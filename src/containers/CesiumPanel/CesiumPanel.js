import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import 'antd/dist/antd.css';

import CustomViewer from '../CustomViewer/CustomViewer';
import FlyTo from '../../components/CesiumComponents/FlyTo/FlyTo';
import CesiumEventHandlers from '../CesiumEventHandler/CesiumEventHandler';
import CesiumScreenSpaceCameraController from '../ScreenSpaceCameraController/CesiumScreenSpaceCameraController';
import CesiumRender from '../CesiumRenders/CesiumRender';
import LeftSider from '../ui/LeftSider/LeftSider';
import RightSider from '../ui/RightSider/RightSider';

const { Content } = Layout;

class CesiumPanel extends Component {

  render () {
    return (
      <Layout>
        <Content>
          <ContextMenuTrigger id="some_unique_identifier">
            <CustomViewer enableTerrain={false}>
              <CesiumScreenSpaceCameraController />
              <FlyTo flyTo={this.props.initialCor} />
              <CesiumEventHandlers />
              <CesiumRender />
            </CustomViewer>
          </ContextMenuTrigger>
          <ContextMenu id="some_unique_identifier">
            <MenuItem>
              ContextMenu Item 1
            </MenuItem>
          </ContextMenu>
          <LeftSider />
        </Content>
        <RightSider />
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    initialCor: state.cesiumReducer.initialCor,
  };
}

export default connect(mapStateToProps)(CesiumPanel);
