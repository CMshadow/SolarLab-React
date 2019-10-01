import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/pro-light-svg-icons'
import {
  Divider,
  Row,
  Col,
  Button,
} from 'antd';
import * as actions from '../../../../../store/actions/index';


const draw3DBuildingButton = (props) => { 
  const DrawBuildingPolygon = (
    <Button
      type = 'primary'
      size = 'large'
      shape = 'round'
      block
      onClick = {() => {
        console.log('[Button]: Test Polygon: ');
        props.EnablePolygon();
        let buildingCoordinatesArray= props.BuildFoundation.getPointsCoordinatesArray();
        let buildingCoordinatesSize = buildingCoordinatesArray.length;
        buildingCoordinatesArray.splice(buildingCoordinatesSize - 3,3);
        props.CreateBuildingFoundationPolygon(props.CurrentBuilding.foundationHeight, buildingCoordinatesArray);
        props.InitNodesCollection(buildingCoordinatesArray, props.PolylinesRelation);
       
      }}
    >Test: Draw Foundation</Button>

  );
  return (
    <Row>
    <Col span={18} offset={3}>
      {DrawBuildingPolygon}
    </Col>
  </Row>
  );
}

const mapStateToProps = state => {
  return {
    CurrentBuilding: 
      state.buildingManagerReducer.workingBuilding,
    BuildFoundation: 
      state.undoableReducer.present.drawingManagerReducer.drawingPolyline,
    PitchedBuildingRoofTop:
      state.undoableReducer.present.drawingRooftopManagerReducer,
    PolylinesRelation: 
      state.undoableReducer.present.drawingInnerManagerReducer.pointsRelation

  };
};

const mapDispatchToProps = dispatch => {
  return {
    EnablePolygon: () => dispatch(actions.enableToBuildFoundation()),
    CreateBuildingFoundationPolygon: (newHeight, coordinatesArray) => 
      dispatch(actions.createPolygonFoundation(newHeight, coordinatesArray)),
    InitNodesCollection: (buindingBoundary, polylinesRelation) => 
      dispatch(actions.initNodesCollection(buindingBoundary, polylinesRelation))
 };
};

export default connect(mapStateToProps,mapDispatchToProps)(draw3DBuildingButton);