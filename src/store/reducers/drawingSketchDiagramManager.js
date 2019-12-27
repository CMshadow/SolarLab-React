import Konva from 'konva';
import { Stage, Layer, Rect, Text } from 'react-konva';

import * as actionTypes from '../actions/actionTypes';
import Aux from '../../hoc/Auxiliary/Auxiliary';

const initState = {

  state: null,
  stageWidth: 0,
  stageHeight: 0,
  layer: null
}


const initStage = (state, action) => {

  return{

    stageHeight: action.stageHeight,
    stageWidth: action.stageWidth,
    layer: action.layer
  }
}

const reducer = (state=initState, action) => {
  switch(action.type){
		case actionTypes.INIT_STAGE_SKETCH_DIAGRAM:
			return initStage(state, action);
		default:
			return state;
	}

};

export default reducer;