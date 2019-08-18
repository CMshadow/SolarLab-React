import React from 'react';
import { Layout, Button } from 'antd';
import { connect } from 'react-redux';

import 'antd/dist/antd.css';

import * as classes from './LeftSider.module.css';
import * as actions from '../../../store/actions/index';

const { Sider } = Layout;

const LeftSider = (props) => {
  return (
    <Sider className={classes.leftSider} width={400}>
      <div>
        <Button
          type="primary"
          size="large"
          block
          loading={props.uiStartDrawing}
          onClick={props.setStartDrawing}
        >
          {props.uiStartDrawing ? '正在画线' : '点击开始画个线'}
        </Button>
      </div>
    </Sider>
  )
}

const mapStateToProps = state => {
  return {
    uiStartDrawing: state.uiDrawBuildingReducer.uiStartDrawing
  };
};

const mapDispatchToProps = dispatch => {
  return {
        setStartDrawing: () => dispatch(actions.startDrawing())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftSider);
