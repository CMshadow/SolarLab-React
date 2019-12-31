import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { Route, Switch, withRouter } from 'react-router-dom';
import SolarlabLogo from '../../logolabw.png';
import NavigationBar from '../../components/Navigation/NavigationBar/NavigationBar';
import './Layout.css';

const { Header } = Layout;

class CustomLayout extends Component {
  state = {
    showSideDrawer: false
  }

  render () {
    return (
      <Layout style={{height:"100vh"}}>
        <Header style={{height:'64px', background:'#202020', width: '100%' ,position: 'fixed', top: 0, left: 0, zIndex: 1}}>
        <div className = "logo">
          <img src = {SolarlabLogo} alt = "logo" style = {{height:'35px'}} />
        </div>
        <NavigationBar/>
        </Header>
        {this.props.children}
      </Layout>
    )
  }
}



export default withRouter(CustomLayout);
