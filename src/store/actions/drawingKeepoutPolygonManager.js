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
  let pitchedRoofs =
    getState().undoableReducer.present.drawingRooftopManagerReducer
    .RooftopCollection.rooftopCollection;
  let pitchedRoofsFoundLine = pitchedRoofs.map(polygon => polygon.toFoundLine())
  let keepoutFoundLines = normalKeepout.map(kpt => kpt.outlinePolyline);
  let keepoutStb = normalKeepout.map(kpt => kpt.setback);
  let foundPolylines = getState().undoableReducer.present.drawingInnerManagerReducer
  .foundPolylines;
  let hipPolylines = getState().undoableReducer.present.drawingInnerManagerReducer
  .hipPolylines;
  let ridgePolylines = getState().undoableReducer.present.drawingInnerManagerReducer
  .ridgePolylines;



  // let pitchedRoofs = [
  //   {
  //     "points": [
  //       {
  //         "lon": -117.841260032222,
  //         "lat": 33.64720459772,
  //         "height": 5,
  //         "heightOffset": 0,
  //         "entityId": "ca991760-fc73-11e9-892b-bbb11e452076",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841239931993,
  //         "lat": 33.64706978074,
  //         "height": 7,
  //         "heightOffset": 0,
  //         "entityId": "ca991761-fc73-11e9-892b-bbb11e452076",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841117723893,
  //         "lat": 33.646993455147,
  //         "height": 7,
  //         "heightOffset": 0,
  //         "entityId": "ca991762-fc73-11e9-892b-bbb11e452076",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.84096103589,
  //         "lat": 33.64701785812,
  //         "height": 5,
  //         "heightOffset": 0,
  //         "entityId": "ca991763-fc73-11e9-892b-bbb11e452076",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841260032222,
  //         "lat": 33.64720459772,
  //         "height": 5,
  //         "heightOffset": 0,
  //         "entityId": "ca991760-fc73-11e9-892b-bbb11e452076",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       }
  //     ],
  //     "entityId": "ca991764-fc73-11e9-892b-bbb11e452076",
  //     "name": "polyline",
  //     "color": {
  //       "red": 1,
  //       "green": 1,
  //       "blue": 1,
  //       "alpha": 1
  //     },
  //     "show": true,
  //     "width": 4
  //   },
  //   {
  //     "points": [
  //       {
  //         "lon": -117.841398763399,
  //         "lat": 33.647050662404,
  //         "height": 5,
  //         "heightOffset": 0,
  //         "entityId": "ca991765-fc73-11e9-892b-bbb11e452076",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841239931993,
  //         "lat": 33.64706978074,
  //         "height": 7,
  //         "heightOffset": 0,
  //         "entityId": "ca991766-fc73-11e9-892b-bbb11e452076",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841260032222,
  //         "lat": 33.64720459772,
  //         "height": 5,
  //         "heightOffset": 0,
  //         "entityId": "ca991767-fc73-11e9-892b-bbb11e452076",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841398763399,
  //         "lat": 33.647050662404,
  //         "height": 5,
  //         "heightOffset": 0,
  //         "entityId": "ca991765-fc73-11e9-892b-bbb11e452076",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       }
  //     ],
  //     "entityId": "ca991768-fc73-11e9-892b-bbb11e452076",
  //     "name": "polyline",
  //     "color": {
  //       "red": 1,
  //       "green": 1,
  //       "blue": 1,
  //       "alpha": 1
  //     },
  //     "show": true,
  //     "width": 4
  //   },
  //   {
  //     "points": [
  //       {
  //         "lon": -117.841099767312,
  //         "lat": 33.646863922623,
  //         "height": 5,
  //         "heightOffset": 0,
  //         "entityId": "ca991769-fc73-11e9-892b-bbb11e452076",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841117723893,
  //         "lat": 33.646993455147,
  //         "height": 7,
  //         "heightOffset": 0,
  //         "entityId": "ca99176a-fc73-11e9-892b-bbb11e452076",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841239931993,
  //         "lat": 33.64706978074,
  //         "height": 7,
  //         "heightOffset": 0,
  //         "entityId": "ca99176b-fc73-11e9-892b-bbb11e452076",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841398763399,
  //         "lat": 33.647050662404,
  //         "height": 5,
  //         "heightOffset": 0,
  //         "entityId": "ca99176c-fc73-11e9-892b-bbb11e452076",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841099767312,
  //         "lat": 33.646863922623,
  //         "height": 5,
  //         "heightOffset": 0,
  //         "entityId": "ca991769-fc73-11e9-892b-bbb11e452076",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       }
  //     ],
  //     "entityId": "ca99176d-fc73-11e9-892b-bbb11e452076",
  //     "name": "polyline",
  //     "color": {
  //       "red": 1,
  //       "green": 1,
  //       "blue": 1,
  //       "alpha": 1
  //     },
  //     "show": true,
  //     "width": 4
  //   },
  //   {
  //     "points": [
  //       {
  //         "lon": -117.84096103589,
  //         "lat": 33.64701785812,
  //         "height": 5,
  //         "heightOffset": 0,
  //         "entityId": "ca99176e-fc73-11e9-892b-bbb11e452076",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841117723893,
  //         "lat": 33.646993455147,
  //         "height": 7,
  //         "heightOffset": 0,
  //         "entityId": "ca99176f-fc73-11e9-892b-bbb11e452076",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841099767312,
  //         "lat": 33.646863922623,
  //         "height": 5,
  //         "heightOffset": 0,
  //         "entityId": "ca991770-fc73-11e9-892b-bbb11e452076",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.84096103589,
  //         "lat": 33.64701785812,
  //         "height": 5,
  //         "heightOffset": 0,
  //         "entityId": "ca99176e-fc73-11e9-892b-bbb11e452076",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       }
  //     ],
  //     "entityId": "ca991771-fc73-11e9-892b-bbb11e452076",
  //     "name": "polyline",
  //     "color": {
  //       "red": 1,
  //       "green": 1,
  //       "blue": 1,
  //       "alpha": 1
  //     },
  //     "show": true,
  //     "width": 4
  //   }
  // ]
  pitchedRoofs = pitchedRoofs.map(p => Polygon.copyPolygon(p))

  // let pitchedRoofsFoundLine = [
  //   {
  //     "points": [
  //       {
  //         "lon": -117.841259585591,
  //         "lat": 33.647202271445,
  //         "height": 5,
  //         "heightOffset": 0,
  //         "entityId": "2e01e230-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841237357642,
  //         "lat": 33.647069663841,
  //         "height": 7,
  //         "heightOffset": 0,
  //         "entityId": "2e01e231-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841116288708,
  //         "lat": 33.646993560883,
  //         "height": 7,
  //         "heightOffset": 0,
  //         "entityId": "2e01e232-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.840957145979,
  //         "lat": 33.647012160158,
  //         "height": 5,
  //         "heightOffset": 0,
  //         "entityId": "2e01e233-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841259585591,
  //         "lat": 33.647202271445,
  //         "height": 5,
  //         "heightOffset": 0,
  //         "entityId": "2e01e230-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       }
  //     ],
  //     "entityId": "2e01e234-fc1c-11e9-ad7f-9f854a898ee7",
  //     "name": "polyline",
  //     "color": {
  //       "red": 1,
  //       "green": 1,
  //       "blue": 1,
  //       "alpha": 1
  //     },
  //     "show": true,
  //     "width": 4
  //   },
  //   {
  //     "points": [
  //       {
  //         "lon": -117.841398017643,
  //         "lat": 33.647049654679,
  //         "height": 5,
  //         "heightOffset": 0,
  //         "entityId": "2e01e235-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841237357642,
  //         "lat": 33.647069663841,
  //         "height": 7,
  //         "heightOffset": 0,
  //         "entityId": "2e01e236-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841259585591,
  //         "lat": 33.647202271445,
  //         "height": 5,
  //         "heightOffset": 0,
  //         "entityId": "2e01e237-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841398017643,
  //         "lat": 33.647049654679,
  //         "height": 5,
  //         "heightOffset": 0,
  //         "entityId": "2e01e235-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       }
  //     ],
  //     "entityId": "2e01e238-fc1c-11e9-ad7f-9f854a898ee7",
  //     "name": "polyline",
  //     "color": {
  //       "red": 1,
  //       "green": 1,
  //       "blue": 1,
  //       "alpha": 1
  //     },
  //     "show": true,
  //     "width": 4
  //   },
  //   {
  //     "points": [
  //       {
  //         "lon": -117.841095578278,
  //         "lat": 33.64685954321,
  //         "height": 5,
  //         "heightOffset": 0,
  //         "entityId": "2e01e239-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841116288708,
  //         "lat": 33.646993560883,
  //         "height": 7,
  //         "heightOffset": 0,
  //         "entityId": "2e01e23a-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841237357642,
  //         "lat": 33.647069663841,
  //         "height": 7,
  //         "heightOffset": 0,
  //         "entityId": "2e01e23b-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841398017643,
  //         "lat": 33.647049654679,
  //         "height": 5,
  //         "heightOffset": 0,
  //         "entityId": "2e01e23c-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841095578278,
  //         "lat": 33.64685954321,
  //         "height": 5,
  //         "heightOffset": 0,
  //         "entityId": "2e01e239-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       }
  //     ],
  //     "entityId": "2e01e23d-fc1c-11e9-ad7f-9f854a898ee7",
  //     "name": "polyline",
  //     "color": {
  //       "red": 1,
  //       "green": 1,
  //       "blue": 1,
  //       "alpha": 1
  //     },
  //     "show": true,
  //     "width": 4
  //   },
  //   {
  //     "points": [
  //       {
  //         "lon": -117.840957145979,
  //         "lat": 33.647012160158,
  //         "height": 5,
  //         "heightOffset": 0,
  //         "entityId": "2e01e23e-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841116288708,
  //         "lat": 33.646993560883,
  //         "height": 7,
  //         "heightOffset": 0,
  //         "entityId": "2e01e23f-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841095578278,
  //         "lat": 33.64685954321,
  //         "height": 5,
  //         "heightOffset": 0,
  //         "entityId": "2e01e240-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.840957145979,
  //         "lat": 33.647012160158,
  //         "height": 5,
  //         "heightOffset": 0,
  //         "entityId": "2e01e23e-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       }
  //     ],
  //     "entityId": "2e01e241-fc1c-11e9-ad7f-9f854a898ee7",
  //     "name": "polyline",
  //     "color": {
  //       "red": 1,
  //       "green": 1,
  //       "blue": 1,
  //       "alpha": 1
  //     },
  //     "show": true,
  //     "width": 4
  //   }
  // ]
  pitchedRoofsFoundLine = pitchedRoofsFoundLine.map(p => FoundLine.fromPolyline(p))
  const pitchedRoofsMathLineCollection = pitchedRoofsFoundLine.map(p => MathLineCollection.fromPolyline(p))

  // let keepoutFoundLines = [
  //   {
  //     "points": [
  //       {
  //         "lon": -117.841184634639,
  //         "lat": 33.64705643171,
  //         "height": 0.05,
  //         "heightOffset": 0,
  //         "entityId": "0ed0f590-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 0,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.84120879853,
  //         "lat": 33.647027222538,
  //         "height": 0.05,
  //         "heightOffset": 0,
  //         "entityId": "0f369530-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 0,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.8411737118,
  //         "lat": 33.647006935004,
  //         "height": 0.05,
  //         "heightOffset": 0,
  //         "entityId": "0fd76910-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 0,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841148498601,
  //         "lat": 33.647041706385,
  //         "height": 0.05,
  //         "heightOffset": 0,
  //         "entityId": "1052daa0-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 0,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841184634639,
  //         "lat": 33.64705643171,
  //         "height": 0.05,
  //         "heightOffset": 0,
  //         "entityId": "0ed0f590-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 0,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       }
  //     ],
  //     "entityId": "10d8ac70-fc1c-11e9-ad7f-9f854a898ee7",
  //     "name": "polyline",
  //     "color": {
  //       "red": 1,
  //       "green": 1,
  //       "blue": 0,
  //       "alpha": 1
  //     },
  //     "show": true,
  //     "width": 4
  //   }
  // ]
  keepoutFoundLines = keepoutFoundLines.map(p => FoundLine.fromPolyline(p))

  // const keepoutStb = [1]

  // let foundPolylines = [
  //   {
  //     "points": [
  //       {
  //         "lon": -117.841259585591,
  //         "lat": 33.647202271445,
  //         "height": 0.05,
  //         "heightOffset": 0,
  //         "entityId": "fb48a770-fc1b-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841398017643,
  //         "lat": 33.647049654679,
  //         "height": 0.05,
  //         "heightOffset": 0,
  //         "entityId": "fc16cce0-fc1b-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       }
  //     ],
  //     "entityId": "2cc3bce0-fc1c-11e9-ad7f-9f854a898ee7",
  //     "name": "polyline",
  //     "color": {
  //       "red": 1,
  //       "green": 1,
  //       "blue": 1,
  //       "alpha": 1
  //     },
  //     "show": true,
  //     "width": 4
  //   },
  //   {
  //     "points": [
  //       {
  //         "lon": -117.841398017643,
  //         "lat": 33.647049654679,
  //         "height": 0.05,
  //         "heightOffset": 0,
  //         "entityId": "fc16cce0-fc1b-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841095578278,
  //         "lat": 33.64685954321,
  //         "height": 0.05,
  //         "heightOffset": 0,
  //         "entityId": "fd307a41-fc1b-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       }
  //     ],
  //     "entityId": "2cc3bce1-fc1c-11e9-ad7f-9f854a898ee7",
  //     "name": "polyline",
  //     "color": {
  //       "red": 1,
  //       "green": 1,
  //       "blue": 1,
  //       "alpha": 1
  //     },
  //     "show": true,
  //     "width": 4
  //   },
  //   {
  //     "points": [
  //       {
  //         "lon": -117.841095578278,
  //         "lat": 33.64685954321,
  //         "height": 0.05,
  //         "heightOffset": 0,
  //         "entityId": "fd307a41-fc1b-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.840957145979,
  //         "lat": 33.647012160158,
  //         "height": 0.05,
  //         "heightOffset": 0,
  //         "entityId": "fe1eaad7-fc1b-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       }
  //     ],
  //     "entityId": "2cc3bce2-fc1c-11e9-ad7f-9f854a898ee7",
  //     "name": "polyline",
  //     "color": {
  //       "red": 1,
  //       "green": 1,
  //       "blue": 1,
  //       "alpha": 1
  //     },
  //     "show": true,
  //     "width": 4
  //   },
  //   {
  //     "points": [
  //       {
  //         "lon": -117.840957145979,
  //         "lat": 33.647012160158,
  //         "height": 0.05,
  //         "heightOffset": 0,
  //         "entityId": "fe1eaad7-fc1b-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       },
  //       {
  //         "lon": -117.841259585591,
  //         "lat": 33.647202271445,
  //         "height": 0.05,
  //         "heightOffset": 0,
  //         "entityId": "fb48a770-fc1b-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       }
  //     ],
  //     "entityId": "2cc3bce3-fc1c-11e9-ad7f-9f854a898ee7",
  //     "name": "polyline",
  //     "color": {
  //       "red": 1,
  //       "green": 1,
  //       "blue": 1,
  //       "alpha": 1
  //     },
  //     "show": true,
  //     "width": 4
  //   }
  // ]
  foundPolylines = foundPolylines.map(p => Polyline.fromPolyline(p))

  // let hipPolylines = [
  //   {
  //     "points": [
  //       {
  //         "lon": -117.841259585591,
  //         "lat": 33.647202271445,
  //         "height": 0.05,
  //         "heightOffset": 0,
  //         "entityId": "fb48a770-fc1b-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 0.6470588235294118,
  //           "blue": 0,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": null,
  //         "render": false
  //       },
  //       {
  //         "lon": -117.841237357642,
  //         "lat": 33.647069663841,
  //         "height": 0.05,
  //         "heightOffset": 0,
  //         "entityId": "0216e711-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       }
  //     ],
  //     "entityId": "00318540-fc1c-11e9-ad7f-9f854a898ee7",
  //     "name": "polyline",
  //     "color": {
  //       "red": 1,
  //       "green": 0.8431372549019608,
  //       "blue": 0,
  //       "alpha": 1
  //     },
  //     "show": true,
  //     "width": 4,
  //     "type": "HIP"
  //   },
  //   {
  //     "points": [
  //       {
  //         "lon": -117.841237357642,
  //         "lat": 33.647069663841,
  //         "height": 0.05,
  //         "heightOffset": 0,
  //         "entityId": "0216e711-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 0.6470588235294118,
  //           "blue": 0,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": null,
  //         "render": false
  //       },
  //       {
  //         "lon": -117.841398017643,
  //         "lat": 33.647049654679,
  //         "height": 0.05,
  //         "heightOffset": 0,
  //         "entityId": "fc16cce0-fc1b-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 0.6470588235294118,
  //           "blue": 0,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": null,
  //         "render": false
  //       }
  //     ],
  //     "entityId": "02caf4d0-fc1c-11e9-ad7f-9f854a898ee7",
  //     "name": "polyline",
  //     "color": {
  //       "red": 1,
  //       "green": 0.8431372549019608,
  //       "blue": 0,
  //       "alpha": 1
  //     },
  //     "show": true,
  //     "width": 4,
  //     "type": "HIP"
  //   },
  //   {
  //     "points": [
  //       {
  //         "lon": -117.841116288708,
  //         "lat": 33.646993560883,
  //         "height": 0.05,
  //         "heightOffset": 0,
  //         "entityId": "056c2c91-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 0.6470588235294118,
  //           "blue": 0,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": null,
  //         "render": false
  //       },
  //       {
  //         "lon": -117.840957145979,
  //         "lat": 33.647012160158,
  //         "height": 0.05,
  //         "heightOffset": 0,
  //         "entityId": "fe1eaad7-fc1b-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 0.6470588235294118,
  //           "blue": 0,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": null,
  //         "render": false
  //       }
  //     ],
  //     "entityId": "063262c0-fc1c-11e9-ad7f-9f854a898ee7",
  //     "name": "polyline",
  //     "color": {
  //       "red": 1,
  //       "green": 0.8431372549019608,
  //       "blue": 0,
  //       "alpha": 1
  //     },
  //     "show": true,
  //     "width": 4,
  //     "type": "HIP"
  //   },
  //   {
  //     "points": [
  //       {
  //         "lon": -117.841116288708,
  //         "lat": 33.646993560883,
  //         "height": 0.05,
  //         "heightOffset": 0,
  //         "entityId": "056c2c91-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 0.6470588235294118,
  //           "blue": 0,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": null,
  //         "render": false
  //       },
  //       {
  //         "lon": -117.841095578278,
  //         "lat": 33.64685954321,
  //         "height": 0.05,
  //         "heightOffset": 0,
  //         "entityId": "fd307a41-fc1b-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 0.6470588235294118,
  //           "blue": 0,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": null,
  //         "render": false
  //       }
  //     ],
  //     "entityId": "07fbd820-fc1c-11e9-ad7f-9f854a898ee7",
  //     "name": "polyline",
  //     "color": {
  //       "red": 1,
  //       "green": 0.8431372549019608,
  //       "blue": 0,
  //       "alpha": 1
  //     },
  //     "show": true,
  //     "width": 4,
  //     "type": "HIP"
  //   }
  // ]
  hipPolylines = hipPolylines.map(p => InnerLine.fromPolyline(p))
  const hipMathLines = hipPolylines.map(hip => MathLine.fromPolyline(hip));

  // let ridgePolylines = [
  //   {
  //     "points": [
  //       {
  //         "lon": -117.841237357642,
  //         "lat": 33.647069663841,
  //         "height": 0.05,
  //         "heightOffset": 0,
  //         "entityId": "0216e711-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 0.6470588235294118,
  //           "blue": 0,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": null,
  //         "render": false
  //       },
  //       {
  //         "lon": -117.841116288708,
  //         "lat": 33.646993560883,
  //         "height": 0.05,
  //         "heightOffset": 0,
  //         "entityId": "056c2c91-fc1c-11e9-ad7f-9f854a898ee7",
  //         "name": "vertex",
  //         "color": {
  //           "red": 1,
  //           "green": 1,
  //           "blue": 1,
  //           "alpha": 1
  //         },
  //         "pixelSize": 15,
  //         "show": true,
  //         "render": true
  //       }
  //     ],
  //     "entityId": "04691470-fc1c-11e9-ad7f-9f854a898ee7",
  //     "name": "polyline",
  //     "color": {
  //       "red": 1,
  //       "green": 0,
  //       "blue": 0,
  //       "alpha": 1
  //     },
  //     "show": true,
  //     "width": 4,
  //     "type": "RIDGE"
  //   }
  // ]
  ridgePolylines = ridgePolylines.map(p => InnerLine.fromPolyline(p))
  const ridgeMathLines = ridgePolylines.map(ridge => MathLine.fromPolyline(ridge));

  const hipAndRidgeMathLines = hipMathLines.concat(ridgeMathLines)


  console.log(pitchedRoofsFoundLine)
  console.log(pitchedRoofs)
  console.log(keepoutFoundLines)
  console.log(keepoutStb)
  console.log(foundPolylines)
  console.log(hipPolylines)
  console.log(ridgePolylines)
  //
  //
  //
  const newKeepoutFoundLines = keepoutFoundLines.map((kptPly, kptIndex) => {
    const kptMathLineCollection = MathLineCollection.fromPolyline(kptPly)
    const augmentCors = [];
    kptMathLineCollection.mathLineCollection.forEach((mathLine, index) => {
      hipAndRidgeMathLines.forEach(inner => {
        const possibleInter = Coordinate.intersection(
          mathLine.originCor, mathLine.brng, inner.originCor, inner.brng
        );
        if (
          possibleInter !== undefined && Coordinate.surfaceDistance(
          possibleInter, mathLine.originCor) < mathLine.dist &&
          Coordinate.surfaceDistance(possibleInter, inner.originCor) < inner.dist
        ) {
          augmentCors.push({segmentIndex: index, augment: possibleInter})
        }
      })

    });
    const newKptPlyPoints = kptPly.points;
    augmentCors.forEach((elem,i) =>
      newKptPlyPoints.splice(
        elem.segmentIndex + i + 1, 0, Point.fromCoordinate(elem.augment)
      )
    );
    const augmentHtKptPlyPoints = newKptPlyPoints.map(p => {
      console.log('===================')
      console.log(p)
      let newPoint = Point.fromPoint(p);
      pitchedRoofsMathLineCollection.forEach((m, i) => {
        if (corWithinLineCollectionPolygon(m, p)) {
          newPoint.setCoordinate(
            null, null,
            pitchedRoofs[i].lowestNode[2] + Coordinate.heightOfArbitraryNode(pitchedRoofs[i], p) + normalKeepout[kptIndex].height
          );
        }
      })
      console.log(newPoint)
      return newPoint;
    })

    return new FoundLine(augmentHtKptPlyPoints);
  })
  const newNormalKeepout = normalKeepout.map((kpt, index) => {
    const hierarchy = Polygon.makeHierarchyFromPolyline(
      newKeepoutFoundLines[index]
    )
    console.log(hierarchy)
    return NormalKeepout.fromKeepout(
      kpt, null, null, null,
      new Polygon(
        null, null, kpt.height, hierarchy, null, null,
        Color.GOLD
      ),
      kpt.setback !== 0 ?
      null :
      null
    )
  });
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
