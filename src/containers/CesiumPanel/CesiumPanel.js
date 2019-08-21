import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';

import 'antd/dist/antd.css';

import * as classes from './CesiumPanel.module.css';
import CustomViewer from '../CustomViewer/CustomViewer';
import FlyTo from '../../components/CesiumComponents/FlyTo/FlyTo';
import CesiumEventHandlers from '../CesiumEventHandler/CesiumEventHandler';
import CesiumRender from '../CesiumRenders/CesiumRender';
import LeftSider from '../../components/Sider/LeftSider/LeftSider';

const { Content } = Layout;

class CesiumPanel extends Component {

  render () {
    return (
      <Layout>
        <Content>
          <CustomViewer enableTerrain={false}>
            <FlyTo flyTo={this.props.initialCor} />
            <CesiumEventHandlers />
            <CesiumRender />
          </CustomViewer>
          <LeftSider />
        </Content>
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
