import React from 'react';
import { connect } from 'react-redux';

import CustomPoint from '../point/point';
import CustomPolyline from '../polyline/polyline';

const DrawingManagerRender = (props) => {
  let foundPolyline = null;
  let foundPoints = null;
  if (props.drawingPolyline && props.drawingPolyline.length > 1) {

    foundPolyline = (<CustomPolyline
      key={props.drawingPolyline.entityId}
      {...props.drawingPolyline}
    />);

    foundPoints = props.drawingPolyline.points.slice(0,-1).map(elem => (
      <CustomPoint key={elem.entityId} {...elem} />
    ));
  }

  let auxPolyline = null;
  if (props.auxPolyline) {
    auxPolyline = (<CustomPolyline
      key={props.auxPolyline.entityId}
      {...props.auxPolyline}
    />);
  }

  let startPointAuxPolyline = null;
  if (props.startPointAuxPolyline) {
    startPointAuxPolyline = (<CustomPolyline
      key={props.startPointAuxPolyline.entityId}
      {...props.startPointAuxPolyline}
    />);
  }

  return (
    <div>
      {foundPoints}
      {foundPolyline}
      {auxPolyline}
      {startPointAuxPolyline}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    drawingPolyline:
      state.undoableReducer.present.drawingManagerReducer.drawingPolyline,
    auxPolyline:
      state.undoableReducer.present.drawingManagerReducer.auxPolyline,
    startPointAuxPolyline:
      state.undoableReducer.present.drawingManagerReducer.startPointAuxPolyline,
  };
}

export default connect(mapStateToProps)(DrawingManagerRender);
