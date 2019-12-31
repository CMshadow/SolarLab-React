import { Menu } from 'antd';
import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Route, Switch, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

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
          defaultSelectedKeys={['1']}
          style={{ lineHeight: '64px', background:"#202020" }}
        >
          <Menu.Item style = {{background:"#202020"}} key='1'>
            <FormattedMessage id='home' />
          </Menu.Item>
          <Menu.Item style = {{background:"#202020"}} key='2' onClick={this.ModelingSwitchHandler}>
            <FormattedMessage id='modeling' />
          </Menu.Item>
          <Menu.Item style = {{background:"#202020"}} key='3' onClick={this.SketchDiagramHandler}>
            <FormattedMessage id='twoD_diagram' />
          </Menu.Item>
          <Menu.Item style = {{background:"#202020"}} key='4'>
            <FormattedMessage id='report' />
          </Menu.Item>
        </Menu>
      )
    }
  }


export default withRouter(NavigationBar);
