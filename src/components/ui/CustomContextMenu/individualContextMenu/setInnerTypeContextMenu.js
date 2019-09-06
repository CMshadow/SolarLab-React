import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ContextMenu, MenuItem } from "react-contextmenu";

import * as actions from '../../../../store/actions/index';

class SetInnerTypeContextMenu extends Component {
  render () {
    return (
      <ContextMenu
        id="cesium_context_menu"
        hideOnLeave={true}
      >
        <MenuItem
          onClick={this.props.setInnerTypeHip}
        >
          HIP
        </MenuItem>
        <MenuItem
          onClick={this.props.setInnerTypeRidge}
        >
          RIDGE
        </MenuItem>
      </ContextMenu>
    );
  };
}


const mapDispatchToProps = dispatch => {
  return {
    setInnerTypeHip: () => dispatch(actions.setInnerTypeHip()),
    setInnerTypeRidge: () => dispatch(actions.setInnerTypeRidge()),
  };
};

export default connect(null, mapDispatchToProps)(SetInnerTypeContextMenu);
