import React from 'react';
import { connect } from 'react-redux';

import AddPointContextMenu from './individualContextMenu/addPointContextMenu';
import DeletePointContextMenu from './individualContextMenu/deletePointContextMenu';

const CustomContextMenu = (props) => {

    let content = null;
    if (props.hoverPolyline) {
      content = (<AddPointContextMenu />);
    }else if (props.hoverPoint !== null) {
      content = (<DeletePointContextMenu />);
    }

    return (
      <div>
        {props.uiState === 'EDITING_FOUND' ? content : null}
      </div>
    );
}

const mapStateToProps = state => {
  return {
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,
    hoverPolyline: state.undoableReducer.present.drawingManagerReducer.hoverPolyline,
    hoverPoint: state.undoableReducer.present.drawingManagerReducer.hoverPoint
  };
};

export default connect(mapStateToProps)(CustomContextMenu);
