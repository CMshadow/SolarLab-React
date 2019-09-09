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

  const fixedInnerPolylines = props.fixedInnerPolylines.map(elem => {
    return (<CustomPolyline
      key={elem.entityId}
      {...elem}
    />)
  });
  const fixedInnerPolylinePoints = props.fixedInnerPolylines.flatMap(
    elem => elem.points.map(p => {
      return (p.render ? <CustomPoint key={p.entityId} {...p} /> : null)
    })
  );

  return (
    <div>
      {drawingInnerPolyline}
      {drawingInnerPolylinePoints}
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
    fixedInnerPolylines:
      state.undoableReducer.present.drawingInnerManagerReducer
      .fixedInnerPolylines
  };
}

export default connect(mapStateToProps)(DrawingInnerManagerRender);
