import React, { Component } from 'react';
import { Layout } from 'antd';

import logo from '../../assets/images/logo.png';
import NavigationBar from '../../components/Navigation/NavigationBar/NavigationBar';
import * as classes from './Layout.module.css';

const { Header } = Layout;

class CustomLayout extends Component {
  state = {
    showSideDrawer: false
  }

  render () {
    return (
      <Layout style={{height:"100vh"}}>
        <Header style={{height:'50px'}}>
          <img className={classes.logo} src={logo} alt=''/>
          <NavigationBar />
        </Header>
        {this.props.children}
      </Layout>
    )
  }
}



export default CustomLayout;
