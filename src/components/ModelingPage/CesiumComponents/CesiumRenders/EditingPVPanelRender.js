import React from 'react';
import { connect } from 'react-redux';
import PVVisualize from '../Polygon/PV';

const EditingPVPanelRender = (props) => {

  let allPanels = null
  if(props.panels !== []) {
    console.log(props.panels)
    allPanels = props.panels.map(array =>
      array.map(elem => (
        <PVVisualize
          key={elem.pv.entityId}
          {...elem.pv}
        />
      ))
    );
  }

	return (
		<div>
      {allPanels}
    </div>
	);
};

const mapStateToProps = state => {
	return{
    panels: state.undoableReducer.present.editingPVPanelManagerReducer
      .panels
	};
};


export default connect(mapStateToProps)(EditingPVPanelRender);
