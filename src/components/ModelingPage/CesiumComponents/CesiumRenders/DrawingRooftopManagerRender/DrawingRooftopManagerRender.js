import React from 'react';
import { connect } from 'react-redux';
import PolygonVisualize from '../../Polygon/Polygon';
import CustomPoint from '../../point/point';
import Node from '../../../../../infrastructure/edgesMap/node/node';
import * as actions from '../../../../../store/actions/index';


const drawingRooftopManagerRender = (props) => {
  let drawingBuildingRooftop = [];
  const drawingBuildingRoofTopExcludeStb = [];
  if (props.PitchedBuildingRoofTop.EnableToBuild && props.CurrentBuilding.type === 'PITCHED') {
    for (let RoofPlane of props.PitchedBuildingRoofTop.RooftopCollection.getAllRoofTops()) {
      drawingBuildingRooftop.push(
        <PolygonVisualize
          key={RoofPlane.entityId}
          {...RoofPlane}
        />
      );
    }
    props.PitchedBuildingRoofTop.RooftopCollection.rooftopExcludeStb.forEach(
      elem => {
        elem.forEach(e =>
        drawingBuildingRoofTopExcludeStb.push(
          <PolygonVisualize
            key={e.entityId}
            {...e}
          />
        )
      )}
    );
  }
  return (
    <div>
      {drawingBuildingRooftop}
      {drawingBuildingRoofTopExcludeStb}
    </div>
  );
};

const mapStateToProps = state => {
  return{
    CurrentBuilding:
      state.buildingManagerReducer.workingBuilding,
    PitchedBuildingRoofTop:
      state.undoableReducer.present.drawingRooftopManagerReducer
  }
};

export default connect(mapStateToProps)(drawingRooftopManagerRender);
