import React, { Component } from 'react';
import { Layout } from 'antd';

import logo from '../../assets/images/logo.png';
import { withRouter } from 'react-router-dom';
import NavigationBar from '../../components/Navigation/NavigationBar/NavigationBar';
import './Layout.css';


const { Header } = Layout;

class CustomLayout extends Component {

  render () {
    return (
      <Layout style={{height:"100vh"}}>

        <Header className='header'>
          <img className='logo' src={logo} alt=''/>
          <NavigationBar />
        </Header>
        {this.props.children}
      </Layout>
    )
  }
}


export default withRouter(CustomLayout);
