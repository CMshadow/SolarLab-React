import React from 'react';
import { connect } from 'react-redux';

import PolygonVisualize from '../../Polygon/Polygon';
import * as actions from '../../../../../store/actions/index';




const drawing3DFoundManagerRender = (props) => {

    let drawingBuildingFoundation = null;
    if (props.EnableToBuild) {
        //buildingFoundation = props.CreateBuildingFoundationPolygon(props.BuildingInfoFields.foundHt, props.DrawingFoundationBoundary.getPointsCoordinatesArray() );
        //console.log('[Polygon Render]: Starting Building' + props.DrawingBuidingFoundation.height);
        drawingBuildingFoundation = (<PolygonVisualize 
            {...props.DrawingBuidingFoundation}
        />);
    }
    

    return <div>{drawingBuildingFoundation}</div>
        
};


const mapStateToProps = state => {
    return{
        EnableToBuild: state.undoableReducer.present.drawingPolygonManagerReducer.PolygonReadyEnable,
        BuildingInfoFields: state.buildingManagerReducer.buildingInfoFields,
        DrawingFoundationBoundary: state.undoableReducer.present.drawingManagerReducer.drawingPolyline,
        CreateBuildingFoundationPolygon: state.undoableReducer.present.drawingPolygonManagerReducer.createBuildingFoundationPolygon,
        DrawingBuidingFoundation: state.undoableReducer.present.drawingPolygonManagerReducer.BuildingFoundation
    };
};

const mapDispatchToProps = dispatch => {
    return {
        CreateBuildingFoundationPolygon:  (newHeight, coordinatesArray) => 
                dispatch(actions.createPolygonFoundation(newHeight, coordinatesArray))
    };
  };


export default connect(mapStateToProps, mapDispatchToProps)(drawing3DFoundManagerRender);