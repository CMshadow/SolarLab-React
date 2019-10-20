import React from 'react';
import { connect } from 'react-redux';
import PVVisualize from '../Polygon/PV';

const EditingPVPanelRender = (props) => {

  let allPanels = null
  if(props.panels !== []) {
    allPanels = props.panels.map(panel => (
      <PVVisualize
        key={panel.pv.entityId}
        {...panel.pv}
      />
    ));
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
