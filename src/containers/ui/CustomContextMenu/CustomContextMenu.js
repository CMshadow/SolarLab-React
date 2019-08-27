import React, { Component } from 'react';
import { connect } from 'react-redux';

import EditPolylineContextMenu from './individualContextMenu/editPolylineContextMenu';

class CustomContextMenu extends Component {

  render () {

    let content = null;
    if (this.props.hoverPolyline) {
      content = (<EditPolylineContextMenu />);
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
    hoverPolyline: state.drawingManagerReducer.hoverPolyline
  };
};

export default connect(mapStateToProps)(CustomContextMenu);
