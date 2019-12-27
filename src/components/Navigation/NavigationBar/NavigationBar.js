import { Menu } from 'antd';
import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Route, Switch, withRouter } from 'react-router-dom';

class NavigationBar extends Component{

  SketchDiagramHandler = () => {
    // console.log(this.props)
    // console.log(props.history.history)
    this.props.history.push('/SketchDiagram');
  }
  ModelingSwitchHandler = () => {
    // console.log(this.props)
    this.props.history.push('/Modeling');
  }

  render() {
    return (
        <Menu
          theme='dark'
          mode='horizontal'
          defaultSelectedKeys={['2']}
          style={{ lineHeight: '50px' }}
        >
          <Menu.Item key='1'>Home</Menu.Item>
          <Menu.Item key='2' onClick={this.ModelingSwitchHandler}>Modeling</Menu.Item>
          <Menu.Item key='3' onClick={this.SketchDiagramHandler}>2D Diagram</Menu.Item>
          <Menu.Item key='4'>Report</Menu.Item>
        </Menu>
      )
    }
  }


export default withRouter(NavigationBar);
