import React from 'react';
import { connect } from 'react-redux';

import AddPointContextMenu from './individualContextMenu/addPointContextMenu';
import DeletePointContextMenu from './individualContextMenu/deletePointContextMenu';
import SetInnerTypeContextMenu from './individualContextMenu/setInnerTypeContextMenu';
import DeleteInnerPointContextMenu from './individualContextMenu/deleteInnerPointContextMenu';


const CustomContextMenu = (props) => {

    let drawingFound = null;
    if (props.hoverPolyline) {
      drawingFound = (<AddPointContextMenu />);
    } else if (props.hoverPoint !== null) {
      drawingFound = (<DeletePointContextMenu />);
    }

    let drawingInner = null;
    if (props.hoverInnerLineIndex !== null) {
      drawingInner = (<SetInnerTypeContextMenu />);
    } else if (props.hoverInnerPointIndex !== null) {
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
    hoverPoint: state.undoableReducer.present.drawingManagerReducer.hoverPoint,
    hoverInnerLineIndex : state.undoableReducer.present.drawingInnerManagerReducer.hoverInnerLineIndex,
    hoverInnerPointIndex: state.undoableReducer.present.drawingInnerManagerReducer.hoverInnerPointIndex
  };
};

export default connect(mapStateToProps)(CustomContextMenu);
