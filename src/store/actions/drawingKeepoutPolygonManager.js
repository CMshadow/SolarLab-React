import {Color} from 'cesium';
import * as martinez from 'martinez-polygon-clipping';

import * as actionTypes from './actionTypes';
import * as actions from './index';
import axios from '../../axios-setup';
import errorNotification from '../../components/ui/Notification/ErrorNotification';
import Point from '../../infrastructure/point/point';
import Polygon from '../../infrastructure/Polygon/Polygon';
import Sphere from '../../infrastructure/Polygon/sphere';
import FoundLine from '../../infrastructure/line/foundLine';
import NormalKeepout from '../../infrastructure/keepout/normalKeepout';
import Passage from '../../infrastructure/keepout/passage';
import Vent from '../../infrastructure/keepout/vent';
import Tree from '../../infrastructure/keepout/tree';
import Env from '../../infrastructure/keepout/env';
import Polyline from '../../infrastructure/line/polyline';
import InnerLine from '../../infrastructure/line/innerLine';
import MathLine from '../../infrastructure/math/mathLine';
import MathLineCollection from '../../infrastructure/math/mathLineCollection';
import Coordinate from '../../infrastructure/point/coordinate';
import { corWithinLineCollectionPolygon } from '../../infrastructure/math/polygonMath'

export const createAllKeepoutPolygon = () => (dispatch, getState) => {
  const allKeepout =
    getState().undoableReducer.present.drawingKeepoutManagerReducer.keepoutList;
  const normalKeepout = allKeepout.filter(kpt => kpt.type === 'KEEPOUT');
  const passageKeepout = allKeepout.filter(kpt => kpt.type === 'PASSAGE');
  const ventKeepout = allKeepout.filter(kpt => kpt.type === 'VENT');
  const treeKeepout = allKeepout.filter(kpt => kpt.type === 'TREE');
  const envKeepout = allKeepout.filter(kpt => kpt.type === 'ENV');
  if (getState().buildingManagerReducer.workingBuilding.type === 'FLAT') {
    dispatch(createNormalKeepoutPolygon(normalKeepout));
    dispatch(createPassageKeepoutPolygon(passageKeepout));
    dispatch(createVentKeepoutPolygon(ventKeepout));
    dispatch(createTreeKeepoutPolygon(treeKeepout));
    dispatch(createEnvKeepoutPolygon(envKeepout));
  } else {
    dispatch(createNormalKeepoutPolygonPitched(normalKeepout));
    dispatch(createPassageKeepoutPolygonPitched(passageKeepout));
    dispatch(createVentKeepoutPolygonPitched(ventKeepout));
    dispatch(createTreeKeepoutPolygon(treeKeepout));
    dispatch(createEnvKeepoutPolygon(envKeepout));
  }
}

export const createNormalKeepoutPolygon = (normalKeepout) =>
(dispatch, getState) => {
  const buildingId = getState().buildingManagerReducer.workingBuilding.entityId;
  const foundPolyline =
    getState().undoableReducer.present.drawingManagerReducer.drawingPolyline;
  const foundHeight =
    getState().buildingManagerReducer.workingBuilding.foundationHeight;
  const keepoutPolylines = normalKeepout.map(kpt => kpt.outlinePolyline);
  const keepoutStb = normalKeepout.map(kpt => kpt.setback);

  axios.post('/calculate-setback-coordinate', {
    originPolylines: keepoutPolylines,
    stbDists: keepoutStb,
    direction: 'outside'
  })
  .then(response => {
    const stbPolylines = JSON.parse(response.data.body).stbPolylines;
    const stbHierarchies = stbPolylines.map(stbPolyline => {
      const trimedStbTurfPolygon = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: martinez.intersection(
            foundPolyline.makeGeoJSON().geometry.coordinates,
            FoundLine.fromPolyline(stbPolyline[0]).makeGeoJSON().geometry
            .coordinates
          )[0]
        }
      }
      return Polygon.makeHierarchyFromGeoJSON(
        trimedStbTurfPolygon, foundHeight, 0.005
      );
    });
    const newNormalKeepout = normalKeepout.map((kpt, index) => {
      const hierarchy = Polygon.makeHierarchyFromPolyline(
        kpt.outlinePolyline, kpt.height + foundHeight
      )
      return NormalKeepout.fromKeepout(
        kpt, null, null, null,
        new Polygon(
          null, null, kpt.height + foundHeight, hierarchy, null, null,
          Color.GOLD
        ),
        kpt.setback !== 0 ?
        new Polygon(
          null, null, foundHeight, stbHierarchies[index], null, null,
          Color.ORANGE
        ) :
        null,
        buildingId,
        0
      )
    });
    dispatch({
      type: actionTypes.CREATE_ALL_NORMAL_KEEPOUT_POLYGON,
      normalKeepout: newNormalKeepout
    })
  })
  .catch(error => {
    return errorNotification(
      'Backend Error',
      error.toString()
    )
  });
}

