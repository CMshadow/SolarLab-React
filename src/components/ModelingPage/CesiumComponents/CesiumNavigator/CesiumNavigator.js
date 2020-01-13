import { connect } from 'react-redux';
import CesiumNavigation from 'cesium-navigation-es6';

const CesiumNavigator = (props) => {
  const options = {
    // 用于启用或禁用罗盘
    enableCompass: true,
    // 用于启用或禁用缩放控件
    enableZoomControls: false,
    // 用于启用或禁用距离图例
    enableDistanceLegend: false,
    // 用于启用或禁用指南针外环
    enableCompassOuterRing: true,
  };

  if (props.viewer) CesiumNavigation(props.viewer, options)
  return null;
};

const mapStateToProps = state => {
  return{
    viewer: state.cesiumReducer.viewer,
  }
}

export default connect(mapStateToProps)(CesiumNavigator);
