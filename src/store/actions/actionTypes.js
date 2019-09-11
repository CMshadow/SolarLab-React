/*
  cesium.js
 */
export const SET_VIEWER = 'SET_VIEWER';
export const ENABLE_ROTATION = 'ENABLE_ROTATION';
export const DISABLE_ROTATION = 'DISABLE_ROTATION';

/*
  drawingManager.js
 */
export const DRAG_POLYLINE = 'DRAG_POINT';
export const DRAG_POLYLINE_FIXED_MODE = 'DRAG_POLYLINE_FIXED_MODE';
export const CLICK_ADD_POINT_ON_POLYLINE = 'CLICK_ADD_POINT_ON_POLYLINE';
export const TERMINATE_DRAWING = 'TERMINATE_DRAWING';
export const CLICK_COMPLEMENT_POINT_ON_POLYLINE = 'CLICK_COMPLEMENT_POINT_ON_POLYLINE';
export const CLICK_DELETE_POINT_ON_POLYLINE = 'CLICK_DELETE_POINT_ON_POLYLINE';
export const SET_MOUSE_CARTESIAN3 = 'SET_MOUSE_CARTESIAN3';
export const SET_RIGHT_CLICK_CARTESIAN3 = 'SET_RIGHT_CLICK_CARTESIAN3';

export const SET_HOVERPOLYLINE = 'SET_HOVERPOLYLINE';
export const RELEASE_HOVERPOLYLINE = 'RELEASE_HOVERPOLYLINE';

export const SET_HOVERPOINT = 'SET_HOVERPOINT';
export const RELEASE_HOVERPOINT = 'RELEASE_HOVERPOINT';

export const SET_PICKEDPOINT = 'SET_PICKEDPOINT';
export const MOVE_PICKEDPOINT = 'MOVE_PICKEDPOINT';
export const RELEASE_PICKEDPOINT = 'RELEASE_PICKEDPOINT';

export const CLEAN_HOVER_AND_COLOR = 'CLEAN_HOVER_AND_COLOR';

export const EXIT_CURRENT_DRAWING = 'EXIT_CURRENT_DRAWING';

export const DO_NOTHING = 'DO_NOTHING';

/*
  drawingInnerManager.js
 */
export const PASS_FOUND_POLYLINE = 'PASS_FOUND_POLYLINE';
export const UPDATE_POINTS_RELATION = 'UPDATE_POINTS_RELATION';
export const ADD_START_POINT = 'ADD_START_POINT';
export const ADD_START_POINT_ON_FOUND = 'ADD_START_POINT_ON_FOUND';
export const DRAG_INNER_POLYLINE = 'DRAG_INNER_POLYLINE';
export const DRAG_INNER_POLYLINE_FIXED_MODE = 'DRAG_INNER_POLYLINE_FIXED_MODE';
export const ADD_END_POINT = 'ADD_END_POINT';
export const ADD_END_POINT_ON_FOUND = 'ADD_END_POINT_ON_FOUND';
export const SET_TYPE_HIP = 'SET_TYPE_HIP';
export const SET_TYPE_RIDGE = 'SET_TYPE_RIDGE';
export const SET_HOVER_INNER_POINT = 'SET_HOVER_INNER_POINT';
export const RELEASE_HOVER_INNER_POINT = 'RELEASE_HOVER_INNER_POINT';
export const SET_HOVER_INNER_LINE = 'SET_HOVER_INNER_LINE';
export const RELEASE_HOVER_INNER_LINE = 'RELEASE_HOVER_INNER_LINE';
export const DELETE_INNER_POLYLINE = 'DELETE_INNER_POLYLINE';

/*
  uiStateManager.js
 */
export const SET_UI_STATE_READY_DRAWING = 'SET_UI_STATE_READY_DRAWING';
export const SET_UI_STATE_DRAWING_FOUND = 'SET_UI_STATE_DRAWING_FOUND';
export const SET_UI_STATE_FOUND_DREW = 'SET_UI_STATE_FOUND_DREW';
export const SET_UI_STATE_EDITING_FOUND = 'SET_UI_STATE_EDITING_FOUND';
export const SET_UI_STATE_DRAWING_INNER = 'SET_UI_STATE_DRAWING_INNER';
export const SET_UI_STATE_INNER_DREW = 'SET_UI_STATE_INNER_DREW';

/*
  buildingManager.js
 */
export const INIT_BUILDING = 'INIT_BUILDING';
export const SAVE_BUILDING_INFO_FIELDS = 'SAVE_BUILDING_INFO_FIELDS';
export const RESET_BUILDING = 'RESET_BUILDING';
