import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import * as actions from './index';
import axios from '../../axios-setup';
import errorNotification from '../../components/ui/Notification/ErrorNotification';
import Polyline from '../../infrastructure/line/polyline';
import Inverter from '../../infrastructure/inverter/inverter';
import Wiring from '../../infrastructure/inverter/wiring';
import Bridging from '../../infrastructure/inverter/bridging';
import Coordinate from '../../infrastructure/point/coordinate';
import Point from '../../infrastructure/point/point';
import PV from '../../infrastructure/Polygon/PV';
import Polygon from '../../infrastructure/Polygon/Polygon';
import MathLineCollection from '../../infrastructure/math/mathLineCollection';
import { setBackendLoadingTrue, setBackendLoadingFalse} from './projectManager';
import { setUIStateSetUpWiring } from './uiStateManager';

export const fetchUserInverters = () => (dispatch, getState) => {
  const userID = getState().undoable.present.authManager.userID;
  dispatch(setBackendLoadingTrue());
  axios.get(`/${userID}/inverter`)
  .then(response => {
    dispatch({
      type: actionTypes.FETCH_USER_INVERTERS,
      inverterData: response.data.data
    })
    dispatch(setUIStateSetUpWiring());
    return dispatch(setBackendLoadingFalse());
  })
  .catch(error => {
    dispatch(setBackendLoadingFalse());
    return errorNotification(
      'Backend Error',
      error.response.data.errorMessage || error
    )
  })
}

export const calculateAutoInverter = (roofIndex) => (dispatch, getState) => {
  const allPanels =
    getState().undoable.present.editingPVPanelManager.panels[roofIndex];
  const roofSpecParams =
    getState().undoable.present.editingPVPanelManager.roofSpecParams;
  const totalPanels = allPanels.reduce((acc2, partial) => {
    const totalPanelOnPartial = partial.reduce((acc3, array) => {
      return acc3 + array.length;
    }, 0);
    return acc2 + totalPanelOnPartial;
  }, 0);
  dispatch(setBackendLoadingTrue());
  axios.get('/calculate-inverter-solution/auto', {
    params: {
      totalPanels: totalPanels,
      userID: getState().undoable.present.authManager.userID,
      panelID: roofSpecParams[roofIndex].panelID,
      PVParams: JSON.stringify(roofSpecParams[roofIndex])
    }
  })
  .then(response => {
    const result = response.data.data;
    const inverterName = getState().undoable.present.editingWiringManager
      .userInverters.reduce((name, val) =>
        val.inverterID === result.inverterID ? val.inverterName : name
      , '');
    const inverterSolutions = result.inverterSetUp.map((inverter, i) =>
      new Inverter(
        null,
        result.inverterID,
        `${0 + i + 1 >= 10 ? '' : 0}${0 + i + 1} - ${inverterName} `,
        0 + i + 1,
        inverter.panelPerString,
        inverter.stringPerInverter,
        inverter.mpptSetup
      )
    )
    dispatch(actions.setRoofAllPVDisConnected(roofIndex));
    dispatch({
      type: actionTypes.SET_UP_INVERTER,
      roofIndex: roofIndex,
      inverterSolutions: inverterSolutions
    })
    return dispatch(setBackendLoadingFalse());
  })
  .catch(error => {
    dispatch(setBackendLoadingFalse());
    return errorNotification(
      'Inverter Error',
      error.response.data.errorMessage || error
    )
  })
}

export const calculateManualInverter = (roofIndex, inverterID) =>
(dispatch, getState) => {
  const allPanels =
    getState().undoable.present.editingPVPanelManager.panels[roofIndex];
  const roofSpecParams =
    getState().undoable.present.editingPVPanelManager.roofSpecParams;
  const totalPanels = allPanels.reduce((acc2, partial) => {
    const totalPanelOnPartial = partial.reduce((acc3, array) => {
      return acc3 + array.length;
    }, 0);
    return acc2 + totalPanelOnPartial;
  }, 0);
  dispatch(setBackendLoadingTrue());
  axios.get('/calculate-inverter-solution/manual', {
    params: {
      totalPanels: totalPanels,
      userID: getState().undoable.present.authManager.userID,
      panelID: roofSpecParams[roofIndex].panelID,
      inverterID: inverterID,
      PVParams: JSON.stringify(roofSpecParams[roofIndex])
    }
  })
  .then(response => {
    const result = response.data.data;
    const inverterName = getState().undoable.present.editingWiringManager
      .userInverters.reduce((name, val) =>
        val.inverterID === result.inverterID ? val.inverterName : name
      , 0);
    const inverterSolutions = result.inverterSetUp.map((inverter, i) =>
      new Inverter(
        null,
        result.inverterID,
        `${0 + i + 1 >= 10 ? '' : 0}${0 + i + 1} - ${inverterName} `,
        0 + i + 1,
        inverter.panelPerString,
        inverter.stringPerInverter,
        inverter.mpptSetup
      )
    )
    dispatch(actions.setRoofAllPVDisConnected(roofIndex));
    dispatch({
      type: actionTypes.SET_UP_INVERTER,
      roofIndex: roofIndex,
      inverterSolutions: inverterSolutions
    })
    return dispatch(setBackendLoadingFalse());
  })
  .catch(error => {
    dispatch(setBackendLoadingFalse());
    return errorNotification(
      'Inverter Error',
      error.response.data.errorMessage || error
    )
  })
}

