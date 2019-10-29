import {Color} from 'cesium';
import * as martinez from 'martinez-polygon-clipping';

import * as actionTypes from './actionTypes';
import axios from '../../axios-setup';
import errorNotification from '../../components/ui/Notification/ErrorNotification';
import Polygon from '../../infrastructure/Polygon/Polygon';
import FoundLine from '../../infrastructure/line/foundLine';
import NormalKeepout from '../../infrastructure/keepout/normalKeepout';

export const createAllKeepoutPolygon = () => (dispatch, getState) => {
  const allKeepout =
    getState().undoableReducer.present.drawingKeepoutManagerReducer.keepoutList;
  const normalKeepout = allKeepout.filter(kpt => kpt.type === 'KEEPOUT');
  dispatch(createNormalKeepoutPolygon(normalKeepout))
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
      return Polygon.makeHierarchyFromTurfPolygon(
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
