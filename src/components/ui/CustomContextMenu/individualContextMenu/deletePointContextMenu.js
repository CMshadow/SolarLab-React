import React, { Component } from 'react';
import { ContextMenu, MenuItem } from "react-contextmenu";

class DeletePointContextMenu extends Component {
  render () {
    return (
      <ContextMenu
        id="cesium_context_menu"
        hideOnLeave={false}
      >
        <MenuItem
          onClick={this.props.deleteFunction}
        >
          Delete Point
        </MenuItem>
      </ContextMenu>
    );
  };
}

export default DeletePointContextMenu;