export const autoWiring = (roofInd, inverterInd, wiringInd) =>
(dispatch, getState) => {
  const roofSpecParams =
    getState().undoable.present.editingPVPanelManager.roofSpecParams[roofInd];
  if (roofSpecParams.mode === 'individual') {
    dispatch(individualAutoWiring(roofInd, inverterInd, wiringInd));
  } else {
    dispatch(arrayAutoWiring(roofInd, inverterInd, wiringInd));
  }
}

const individualAutoWiring = (roofInd, inverterInd, wiringInd) =>
(dispatch, getState) => {
  const allPanels =
    getState().undoable.present.editingPVPanelManager.panels[roofInd];
  const availablePanels = allPanels.flatMap(partial => {
    const partialRoofPanels = partial.map(originPanelArray => {
      const panelArray = originPanelArray.filter(panel => !panel.pv.connected);
      if (panelArray.length === 0) return [];
      return panelArray.map(panel => {
        return {
          ...panel,
          pv: PV.copyPolygon(panel.pv)
        }
      });
    })
    return partialRoofPanels.filter(panelArray => panelArray.length > 0);
  });
  const inverterConfig = getState().undoable.present.editingWiringManager
    .roofSpecInverters[roofInd][inverterInd];

  const string = findAWiringString(availablePanels, inverterConfig, 0);
  const panelRows = string.map(p => p.row);
  const panelsOnString = string.map(p => p.pv);
  const panelCenterPoints = string.map(p => {
    const center = p.pv.getCenter(0.2);
    // center.setCoordinate(null, null, center.height + 0.2);
    return center;
  });
  const wiringPolyline = new Polyline(
    panelCenterPoints, null, 'wiring', Cesium.Color.DARKORANGE
  );
  const newWiring = new Wiring(
    null, panelsOnString[0], panelsOnString.slice(-1)[0], panelsOnString,
    wiringPolyline, panelRows
  );
  return dispatch({
    type: actionTypes.AUTO_WIRING,
    wiring: newWiring,
    roofIndex: roofInd,
    inverterIndex: inverterInd,
    wiringIndex: wiringInd
  });
}

const arrayAutoWiring = (roofInd, inverterInd, wiringInd) =>
(dispatch, getState) => {
  const roofSpecParams =
    getState().undoable.present.editingPVPanelManager.roofSpecParams[roofInd];
  const allPanels =
    getState().undoable.present.editingPVPanelManager.panels[roofInd];
  const availablePanelArrays = allPanels.flatMap(partial => {
    return partial.map(originPanelArray => {
      return originPanelArray.filter(panel => !panel.pv.connected);
    }).filter(array => array.length > 0)
  });

  const panelCandidates = [];
  for (let r = 0; r < roofSpecParams.rowPerArray; r++) {
    panelCandidates.push(
      availablePanelArrays[0].slice(
        r * roofSpecParams.panelPerRow,
        r * roofSpecParams.panelPerRow + roofSpecParams.panelPerRow
      )
    );
  }
  let string = [];
  if (availablePanelArrays[0][0].col % 2 === 0) {
    panelCandidates.forEach((row, i) => {
      if (i % 2 === 0) {
        string = string.concat(row.reverse())
      } else {
        string = string.concat(row)
      }
    })
  } else {
    panelCandidates.forEach((row, i) => {
      if (i % 2 !== 0) {
        string = string.concat(row.reverse())
      } else {
        string = string.concat(row)
      }
    })
  }
  const panelRows = string.map(p => p.row);

  const panelsOnString = string.map(p => p.pv);
  const panelCenterPoints = string.map(p => {
    const center = p.pv.getCenter(0.2);
    // center.setCoordinate(null, null, center.height + 0.2);
    return center;
  });
  const wiringPolyline = new Polyline(
    panelCenterPoints, null, 'wiring', Cesium.Color.DARKORANGE
  );
  const newWiring = new Wiring(
    null, panelsOnString[0], panelsOnString.slice(-1)[0], panelsOnString,
    wiringPolyline, panelRows
  );
  dispatch({
    type: actionTypes.AUTO_WIRING,
    wiring: newWiring,
    roofIndex: roofInd,
    inverterIndex: inverterInd,
    wiringIndex: wiringInd
  });
}

