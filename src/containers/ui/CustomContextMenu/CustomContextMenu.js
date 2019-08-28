import React, { Component } from 'react';
import { connect } from 'react-redux';

import AddPointContextMenu from './individualContextMenu/addPointContextMenu';
import DeletePointContextMenu from './individualContextMenu/deletePointContextMenu';

class CustomContextMenu extends Component {

  render () {

    let content = null;
    if (this.props.hoverPolyline) {
      content = (<AddPointContextMenu />);
    }else if (this.props.hoverPoint) {
      content = (<DeletePointContextMenu />);
    }

    return (
      <div>
        {content}
      </div>
    )
  };
}

const mapStateToProps = state => {
  return {
    hoverPolyline: state.drawingManagerReducer.hoverPolyline,
    hoverPoint: state.drawingManagerReducer.hoverPoint
  };
};

export default connect(mapStateToProps)(CustomContextMenu);
