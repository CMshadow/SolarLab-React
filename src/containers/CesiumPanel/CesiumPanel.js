import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { ContextMenuTrigger } from "react-contextmenu";

import 'antd/dist/antd.css';

import CustomViewer from '../CustomViewer/CustomViewer';
import FlyTo from '../../components/CesiumComponents/FlyTo/FlyTo';
import CesiumEventHandlers from '../CesiumEventHandler/CesiumEventHandler';
import CesiumScreenSpaceCameraController from '../ScreenSpaceCameraController/CesiumScreenSpaceCameraController';
import CesiumRender from '../CesiumRenders/CesiumRender';
import LeftSider from '../ui/LeftSider/LeftSider';
import RightSider from '../ui/RightSider/RightSider';
import CustomContextMenu from '../ui/CustomContextMenu/CustomContextMenu';

const { Content } = Layout;

class CesiumPanel extends Component {

  render () {
    return (
      <Layout>
        <Content>
          <ContextMenuTrigger id="cesium_context_menu">
            <CustomViewer enableTerrain={false}>
              <CesiumScreenSpaceCameraController />
              <FlyTo flyTo={this.props.initialCor} />
              <CesiumEventHandlers />
              <CesiumRender />
            </CustomViewer>
          </ContextMenuTrigger>
          <CustomContextMenu />
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