export const manualWiring = (roofInd, inverterInd, wiringInd) =>{
  return {
    type: actionTypes.MANUAL_WIRING,
    roofIndex: roofInd,
    inverterIndex: inverterInd,
    wiringIndex: wiringInd
  };
}

export const setManualWiringStart = (panelId) => (dispatch, getState) => {
  const editingRoofIndex =
    getState().undoable.present.editingWiringManager.editingRoofIndex;
  const allPanels =
    getState().undoable.present.editingPVPanelManager.panels[editingRoofIndex];
  const availablePanels = allPanels.flatMap(partial => {
    const partialRoofPanels = partial.map(originPanelArray => {
      const panelArray = originPanelArray.filter(panel => !panel.pv.connected);
      if (panelArray.length === 0) return [];
      return panelArray.map(panel => {
        return {
          ...panel,
          pv: PV.copyPolygon(panel.pv)
        }
      });
    })
    return partialRoofPanels.filter(panelArray => panelArray.length > 0);
  });
  const matchPanel = availablePanels.find(elem => elem[0].pv.entityId === panelId)[0];
  const panelCenterPoints = [Point.fromCoordinate(matchPanel.center)]
  const wiringPolyline = new Polyline(
    panelCenterPoints, null, 'wiring', Cesium.Color.RED
  );
  const newWiring = new Wiring(
    null, matchPanel.pv, matchPanel.pv, [matchPanel.pv], wiringPolyline, [matchPanel.row]
  );

  return dispatch({
    type: actionTypes.MANUAL_WIRING_START,
    wiring: newWiring,
    position: 'END'
  });
}

export const editWiring = (roofInd, inverterInd, wiringInd) => {
  return {
    type: actionTypes.EDIT_WIRING,
    roofIndex: roofInd,
    inverterIndex: inverterInd,
    wiringIndex: wiringInd
  };
}

export const stopEditWiring = () => {
  return {
    type: actionTypes.STOP_EDIT_WIRING,
  };
}

const findAWiringString = (availablePanels, inverterConfig, startIndex) => {
  const coefficient = 0.75;

  const string = [availablePanels[startIndex][0]];
  availablePanels[startIndex][0].pv.setConnected();
  for (let i = 0; i < inverterConfig.panelPerString - 1; i++) {
    const currentPanel = string.slice(-1)[0];
    const withDist = availablePanels.map((panelArray, panelArrayInd) => {
      let dist = null;
      if (
        (currentPanel.rowPos === 'start' ||
        currentPanel.rowPos === 'end' ||
        currentPanel.rowPos === 'single') &&
        (panelArray[0].rowPos === 'start' ||
        panelArray[0].rowPos === 'end' ||
        panelArray[0].rowPos === 'single')
      ) {
        dist = Point.surfaceDistance(currentPanel.center, panelArray[0].center)
          * coefficient;
      } else {
        dist = Point.surfaceDistance(currentPanel.center, panelArray[0].center)
      }

      return {
        dist: dist,
        panelArrayInd: panelArrayInd,
        pvInfo: panelArray[0]
      };
    }).filter(elem => !elem.pvInfo.pv.connected);
    withDist.sort((first, second) => first.dist > second.dist ? 1 : -1);
    const nextPanel = withDist[0].pvInfo;
    string.push(nextPanel);
    availablePanels[withDist[0].panelArrayInd][0].pv.setConnected();
  }
  return string;
}

export const setHoverWiringPoint = (position) => {
  return {
    type: actionTypes.SET_HOVER_WIRING_POINT,
    position: position
  };
}

export const releaseHoverWiringPoint = () => {
  return {
    type: actionTypes.RELEASE_HOVER_WIRING_POINT,
  };
}

export const setPickedWiringPoint = () => {
  return {
    type: actionTypes.SET_PICKED_WIRING_POINT,
  };
}

export const releasePickedWiringPoint = () => {
  return {
    type: actionTypes.RELEASE_PICKED_WIRING_POINT,
  };
}

