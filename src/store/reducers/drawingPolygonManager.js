import * as Cesium from 'cesium';
import uuid from 'uuid/v1';
import * as actionTypes from '../actions/actionTypes';
import Coordinate from '../../infrastructure/point/coordinate';
import Polygon from '../../infrastructure/Polygon/Polygon';


const initialState = {
    PolygonReadyEnable: false,
    BuildingFoundation: {
        id: uuid(), 
        name: 'Polygon_Foundation', 
        height: 10.0,
        hierarchy: [-117.841128138803,33.647271736676,0.1,-117.841312393538,33.646929442767,0.1,-117.841042636422,33.646859019268,0.1,-117.840945037791,33.647098452844,0.1],
        material: Cesium.Color.WHITE,
        perPosition: true,
        extrudeHeight: 0.0,
        show: true
    }

};

/**
 * 
 * Toggle Handler: To Enable To Generate 3D Polygon
 */
const enableToBuild = (state, action) => {
    console.log('[Found Checked]: Ready to Build');
    return{
        ...state,
        PolygonReadyEnable: true
    }
}

/**
 * 
 *  CREATE 3D Building Foundation Polygon 
 */
const createBuildingFoundationPolygon = (state, action) => {

    let newFoundation = {
        ...state.BuildingFoundation
    }

    newFoundation.height = action.height;
    console.log('new height: ' + newFoundation.height);
    newFoundation.hierarchy = [...action.coordinatesArray];
    newFoundation.hierarchy.map( (_,index) => {
        if ((index + 1) % 3 === 0) {
            newFoundation.hierarchy[index] = newFoundation.height;
        }
    });
    return{
        ...state,
        BuildingFoundation: {
            ...newFoundation
        }
    };
};

/**
 * 
 *  Set Up The Props of 3D Building Foundation Polygon
 */

const setUpBuildingFoundationPolygon = (state, action) => {
    return null;
};
    

 const reducer = (state= initialState, action) => {
    switch(action.type){
        case actionTypes.ENABLE_TO_BUILD_FOUNDATION:
            return enableToBuild(state, action);

        case actionTypes.CREATE_POLYGON_FOUNDATION:
            return createBuildingFoundationPolygon(state, action);

        case actionTypes.SET_POLYGON_FOUNDATION:
            return setUpBuildingFoundationPolygon(state, action);
        
        default:
            return state;
    }
 };


 export default reducer;