import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/pro-light-svg-icons'
import {
  Divider,
} from 'antd';

import * as uiStateJudge from '../../../../infrastructure/ui/uiStateJudge';
import DrawFoundButton from './drawButtons/drawFoundButton';
import DrawInnerButton from './drawButtons/drawInnerButton';
import DrawBuilding3DPolygon from './drawButtons/Draw3DBuildingButton';
const DrawBuildingPanel = (props) => {

  const step1 = (
    <div>
      <Divider>Step 1</Divider>
        <DrawFoundButton />
    </div>
  )

  const step2 = (
    <div>
      <Divider>Step 2</Divider>
        <DrawInnerButton />
    </div>
  )

  let PolygonTest = null;
  if (uiStateJudge.isFoundDrew(props.uiState)) {
    PolygonTest = (
      <div>
        <Divider>Final Step</Divider>
          <DrawBuilding3DPolygon />
      </div>
    );
  }

  return (
    <div>
      {step1}
      {uiStateJudge.isFoundDrew(props.uiState) ? step2 : null}
      {PolygonTest}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState
  };
};

export default connect(mapStateToProps)(DrawBuildingPanel);
