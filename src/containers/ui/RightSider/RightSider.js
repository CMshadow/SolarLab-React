import React, { Component } from 'react';
import { Layout } from 'antd';

import 'antd/dist/antd.css';

import * as classes from './RightSider.module.css';
import * as actions from '../../../store/actions/index';
import LockMap from './individualButtons/lockMap';
import SelectMap from './individualButtons/selectMap';
import Auxiliary from '../../../hoc/Auxiliary/Auxiliary';

const { Sider } = Layout;

class RightSider extends Component {

  render() {

    return (
      <Auxiliary>
        <Sider
          className={classes.rightSider}
          width={50}
        >
          <SelectMap style={{top: '5px'}}/>
          <LockMap />
        </Sider>
      </Auxiliary>
    );
  }
}

export default RightSider;
