import React, { Component } from 'react';
import { Layout, Button, Icon } from 'antd';
import { connect } from 'react-redux';

import 'antd/dist/antd.css';

import * as classes from './LeftSider.module.css';
import UndoRedo from '../../../components/ui/UndoRedo/UndoRedo';
import CreateBuildingPanel from './individualPanels/createBuildingPanel';
import DrawBuildingPanel from './individualPanels/drawBuildingPanel';
import Editing3DPanel from './individualPanels/editing3DPanel';
import SetUpPVPanel from './individualPanels/setUpPVPanel';
import SetUpWiringPanel from './individualPanels/setUpWiringPanel';
import SetUpBridgingPanel from './individualPanels/setUpBridgingPanel';
import * as uiStateJudge from '../../../infrastructure/ui/uiStateJudge';

const { Sider } = Layout;

class LeftSider extends Component {

  state = {
    siderCollapse: false,

  }

  onCollapse = (collapsed, type) => {
    this.setState ({
      siderCollapse: collapsed
    });
  }
  toggle = () => {
    this.setState({
      siderCollapse: !this.state.siderCollapse,
    });
  };

  render() {

    let content = null;
    if (this.state.siderCollapse === false) {
      if (uiStateJudge.isIdleStates(this.props.uiState)) {
        content = (<CreateBuildingPanel/>);
        // content = (<SetUpPVPanel/>);
      }
      else if (uiStateJudge.showDrawingPanel(this.props.uiState)) {
        content = (<DrawBuildingPanel/>);
      }
      else if (uiStateJudge.showEditing3DPanel(this.props.uiState)) {
        content = (<Editing3DPanel/>);
      }
      else if (uiStateJudge.showSetUpPVPanel(this.props.uiState)) {
        content = (<SetUpPVPanel/>)
      }
      else if (uiStateJudge.showSetUpWiringPanel(this.props.uiState)) {
        content = (<SetUpWiringPanel/>)
      }
      else if (uiStateJudge.showSetUpBridgingPanel(this.props.uiState)) {
        content = (<SetUpBridgingPanel/>)
      }
    }
    let buttomBar = "325px";
    if (this.state.siderCollapse === false) { 
      buttomBar = "325px";
    }
    else{
      buttomBar = "50px";
    }

    return (
      <Layout style={{ minHeight: '100vh', position:"fixed", top:'64px'}}>
        <Sider
          className={classes.leftSider}
          width={325}
          collapsedWidth={50}
          collapsible
          onCollapse={this.onCollapse}
          trigger={null}
          collapsed={this.state.siderCollapse}
        >
        <Layout className = {classes.upperPart}>
          {content}
        </Layout>

        </Sider>
        
        <Sider 
          style = {{height:'60px',width: buttomBar, background:'#a0a0a0', position:"absolute", bottom:'60px'}}
          width={325}
          collapsedWidth={50}
          collapsible
          onCollapse={this.onCollapse}
          trigger={null}
          collapsed={this.state.siderCollapse}>
        <Layout  
          style = {{height:'60px',width: buttomBar, background: null, position:"absolute"}}
          className = {classes.lowerPart}>
          {this.state.siderCollapse ? null : <UndoRedo />}
        </Layout>
        <Icon
              className="trigger"
              style = {{position:"absolute", right:'0px'}}
              type={this.state.siderCollapse ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
        />
        </Sider>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState
  };
};

export default connect(mapStateToProps)(LeftSider);
