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
    if (props.hoverInnerPolyline) {
      drawingInner = (<SetInnerTypeContextMenu />);
    } else if (props.hoverInnerPoint !== null) {
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
    hoverInnerPolyline : state.undoableReducer.present.drawingInnerManagerReducer.hoverPolyline,
    hoverInnerPoint: state.undoableReducer.present.drawingInnerManagerReducer.hoverPoint
  };
};

export default connect(mapStateToProps)(CustomContextMenu);
