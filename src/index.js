import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import undoable, { includeAction } from 'redux-undo';

import './index.css';
import './contextMenu.css';
import './cesiumNavigator.css'
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as actionTypes from './store/actions/actionTypes';

/*
  import Redux reducers
 */
import authReducer from './store/reducers/auth';
import cesiumReducer from './store/reducers/cesium';
import drawingManagerReducer from './store/reducers/drawingManager';
import drawingInnerManagerReducer from './store/reducers/drawingInnerManager';
import drawingKeepoutManagerReducer from './store/reducers/drawingKeepoutManager';
import uiStateManagerReducer from './store/reducers/uiStateManager';
import buildingManagerReducer from './store/reducers/buildingManager';
import keepoutManagerReducer from './store/reducers/keepoutManager';
import projectManagerReducer from './store/reducers/projectManager';
import drawingPolygonManagerReducer from './store/reducers/drawingPolygonManager';
import drawingKeepoutPolygonManagerReducer from './store/reducers/drawingKeepoutPolygonManager';
import editingPVPanelManagerReducer from './store/reducers/editingPVPanelManager';
import editingWiringManager from './store/reducers/editingWiringManager';
import debugRenderReducer from './store/reducers/debugRender';
import drawingRooftopManagerReducer from './store/reducers/drawingRooftopManager';
import editingShadowManager from './store/reducers/editingShadowManager';
import drawingSketchDiagramManagerReducer from './store/reducers/drawingSketchDiagramManager';
import drawingSingleLineDiagramReducer from './store/reducers/drawingSingleLineDiagramManager';
import reportManager from './store/reducers/reportManager';
// IMPORT MORE REDBUX REDUCERS OVER HERE

/*
  composeEnhancers: Used to build Redux store
 */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/*
  rootReducer: the combiner of all Redux reducers
 */
const rootReducer = combineReducers({
  authReducer: authReducer,
  projectManagerReducer: projectManagerReducer,
  cesiumReducer: cesiumReducer,
  buildingManagerReducer: buildingManagerReducer,
  keepoutManagerReducer: keepoutManagerReducer,
  debugRenderReducer:debugRenderReducer,
  drawingSketchDiagramManagerReducer,
  drawingSingleLineDiagramReducer,
  undoableReducer: undoable(combineReducers({
    drawingManagerReducer: drawingManagerReducer,
    drawingInnerManagerReducer: drawingInnerManagerReducer,
    uiStateManagerReducer: uiStateManagerReducer,
    drawingKeepoutManagerReducer: drawingKeepoutManagerReducer,
    drawingPolygonManagerReducer: drawingPolygonManagerReducer,
    drawingKeepoutPolygonManagerReducer: drawingKeepoutPolygonManagerReducer,
    drawingRooftopManagerReducer: drawingRooftopManagerReducer,
    editingShadowManager: editingShadowManager,
    editingPVPanelManagerReducer: editingPVPanelManagerReducer,
    editingWiringManager: editingWiringManager,
    reportManager: reportManager
  }), {
    initTypes: ['@@redux/INIT'],
    filter: includeAction([
      actionTypes.CLICK_ADD_POINT_ON_POLYLINE,
      actionTypes.CLICK_COMPLEMENT_POINT_ON_POLYLINE,
      actionTypes.CLICK_DELETE_POINT_ON_POLYLINE,
      actionTypes.RELEASE_PICKEDPOINT,

      actionTypes.ADD_START_POINT,
      actionTypes.ADD_START_POINT_ON_FOUND,
      actionTypes.ADD_END_POINT,
      actionTypes.ADD_END_POINT_ON_FOUND,
      actionTypes.SET_TYPE_HIP,
      actionTypes.SET_TYPE_RIDGE,
      actionTypes.DELETE_INNER_POLYLINE,

      actionTypes.SET_UI_STATE_DRAWING_FOUND,
      actionTypes.SET_UI_STATE_FOUND_DREW,
      actionTypes.SET_UI_STATE_EDITING_FOUND,
      actionTypes.SET_UI_STATE_DRAWING_INNER,
      actionTypes.SET_UI_STATE_INNER_DREW,
    ]),
  })
  // ADD MORE REDUCERS OVER HERE
});

/*
  store: global Redux store
 */
const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(thunk)
));

/*
  wholeApp: the wrapper of the entier App
 */
const wholeApp = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(wholeApp, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