export const createNormalKeepoutPolygonPitched = (normalKeepout) =>
(dispatch, getState) => {
  const buildingId = getState().buildingManagerReducer.workingBuilding.entityId;
  const pitchedRoofPolygons = getState().undoableReducer.present
    .drawingRooftopManagerReducer.RooftopCollection.rooftopCollection;
  const pitchedRoofsFoundLine = pitchedRoofPolygons.map(polygon =>
    polygon.toFoundLine()
  );
  const pitchedRoofsMathLineCollection = pitchedRoofsFoundLine.map(l =>
    MathLineCollection.fromPolyline(l)
  );
  const foundHeight =
    getState().buildingManagerReducer.workingBuilding.foundationHeight;
  const keepoutFoundLines = normalKeepout.map(kpt => kpt.outlinePolyline);
  const keepoutStb = normalKeepout.map(kpt => kpt.setback);

  axios.post('/calculate-setback-coordinate', {
    originPolylines: keepoutFoundLines,
    stbDists: keepoutStb,
    direction: 'outside'
  })
  .then(response => {
    const stbPolylines = JSON.parse(response.data.body).stbPolylines.map(l =>
      FoundLine.fromPolyline(l[0])
    );

    const newNormalKeepout = stbPolylines.map((stbFoundLine, kptIndex) => {
      const inWhichRoof = [];
      keepoutFoundLines[kptIndex].points.forEach(kptP => {
        pitchedRoofsMathLineCollection.forEach((roof, roofIndex) => {
          if (corWithinLineCollectionPolygon(roof, kptP)) {
            inWhichRoof.push(roofIndex);
          }
        })
      })
      const indexCount = inWhichRoof.reduce((acc, val) => {
        acc[val] = acc[val] === undefined ? 1 : acc[val] += 1;
        return acc;
      }, {});
      const maxCount = Math.max(...Object.values(indexCount));
      const roofIndex = +Object.keys(indexCount).filter(
        k => indexCount[k] === maxCount
      )[0];

      let clippedStbCors = martinez.intersection(
        stbFoundLine.makeGeoJSON().geometry.coordinates,
        pitchedRoofsFoundLine[roofIndex].makeGeoJSON().geometry.coordinates
      )[0][0]

      let stbHierarchy = [];
      clippedStbCors.forEach(cor => {
        const newHeight = Coordinate.heightOfArbitraryNode(
          pitchedRoofPolygons[roofIndex], new Coordinate(cor[0], cor[1], 0)
        ) + pitchedRoofPolygons[roofIndex].lowestNode[2] + 0.01;
        if (cor[2]) {
          cor[2] = newHeight;
        } else {
          cor.push(newHeight);
        }
        stbHierarchy = stbHierarchy.concat(cor);
      })

      let kptHierarchy = [];
      let kptAvgHeight = 0;
      let kptAvgHeightDenominator = 0;
      keepoutFoundLines[kptIndex].points.forEach(p => {
        if (corWithinLineCollectionPolygon(
          pitchedRoofsMathLineCollection[roofIndex], p
        )) {
          kptAvgHeight += (Coordinate.heightOfArbitraryNode(
            pitchedRoofPolygons[roofIndex], p
          ) + foundHeight);
          kptAvgHeightDenominator += 1;
        }
      })
      kptAvgHeight = kptAvgHeight / kptAvgHeightDenominator;
      keepoutFoundLines[kptIndex].points.forEach(p => {
        let cor = p.getCoordinate(true);
        cor[2] = normalKeepout[kptIndex].height + kptAvgHeight
        kptHierarchy = kptHierarchy.concat(cor);
      })

      return NormalKeepout.fromKeepout(
        normalKeepout[kptIndex], null, null, null,
        new Polygon(
          null, null, normalKeepout[kptIndex].height + kptAvgHeight,
          kptHierarchy, null, null, Color.GOLD
        ),
        normalKeepout[kptIndex].setback !== 0 ?
        new Polygon(
          null, null, pitchedRoofPolygons[roofIndex].lowestNode[2], stbHierarchy,
          null, null, Color.ORANGE
        ) :
        null,
        buildingId,
        roofIndex
      )
    })

    dispatch({
      type: actionTypes.CREATE_ALL_NORMAL_KEEPOUT_POLYGON,
      normalKeepout: newNormalKeepout
    })
  })
  .catch(error => {
    return errorNotification(
      'Backend Error',
      error
    )
  });
}

