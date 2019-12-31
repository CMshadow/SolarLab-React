import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { Route, Switch, withRouter } from 'react-router-dom';
import NavigationBar from '../../components/Navigation/NavigationBar/NavigationBar';

const { Header } = Layout;

class CustomLayout extends Component {
  state = {
    showSideDrawer: false
  }

  render () {
    return (
      <Layout style={{height:"100vh"}}>
        <Header style={{height:'50px', width: '100%' ,position: 'fixed', top: 0, left: 0, zIndex: 1}}>
          <NavigationBar/>
        </Header>
        {this.props.children}
      </Layout>
    )
  }
}



export default withRouter(CustomLayout);
