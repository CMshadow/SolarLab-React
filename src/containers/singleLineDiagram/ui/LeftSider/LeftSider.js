import React, { Component } from 'react';
import { Layout } from 'antd';
// import { connect } from 'react-redux';

import 'antd/dist/antd.css';
import * as classes from './LeftSider.module.css';


const { Sider } = Layout;

class LeftSider extends Component {

  state = {
    siderCollapse: false,
  }

  onCollapse = (collapsed, type) => {
    this.setState ({
      siderCollapse: collapsed
    });
  }

  render() {

    let content = "test single diagram demo";


    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          className={classes.leftSider}
          width={325}
          collapsedWidth={50}
          collapsible
          onCollapse={this.onCollapse}
        >
          {content}
        </Sider>
      </Layout>
    );
  }
}


export default LeftSider;
