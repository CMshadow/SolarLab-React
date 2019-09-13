import React from 'react';
import { connect } from 'react-redux';

import * as uiStateJudge from '../../../../infrastructure/ui/uiStateJudge';
import DrawingManagerRender from './DrawingManagerRender';
import Drawing3DFoundManagerRender from './Drawing3DFoundManagerRender/Drawing3DFoundMangerRender';
import DrawingInnerManagerRender from './DrawingInnerManagerRender';

const CesiumRender = (props) => {
  return (
    <div>
      {
        uiStateJudge.isWorkingFound(props.uiState) ?
        <DrawingManagerRender /> :
        null
      }
      {
        uiStateJudge.isWorkingInner(props.uiState) ?
        <DrawingInnerManagerRender /> :
        null
      }
      <Drawing3DFoundManagerRender />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,
  };
};

export default connect(mapStateToProps)(CesiumRender);
