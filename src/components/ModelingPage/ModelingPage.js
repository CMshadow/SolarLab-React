import React from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { ContextMenuTrigger } from "react-contextmenu";

import 'antd/dist/antd.css';

import CustomViewer from './CesiumComponents/CustomViewer/CustomViewer';
import FlyTo from './CesiumComponents/FlyTo/FlyTo';
import CesiumEventHandlers from './CesiumComponents/CesiumEventHandler/CesiumEventHandler';
import CesiumScreenSpaceCameraController from './CesiumComponents/ScreenSpaceCameraController/CesiumScreenSpaceCameraController';
import CesiumRender from './CesiumComponents/CesiumRenders/CesiumRender';
import LeftSider from '../../containers/ui/LeftSider/LeftSider';
import RightSider from '../../containers/ui/RightSider/RightSider';
import CustomContextMenu from '../ui/CustomContextMenu/CustomContextMenu';

const { Content } = Layout;

const ModelingPage = (props) => {
  return (
    <Layout>
      <Content>
        <ContextMenuTrigger id="cesium_context_menu">
          <CustomViewer enableTerrain={false}>
            <CesiumScreenSpaceCameraController />
            <FlyTo flyTo={[
              props.projectInfo.projectLon,
              props.projectInfo.projectLat,
              props.projectInfo.projectZoom]}
            />
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
};

const mapStateToProps = state => {
  return {
    projectInfo: state.projectManagerReducer.projectInfo,
  };
}

export default connect(mapStateToProps)(ModelingPage);
