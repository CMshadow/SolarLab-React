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
    dispatch(createNormalKeepoutPolygonPitched(normalKeepout))
  }
}

export const createNormalKeepoutPolygon = (normalKeepout) =>
(dispatch, getState) => {
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
        null
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
      error
    )
  });
}

export const createNormalKeepoutPolygonPitched = (normalKeepout) =>
(dispatch, getState) => {
  let pitchedRoofPolygons =
    getState().undoableReducer.present.drawingRooftopManagerReducer
    .RooftopCollection.rooftopCollection;
  let pitchedRoofsFoundLine = pitchedRoofPolygons.map(polygon => polygon.toFoundLine())
  let keepoutFoundLines = normalKeepout.map(kpt => kpt.outlinePolyline);
  let keepoutStb = normalKeepout.map(kpt => kpt.setback);
  // let foundPolylines = getState().undoableReducer.present.drawingInnerManagerReducer
  //   .foundPolylines;
  // let hipPolylines = getState().undoableReducer.present.drawingInnerManagerReducer
  //   .hipPolylines;
  // let ridgePolylines = getState().undoableReducer.present.drawingInnerManagerReducer
  //   .ridgePolylines;



  pitchedRoofPolygons = pitchedRoofPolygons.map(p => Polygon.copyPolygon(p))
  pitchedRoofsFoundLine = pitchedRoofsFoundLine.map(p => FoundLine.fromPolyline(p))
  const pitchedRoofsMathLineCollection = pitchedRoofsFoundLine.map(l =>
    MathLineCollection.fromPolyline(l)
  );
  keepoutFoundLines = keepoutFoundLines.map(p => FoundLine.fromPolyline(p))
  // foundPolylines = foundPolylines.map(p => Polyline.fromPolyline(p))

  const newNormalKeepout = keepoutFoundLines.map((kptFoundLine, kptIndex) => {
    const inWhichRoof = [];
    kptFoundLine.points.forEach(kptP => {
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
    const roofIndex = Object.keys(indexCount).filter(k => indexCount[k] === maxCount);

    let newKptCors = martinez.intersection(
      kptFoundLine.makeGeoJSON().geometry.coordinates,
      pitchedRoofsFoundLine[roofIndex].makeGeoJSON().geometry.coordinates
    )[0][0]

    let hierarchy = [];
    newKptCors.forEach(cor => {
      const newHeight = Coordinate.heightOfArbitraryNode(
        pitchedRoofPolygons[roofIndex], new Coordinate(cor[0], cor[1], 0)
      ) + pitchedRoofPolygons[roofIndex].lowestNode[2] + 0.005;
      if (cor[2]) {
        cor[2] = newHeight;
      } else {
        cor.push(newHeight);
      }
      hierarchy = hierarchy.concat(cor);
    })
    console.log(newKptCors)
    console.log(hierarchy)

    return NormalKeepout.fromKeepout(
      normalKeepout[kptIndex], null, null, null,
      new Polygon(
        null, null, normalKeepout[kptIndex].height + pitchedRoofPolygons[roofIndex].lowestNode[2], hierarchy, null, null,
        Color.GOLD
      ),
      normalKeepout[kptIndex].setback !== 0 ?
      null :
      null
    )
  })

  dispatch({
    type: actionTypes.CREATE_ALL_NORMAL_KEEPOUT_POLYGON,
    normalKeepout: newNormalKeepout
  })
}

export const createPassageKeepoutPolygon = (passageKeepout) =>
(dispatch, getState) => {
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
        )
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
      error
    )
  });
}

export const createVentKeepoutPolygon = (ventKeepout) =>
(dispatch, getState) => {
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
      )
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
      dispatch(createNormalKeepoutPolygon(normalKeepout));
      break;
    }

    case 'PASSAGE': {
      const allKeepout =
        getState().undoableReducer.present.drawingKeepoutManagerReducer.keepoutList;
      const passageKeepout = allKeepout.filter(kpt => kpt.type === 'PASSAGE');
      dispatch(createPassageKeepoutPolygon(passageKeepout));
      break;
    }

    case 'VENT': {
      const allKeepout =
        getState().undoableReducer.present.drawingKeepoutManagerReducer.keepoutList;
      const ventKeepout = allKeepout.filter(kpt => kpt.type === 'VENT');
      dispatch(createVentKeepoutPolygon(ventKeepout));
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
