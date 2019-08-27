import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ContextMenu, MenuItem } from "react-contextmenu";

class CustomContextMenu extends Component {
  render () {
    return (
      <ContextMenu id="cesium_context_menu">
        <MenuItem>
          ContextMenu Item 1
        </MenuItem>
      </ContextMenu>
    )
  };
}

export default CustomContextMenu;
