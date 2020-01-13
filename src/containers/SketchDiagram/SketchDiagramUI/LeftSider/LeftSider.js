import React, { Component } from 'react';
import { Menu, Icon, Layout, Checkbox, Slider, InputNumber, Row, Col, Button } from 'antd';
import { connect } from 'react-redux';

import 'antd/dist/antd.css';

import * as classes from './LeftSider.module.css';
import SketchDiagram from '../../SketchDiagram'
import * as uiStateJudge from '../../../../infrastructure/ui/uiStateJudge';

const { Sider, Content } = Layout;

class LeftSider extends Component {

  state = {
    siderCollapse: false,
  }

  onCollapse = (collapsed, type) => {
    this.setState ({
      siderCollapse: collapsed
    });
  }

  render() {

    let content = <Button
      type = 'primary'
      size = 'large'
      shape = 'round'
      block
      onClick = {() => {
        // this.props.createSingleLineDiagram();
        // this.initState();
      }}
    >Generate Single Line Diagram</Button>


    return (
      <Layout style={{ minHeight: '100vh', position:'fixed', top: '64px' }}>
        <Sider
            collapsible
/*          collapsed={this.state.collapsed}
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseOut}*/
            style={{ backgroundColor: '#fafafa' }}
        >
          <Menu
              theme="light"
              mode="inline"
              // onClick={this.handleMenuDownload}
              style={{ backgroundColor: '#fafafa' }}
          >
            <Menu.SubMenu
              key="sub1"
              title={<span><Icon type="user" /><span>Building</span></span>}
              
            >
              <Menu.Item key="3">Building 1</Menu.Item>
              <Menu.Item key="4">Building 2</Menu.Item>
              <Menu.Item key="5">Building 3</Menu.Item>
            </Menu.SubMenu>
            <Menu.Item key="report">
                <Icon type="pie-chart" />
                <span>Screenshot </span>
            </Menu.Item>

            <Menu.Item key="number">
                {/* <Icon type="box-plot" /> */}
                <span>
                    <Checkbox
                        // checked={this.state.Serial_Number}
                        // onChange={this.onSerialCheckedChange}
                    >Serial Number
                    </Checkbox>
                </span>
            </Menu.Item>
            <Menu.Item key="Size"  style={{height:"auto"}}>
                <Icon type="zoom-in" />
                <span>Zoom-In/Out </span>

                  <Row style={{ display:"block" }}>
                    <Col span={24}>
                        <Slider
                            min={0.1}
                            max={3}
                            // onChange={this.onSliderChange}
                            defaultValue = {1}
                            // value ={typeof this.state.size === 'number' ? this.state.size : 1}
                            step={0.1}
                        />
                    </Col>
                    
                </Row>
            </Menu.Item>
              
            <Menu.SubMenu
                key="sub2"
                title={<span><Icon type="team" /><span>Team</span></span>}
            >
                <Menu.Item key="6">Team 1</Menu.Item>
                <Menu.Item key="8">Team 2</Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Sider>

    </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    // uiState: state.undoableReducer.present.uiStateManagerReducer.uiState
  };
};

export default connect(mapStateToProps)(LeftSider);