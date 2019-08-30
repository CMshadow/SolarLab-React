import React, { Component } from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';

import 'antd/dist/antd.css';

import * as classes from './LeftSider.module.css';
import UndoRedo from '../../../components/ui/UndoRedo/UndoRedo';
import CreateBuildingPanel from './individualPanels/createBuildingPanel';
import DrawBuildingPanel from './individualPanels/drawBuildingPanel';
import Auxiliary from '../../../hoc/Auxiliary/Auxiliary';

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
      if (this.props.uiState === 'IDLE') {
        content = (<CreateBuildingPanel/>);
      }
      else if (
        this.props.uiState === 'READY_DRAWING' ||
        this.props.uiState === 'DRAWING_FOUND' ||
        this.props.uiState === 'FOUND_DREW' ||
        this.props.uiState === 'EDITING_FOUND'
      ) {
        content = (<DrawBuildingPanel/>);
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
