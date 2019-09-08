import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ContextMenu, MenuItem } from "react-contextmenu";

import * as actions from '../../../../store/actions/index';

class DeleteInnerPointContextMenu extends Component {
  render () {
    return (
      <ContextMenu
        id="cesium_context_menu"
        hideOnLeave={true}
      >
        <MenuItem
          onClick={this.props.deleteInnerPointOnPolyline}
        >
          Delete Point
        </MenuItem>
      </ContextMenu>
    );
  };
}


const mapDispatchToProps = dispatch => {
  return {
    deleteInnerPointOnPolyline: () => dispatch(
      actions.deleteInnerPointOnPolyline()
    ),
  };
};

export default connect(null, mapDispatchToProps)(DeleteInnerPointContextMenu);
