import React from 'react';
import { connect } from 'react-redux';

import CustomPoint from '../point/point';
import CustomPolyline from '../polyline/polyline';

const DrawingInnerManagerRender = (props) => {

  const foundPolyline = (<CustomPolyline
    key={props.drawingPolyline.entityId}
    {...props.drawingPolyline}
  />);

  let drawingInnerPolyline = null;
  if (props.drawingInnerPolyline && props.drawingInnerPolyline.length > 1) {
    drawingInnerPolyline = (<CustomPolyline
      key={props.drawingInnerPolyline.entityId}
      {...props.drawingInnerPolyline}
    />)
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
      {foundPolyline}
      {drawingInnerPolyline}
      {auxPolyline}
      {fixedInnerPolylines}
      {fixedInnerPolylinePoints}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    drawingPolyline:
      state.undoable.present.drawingManager.drawingPolyline,
    drawingInnerPolyline:
      state.undoable.present.drawingInnerManager.drawingInnerPolyline,
    auxPolyline:
      state.undoable.present.drawingInnerManager.auxPolyline,
    fixedInnerPolylines:
      state.undoable.present.drawingInnerManager.fixedInnerPolylines,
    pointsRelation:
      state.undoable.present.drawingInnerManager.pointsRelation,
  };
}

export default connect(mapStateToProps)(DrawingInnerManagerRender);