export const releasePVPanel = (hoverPanelId) => (dispatch, getState) => {
  const currentMouseDrag =
    getState().undoable.present.editingWiringManager.currentMouseDrag;
  const lastMouseDrag =
    getState().undoable.present.editingWiringManager.lastMouseDrag;
  const editingRoofIndex =
    getState().undoable.present.editingWiringManager.editingRoofIndex;
  const editingInverterIndex =
    getState().undoable.present.editingWiringManager.editingInverterIndex;
  const editingWiringIndex =
    getState().undoable.present.editingWiringManager.editingWiringIndex;
  const pickedWiringPointPosition =
    getState().undoable.present.editingWiringManager.pickedWiringPointPosition;
  const currentWiring = getState().undoable.present.editingWiringManager
    .roofSpecInverters[editingRoofIndex][editingInverterIndex]
    .wiring[editingWiringIndex];

  let toReleasePanelId = null;
  if (pickedWiringPointPosition === 'START') {
    toReleasePanelId = currentWiring.allPanels[0].entityId
  } else {
    toReleasePanelId = currentWiring.allPanels.slice(-1)[0].entityId
  }
  if (
    toReleasePanelId === hoverPanelId && currentWiring.allPanels.length > 1 &&
    currentMouseDrag !== lastMouseDrag
  ) {
    dispatch(actions.setPVDisConnected(editingRoofIndex, hoverPanelId))
    return dispatch({
      type: actionTypes.RELEASE_PV_PANEL,
    })
  }
}

export const attachPVPanel = (hoverPanelId) => (dispatch, getState) => {
  const currentMouseDrag =
    getState().undoable.present.editingWiringManager.currentMouseDrag;
  const lastMouseDrag =
    getState().undoable.present.editingWiringManager.lastMouseDrag;
  const editingRoofIndex =
    getState().undoable.present.editingWiringManager.editingRoofIndex;
  const editingInverterIndex =
    getState().undoable.present.editingWiringManager.editingInverterIndex;
  const editingWiringIndex =
    getState().undoable.present.editingWiringManager.editingWiringIndex;
  const currentWiring = getState().undoable.present.editingWiringManager
    .roofSpecInverters[editingRoofIndex][editingInverterIndex]
    .wiring[editingWiringIndex];
  const currentInverter = getState().undoable.present.editingWiringManager
    .roofSpecInverters[editingRoofIndex][editingInverterIndex];

  const flatMapPanels =
    getState().undoable.present.editingPVPanelManager.panels[editingRoofIndex]
    .flatMap(partial =>
      partial.flatMap(originPanelArray =>
        originPanelArray
      )
    );
  const matchInfo = flatMapPanels.find(elem => elem.pv.entityId === hoverPanelId);

  if (
    currentWiring.allPanels.length < currentInverter.panelPerString &&
    currentMouseDrag !== lastMouseDrag
  ) {
    dispatch(actions.setPVConnected(editingRoofIndex, hoverPanelId))
    return dispatch({
      type: actionTypes.ATTACH_PV_PANEL,
      panelInfo: matchInfo
    })
  }
}

export const dynamicWiringLine = () => (dispatch, getState) => {
  const mouseCartesian3 =
    getState().undoable.present.drawingManager.mouseCartesian3;
  if (Cesium.defined(mouseCartesian3)) {
    return dispatch({
      type: actionTypes.DYNAMIC_WIRING_LINE,
      cartesian3: mouseCartesian3
    });
  } else {
    return dispatch({
      type: actionTypes.DO_NOTHING
    });
  }
}

export const setMouseDragStatus = (hoverObj) => {
  return {
    type: actionTypes.SET_MOUSE_DRAG_STATUS,
    dragStatus: hoverObj
  }
}

export const setBridgingRoofAndInverter = (roofIndex, inverterIndex) => {
  return {
    type: actionTypes.SET_BRIDGING_ROOF_AND_INVERTER,
    roofIndex: roofIndex,
    inverterIndex: inverterIndex
  };
}

export const placeInverter = (heightOffset=0.2) => (dispatch, getState) => {
  const workingBuilding =
    getState().undoable.present.buildingManager.workingBuilding;
  const inverterLength = 0.25;
  const mouseCartesian3 =
    getState().undoable.present.drawingManager.mouseCartesian3;
  const editingRoofIndex =
    getState().undoable.present.editingWiringManager.editingRoofIndex;
  const result = makeInverterPolygonAndCenter(
    mouseCartesian3, workingBuilding, editingRoofIndex, heightOffset, inverterLength
  );
  const inverterPolygon = result.inverterPolygon;
  const inverterCenter = result.inverterCenter;

  return dispatch({
    type: actionTypes.PLACE_INVERTER,
    polygon: inverterPolygon,
    polygonCenter: inverterCenter
  })
}

