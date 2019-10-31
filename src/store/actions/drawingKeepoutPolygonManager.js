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
            FoundLine.fromPolyline(stbPolyline[0]).makeGeoJSON().geometry.coordinates
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
  // const pitchedRoofs =
  //   getState().undoableReducer.present.drawingRooftopManagerReducer
  //   .RooftopCollection.rooftopCollection;
  // const pitchedRoofsFoundLine = pitchedRoofs.map(polygon => polygon.toFoundLine())
  // const keepoutPolylines = normalKeepout.map(kpt => kpt.outlinePolyline);
  // const keepoutStb = normalKeepout.map(kpt => kpt.setback);
  let pitchedRoofsFoundLine = [
    {
    "points": [
      {
        "lon": -117.84126053273,
        "lat": 33.647202018835,
        "height": 5,
        "heightOffset": 0,
        "entityId": "7b245ce0-fbaf-11e9-af2a-ab6af2449303",
        "name": "vertex",
        "color": {
          "red": 1,
          "green": 1,
          "blue": 1,
          "alpha": 1
        },
        "pixelSize": 15,
        "show": true,
        "render": true
      },
      {
        "lon": -117.841241586523,
        "lat": 33.647069374757,
        "height": 7,
        "heightOffset": 0,
        "entityId": "7b245ce1-fbaf-11e9-af2a-ab6af2449303",
        "name": "vertex",
        "color": {
          "red": 1,
          "green": 1,
          "blue": 1,
          "alpha": 1
        },
        "pixelSize": 15,
        "show": true,
        "render": true
      },
      {
        "lon": -117.841118506894,
        "lat": 33.646992031502,
        "height": 7,
        "heightOffset": 0,
        "entityId": "7b245ce2-fbaf-11e9-af2a-ab6af2449303",
        "name": "vertex",
        "color": {
          "red": 1,
          "green": 1,
          "blue": 1,
          "alpha": 1
        },
        "pixelSize": 15,
        "show": true,
        "render": true
      },
      {
        "lon": -117.840961034805,
        "lat": 33.647013814134,
        "height": 5,
        "heightOffset": 0,
        "entityId": "7b245ce3-fbaf-11e9-af2a-ab6af2449303",
        "name": "vertex",
        "color": {
          "red": 1,
          "green": 1,
          "blue": 1,
          "alpha": 1
        },
        "pixelSize": 15,
        "show": true,
        "render": true
      },
      {
        "lon": -117.84126053273,
        "lat": 33.647202018835,
        "height": 5,
        "heightOffset": 0,
        "entityId": "7b245ce0-fbaf-11e9-af2a-ab6af2449303",
        "name": "vertex",
        "color": {
          "red": 1,
          "green": 1,
          "blue": 1,
          "alpha": 1
        },
        "pixelSize": 15,
        "show": true,
        "render": true
      }
    ],
    "entityId": "7b245ce4-fbaf-11e9-af2a-ab6af2449303",
    "name": "polyline",
    "color": {
      "red": 1,
      "green": 1,
      "blue": 1,
      "alpha": 1
    },
    "show": true,
    "width": 4
    },
    {
      "points": [
        {
          "lon": -117.841398656684,
          "lat": 33.647049695275,
          "height": 5,
          "heightOffset": 0,
          "entityId": "7b245ce5-fbaf-11e9-af2a-ab6af2449303",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841241586523,
          "lat": 33.647069374757,
          "height": 7,
          "heightOffset": 0,
          "entityId": "7b245ce6-fbaf-11e9-af2a-ab6af2449303",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.84126053273,
          "lat": 33.647202018835,
          "height": 5,
          "heightOffset": 0,
          "entityId": "7b245ce7-fbaf-11e9-af2a-ab6af2449303",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841398656684,
          "lat": 33.647049695275,
          "height": 5,
          "heightOffset": 0,
          "entityId": "7b245ce5-fbaf-11e9-af2a-ab6af2449303",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        }
      ],
      "entityId": "7b245ce8-fbaf-11e9-af2a-ab6af2449303",
      "name": "polyline",
      "color": {
        "red": 1,
        "green": 1,
        "blue": 1,
        "alpha": 1
      },
      "show": true,
      "width": 4
    },
    {
      "points": [
        {
          "lon": -117.84109915899,
          "lat": 33.646861490386,
          "height": 5,
          "heightOffset": 0,
          "entityId": "7b245ce9-fbaf-11e9-af2a-ab6af2449303",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841118506894,
          "lat": 33.646992031502,
          "height": 7,
          "heightOffset": 0,
          "entityId": "7b245cea-fbaf-11e9-af2a-ab6af2449303",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841241586523,
          "lat": 33.647069374757,
          "height": 7,
          "heightOffset": 0,
          "entityId": "7b245ceb-fbaf-11e9-af2a-ab6af2449303",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841398656684,
          "lat": 33.647049695275,
          "height": 5,
          "heightOffset": 0,
          "entityId": "7b245cec-fbaf-11e9-af2a-ab6af2449303",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.84109915899,
          "lat": 33.646861490386,
          "height": 5,
          "heightOffset": 0,
          "entityId": "7b245ce9-fbaf-11e9-af2a-ab6af2449303",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        }
      ],
      "entityId": "7b245ced-fbaf-11e9-af2a-ab6af2449303",
      "name": "polyline",
      "color": {
        "red": 1,
        "green": 1,
        "blue": 1,
        "alpha": 1
      },
      "show": true,
      "width": 4
    },
    {
      "points": [
        {
          "lon": -117.840961034805,
          "lat": 33.647013814134,
          "height": 5,
          "heightOffset": 0,
          "entityId": "7b245cee-fbaf-11e9-af2a-ab6af2449303",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841118506894,
          "lat": 33.646992031502,
          "height": 7,
          "heightOffset": 0,
          "entityId": "7b245cef-fbaf-11e9-af2a-ab6af2449303",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.84109915899,
          "lat": 33.646861490386,
          "height": 5,
          "heightOffset": 0,
          "entityId": "7b245cf0-fbaf-11e9-af2a-ab6af2449303",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.840961034805,
          "lat": 33.647013814134,
          "height": 5,
          "heightOffset": 0,
          "entityId": "7b245cee-fbaf-11e9-af2a-ab6af2449303",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        }
      ],
      "entityId": "7b245cf1-fbaf-11e9-af2a-ab6af2449303",
      "name": "polyline",
      "color": {
        "red": 1,
        "green": 1,
        "blue": 1,
        "alpha": 1
      },
      "show": true,
      "width": 4
    }
  ]
  pitchedRoofsFoundLine = pitchedRoofsFoundLine.map(p => FoundLine.fromPolyline(p))
  let pitchedRoofs = [
    {
      "entityId": "7b203e31-fbaf-11e9-af2a-ab6af2449303",
      "name": "roofPlane",
      "height": 0,
      "hierarchy": [
        -117.84126053273,
        33.647202018835,
        5,
        -117.841241586523,
        33.647069374757,
        7,
        -117.841118506894,
        33.646992031502,
        7,
        -117.840961034805,
        33.647013814134,
        5
      ],
      "perPositionHeight": true,
      "extrudedHeight": 0,
      "material": {
        "red": 1,
        "green": 1,
        "blue": 1,
        "alpha": 1
      },
      "outlineColor": {
        "red": 0,
        "green": 0,
        "blue": 0,
        "alpha": 1
      },
      "outlineWidth": 4,
      "shadow": 0,
      "show": true,
      "brng": 37.0478499465861,
      "obliquity": 10.572527233167175
    },
    {
      "entityId": "7b203e32-fbaf-11e9-af2a-ab6af2449303",
      "name": "roofPlane",
      "height": 0,
      "hierarchy": [
        -117.841398656684,
        33.647049695275,
        5,
        -117.841241586523,
        33.647069374757,
        7,
        -117.84126053273,
        33.647202018835,
        5
      ],
      "perPositionHeight": true,
      "extrudedHeight": 0,
      "material": {
        "red": 1,
        "green": 1,
        "blue": 1,
        "alpha": 1
      },
      "outlineColor": {
        "red": 0,
        "green": 0,
        "blue": 0,
        "alpha": 1
      },
      "outlineWidth": 4,
      "shadow": 0,
      "show": true,
      "brng": -52.95222228052478,
      "obliquity": 11.003284628902636
    },
    {
      "entityId": "7b203e33-fbaf-11e9-af2a-ab6af2449303",
      "name": "roofPlane",
      "height": 0,
      "hierarchy": [
        -117.84109915899,
        33.646861490386,
        5,
        -117.841118506894,
        33.646992031502,
        7,
        -117.841241586523,
        33.647069374757,
        7,
        -117.841398656684,
        33.647049695275,
        5
      ],
      "perPositionHeight": true,
      "extrudedHeight": 0,
      "material": {
        "red": 1,
        "green": 1,
        "blue": 1,
        "alpha": 1
      },
      "outlineColor": {
        "red": 0,
        "green": 0,
        "blue": 0,
        "alpha": 1
      },
      "outlineWidth": 4,
      "shadow": 0,
      "show": true,
      "brng": 217.04801591090023,
      "obliquity": 10.778031041523404
    },
    {
      "entityId": "7b203e34-fbaf-11e9-af2a-ab6af2449303",
      "name": "roofPlane",
      "height": 0,
      "hierarchy": [
        -117.840961034805,
        33.647013814134,
        5,
        -117.841118506894,
        33.646992031502,
        7,
        -117.84109915899,
        33.646861490386,
        5
      ],
      "perPositionHeight": true,
      "extrudedHeight": 0,
      "material": {
        "red": 1,
        "green": 1,
        "blue": 1,
        "alpha": 1
      },
      "outlineColor": {
        "red": 0,
        "green": 0,
        "blue": 0,
        "alpha": 1
      },
      "outlineWidth": 4,
      "shadow": 0,
      "show": true,
      "brng": 127.04792656142067,
      "obliquity": 11.12056367835131
    }
  ]
  pitchedRoofs = pitchedRoofs.map(p => Polygon.copyPolygon(p))
  let keepoutPolylines = [
    {
      "points": [
        {
          "lon": -117.841186765742,
          "lat": 33.647056379321,
          "height": 0.05,
          "heightOffset": 0,
          "entityId": "76b82920-fbaf-11e9-af2a-ab6af2449303",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 0,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841216529375,
          "lat": 33.647023142729,
          "height": 0.05,
          "heightOffset": 0,
          "entityId": "77296180-fbaf-11e9-af2a-ab6af2449303",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 0,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841185768391,
          "lat": 33.647003673554,
          "height": 0.05,
          "heightOffset": 0,
          "entityId": "77814580-fbaf-11e9-af2a-ab6af2449303",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 0,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841154841091,
          "lat": 33.647036353917,
          "height": 0.05,
          "heightOffset": 0,
          "entityId": "77d5a710-fbaf-11e9-af2a-ab6af2449303",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 0,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841186765742,
          "lat": 33.647056379321,
          "height": 0.05,
          "heightOffset": 0,
          "entityId": "76b82920-fbaf-11e9-af2a-ab6af2449303",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 0,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        }
      ],
      "entityId": "78101800-fbaf-11e9-af2a-ab6af2449303",
      "name": "polyline",
      "color": {
        "red": 1,
        "green": 1,
        "blue": 0,
        "alpha": 1
      },
      "show": true,
      "width": 4
    }
  ]
  keepoutPolylines = keepoutPolylines.map(p => FoundLine.fromPolyline(p))
  const keepoutStb = [1]
  console.log(pitchedRoofsFoundLine)
  console.log(pitchedRoofs)
  console.log(keepoutPolylines)
  console.log(keepoutStb)
  keepoutPolylines.forEach(kptPly => {

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
