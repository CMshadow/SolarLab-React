import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ContextMenu, MenuItem } from "react-contextmenu";

import * as actions from '../../../../store/actions/index';

class DeletePointContextMenu extends Component {
  render () {
    return (
      <ContextMenu
        id="cesium_context_menu"
        hideOnLeave={true}
      >
        <MenuItem
          onClick={this.props.deletePointOnPolyline}
        >
          Delete Point
        </MenuItem>
      </ContextMenu>
    );
  };
}

const mapStateToProps = state => {
  return {
    mouseCartesian3: state.drawingManagerReducer.mouseCartesian3
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deletePointOnPolyline: () => dispatch(
      actions.deletePointOnPolyline()
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeletePointContextMenu);