export const bridging = (roofIndex, inverterIndex, heightOffset=0.2) =>
(dispatch, getState) => {
  const workingBuilding =
    getState().undoable.present.buildingManager.workingBuilding;
  const inverterCenterPoint =
    getState().undoable.present.editingWiringManager
    .roofSpecInverters[roofIndex][inverterIndex].polygonCenter;
  const wirings = getState().undoable.present.editingWiringManager
    .roofSpecInverters[roofIndex][inverterIndex].wiring;
  const roofSpecParams = getState().undoable.present.editingPVPanelManager
    .roofSpecParams[roofIndex];
  const pvPanelParams = getState().undoable.present.editingPVPanelManager
    .userPanels[roofSpecParams.selectPanelIndex];
  const rooftopLineCollection = workingBuilding.type === 'FLAT' ?
    MathLineCollection.fromPolyline(
      workingBuilding.foundationPolygon[roofIndex]
      .convertHierarchyToFoundLine()
    ) :
    MathLineCollection.fromPolyline(
      workingBuilding.pitchedRoofPolygons[roofIndex]
      .convertHierarchyToFoundLine()
    );
  const panelCos = Math.cos(roofSpecParams.tilt * Math.PI / 180.0);
  let panelWidth = null;
  if (roofSpecParams.orientation === 'portrait') {
    panelWidth = pvPanelParams.panelWidth > pvPanelParams.panelLength ?
    panelCos * pvPanelParams.panelWidth : panelCos * pvPanelParams.panelLength
  } else {
    panelWidth = pvPanelParams.panelWidth < pvPanelParams.panelLength ?
    panelCos * pvPanelParams.panelWidth : panelCos * pvPanelParams.panelLength
  }
  const anchorDist = panelWidth / 2 + roofSpecParams.rowSpace / 2;

  const bridgingDict = {};
  wirings.forEach((wiring, i) => {
    if (wiring.allPanels.length > 0) {
      const firstPanelCenter = wiring.startPanel.getCenter(0.2);
      const firstAnchor = wiring.panelRows[0] % 2 === 0 ?
        Point.fromCoordinate(Coordinate.destination(
          firstPanelCenter, roofSpecParams.azimuth, anchorDist
        ), null, null, null, Cesium.Color.DARKCYAN) :
        Point.fromCoordinate(Coordinate.destination(
          firstPanelCenter, roofSpecParams.azimuth + 180, anchorDist
        ), null, null, null, Cesium.Color.DARKCYAN)
      if (workingBuilding.type === 'FLAT') {
        firstAnchor.setCoordinate(
          null, null, workingBuilding.foundationHeight + heightOffset
        );
      } else {
        firstAnchor.setCoordinate(
          null, null,
          Coordinate.heightOfArbitraryNode(
            workingBuilding.pitchedRoofPolygons[roofIndex],
            firstAnchor
          ) + workingBuilding.foundationHeight + heightOffset
        );
      }

      const bridgingIndex = wiring.panelRows[0] % 2 === 0 ?
        wiring.panelRows[0] :
        wiring.panelRows[0] - 1;
      if (bridgingIndex in bridgingDict) {
        bridgingDict[bridgingIndex].push({
          anchor: firstAnchor,
          panelCenter:firstPanelCenter,
          wiringIndex: i
        });
      } else {
        bridgingDict[bridgingIndex] = [{
          anchor: firstAnchor,
          panelCenter:firstPanelCenter,
          wiringIndex: i
        }];
      }
    }
  })
  wirings.forEach(wiring => {
    if (wiring.allPanels.length > 0) {
      const endPanelCenter = wiring.endPanel.getCenter(0.2);
      const endAnchor = wiring.panelRows.slice(-1)[0] % 2 === 0 ?
        Point.fromCoordinate(Coordinate.destination(
          endPanelCenter, roofSpecParams.azimuth, anchorDist
        ), null, null, null, Cesium.Color.DARKCYAN) :
        Point.fromCoordinate(Coordinate.destination(
          endPanelCenter, roofSpecParams.azimuth + 180, anchorDist
        ), null, null, null, Cesium.Color.DARKCYAN)
      if (workingBuilding.type === 'FLAT') {
        endAnchor.setCoordinate(
          null, null, workingBuilding.foundationHeight + heightOffset
        );
      } else {
        endAnchor.setCoordinate(
          null, null,
          Coordinate.heightOfArbitraryNode(
            workingBuilding.pitchedRoofPolygons[roofIndex],
            endAnchor
          ) + workingBuilding.foundationHeight + heightOffset
        );
      }

      const bridgingIndex = wiring.panelRows.slice(-1)[0] % 2 === 0 ?
        wiring.panelRows.slice(-1)[0] :
        wiring.panelRows.slice(-1) - 1;
      if (bridgingIndex in bridgingDict) {
        bridgingDict[bridgingIndex].push({
          anchor: endAnchor,
          panelCenter:endPanelCenter
        });
      } else {
        bridgingDict[bridgingIndex] = [{
          anchor: endAnchor,
          panelCenter:endPanelCenter
        }];
      }
    }
  })

  const bridgings = Object.keys(bridgingDict).map(key => {
    bridgingDict[key].sort((first, second) =>
      Coordinate.surfaceDistance(inverterCenterPoint, first.anchor) <
      Coordinate.surfaceDistance(inverterCenterPoint, second.anchor) ?
      -1 : 1
    )

    let leftIntersect = null;
    rooftopLineCollection.mathLineCollection.forEach(mathLine => {
      const inter = Coordinate.intersection(
        bridgingDict[key][0].anchor, roofSpecParams.azimuth + 90,
        mathLine.originCor, mathLine.brng
      );
      if (inter !== undefined) {
        if (
          Coordinate.surfaceDistance(inter, mathLine.originCor) <
          mathLine.dist
        ) {
          leftIntersect = inter;
        }
      }
    });
    let rightIntersect = null;
    rooftopLineCollection.mathLineCollection.forEach(mathLine => {
      const inter = Coordinate.intersection(
        bridgingDict[key][0].anchor, roofSpecParams.azimuth - 90,
        mathLine.originCor, mathLine.brng
      );
      if (inter !== undefined) {
        if (
          Coordinate.surfaceDistance(inter, mathLine.originCor) <
          mathLine.dist
        ) {
          rightIntersect = inter;
        }
      }
    });
    const leftOrRightAnchor =
      Coordinate.surfaceDistance(leftIntersect, inverterCenterPoint) <
      Coordinate.surfaceDistance(rightIntersect, inverterCenterPoint) ?
      Point.fromCoordinate(leftIntersect, null, null, null, Cesium.Color.DARKCYAN) :
      Point.fromCoordinate(rightIntersect, null, null, null, Cesium.Color.DARKCYAN)
    const upIntersect = Coordinate.intersection(
      bridgingDict[key][0].anchor, roofSpecParams.azimuth + 90,
      inverterCenterPoint, roofSpecParams.azimuth + 180
    ) || Coordinate.intersection(
      bridgingDict[key][0].anchor, roofSpecParams.azimuth - 90,
      inverterCenterPoint, roofSpecParams.azimuth + 180
    );
    const downIntersect = Coordinate.intersection(
      bridgingDict[key][0].anchor, roofSpecParams.azimuth + 90,
      inverterCenterPoint, roofSpecParams.azimuth
    ) || Coordinate.intersection(
      bridgingDict[key][0].anchor, roofSpecParams.azimuth - 90,
      inverterCenterPoint, roofSpecParams.azimuth
    );
    const upOrDownAnchor =
      upIntersect === undefined ?
      Point.fromCoordinate(downIntersect, null, null, null, Cesium.Color.DARKCYAN) :
      downIntersect === undefined ?
      Point.fromCoordinate(upIntersect, null, null, null, Cesium.Color.DARKCYAN) :
      Coordinate.surfaceDistance(upIntersect, inverterCenterPoint) <
      Coordinate.surfaceDistance(downIntersect, inverterCenterPoint) ?
      Point.fromCoordinate(upIntersect, null, null, null, Cesium.Color.DARKCYAN) :
      Point.fromCoordinate(downIntersect, null, null, null, Cesium.Color.DARKCYAN)

    const bridgeAnchor =
      Coordinate.surfaceDistance(upOrDownAnchor, bridgingDict[key][0].anchor) <
      Coordinate.surfaceDistance(leftOrRightAnchor, bridgingDict[key][0].anchor) ?
      upOrDownAnchor :
      leftOrRightAnchor

    const mainPolyline = new Polyline(
      [inverterCenterPoint, bridgeAnchor, ...bridgingDict[key].map(obj => obj.anchor)],
      null, 'bridging', Cesium.Color.DARKCYAN
    );
    const subPolylines = bridgingDict[key].map(obj =>
      new Polyline([obj.anchor, obj.panelCenter],
      null, 'bridging', Cesium.Color.DARKCYAN)
    );
    const anchorPanelMap = bridgingDict[key].map((obj, i) => {
      return {
        anchorIndex: i + 2,
        panelCenter: obj.panelCenter
      }
    });
    const connectedWiringIndex =
      bridgingDict[key].filter(obj => obj.wiringIndex !== undefined)
      .map((obj, i) => obj.wiringIndex);
    return new Bridging(
      null, mainPolyline, subPolylines, anchorPanelMap, connectedWiringIndex
    );
  })

  return dispatch({
    type: actionTypes.AUTO_BRIDGING,
    bridging: bridgings,
    roofIndex: roofIndex,
    inverterIndex: inverterIndex
  });
}

