import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

/*
  import Redux reducers
 */
import authReducer from './store/reducers/auth';
import cesiumReducer from './store/reducers/cesium';
import drawingManagerReducer from './store/reducers/drawingManager';
import uiStateManagerReducer from './store/reducers/uiStateManager';
import buildingManagerReducer from './store/reducers/buildingManager';
import projectManagerReducer from './store/reducers/projectManager';
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
  drawingManagerReducer: drawingManagerReducer,
  uiStateManagerReducer: uiStateManagerReducer,
  buildingManagerReducer: buildingManagerReducer,
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