export const createPassageKeepoutPolygon = (passageKeepout) =>
(dispatch, getState) => {
  const buildingId = getState().buildingManagerReducer.workingBuilding.entityId;
  const foundPolyline =
    getState().undoableReducer.present.drawingManagerReducer.drawingPolyline;
  const foundHeight =
    getState().buildingManagerReducer.workingBuilding.foundationHeight;
  const keepoutPolylines = passageKeepout.map(kpt => kpt.outlinePolyline);
  const keepoutWidth = passageKeepout.map(kpt => kpt.width/2);

  axios.post('/calculate-passage-coordinate', {
    originPolylines: keepoutPolylines,
    stbDists: keepoutWidth,
    direction: 'outside'
  })
  .then(response => {
    const stbPolylines = JSON.parse(response.data.body).stbPolylines;
    const stbHierarchies = stbPolylines.map(stbPolyline => {
      const trimedStbTurfPolygon = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: martinez.intersection(
            foundPolyline.makeGeoJSON().geometry.coordinates,
            new FoundLine(
              [...stbPolyline[0].points.map(p => Point.fromPoint(p)),
              Point.fromPoint(stbPolyline[0].points[0])]
            ).makeGeoJSON().geometry.coordinates
          )[0]
        }
      }
      return Polygon.makeHierarchyFromGeoJSON(
        trimedStbTurfPolygon, foundHeight, 0.005
      );
    });
    const newPassageKeepout = passageKeepout.map((kpt, index) => {
      return Passage.fromKeepout(
        kpt, null, null,
        new Polygon(
          null, null, foundHeight, stbHierarchies[index], null, null,
          Color.ORANGE
        ),
        buildingId,
        0
      )
    });
    dispatch({
      type: actionTypes.CREATE_ALL_PASSAGE_KEEPOUT_POLYGON,
      passageKeepout: newPassageKeepout
    })
  })
  .catch(error => {
    return errorNotification(
      'Backend Error',
      error.toString()
    )
  });
}

export const createPassageKeepoutPolygonPitched = (passageKeepout) =>
(dispatch, getState) => {
  const buildingId = getState().buildingManagerReducer.workingBuilding.entityId;
  const pitchedRoofPolygons = getState().undoableReducer.present
    .drawingRooftopManagerReducer.RooftopCollection.rooftopCollection;
  const pitchedRoofsFoundLine = pitchedRoofPolygons.map(polygon =>
    polygon.toFoundLine()
  );
  const pitchedRoofsMathLineCollection = pitchedRoofsFoundLine.map(l =>
    MathLineCollection.fromPolyline(l)
  );
  const foundHeight =
    getState().buildingManagerReducer.workingBuilding.foundationHeight;
  const keepoutPolylines = passageKeepout.map(kpt => kpt.outlinePolyline);
  const keepoutWidth = passageKeepout.map(kpt => kpt.width/2);

  axios.post('/calculate-passage-coordinate', {
    originPolylines: keepoutPolylines,
    stbDists: keepoutWidth,
    direction: 'outside'
  })
  .then(response => {
    const stbPolylines = JSON.parse(response.data.body).stbPolylines.map(l => {
      l[0].points.push(l[0].points[0]);
      return FoundLine.fromPolyline(l[0])
    });
    const newPassageKeepout = stbPolylines.map((stbFoundline, kptIndex) => {
      const inWhichRoof = [];
      keepoutPolylines[kptIndex].points.forEach(kptP => {
        pitchedRoofsMathLineCollection.forEach((roof, roofIndex) => {
          if (corWithinLineCollectionPolygon(roof, kptP)) {
            inWhichRoof.push(roofIndex);
          }
        })
      })
      const indexCount = inWhichRoof.reduce((acc, val) => {
        acc[val] = acc[val] === undefined ? 1 : acc[val] += 1;
        return acc;
      }, {});
      const maxCount = Math.max(...Object.values(indexCount));
      const roofIndex = +Object.keys(indexCount).filter(
        k => indexCount[k] === maxCount
      )[0];

      let clippedPassageCors = martinez.intersection(
        stbFoundline.makeGeoJSON().geometry.coordinates,
        pitchedRoofsFoundLine[roofIndex].makeGeoJSON().geometry.coordinates
      )[0][0]

      let stbHierarchy = [];
      clippedPassageCors.forEach(cor => {
        const newHeight = Coordinate.heightOfArbitraryNode(
          pitchedRoofPolygons[roofIndex], new Coordinate(cor[0], cor[1], 0)
        ) + pitchedRoofPolygons[roofIndex].lowestNode[2] + 0.01;
        if (cor[2]) {
          cor[2] = newHeight;
        } else {
          cor.push(newHeight);
        }
        stbHierarchy = stbHierarchy.concat(cor);
      })

      return Passage.fromKeepout(
        passageKeepout[kptIndex], null, null,
        new Polygon(
          null, null, foundHeight, stbHierarchy, null, null,
          Color.ORANGE
        ),
        buildingId,
        roofIndex
      )
    })
    dispatch({
      type: actionTypes.CREATE_ALL_PASSAGE_KEEPOUT_POLYGON,
      passageKeepout: newPassageKeepout
    })
  })
  .catch(error => {
    return errorNotification(
      'Backend Error',
      error
    )
  });
}