export const setHoverInverterCenter = () => {
  return {
    type: actionTypes.SET_HOVER_INVERTER_CENTER
  };
}

export const releaseHoverInverterCenter = () => {
  return {
    type: actionTypes.RELEASE_HOVER_INVERTER_CENTER
  };
}

export const dragInverter = (heightOffset=0.2) => (dispatch, getState) => {
  const inverterLength = 0.25;
  const workingBuilding =
    getState().undoable.present.buildingManager.workingBuilding;
  const mouseCartesian3 =
    getState().undoable.present.drawingManager.mouseCartesian3;
  const editingRoofIndex =
    getState().undoable.present.editingWiringManager.editingRoofIndex;

  const result = makeInverterPolygonAndCenter(
    mouseCartesian3, workingBuilding, editingRoofIndex, heightOffset, inverterLength
  );
  const inverterPolygon = result.inverterPolygon;
  const inverterCenter = result.inverterCenter;

  return dispatch({
    type: actionTypes.DRAG_INVERTER,
    polygon: inverterPolygon,
    polygonCenter: inverterCenter
  })
}

export const setHoverBridgingPoint = (pointId) => (dispatch, getState) => {
  const roofSpecInverters =
    getState().undoable.present.editingWiringManager.roofSpecInverters;
  const editingRoofIndex =
    getState().undoable.present.editingWiringManager.editingRoofIndex;
  const editingInverterIndex =
    getState().undoable.present.editingWiringManager.editingInverterIndex;
  let bridgingIndex = null;
  let bridgingPointIndex = null;
  roofSpecInverters[editingRoofIndex][editingInverterIndex]
  .bridging.forEach((bridging, i) => {
    const matchIndex = bridging.mainPolyline.points.findIndex(p =>
      p.entityId === pointId
    );
    if (matchIndex > 0) {
      bridgingPointIndex = matchIndex;
      bridgingIndex = i;
    }
  });
  if (bridgingIndex !== null && bridgingPointIndex !== null) {
    return dispatch({
      type: actionTypes.SET_HOVER_BRIDGING_POINT,
      bridgingIndex: bridgingIndex,
      bridgingPointIndex: bridgingPointIndex
    })
  }
}

