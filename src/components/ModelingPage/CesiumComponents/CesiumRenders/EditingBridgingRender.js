import React from 'react';
import {connect} from 'react-redux';
import FloatPolyline from '../polyline/floatingPolyline';
import PolygonVisualize from '../Polygon/Polygon';
import CustomPoint from '../point/point';

const EditingBridgingRender = (props) => {

  let allInverterPolygons = null;
  if (
    props.uiState !== 'READY_DRAG_INVERTER' && props.uiState !== 'DRAG_INVERTER'
  ) {
    allInverterPolygons = props.entireSpecInverters
    .filter(inverter => inverter.polygon)
    .map(inverter =>
      <PolygonVisualize key={inverter.polygon.entityId} {...inverter.polygon}/>
    )
  } else {
    allInverterPolygons = props.entireSpecInverters
    .filter((inverter, i) =>
      inverter.polygon && i !== props.editingInverterIndex
    )
    .map(inverter =>
      <PolygonVisualize key={inverter.polygon.entityId} {...inverter.polygon}/>
    )
  }

  const mainBridgings = props.entireSpecInverters.map(inverter =>
    inverter.bridging.map(bridging =>
      <FloatPolyline
        key={bridging.mainPolyline.entityId}
        {...bridging.mainPolyline}
      />
    )
  );


  const subBridgings = props.entireSpecInverters.map(inverter =>
    inverter.bridging.map(bridging =>
      bridging.subPolyline.map(subPolyline =>
        <FloatPolyline key={subPolyline.entityId} {...subPolyline}/>
      )
    )
  );


  let inverterCenterPoint = null;
  if (
    props.uiState === 'READY_DRAG_INVERTER' || props.uiState === 'DRAG_INVERTER'
  ) {
    const center =
      props.entireSpecInverters[props.editingInverterIndex].polygonCenter;
    inverterCenterPoint = <CustomPoint key={center.entityId} {...center}/>
  }

  let bridgingPoints = null;
  if (props.uiState === 'EDIT_BRIDGING' || props.uiState === 'DRAG_BRIDGING') {
    bridgingPoints =
      props.entireSpecInverters[props.editingInverterIndex].bridging
      .flatMap(bridging => {
        const anchorIndex = bridging.anchorPanelMap.map(obj => obj.anchorIndex);
        return bridging.mainPolyline.points
          .filter((point, i) => !anchorIndex.includes(i))
          .slice(1,)
          .map(point => <CustomPoint key={point.entityId} {...point}/>)
      });
  }

  return (
    <div>
      {allInverterPolygons}
      {mainBridgings}
      {subBridgings}
      {inverterCenterPoint}
      {bridgingPoints}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    uiState:
      state.undoable.present.uiStateManager.uiState,
    entireSpecInverters:
      state.undoable.present.editingWiringManager.entireSpecInverters,
    editingRoofIndex:
      state.undoable.present.editingWiringManager.editingRoofIndex,
    editingInverterIndex:
      state.undoable.present.editingWiringManager.editingInverterIndex,
    editingWiringIndex:
      state.undoable.present.editingWiringManager.editingInverterIndex,
    editingStartPoint:
      state.undoable.present.editingWiringManager.editingStartPoint,
    editingEndPoint:
      state.undoable.present.editingWiringManager.editingEndPoint
  };
};

export default connect(mapStateToProps)(EditingBridgingRender);