export const createVentKeepoutPolygon = (ventKeepout) =>
(dispatch, getState) => {
  const buildingId = getState().buildingManagerReducer.workingBuilding.entityId;
  const foundPolyline =
    getState().undoableReducer.present.drawingManagerReducer.drawingPolyline;
  const foundHeight =
    getState().buildingManagerReducer.workingBuilding.foundationHeight;
  const newVentKeepout = ventKeepout.map((kpt, index) => {
    const trimedStbTurfPolygon = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: martinez.intersection(
          foundPolyline.makeGeoJSON().geometry.coordinates,
          kpt.outlinePolyline.makeGeoJSON().geometry.coordinates
        )[0]
      }
    }
    const hierarchy = Polygon.makeHierarchyFromGeoJSON(
      trimedStbTurfPolygon, foundHeight, 0.005
    );
    return Vent.fromKeepout(
      kpt, null, null, null, null,
      new Polygon(
        null, null, foundHeight, hierarchy, null, null,
        Color.ORANGE
      ),
      buildingId,
      0
    )
  });
  dispatch({
    type: actionTypes.CREATE_ALL_VENT_KEEPOUT_POLYGON,
    ventKeepout: newVentKeepout
  })
}

export const createVentKeepoutPolygonPitched = (ventKeepout) =>
(dispatch, getState) => {
  const buildingId = getState().buildingManagerReducer.workingBuilding.entityId;
  const pitchedRoofPolygons = getState().undoableReducer.present
    .drawingRooftopManagerReducer.RooftopCollection.rooftopCollection;
  const pitchedRoofsFoundLine = pitchedRoofPolygons.map(polygon =>
    polygon.toFoundLine()
  );
  const pitchedRoofsMathLineCollection = pitchedRoofsFoundLine.map(l =>
    MathLineCollection.fromPolyline(l)
  );
  const foundHeight =
    getState().buildingManagerReducer.workingBuilding.foundationHeight;
  const newVentKeepout = ventKeepout.map((kpt, index) => {
    let roofIndex = 0;
    pitchedRoofsMathLineCollection.forEach((roof, ind) => {
      if (corWithinLineCollectionPolygon(roof, kpt.outlinePolyline.points[0])) {
        roofIndex = ind;
      }
    })

    let clippedPassageCors = martinez.intersection(
      kpt.outlinePolyline.makeGeoJSON().geometry.coordinates,
      pitchedRoofsFoundLine[roofIndex].makeGeoJSON().geometry.coordinates
    )[0][0]

    let hierarchy = [];
    clippedPassageCors.forEach(cor => {
      const newHeight = Coordinate.heightOfArbitraryNode(
        pitchedRoofPolygons[roofIndex], new Coordinate(cor[0], cor[1], 0)
      ) + pitchedRoofPolygons[roofIndex].lowestNode[2] + 0.01;
      if (cor[2]) {
        cor[2] = newHeight;
      } else {
        cor.push(newHeight);
      }
      hierarchy = hierarchy.concat(cor);
    })

    return Vent.fromKeepout(
      kpt, null, null, null, null,
      new Polygon(
        null, null, foundHeight, hierarchy, null, null,
        Color.ORANGE
      ),
      buildingId,
      roofIndex
    )
  });
  dispatch({
    type: actionTypes.CREATE_ALL_VENT_KEEPOUT_POLYGON,
    ventKeepout: newVentKeepout
  })
}