export const releaseHoverBridgingPoint = () => {
  return {
    type: actionTypes.RELEASE_HOVER_BRIDGING_POINT
  }
}

export const dragBridgingPoint = (heightOffset=0.2) => (dispatch, getState) => {
  const workingBuilding =
    getState().undoable.present.buildingManager.workingBuilding;
  const mouseCartesian3 =
    getState().undoable.present.drawingManager.mouseCartesian3;
  const editingRoofIndex =
    getState().undoable.present.editingWiringManager.editingRoofIndex;

  let newPoint = null;
  if (workingBuilding.type === 'FLAT') {
    newPoint = Point.fromCoordinate(Coordinate.fromCartesian(
      mouseCartesian3, workingBuilding.foundationHeight + heightOffset
    ), null, null, null, Cesium.Color.DARKCYAN)
  } else {
    newPoint = Point.fromCoordinate(
      Coordinate.fromCartesian(mouseCartesian3), null, null, null,
      Cesium.Color.DARKCYAN
    );
    newPoint.setCoordinate(
      null, null,
      Coordinate.heightOfArbitraryNode(
        workingBuilding.pitchedRoofPolygons[editingRoofIndex], newPoint
      ) + workingBuilding.foundationHeight + heightOffset
    );
  }

  return dispatch({
    type: actionTypes.DRAG_BRIDGING_POINT,
    point: newPoint
  })
}

export const setHoverBridgingMainPolyline = (polylineId) =>
(dispatch, getState) => {
  const roofSpecInverters =
    getState().undoable.present.editingWiringManager.roofSpecInverters;
  const editingRoofIndex =
    getState().undoable.present.editingWiringManager.editingRoofIndex;
  const editingInverterIndex =
    getState().undoable.present.editingWiringManager.editingInverterIndex;
  const bridgingMainPolylineIndex =
    roofSpecInverters[editingRoofIndex][editingInverterIndex].bridging
    .findIndex(bridging => bridging.mainPolyline.entityId === polylineId);
  if (bridgingMainPolylineIndex !== null) {
    return dispatch({
      type: actionTypes.SET_HOVER_BRIDGING_MAIN_POLYLINE,
      bridgingMainPolylineIndex: bridgingMainPolylineIndex,
    })
  }
}

