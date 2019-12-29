import { Menu } from 'antd';
import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import * as actions from '../../../store/actions/index';

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

  ReportSwitchHandler = () => {
    // console.log(this.props)
    this.props.request();
    this.props.history.push('/Report');
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
        <Menu.Item style = {{background:"#202020"}} key='4' onClick={this.ReportSwitchHandler}>Report</Menu.Item>
      </Menu>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
      request: () => {
          dispatch(actions.request_metadata());
          dispatch(actions.request_loss());
          dispatch(actions.request_electricity_bill());
          dispatch(actions.request_pv_production());
          dispatch(actions.request_cash_flow());
          dispatch(actions.request_board_working_condition_left());
          dispatch(actions.request_board_working_condition_center());
          dispatch(actions.request_board_working_condition_right());
          dispatch(actions.request_energy());
          dispatch(actions.request_weather());
      }
      
 };
};

export default connect(null, mapDispatchToProps)(withRouter(NavigationBar));
