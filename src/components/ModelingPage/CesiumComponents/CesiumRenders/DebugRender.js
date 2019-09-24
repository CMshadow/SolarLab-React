import React from 'react';
import { connect } from 'react-redux';

import CustomPoint from '../point/point';
import CustomPolyline from '../polyline/polyline';

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

  return (
    <div>
      {renderPolylines}
      {renderPoints}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    debugPolylines:
      state.debugRenderReducer.debugPolylines,
    debugPoints:
      state.debugRenderReducer.debugPoints,
  };
}

export default connect(mapStateToProps)(DebugRender);
