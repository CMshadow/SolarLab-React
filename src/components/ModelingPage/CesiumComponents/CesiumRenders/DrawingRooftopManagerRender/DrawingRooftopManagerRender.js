import React from 'react';
import { connect } from 'react-redux';
import PolygonVisualize from '../../Polygon/Polygon';
import * as actions from '../../../../../store/actions/index';


const drawingRooftopManagerRender = (props) => {
  let drawingBuildingRooftop = null;

  if (props.EnableToBuild && props.CurrentBuilding.type === 'PITCHED') {
    console.log('[Pitched Building: start]');
  }
  return <div>{drawingBuildingRooftop}</div>
};

const mapStateToProps = state => {
  return{
    EnableToBuild: 
      state.undoableReducer.present.drawingPolygonManagerReducer.PolygonReadyEnable,
    CurrentBuilding:
      state.buildingManagerReducer.workingBuilding
  }
}

export default connect(mapStateToProps)(drawingRooftopManagerRender);