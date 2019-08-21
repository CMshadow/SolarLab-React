import React from 'react';
import { Layout, Button } from 'antd';
import { connect } from 'react-redux';

import 'antd/dist/antd.css';

import * as classes from './LeftSider.module.css';
import * as actions from '../../../store/actions/index';
import CreateBuildingPanel from '../../../containers/ui/LeftSider/createBuildingPanel';
import DrawBuildingPanel from '../../../containers/ui/LeftSider/drawBuildingPanel';
import Auxiliary from '../../../hoc/Auxiliary/Auxiliary';

const { Sider } = Layout;

const LeftSider = (props) => {
  let content;
  if (props.uiState === 'IDLE') {
    content = (<CreateBuildingPanel />);
  }
  else if (props.uiState === 'READY_DRAWING') {
    content = (<DrawBuildingPanel />)
  }

  return (
    <Auxiliary>
      <Sider className={classes.leftSider} width={300}>
        {content}
      </Sider>
    </Auxiliary>
  )
}

const mapStateToProps = state => {
  return {
    uiStartDrawing: state.uiStateManagerReducer.uiStartDrawing,
    uiState: state.uiStateManagerReducer.uiState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setStartDrawing: () => dispatch(actions.startDrawing())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftSider);
