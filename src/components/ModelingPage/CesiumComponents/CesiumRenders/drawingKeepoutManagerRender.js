import React from 'react';
import { connect } from 'react-redux';

import CustomPoint from '../point/point';
import CustomPolyline from '../polyline/polyline';

const DrawingKeepoutManagerRender = (props) => {
  let drawingFoundPolyline = null;
  let drawingFoundPoints = null;
  if (props.drawingKeepoutPolyline && props.drawingKeepoutPolyline.length > 1) {

    drawingFoundPolyline = (<CustomPolyline
      key={props.drawingKeepoutPolyline.entityId}
      {...props.drawingKeepoutPolyline}
    />);

    drawingFoundPoints = props.drawingKeepoutPolyline.points.slice(0,-1).map(elem => (
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

  const fixedKeepoutPolylines = props.keepoutList.map(keepout => {
    if (keepout.finishedDrawing && !keepout.isEditing) {
      return <CustomPolyline
        key={keepout.id}
        {...keepout.outlinePolyline}
      />
    }
    return null;
  });

  return (
    <div>
      {drawingFoundPoints}
      {drawingFoundPolyline}
      {auxPolyline}
      {startPointAuxPolyline}
      {fixedKeepoutPolylines}
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
    keepoutList:
      state.undoableReducer.present.drawingKeepoutManagerReducer.keepoutList
  };
}

export default connect(mapStateToProps)(DrawingKeepoutManagerRender);
