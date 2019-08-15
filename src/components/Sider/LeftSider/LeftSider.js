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
      <Button type="primary">生成点</Button>
    </Sider>
  )
}

const mapDispatchToProps = dispatch => {
  return {
        onAddPoint: () => dispatch(actions.addPoint())
    }
}

export default connect(null, mapDispatchToProps)(LeftSider);
