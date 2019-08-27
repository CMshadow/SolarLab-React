import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ContextMenu, MenuItem } from "react-contextmenu";

import * as actions from '../../../../store/actions/index';

class EditPolylineContextMenu extends Component {
  render () {
    return (
      <ContextMenu
        id="cesium_context_menu"
        hideOnLeave={true}
      >
        <MenuItem
          onClick={this.props.complementPointOnPolyline}
        >
          Add Point
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
    complementPointOnPolyline: () => dispatch(
      actions.complementPointOnPolyline()
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPolylineContextMenu);
