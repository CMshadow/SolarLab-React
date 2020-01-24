import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions/index';
import AddPointContextMenu from './individualContextMenu/addPointContextMenu';
import DeletePointContextMenu from './individualContextMenu/deletePointContextMenu';
import InnerLineContextMenu from './individualContextMenu/innerLineContextMenu';
import EditBridgingContextMenu from './individualContextMenu/editBridgingContextMenu';

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
    if (
      props.hoverKeepoutPolyline &&
      props.linkedKeepoutType !== 'VENT' &&
      props.linkedKeepoutType !== 'TREE'
    ) {
      drawingKeepout = (
        <AddPointContextMenu
          complementFunction={props.complementPointOnKeepoutPolyline}
        />
      );
    } else if (
      props.hoverKeepoutPointIndex !== null &&
      props.linkedKeepoutType !== 'VENT' &&
      props.linkedKeepoutType !== 'TREE'
    ) {
      drawingKeepout = (
        <DeletePointContextMenu
          deleteFunction={props.deletePointOnKeepoutPolyline}
        />
      );
    }

    let editBridging = null;
    if (props.editingBridgingMainPolylineIndex !== null) {
      editBridging = (
        <EditBridgingContextMenu
          addPointOnBridging={props.complementPointOnBridging}
        />
      );
    }

    return (
      <div>
        {props.uiState === 'EDITING_FOUND' ? drawingFound : null}
        {props.uiState === 'DRAWING_INNER' ? drawingInner : null}
        {props.uiState === 'EDITING_KEEPOUT' ? drawingKeepout : null}
        {props.uiState === 'EDIT_BRIDGING' ? editBridging : null}
      </div>
    );
}

const mapStateToProps = state => {
  return {
    uiState:
      state.undoable.present.uiStateManager.uiState,

    hoverPolyline:
      state.undoable.present.drawingManager.hoverPolyline,
    hoverPointIndex:
      state.undoable.present.drawingManager.hoverPointIndex,

    hoverInnerLineIndex:
      state.undoable.present.drawingInnerManager.hoverInnerLineIndex,
    hoverInnerPointId:
      state.undoable.present.drawingInnerManager.hoverInnerPointId,

    hoverKeepoutPolyline:
      state.undoable.present.drawingKeepoutManager.hoverPolyline,
    hoverKeepoutPointIndex:
      state.undoable.present.drawingKeepoutManager.hoverPointIndex,
    linkedKeepoutType:
      state.undoable.present.drawingKeepoutManager.linkedKeepoutType,

    editingBridgingMainPolylineIndex:
      state.undoable.present.editingWiringManager
      .editingBridgingMainPolylineIndex
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
    complementPointOnBridging: () => dispatch(
      actions.complementPointOnBridging()
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomContextMenu);
