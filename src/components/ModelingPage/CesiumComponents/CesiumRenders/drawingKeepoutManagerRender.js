import React from 'react';
import { connect } from 'react-redux';

import FoundLine from '../../../../infrastructure/line/foundLine';
import Sector from '../../../../infrastructure/line/sector';
import CustomPoint from '../point/point';
import CustomPolyline from '../polyline/polyline';

const DrawingKeepoutManagerRender = (props) => {
  let drawingKeepoutPolyline = null;
  let drawingKeepoutPoints = null;
  if (props.drawingKeepoutPolyline && props.drawingKeepoutPolyline.length > 1) {

    drawingKeepoutPolyline = (<CustomPolyline
      key={props.drawingKeepoutPolyline.entityId}
      {...props.drawingKeepoutPolyline}
    />);

    if (props.drawingKeepoutPolyline instanceof FoundLine) {
      drawingKeepoutPoints =
        props.drawingKeepoutPolyline.points.slice(0, -1).map(elem => (
        <CustomPoint key={elem.entityId} {...elem} />
      ));
    } else if (props.drawingKeepoutPolyline instanceof Sector) {
      let showPoints = [];
      if (props.drawingKeepoutPolyline.points.length > 4) {
        showPoints = [
          props.drawingKeepoutPolyline.points[0],
          props.drawingKeepoutPolyline.points[1],
          props.drawingKeepoutPolyline.points[
            Math.trunc(props.drawingKeepoutPolyline.points.length/2)
          ],
          props.drawingKeepoutPolyline.points[
            props.drawingKeepoutPolyline.points.length-2
          ],
        ]
      } else {
        showPoints = [
          props.drawingKeepoutPolyline.points[1]
        ]
      }
      drawingKeepoutPoints =
        showPoints.map(elem => (
        <CustomPoint key={elem.entityId} {...elem} />
      ));
    }else {
      drawingKeepoutPoints =
        props.drawingKeepoutPolyline.points.map(elem => (
        <CustomPoint key={elem.entityId} {...elem} />
      ));
    }

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
      console.log(keepout.outlinePolyline)
      return <CustomPolyline
        key={keepout.id}
        {...keepout.outlinePolyline}
      />
    }
    return null;
  });

  return (
    <div>
      {drawingKeepoutPoints}
      {drawingKeepoutPolyline}
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
    drawingKeepoutObject:
      state.undoableReducer.present.drawingKeepoutManagerReducer
      .keepoutList[state.undoableReducer.present.drawingKeepoutManagerReducer
      .linkedKeepoutIndex],
    auxPolyline:
      state.undoableReducer.present.drawingKeepoutManagerReducer.auxPolyline,
    startPointAuxPolyline:
      state.undoableReducer.present.drawingKeepoutManagerReducer.startPointAuxPolyline,
    keepoutList:
      state.undoableReducer.present.drawingKeepoutManagerReducer.keepoutList
  };
}

export default connect(mapStateToProps)(DrawingKeepoutManagerRender);
