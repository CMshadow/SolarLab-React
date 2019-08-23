import React, { Component } from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';

import 'antd/dist/antd.css';

import * as classes from './LeftSider.module.css';
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
      else if (this.props.uiState === 'READY_DRAWING') {
        content = (<DrawBuildingPanel/>);
      }
    }

    return (
      <Auxiliary>
        <Sider
          className={classes.leftSider}
          width={325}
          collapsedWidth={50}
          collapsible
          onCollapse={this.onCollapse}
        >
          {content}
        </Sider>
      </Auxiliary>
    );
  }
}

const mapStateToProps = state => {
  return {
    uiState: state.uiStateManagerReducer.uiState
  };
};

export default connect(mapStateToProps)(LeftSider);
