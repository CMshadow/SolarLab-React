import React, { Component } from 'react';
import { Layout, Button } from 'antd';
import { connect } from 'react-redux';

import 'antd/dist/antd.css';

import * as classes from './LeftSider.module.css';
import UndoRedo from '../../../components/ui/UndoRedo/UndoRedo';
import HomePanel from './individualPanels/homePanel';
import ManageBuildingPanel from './individualPanels/manageBuildingPanel';
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

  toggle = () => {
    this.setState({
      siderCollapse: !this.state.siderCollapse,
    });
  };

  render() {

    let content = null;
    if (this.state.siderCollapse === false) {
      if (uiStateJudge.isIdleStates(this.props.uiState)) {
        content = (<HomePanel/>);
      }
      else if (uiStateJudge.showManageBuildingPanel(this.props.uiState)) {
        content = (<ManageBuildingPanel />)
      }
      else if (uiStateJudge.showCreateBuildingPanel(this.props.uiState)) {
        content = (<CreateBuildingPanel/>);
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

    return (
      <Layout className={classes.outerLayout}>
        <Sider
          className={classes.leftSider}
          width={350}
          collapsedWidth={50}
          collapsible
          trigger={null}
          collapsed={this.state.siderCollapse}
        >
          <Layout className = {classes.upperPart}>
            {content}
          </Layout>
          <Layout className = {classes.lowerPart}>
            {this.state.siderCollapse ? null : <UndoRedo />}
          </Layout>
        </Sider>
        <Button
          className={classes.collapseButton}
          icon={this.state.siderCollapse ? 'right' : 'left'}
          shape='circle'
          size='small'
          onClick={() => {
            this.toggle();
          }}
        />
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    uiState: state.undoable.present.uiStateManager.uiState
  };
};

export default connect(mapStateToProps)(LeftSider);
