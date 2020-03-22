import React, { Component } from 'react';
import { ContextMenu, MenuItem } from "react-contextmenu";

class AddPointContextMenu extends Component {
  render () {
    return (
      <ContextMenu
        id="cesium_context_menu"
      >
        <MenuItem
          onClick={this.props.complementFunction}
        >
          Add Point
        </MenuItem>
      </ContextMenu>
    );
  };
}

export default AddPointContextMenu;
