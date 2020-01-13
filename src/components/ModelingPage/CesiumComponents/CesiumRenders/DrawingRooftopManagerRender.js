import React from 'react';
import { connect } from 'react-redux';
import PolygonVisualize from '../Polygon/Polygon';
import CustomPoint from '../point/point';
import Node from '../../../../infrastructure/edgesMap/node/node';
import * as actions from '../../../../store/actions/index';
import Polygon from '../../../../infrastructure/Polygon/Polygon';


const drawingRooftopManagerRender = (props) => {
  const drawingBuildingRooftop = [];
  const drawingBuildingRoofTopExcludeStb = [];
  const editingInnerPlanePoints = [];
  if (props.PitchedBuildingRoofTop.EnableToBuild && props.CurrentBuilding.type === 'PITCHED') {
    props.PitchedBuildingRoofTop.RooftopCollection.getAllRoofTops()
    .forEach((RoofPlane, ind) => {
      if (RoofPlane.show) {
        drawingBuildingRooftop.push(
          <PolygonVisualize
            key={RoofPlane.entityId}
            {...RoofPlane}
          />
        );
      }
    })
    props.PitchedBuildingRoofTop.RooftopCollection.rooftopExcludeStb.forEach(
      elem => {
        elem.forEach(e => {
          if (e.show) {
            drawingBuildingRoofTopExcludeStb.push(
              <PolygonVisualize
                key={e.entityId}
                {...e}
              />
            );
          }
        }
      )}
    );
    if (props.editingInnerPlanePoints) {
      props.editingInnerPlanePoints.forEach(p =>
        editingInnerPlanePoints.push(
          <CustomPoint key={p.entityId} {...p}/>
        )
      );
    }
  }
  return (
    <div>
      {drawingBuildingRooftop}
      {drawingBuildingRoofTopExcludeStb}
      {editingInnerPlanePoints}
    </div>
  );
};

const mapStateToProps = state => {
  return{
    CurrentBuilding:
      state.buildingManagerReducer.workingBuilding,
    PitchedBuildingRoofTop:
      state.undoableReducer.present.drawingRooftopManagerReducer,
    editingInnerPlaneIndex:
      state.undoableReducer.present.drawingRooftopManagerReducer
      .editingInnerPlaneIndex,
    editingInnerPlanePoints:
      state.undoableReducer.present.drawingRooftopManagerReducer
      .editingInnerPlanePoints,
  }
};

export default connect(mapStateToProps)(drawingRooftopManagerRender);
