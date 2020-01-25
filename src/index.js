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
import authManager from './store/reducers/auth';
import cesiumManager from './store/reducers/cesium';
import drawingManager from './store/reducers/drawingManager';
import drawingInnerManager from './store/reducers/drawingInnerManager';
import drawingKeepoutManager from './store/reducers/drawingKeepoutManager';
import uiStateManager from './store/reducers/uiStateManager';
import buildingManager from './store/reducers/buildingManager';
import keepoutManager from './store/reducers/keepoutManager';
import projectManager from './store/reducers/projectManager';
import drawingPolygonManager from './store/reducers/drawingPolygonManager';
import drawingKeepoutPolygonManager from './store/reducers/drawingKeepoutPolygonManager';
import editingPVPanelManager from './store/reducers/editingPVPanelManager';
import editingWiringManager from './store/reducers/editingWiringManager';
import debugRender from './store/reducers/debugRender';
import drawingRooftopManager from './store/reducers/drawingRooftopManager';
import editingShadowManager from './store/reducers/editingShadowManager';
import drawingSketchDiagramManager from './store/reducers/drawingSketchDiagramManager';
import drawingSingleLineDiagram from './store/reducers/drawingSingleLineDiagramManager';
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
  undoable: undoable(combineReducers({
    authManager: authManager,
    cesiumManager: cesiumManager,
    projectManager: projectManager,
    buildingManager: buildingManager,
    keepoutManager: keepoutManager,
    debugRender:debugRender,
    drawingSketchDiagramManager: drawingSketchDiagramManager,
    drawingSingleLineDiagram: drawingSingleLineDiagram,
    drawingManager: drawingManager,
    drawingInnerManager: drawingInnerManager,
    uiStateManager: uiStateManager,
    drawingKeepoutManager: drawingKeepoutManager,
    drawingPolygonManager: drawingPolygonManager,
    drawingKeepoutPolygonManager: drawingKeepoutPolygonManager,
    drawingRooftopManager: drawingRooftopManager,
    editingShadowManager: editingShadowManager,
    editingPVPanelManager: editingPVPanelManager,
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
