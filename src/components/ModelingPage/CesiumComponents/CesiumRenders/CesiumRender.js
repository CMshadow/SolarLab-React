import React from 'react';
import { connect } from 'react-redux';

import * as uiStateJudge from '../../../../infrastructure/ui/uiStateJudge';
import DrawingManagerRender from './DrawingManagerRender';
import Drawing3DFoundManagerRender from './Drawing3DFoundMangerRender';
import DrawingInnerManagerRender from './DrawingInnerManagerRender';
import DrawingKeepoutManagerRender from './DrawingKeepoutManagerRender';
import DrawingKeepoutPolygonManagerRender from './DrawingKeepoutPolygonManagerRender';
import EditingPVPanelRender from './EditingPVPanelRender';
import DebugRender from './DebugRender';

const CesiumRender = (props) => {
  return (
    <div>
      {
        uiStateJudge.useFoundManagerRender(props.uiState) ?
        <DrawingManagerRender /> :
        null
      }
      {
        uiStateJudge.useInnerManagerRender(props.uiState) ?
        <DrawingInnerManagerRender /> :
        null
      }
      <Drawing3DFoundManagerRender />
      <DrawingKeepoutPolygonManagerRender />
      <DrawingKeepoutManagerRender />
      <EditingPVPanelRender />
      <DebugRender />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,
  };
};

export default connect(mapStateToProps)(CesiumRender);
