import React from 'react';
import { connect } from 'react-redux';
import PolygonVisualize from '../../Polygon/Polygon';
import Node from '../../../../../infrastructure/edgesMap/node/node';
import * as actions from '../../../../../store/actions/index';


const drawingRooftopManagerRender = (props) => {
  let drawingBuildingRooftop = null;

  if (props.EnableToBuild && props.CurrentBuilding.type === 'PITCHED') {
    console.log('[Pitched Building: start]');
    let nodesCollections = [];
    let buildingOutline = props.foundationPolygon.getFoundationCoordinatesArray();
    // console.log(buildingOutline);
    //Building Boundary
    for (let i = 0; i < buildingOutline.length; i+=3) {
      nodesCollections.push(new Node(null, buildingOutline[i], buildingOutline[i + 1], buildingOutline[i + 2], 0 ));
    }
    // props.InitNodesCollection(nodesCollections);
    // for (let i = 0; i < nodesCollections.length; ++i) {
    //   console.log(nodesCollections[i].present());
    // }

    // console.log(props.PitchedBuildingRoofTop.NodesCollection[0].present());
    
}
  return <div>{drawingBuildingRooftop}</div>
};

const mapStateToProps = state => {
  return{
    EnableToBuild: 
      state.undoableReducer.present.drawingPolygonManagerReducer.PolygonReadyEnable,
    CurrentBuilding:
      state.buildingManagerReducer.workingBuilding,
    PitchedBuildingRoofTop:
      state.undoableReducer.present.drawingRooftopManagerReducer
  }
};
const mapDispatchToProps = dispatch => {
  return {
    EnablePolygon: () => dispatch(actions.enableToBuildFoundation()),
    InitNodesCollection: (newNodesCollection) => 
      dispatch(actions.initNodesCollection(newNodesCollection))
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(drawingRooftopManagerRender);