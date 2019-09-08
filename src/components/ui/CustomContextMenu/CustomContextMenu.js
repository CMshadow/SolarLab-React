import React from 'react';
import { connect } from 'react-redux';

import AddPointContextMenu from './individualContextMenu/addPointContextMenu';
import DeletePointContextMenu from './individualContextMenu/deletePointContextMenu';
import InnerLineContextMenu from './individualContextMenu/innerLineContextMenu';
import DeleteInnerPointContextMenu from './individualContextMenu/deleteInnerPointContextMenu';


const CustomContextMenu = (props) => {

    let drawingFound = null;
    if (props.hoverPolyline) {
      drawingFound = (<AddPointContextMenu />);
    } else if (props.hoverPointIndex !== null) {
      drawingFound = (<DeletePointContextMenu />);
    }

    let drawingInner = null;
    if (props.hoverInnerLineIndex !== null) {
      drawingInner = (<InnerLineContextMenu />);
    }
    else if (props.hoverInnerPointId !== null) {
      drawingInner = (<DeleteInnerPointContextMenu />);
    }

    return (
      <div>
        {props.uiState === 'EDITING_FOUND' ? drawingFound : null}
        {props.uiState === 'DRAWING_INNER' ? drawingInner : null}
      </div>
    );
}

const mapStateToProps = state => {
  return {
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,
    hoverPolyline: state.undoableReducer.present.drawingManagerReducer.hoverPolyline,
    hoverPointIndex: state.undoableReducer.present.drawingManagerReducer.hoverPointIndex,
    hoverInnerLineIndex : state.undoableReducer.present.drawingInnerManagerReducer.hoverInnerLineIndex,
    hoverInnerPointId: state.undoableReducer.present.drawingInnerManagerReducer.hoverInnerPointId
  };
};

export default connect(mapStateToProps)(CustomContextMenu);
