import React from 'react';
import { connect } from 'react-redux';

import CustomPoint from '../point/point';
import CustomPolyline from '../polyline/polyline';

const DrawingKeepoutManagerRender = (props) => {
  let foundPolyline = null;
  let foundPoints = null;
  if (props.drawingKeepoutPolyline && props.drawingKeepoutPolyline.length > 1) {

    foundPolyline = (<CustomPolyline
      key={props.drawingKeepoutPolyline.entityId}
      {...props.drawingKeepoutPolyline}
    />);

    foundPoints = props.drawingKeepoutPolyline.points.slice(0,-1).map(elem => (
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
    drawingKeepoutPolyline:
      state.undoableReducer.present.drawingKeepoutManagerReducer
      .drawingKeepoutPolyline,
    auxPolyline:
      state.undoableReducer.present.drawingKeepoutManagerReducer.auxPolyline,
    startPointAuxPolyline:
      state.undoableReducer.present.drawingKeepoutManagerReducer.startPointAuxPolyline,
  };
}

export default connect(mapStateToProps)(DrawingKeepoutManagerRender);
