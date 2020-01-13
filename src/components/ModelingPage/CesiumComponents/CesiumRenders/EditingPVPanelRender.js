import React from 'react';
import { connect } from 'react-redux';
import PVVisualize from '../Polygon/PV';

const EditingPVPanelRender = (props) => {

  let allPanels = null
  if(Object.keys(props.panels).length !== 0) {
    allPanels = Object.keys(props.panels).map(roofIndex =>
      props.panels[roofIndex].map(partial =>
        partial.map(array =>
          array.map(panel => {
            return <PVVisualize
              key={panel.pv.entityId}
              {...panel.pv}
            />
          })
        )
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
