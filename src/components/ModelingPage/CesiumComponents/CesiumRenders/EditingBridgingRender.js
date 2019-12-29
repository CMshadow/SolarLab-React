import React from 'react';
import { connect } from 'react-redux';
import FloatPolyline from '../polyline/floatingPolyline';
import PolygonVisualize from '../Polygon/Polygon';
import CustomPoint from '../point/point';

const EditingBridgingRender = (props) => {

  let allInverterPolygons = null;
  if(Object.keys(props.roofSpecInverters).length !== 0) {
    if (
      props.uiState !== 'READY_DRAG_INVERTER' &&
      props.uiState !== 'DRAG_INVERTER'
    ) {
      allInverterPolygons = Object.keys(props.roofSpecInverters).map(roofIndex =>
        props.roofSpecInverters[roofIndex].filter(inverter => inverter.polygon)
        .map(inverter =>
          <PolygonVisualize
            key = {inverter.polygon.entityId}
    				{...inverter.polygon}
    			/>
        )
      )
    } else {
      allInverterPolygons = Object.keys(props.roofSpecInverters).map(roofIndex =>
        props.roofSpecInverters[roofIndex].filter((inverter, i) =>
          inverter.polygon && roofIndex !== props.editingRoofIndex &&
          i !== props.editingInverterIndex
        )
        .map(inverter =>
          <PolygonVisualize
            key = {inverter.polygon.entityId}
    				{...inverter.polygon}
    			/>
        )
      )
    }
  }

  let mainBridgings = null;
  if(Object.keys(props.roofSpecInverters).length !== 0) {
    mainBridgings = Object.keys(props.roofSpecInverters).map(roofIndex =>
      props.roofSpecInverters[roofIndex].map(inverter =>
        inverter.bridging.map(bridging =>
          <FloatPolyline
            key={bridging.mainPolyline.entityId}
            {...bridging.mainPolyline}
          />
        )
      )
    )
  }

  let subBridgings = null;
  if(Object.keys(props.roofSpecInverters).length !== 0) {
    subBridgings = Object.keys(props.roofSpecInverters).map(roofIndex =>
      props.roofSpecInverters[roofIndex].map(inverter =>
        inverter.bridging.map(bridging =>
          bridging.subPolyline.map(subPolyline =>
            <FloatPolyline
              key={subPolyline.entityId}
              {...subPolyline}
            />
          )
        )
      )
    )
  }

  let inverterCenterPoint = null;
  if (
    props.uiState === 'READY_DRAG_INVERTER' ||
    props.uiState === 'DRAG_INVERTER'
  ) {
    const center =
      props.roofSpecInverters[props.editingRoofIndex][props.editingInverterIndex]
      .polygonCenter;
    inverterCenterPoint = <CustomPoint
      key={center.entityId}
      {...center}
    />
  }

	return (
		<div>
      {allInverterPolygons}
      {mainBridgings}
      {subBridgings}
      {inverterCenterPoint}
    </div>
	);
};

const mapStateToProps = state => {
	return{
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,
    roofSpecInverters: state.undoableReducer.present.editingWiringManager
      .roofSpecInverters,
    editingRoofIndex: state.undoableReducer.present.editingWiringManager
      .editingRoofIndex,
    editingInverterIndex: state.undoableReducer.present.editingWiringManager
      .editingInverterIndex,
    editingWiringIndex: state.undoableReducer.present.editingWiringManager
      .editingInverterIndex,
    editingStartPoint: state.undoableReducer.present.editingWiringManager
      .editingStartPoint,
    editingEndPoint: state.undoableReducer.present.editingWiringManager
      .editingEndPoint,
	};
};


export default connect(mapStateToProps)(EditingBridgingRender);
