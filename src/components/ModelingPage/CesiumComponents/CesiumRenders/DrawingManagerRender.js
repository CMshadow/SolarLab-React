import React from 'react';
import { connect } from 'react-redux';

import CustomPoint from '../point/point';
import CustomPolyline from '../polyline/polyline';

const DrawingManagerRender = (props) => {
  let polyline = null;
  let points = null;
  if (props.drawingPolyline && props.drawingPolyline.length > 1) {

    polyline = (<CustomPolyline
      key={props.drawingPolyline.entityId}
      {...props.drawingPolyline}
    />);

    points = props.drawingPolyline.points.slice(0,-1).map(elem => (
      <CustomPoint key={elem.entityId} {...elem} />
    ));
  }

  return (
    <div>
      {points}
      {polyline}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    drawingPolyline: state.undoableReducer.present.drawingManagerReducer.drawingPolyline
  };
}

export default connect(mapStateToProps)(DrawingManagerRender);
