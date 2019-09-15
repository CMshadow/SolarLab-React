import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions/index';
import AddPointContextMenu from './individualContextMenu/addPointContextMenu';
import DeletePointContextMenu from './individualContextMenu/deletePointContextMenu';
import InnerLineContextMenu from './individualContextMenu/innerLineContextMenu';

const CustomContextMenu = (props) => {

    let drawingFound = null;
    if (props.hoverPolyline) {
      drawingFound = (
        <AddPointContextMenu
          complementFunction={props.complementPointOnFoundPolyline}
        />
      );
    } else if (props.hoverPointIndex !== null) {
      drawingFound = (
        <DeletePointContextMenu
          deleteFunction={props.deletePointOnFoundPolyline}
        />
      );
    }

    let drawingInner = null;
    if (props.hoverInnerLineIndex !== null) {
      drawingInner = (<InnerLineContextMenu />);
    }

    let drawingKeepout = null;
    if (props.hoverKeepoutPolyline) {
      drawingKeepout = (
        <AddPointContextMenu
          complementFunction={props.complementPointOnKeepoutPolyline}
        />
      );
    } else if (props.hoverKeepoutPointIndex !== null) {
      drawingKeepout = (
        <DeletePointContextMenu
          deleteFunction={props.deletePointOnKeepoutPolyline}
        />
      );
    }

    return (
      <div>
        {props.uiState === 'EDITING_FOUND' ? drawingFound : null}
        {props.uiState === 'DRAWING_INNER' ? drawingInner : null}
        {props.uiState === 'EDITING_KEEPOUT' ? drawingKeepout : null}
      </div>
    );
}

const mapStateToProps = state => {
  return {
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,

    hoverPolyline:
      state.undoableReducer.present.drawingManagerReducer.hoverPolyline,
    hoverPointIndex:
      state.undoableReducer.present.drawingManagerReducer.hoverPointIndex,

    hoverInnerLineIndex:
      state.undoableReducer.present.drawingInnerManagerReducer
      .hoverInnerLineIndex,
    hoverInnerPointId:
      state.undoableReducer.present.drawingInnerManagerReducer
      .hoverInnerPointId,

    hoverKeepoutPolyline:
      state.undoableReducer.present.drawingKeepoutManagerReducer
      .hoverPolyline,
    hoverKeepoutPointIndex:
      state.undoableReducer.present.drawingKeepoutManagerReducer.hoverPointIndex,

  };
};

const mapDispatchToProps = dispatch => {
  return {
    complementPointOnFoundPolyline: () => dispatch(
      actions.complementPointOnPolyline()
    ),
    deletePointOnFoundPolyline: () => dispatch(
      actions.deletePointOnPolyline()
    ),
    complementPointOnKeepoutPolyline: () => dispatch(
      actions.complementPointOnKeepoutPolyline()
    ),
    deletePointOnKeepoutPolyline: () => dispatch(
      actions.deletePointOnKeepoutPolyline()
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomContextMenu);