export const createTreeKeepoutPolygon = (treeKeepout) =>
(dispatch, getState) => {
  const newTreeKeepout = treeKeepout.map((kpt, index) => {
    return Tree.fromKeepout(
      kpt, null, null, null,
      new Sphere(
        null, null, kpt.outlinePolyline.centerPoint, kpt.height, kpt.radius,
        Color.FORESTGREEN
      ),
      new Sphere(
        null, null, kpt.outlinePolyline.centerPoint, kpt.height, kpt.radius
      )
    );
  });
  dispatch({
    type: actionTypes.CREATE_ALL_TREE_KEEPOUT_POLYGON,
    treeKeepout: newTreeKeepout
  })
}

export const createEnvKeepoutPolygon = (envKeepout) =>
(dispatch, getState) => {
  const newEnvKeepout = envKeepout.map((kpt, index) => {
    const hierarchy = Polygon.makeHierarchyFromPolyline(
      kpt.outlinePolyline, kpt.height
    )
    return Env.fromKeepout(
      kpt, null, null,
      new Polygon(
        null, null, kpt.height, hierarchy, null, null,
        Color.GOLD
      )
    )
  });
  dispatch({
    type: actionTypes.CREATE_ALL_ENV_KEEPOUT_POLYGON,
    envKeepout: newEnvKeepout
  })
}

export const reRenderKeepoutPolygon = (type, id, values) =>
(dispatch, getState) => {
  dispatch(actions.updateKeepout(id, values));
  switch (type) {
    default:
    case 'KEEPOUT': {
      const allKeepout =
        getState().undoableReducer.present.drawingKeepoutManagerReducer.keepoutList;
      const normalKeepout = allKeepout.filter(kpt => kpt.type === 'KEEPOUT');
      getState().buildingManagerReducer.workingBuilding.type === 'FLAT' ?
      dispatch(createNormalKeepoutPolygon(normalKeepout)) :
      dispatch(createNormalKeepoutPolygonPitched(normalKeepout))
      break;
    }

    case 'PASSAGE': {
      const allKeepout =
        getState().undoableReducer.present.drawingKeepoutManagerReducer.keepoutList;
      const passageKeepout = allKeepout.filter(kpt => kpt.type === 'PASSAGE');
      getState().buildingManagerReducer.workingBuilding.type === 'FLAT' ?
      dispatch(createPassageKeepoutPolygon(passageKeepout)) :
      dispatch(createPassageKeepoutPolygonPitched(passageKeepout))
      break;
    }

    case 'VENT': {
      const allKeepout =
        getState().undoableReducer.present.drawingKeepoutManagerReducer.keepoutList;
      const ventKeepout = allKeepout.filter(kpt => kpt.type === 'VENT');
      getState().buildingManagerReducer.workingBuilding.type === 'FLAT' ?
      dispatch(createVentKeepoutPolygon(ventKeepout)) :
      dispatch(createVentKeepoutPolygonPitched(ventKeepout))
      break;
    }

    case 'TREE': {
      const allKeepout =
        getState().undoableReducer.present.drawingKeepoutManagerReducer.keepoutList;
      const treeKeepout = allKeepout.filter(kpt => kpt.type === 'TREE');
      dispatch(createTreeKeepoutPolygon(treeKeepout));
      break;
    }

    case 'ENV': {
      const allKeepout =
        getState().undoableReducer.present.drawingKeepoutManagerReducer.keepoutList;
      const envKeepout = allKeepout.filter(kpt => kpt.type === 'ENV');
      dispatch(createEnvKeepoutPolygon(envKeepout));
      break;
    }
  }
};

export const updateKeepoutOnRoof = (roofIndex) => (dispatch, getState) => {
  if (getState().buildingManagerReducer.workingBuilding.type === 'PITCHED') {
    dispatch(updateKeepoutOnPitchedRoof(roofIndex))
  }
}

