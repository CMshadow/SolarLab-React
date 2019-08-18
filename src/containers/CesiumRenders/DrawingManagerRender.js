import React, { Component } from 'react';
import { connect } from 'react-redux';

import CustomPoint from '../../components/CesiumComponents/point/point';
import CustomPolyline from '../../components/CesiumComponents/polyline/polyline';

class DrawingManagerRender extends Component {

  render () {
    let polyline = null;
    let points = null;
    if (this.props.drawingPolyline && this.props.drawingPolyline.length > 1) {

      polyline = (<CustomPolyline
        key={this.props.drawingPolyline.entityId}
        {...this.props.drawingPolyline}
      />);

      points = this.props.drawingPolyline.points.slice(0,-1).map(elem => (
        <CustomPoint key={elem.entityId} {...elem} />
      ));
    }

    return (
      <div>
        {points}
        {polyline}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    drawingPolyline: state.drawingManagerReducer.drawingPolyline
  };
}

export default connect(mapStateToProps)(DrawingManagerRender);
