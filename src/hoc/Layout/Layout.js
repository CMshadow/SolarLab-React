import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';

import NavigationBar from '../../components/Navigation/NavigationBar/NavigationBar';
import LeftSider from '../../components/Sider/LeftSider/LeftSider';

const { Header, Content } = Layout;

class CustomLayout extends Component {
  state = {
    showSideDrawer: false
  }

  render () {
    return (
      <Layout>
        <Header style={{height:'50px'}}>
          <NavigationBar />
        </Header>
        <Layout>
          <Content>
            {this.props.children}
            <LeftSider />
          </Content>
        </Layout>
      </Layout>
    )
  }
}



export default CustomLayout;
