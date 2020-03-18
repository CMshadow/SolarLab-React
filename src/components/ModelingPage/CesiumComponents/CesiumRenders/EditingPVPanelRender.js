import React from 'react';
import { connect } from 'react-redux';
import PVVisualize from '../Polygon/PV';

const EditingPVPanelRender = (props) => {

  let allPanels = null
  if(Object.keys(props.panels).length !== 0) {
    allPanels = Object.keys(props.panels).map(roofIndex =>
      Object.keys(props.panels[roofIndex]).map(panelId =>
        <PVVisualize
          key={props.panels[roofIndex][panelId].pv.entityId}
          {...props.panels[roofIndex][panelId].pv}
        />
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
    panels:
      state.undoable.present.editingPVPanelManager.panels
	};
};


export default connect(mapStateToProps)(EditingPVPanelRender);
