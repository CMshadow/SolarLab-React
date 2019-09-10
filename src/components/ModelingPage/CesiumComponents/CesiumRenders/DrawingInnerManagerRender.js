import React from 'react';
import { connect } from 'react-redux';

import CustomPoint from '../point/point';
import CustomPolyline from '../polyline/polyline';

const DrawingInnerManagerRender = (props) => {

  let drawingInnerPolyline = null;
  let drawingInnerPolylinePoints = null;
  if (props.drawingInnerPolyline && props.drawingInnerPolyline.length > 1) {
    drawingInnerPolyline = (<CustomPolyline
      key={props.drawingInnerPolyline.entityId}
      {...props.drawingInnerPolyline}
    />)

    drawingInnerPolylinePoints = props.drawingInnerPolyline.points.slice(0,-1)
    .map(elem => (
      elem.render ? <CustomPoint key={elem.entityId} {...elem} /> : null
    ));
  }

  let auxPolyline = null;
  if (props.auxPolyline) {
    auxPolyline = (<CustomPolyline
      key={props.auxPolyline.entityId}
      {...props.auxPolyline}
    />);
  }

  const fixedInnerPolylines = props.fixedInnerPolylines.map(elem => {
    return (<CustomPolyline
      key={elem.entityId}
      {...elem}
    />)
  });
  const fixedInnerPolylinePoints = Object.keys(props.pointsRelation).map(
    p => (
      props.pointsRelation[p].object.render ?
      <CustomPoint key={p} {...props.pointsRelation[p].object} /> : 
      null
    )
  );

  return (
    <div>
      {drawingInnerPolyline}
      {drawingInnerPolylinePoints}
      {auxPolyline}
      {fixedInnerPolylines}
      {fixedInnerPolylinePoints}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    drawingInnerPolyline:
      state.undoableReducer.present.drawingInnerManagerReducer
      .drawingInnerPolyline,
    auxPolyline:
      state.undoableReducer.present.drawingInnerManagerReducer.auxPolyline,
    fixedInnerPolylines:
      state.undoableReducer.present.drawingInnerManagerReducer
      .fixedInnerPolylines,
    pointsRelation:
      state.undoableReducer.present.drawingInnerManagerReducer
      .pointsRelation,
  };
}

export default connect(mapStateToProps)(DrawingInnerManagerRender);