export const releaseHoverBridgingMainPolyline = () => {
  return {
    type: actionTypes.RELEASE_HOVER_BRIDGING_MAINPOLYLINE
  }
}

export const complementPointOnBridging = (heightOffset=0.2) =>
(dispatch, getState) => {
  const workingBuilding =
    getState().undoable.present.buildingManager.workingBuilding;
  const roofSpecInverters =
    getState().undoable.present.editingWiringManager.roofSpecInverters;
  const editingRoofIndex =
    getState().undoable.present.editingWiringManager.editingRoofIndex;
  const editingInverterIndex =
    getState().undoable.present.editingWiringManager.editingInverterIndex;
  const editingBridgingMainPolylineIndex =
    getState().undoable.present.editingWiringManager
    .editingBridgingMainPolylineIndex;
  const mainPolyline = roofSpecInverters[editingRoofIndex][editingInverterIndex]
    .bridging[editingBridgingMainPolylineIndex].mainPolyline;
  const rightClickCartesian3 =
    getState().undoable.present.drawingManager.rightClickCartesian3;
  const indexToAdd = mainPolyline.determineAddPointPosition(rightClickCartesian3);

  let newPoint = null;
  if (workingBuilding.type === 'FLAT') {
    newPoint = Point.fromCoordinate(Coordinate.fromCartesian(
      rightClickCartesian3, workingBuilding.foundationHeight + heightOffset
    ), null, null, null, Cesium.Color.DARKCYAN)
  } else {
    newPoint = Point.fromCoordinate(
      Coordinate.fromCartesian(rightClickCartesian3), null, null, null,
      Cesium.Color.DARKCYAN
    );
    newPoint.setCoordinate(
      null, null,
      Coordinate.heightOfArbitraryNode(
        workingBuilding.pitchedRoofPolygons[editingRoofIndex], newPoint
      ) + workingBuilding.foundationHeight + heightOffset
    );
  }

  return dispatch({
    type: actionTypes.COMPLEMENT_POINT_ON_BRIDGING,
    indexToAdd: indexToAdd,
    point: newPoint
  });
}

export const highLightWiring = (roofInd, inverterInd, wiringInd) => {
  return {
    type: actionTypes.HIGHLIGHT_WIRING,
    roofIndex: roofInd,
    inverterIndex: inverterInd,
    wiringIndex: wiringInd
  }
}

export const deHighLightWiring = (roofInd, inverterInd, wiringInd) => {
  return {
    type: actionTypes.DE_HIGHLIGHT_WIRING,
    roofIndex: roofInd,
    inverterIndex: inverterInd,
    wiringIndex: wiringInd
  }
}

const makeInverterPolygonAndCenter = (
  mouseCartesian3, workingBuilding, editingRoofIndex, heightOffset, inverterLength
) => {
  const inverterCenterPoint = Point.fromCoordinate(
    Coordinate.fromCartesian(mouseCartesian3), null, null, null,
    Cesium.Color.DARKCYAN
  );
  if (workingBuilding.type === 'FLAT') {
    inverterCenterPoint.setCoordinate(
      null, null, workingBuilding.foundationHeight + heightOffset
    );
  } else {
    inverterCenterPoint.setCoordinate(
      null, null,
      Coordinate.heightOfArbitraryNode(
        workingBuilding.pitchedRoofPolygons[editingRoofIndex],
        inverterCenterPoint
      ) + workingBuilding.foundationHeight + heightOffset
    );
  }
  const inverterWNPoint = Point.fromCoordinate(
    Coordinate.destination(
      Coordinate.destination(inverterCenterPoint, 0, inverterLength),
      270, inverterLength
    )
  );
  const inverterWSPoint = Point.fromCoordinate(
    Coordinate.destination(inverterWNPoint, 180, 2 * inverterLength)
  );
  const inverterESPoint = Point.fromCoordinate(
    Coordinate.destination(inverterWSPoint, 90, 2 * inverterLength)
  );
  const inverterENPoint = Point.fromCoordinate(
    Coordinate.destination(inverterESPoint, 0, 2 * inverterLength)
  );
  const hier = Polygon.makeHierarchyFromPolyline(
    new Polyline(
      [inverterWNPoint, inverterWSPoint, inverterESPoint, inverterENPoint]
    ), inverterCenterPoint.height
  );
  return {
    inverterPolygon: new Polygon(
      null, 'inverter', null, hier, null, null, Cesium.Color.DARKCYAN
    ),
    inverterCenter: inverterCenterPoint
  };
}
