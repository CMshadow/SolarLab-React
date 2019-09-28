import {Color} from 'cesium';
import * as martinez from 'martinez-polygon-clipping';

import * as actionTypes from './actionTypes';
import axios from '../../axios-setup';
import errorNotification from '../../components/ui/Notification/ErrorNotification';
import Polygon from '../../infrastructure/Polygon/Polygon';
import FoundLine from '../../infrastructure/line/foundLine';
import NormalKeepout from '../../infrastructure/keepout/normalKeepout';
import Passage from '../../infrastructure/keepout/passage';

export const createAllKeepoutPolygon = () => (dispatch, getState) => {
  const allKeepout =
    getState().undoableReducer.present.drawingKeepoutManagerReducer.keepoutList;
  const normalKeepout = allKeepout.filter(kpt => kpt.type === 'KEEPOUT');
  const passageKeepout = allKeepout.filter(kpt => kpt.type === 'PASSAGE');
  dispatch(createNormalKeepoutPolygon(normalKeepout));
  dispatch(createPassageKeepoutPolygon(passageKeepout));
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

export const createPassageKeepoutPolygon = (passageKeepout) =>
(dispatch, getState) => {
  const foundPolyline =
    getState().undoableReducer.present.drawingManagerReducer.drawingPolyline;
  const foundHeight =
    getState().buildingManagerReducer.workingBuilding.foundationHeight;
  const keepoutPolylines = passageKeepout.map(kpt => kpt.outlinePolyline);
  const keepoutWidth = passageKeepout.map(kpt => kpt.width);

  // const test = keepoutPolylines.map(ply => ply.makeSetbackPolyline(keepoutWidth, 'outside').polyline)
  // const newPassageKeepout = passageKeepout.map((kpt, index) => {
  //   const parsedPolyline = test[index].removeOutsideSetbackSelfIntersection(90);
  //   console.log(parsedPolyline[0])
  //   const hierarchy = Polygon.makeHierarchyFromPolyline(
  //     parsedPolyline[0], foundHeight, 0.005
  //   )
  //   console.log(hierarchy)
  //   return Passage.fromKeepout(
  //     kpt, null, null,
  //     new Polygon(
  //       null, null, foundHeight, hierarchy, null, null,
  //       Color.ORANGE
  //     ),
  //   )
  // });
  // dispatch({
  //   type: actionTypes.CREATE_ALL_PASSAGE_KEEPOUT_POLYGON,
  //   passageKeepout: newPassageKeepout
  // })


  axios.post('/calculate-passage-coordinate', {
    originPolylines: keepoutPolylines,
    stbDists: keepoutWidth/2,
    direction: 'outside'
  }).then(response => {
    const stbPolylines = JSON.parse(response.data.body).stbPolylines;
    console.log(stbPolylines)
  })
  // .then(response => {
  //   const stbPolylines = JSON.parse(response.data.body).stbPolylines;
  //   const stbHierarchies = stbPolylines.map(stbPolyline => {
  //     const trimedStbTurfPolygon = {
  //       type: 'Feature',
  //       geometry: {
  //         type: 'Polygon',
  //         coordinates: martinez.intersection(
  //           foundPolyline.makeGeoJSON().geometry.coordinates,
  //           FoundLine.fromPolyline(stbPolyline[0]).makeGeoJSON().geometry.coordinates
  //         )[0]
  //       }
  //     }
  //     return Polygon.makeHierarchyFromTurfPolygon(
  //       trimedStbTurfPolygon, foundHeight, 0.005
  //     );
  //   });
  //   const newNormalKeepout = normalKeepout.map((kpt, index) => {
  //     const hierarchy = Polygon.makeHierarchyFromPolyline(
  //       kpt.outlinePolyline, kpt.height + foundHeight
  //     )
  //     return NormalKeepout.fromKeepout(
  //       kpt, null, null, null,
  //       new Polygon(
  //         null, null, kpt.height + foundHeight, hierarchy, null, null,
  //         Color.GOLD
  //       ),
  //       kpt.setback !== 0 ?
  //       new Polygon(
  //         null, null, foundHeight, stbHierarchies[index], null, null,
  //         Color.ORANGE
  //       ) :
  //       null
  //     )
  //   });
  //   dispatch({
  //     type: actionTypes.CREATE_ALL_NORMAL_KEEPOUT_POLYGON,
  //     normalKeepout: newNormalKeepout
  //   })
  // })
  // .catch(error => {
  //   return errorNotification(
  //     'Backend Error',
  //     error
  //   )
  // });
}
