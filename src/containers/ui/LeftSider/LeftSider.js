import React, { Component } from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';

import 'antd/dist/antd.css';

import * as classes from './LeftSider.module.css';
import UndoRedo from '../../../components/ui/UndoRedo/UndoRedo';
import CreateBuildingPanel from './individualPanels/createBuildingPanel';
import DrawBuildingPanel from './individualPanels/drawBuildingPanel';
import Editing3DPanel from './individualPanels/editing3DPanel';
import SetUpPVPanel from './individualPanels/setUpPVPanel';
import SetUpWiringPanel from './individualPanels/setUpWiringPanel';
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
    }

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          className={classes.leftSider}
          width={325}
          collapsedWidth={50}
          collapsible
          onCollapse={this.onCollapse}
        >
          {this.state.siderCollapse ? null : <UndoRedo />}
          {content}
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
