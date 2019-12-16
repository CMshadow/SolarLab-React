import React from 'react';
import { connect } from 'react-redux';
import FloatPolyline from '../polyline/floatingPolyline';
import CustomPoint from '../point/point';

const EditingWiringRender = (props) => {

  let allWirings = null
  if(Object.keys(props.roofSpecInverters).length !== 0) {
    allWirings = Object.keys(props.roofSpecInverters).map(roofIndex =>
      props.roofSpecInverters[roofIndex].map(inverter =>
        inverter.wiring.filter(wiring => wiring.polyline !== null)
        .map(wiring =>
          <FloatPolyline
            key={wiring.polyline.entityId}
            {...wiring.polyline}
          />
        )
      )
    )
  }

  let editingWiringPoints = null;
  if (props.editingStartPoint && props.editingEndPoint) {
    editingWiringPoints = [
      <CustomPoint
        key={props.editingStartPoint.entityId}
        {...props.editingStartPoint}
      />,
      <CustomPoint
        key={props.editingEndPoint.entityId}
        {...props.editingEndPoint}
      />
    ];
  }

	return (
		<div>
      {allWirings}
      {editingWiringPoints}
    </div>
	);
};

const mapStateToProps = state => {
	return{
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


export default connect(mapStateToProps)(EditingWiringRender);
