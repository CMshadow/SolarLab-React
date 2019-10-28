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
  dispatch(createNormalKeepoutPolygon(normalKeepout));
  dispatch(createPassageKeepoutPolygon(passageKeepout));
  dispatch(createVentKeepoutPolygon(ventKeepout));
  dispatch(createTreeKeepoutPolygon(treeKeepout));
  dispatch(createEnvKeepoutPolygon(envKeepout));
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
      error.toString()
    )
  });
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
      error.toString()
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
