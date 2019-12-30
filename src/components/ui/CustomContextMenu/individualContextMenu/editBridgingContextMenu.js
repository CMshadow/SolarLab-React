import React, { Component } from 'react';
import { ContextMenu, MenuItem } from "react-contextmenu";

class EditBridgingContextMenu extends Component {
  render () {
    return (
      <ContextMenu
        id="cesium_context_menu"
        hideOnLeave={true}
      >
        <MenuItem
          onClick={this.props.addPointOnBridging}
        >
          Add Point
        </MenuItem>
      </ContextMenu>
    );
  };
}

export default EditBridgingContextMenu;
