import React from 'react';
import { connect } from 'react-redux';
import FloatPolyline from '../polyline/floatingPolyline';

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

	return (
		<div>
      {allWirings}
    </div>
	);
};

const mapStateToProps = state => {
	return{
    roofSpecInverters: state.undoableReducer.present.editingWiringManager
      .roofSpecInverters
	};
};


export default connect(mapStateToProps)(EditingWiringRender);
