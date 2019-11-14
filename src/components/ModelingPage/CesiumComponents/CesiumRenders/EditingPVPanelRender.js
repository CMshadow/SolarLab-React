import React from 'react';
import { connect } from 'react-redux';
import PVVisualize from '../Polygon/PV';

const EditingPVPanelRender = (props) => {

  let allPanels = null
  if(props.panels !== {}) {
    console.log(props.panels)
    allPanels = props.panels.map(roof =>
      roof.map(array =>
        array.map(panel => {
          return <PVVisualize
            key={panel.pv.entityId}
            {...panel.pv}
          />
        })
      )
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
