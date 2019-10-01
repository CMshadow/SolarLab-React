import React from 'react';
import { connect } from 'react-redux';
import PolygonVisualize from '../../Polygon/Polygon';
import CustomPoint from '../../point/point';
import Node from '../../../../../infrastructure/edgesMap/node/node';
import * as actions from '../../../../../store/actions/index';


const drawingRooftopManagerRender = (props) => {
  let drawingBuildingRooftop = [];
  console.log('qqqq '+ props.PitchedBuildingRoofTop.EnableToBuild);
  if (props.PitchedBuildingRoofTop.EnableToBuild && props.CurrentBuilding.type === 'PITCHED') {
    console.log('[Pitched Building: start]');
    for (let RoofPlane of props.PitchedBuildingRoofTop.RooftopCollection) {
      drawingBuildingRooftop.push(<PolygonVisualize
      {...RoofPlane}/>);
    }
    console.log("how many planes: " + drawingBuildingRooftop.length);
  }
  return <div>{drawingBuildingRooftop.map((roofPlane,index) => (
    <li key={index}>{roofPlane}</li>
  ))}</div>
};

const mapStateToProps = state => { 
  return{
    CurrentBuilding:
      state.buildingManagerReducer.workingBuilding,
    PitchedBuildingRoofTop:
      state.undoableReducer.present.drawingRooftopManagerReducer
  }
};
const mapDispatchToProps = dispatch => {
  return {
    EnablePolygon: () => dispatch(actions.enableToBuildFoundation()),
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(drawingRooftopManagerRender);