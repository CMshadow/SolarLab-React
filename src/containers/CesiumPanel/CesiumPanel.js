import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Cesium from 'cesium';

import 'antd/dist/antd.css';

import CustomViewer from '../CustomViewer/CustomViewer';
import FlyTo from '../../components/CesiumComponents/FlyTo/FlyTo';
import CesiumEventHandlers from '../CesiumEventHandler/CesiumEventHandler';
import CesiumRender from '../CesiumRenders/CesiumRender';

class CesiumPanel extends Component {

  render () {
    return (
      <CustomViewer enableTerrain={false}>
        <FlyTo flyTo={this.props.initialCor} />
        <CesiumEventHandlers />
        <CesiumRender />
      </CustomViewer>
    );
  }
}

const mapStateToProps = state => {
  return {
    initialCor: state.cesiumReducer.initialCor,
  };
}

export default connect(mapStateToProps)(CesiumPanel);
