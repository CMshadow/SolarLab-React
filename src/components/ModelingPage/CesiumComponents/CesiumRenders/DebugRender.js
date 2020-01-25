import React from 'react';
import { connect } from 'react-redux';

import CustomPoint from '../point/point';
import CustomPolyline from '../polyline/polyline';
import PolygonVisualize from '../Polygon/Polygon';
import ShadowPolygon from '../Polygon/shadowPolygon';

const DebugRender = (props) => {
  let renderPolylines = null;
  if (props.debugPolylines.length !== 0) {
    renderPolylines = props.debugPolylines.map(elem =>
      (<CustomPolyline
        key={elem.entityId}
        {...elem}
      />)
    )
  }

  let renderPoints = null;
  if (props.debugPoints.length !== 0) {
    renderPoints = props.debugPoints.map(elem =>
      (<CustomPoint key={elem.entityId} {...elem} />)
    )
  }

  let renderPolygons = null;
  if (props.debugPolygons.length !== 0) {
    console.log(props.debugPolygons)
    renderPolygons = props.debugPolygons.map(elem =>
      (<PolygonVisualize key={elem.entityId} {...elem} />)
    )
  }

  let renderShadowPolygons = null;
  if (props.debugShadowPolygons.length !== 0) {
    renderShadowPolygons = props.debugShadowPolygons.map(elem =>
      (<ShadowPolygon key={elem.entityId} {...elem} />)
    )
  }

  return (
    <div>
      {renderPolylines}
      {renderPoints}
      {renderPolygons}
      {renderShadowPolygons}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    debugPolylines:
      state.undoable.present.debugRender.debugPolylines,
    debugPoints:
      state.undoable.present.debugRender.debugPoints,
    debugPolygons:
      state.undoable.present.debugRender.debugPolygons,
    debugShadowPolygons:
      state.undoable.present.debugRender.debugShadowPolygons
  };
}

export default connect(mapStateToProps)(DebugRender);
