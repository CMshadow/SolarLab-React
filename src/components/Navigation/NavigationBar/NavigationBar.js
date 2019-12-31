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

  SingleLineDiagramSwitchHandler = () => {
    // console.log(this.props)
    this.props.history.push('/SingleLineDigram');
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
          <Menu.Item key='4' onClick={this.SingleLineDiagramSwitchHandler}>Single Line Diagram</Menu.Item>
          <Menu.Item key='5'>Report</Menu.Item>
        </Menu>
      )
    }
  }


export default withRouter(NavigationBar);