export const updateKeepoutOnPitchedRoof = (roofIndex) => (dispatch, getState) => {
  const roofPolygon = getState().undoableReducer.present
    .drawingRooftopManagerReducer.RooftopCollection.rooftopCollection[roofIndex];
  const roofLowestHeight = roofPolygon.lowestNode[2];
  const normalKeepout = getState().undoableReducer.present
    .drawingKeepoutPolygonManagerReducer.normalKeepout;
  const passageKeepout = getState().undoableReducer.present
    .drawingKeepoutPolygonManagerReducer.passageKeepout;
  const ventKeepout = getState().undoableReducer.present
    .drawingKeepoutPolygonManagerReducer.ventKeepout;
  const newNormalKeepout = normalKeepout.map(kpt => {
    if (kpt.roofIndexBelong !== roofIndex) {
      return kpt;
    } else {
      let kptAvgHeight = 0;
      let kptAvgHeightDenominator = 0;
      kpt.outlinePolyline.points.forEach(p => {
        kptAvgHeight += (
          Coordinate.heightOfArbitraryNode(roofPolygon, p) + roofLowestHeight
        );
        kptAvgHeightDenominator += 1;
      })
      kptAvgHeight = kptAvgHeight / kptAvgHeightDenominator;
      const newKptHier = Polygon.makeHierarchyFromPolyline(
        kpt.outlinePolyline, kptAvgHeight + kpt.height
      );

      let newStbHier = null;
      if (kpt.outlinePolygonPart2) {
        const stbLine = kpt.outlinePolygonPart2.toFoundLine();
        stbLine.points.forEach(p => {
          p.setCoordinate(
            null, null,
            Coordinate.heightOfArbitraryNode(roofPolygon, p) + roofLowestHeight
          );
        })
        newStbHier = Polygon.makeHierarchyFromPolyline(stbLine, null, 0.01);
      }

      return NormalKeepout.fromKeepout(
        kpt, null, null, null,
        new Polygon(
          null, null, kptAvgHeight + kpt.height,
          newKptHier, null, null, Color.GOLD
        ),
        kpt.setback !== 0 ?
        new Polygon(
          null, null, roofLowestHeight, newStbHier,
          null, null, Color.ORANGE
        ) :
        null
      )
    }
  })
  dispatch({
    type: actionTypes.CREATE_ALL_NORMAL_KEEPOUT_POLYGON,
    normalKeepout: newNormalKeepout
  });

  const newPassageKeepout = passageKeepout.map(kpt => {
    if (kpt.roofIndexBelong !== roofIndex) {
      return kpt;
    } else {
      const passageFoundLine = kpt.outlinePolygon.toFoundLine();
      passageFoundLine.points.forEach(p => {
        p.setCoordinate(
          null, null,
          Coordinate.heightOfArbitraryNode(roofPolygon, p) + roofLowestHeight
        );
      })
      const newKptHier = Polygon.makeHierarchyFromPolyline(
        passageFoundLine, null, 0.01
      );

      return Passage.fromKeepout(
        kpt, null, null,
        new Polygon(
          null, null, roofLowestHeight,
          newKptHier, null, null, Color.ORANGE
        )
      )
    }
  })
  dispatch({
    type: actionTypes.CREATE_ALL_PASSAGE_KEEPOUT_POLYGON,
    passageKeepout: newPassageKeepout
  });

  const newVentKeepout = ventKeepout.map(kpt => {
    if (kpt.roofIndexBelong !== roofIndex) {
      return kpt;
    } else {
      const ventFoundLine = kpt.outlinePolygon.toFoundLine();
      ventFoundLine.points.forEach(p => {
        p.setCoordinate(
          null, null,
          Coordinate.heightOfArbitraryNode(roofPolygon, p) + roofLowestHeight
        );
      })
      const newKptHier = Polygon.makeHierarchyFromPolyline(
        ventFoundLine, null, 0.01
      );

      return Vent.fromKeepout(
        kpt, null, null, null, null,
        new Polygon(
          null, null, roofLowestHeight,
          newKptHier, null, null, Color.ORANGE
        )
      )
    }
  })
  dispatch({
    type: actionTypes.CREATE_ALL_VENT_KEEPOUT_POLYGON,
    ventKeepout: newVentKeepout
  });
}
