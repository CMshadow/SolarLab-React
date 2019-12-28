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
          style={{ lineHeight: '64px', background:"#202020" }}
        >
          <Menu.Item style = {{background:"#202020"}} key='1'>Home</Menu.Item>
          <Menu.Item style = {{background:"#202020"}} key='2' onClick={this.ModelingSwitchHandler}>Modeling</Menu.Item>
          <Menu.Item style = {{background:"#202020"}} key='3' onClick={this.SketchDiagramHandler}>2D Diagram</Menu.Item>
          <Menu.Item style = {{background:"#202020"}} key='4'>Report</Menu.Item>
        </Menu>
      )
    }
  }


export default withRouter(NavigationBar);
