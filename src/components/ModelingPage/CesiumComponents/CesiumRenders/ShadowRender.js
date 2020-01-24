import React from 'react';
import { connect } from 'react-redux';

import ShadowPolygon from '../Polygon/shadowPolygon';

const ShadowRender = (props) => {

  const renderShadowPolygons = Object.keys(props.shadows).map(shadowId =>
    (<ShadowPolygon key={shadowId} {...props.shadows[shadowId].polygon} />)
  )

  return (
    <div>
      {renderShadowPolygons}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    shadows:
      state.undoable.present.editingShadowManager.shadows,
  };
}

export default connect(mapStateToProps)(ShadowRender);
