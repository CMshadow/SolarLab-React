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
  drawingKeepoutManager.js
 */
export const CREATE_KEEPOUT = 'CREATE_KEEPOUT';
export const UPDATE_KEEPOUT = 'UPDATE_KEEPOUT';
export const DELETE_KEEPOUT = 'DELETE_KEEPOUT';
export const INIT_LINKED_KEEPOUT_INDEX = 'INIT_LINKED_KEEPOUT_INDEX';
export const RELEASE_LINKED_KEEPOUT_INDEX = 'RELEASE_LINKED_KEEPOUT_INDEX';
export const KEEPOUT_ADD_POINT = 'KEEPOUT_ADD_POINT';
export const KEEPOUT_ADD_VENT_TEMPLATE = 'KEEPOUT_ADD_VENT_TEMPLATE';
export const KEEPOUT_ADD_TREE_TEMPLATE = 'KEEPOUT_ADD_TREE_TEMPLATE';
export const KEEPOUT_DRAG_POLYLINE = 'KEEPOUT_DRAG_POLYLINE';
export const KEEPOUT_DRAG_POLYLINE_FIXED_MODE = 'KEEPOUT_DRAG_POLYLINE_FIXED_MODE';
export const KEEPOUT_TERMINATE_DRAWING = 'KEEPOUT_TERMINATE_DRAWING';
export const SET_KEEPOUT_HOVERPOINT = 'SET_KEEPOUT_HOVERPOINT';
export const RELEASE_KEEPOUT_HOVERPOINT = 'RELEASE_KEEPOUT_HOVERPOINT';
export const SET_KEEPOUT_HOVERPOLYLINE = 'SET_KEEPOUT_HOVERPOLYLINE';
export const RELEASE_KEEPOUT_HOVERPOLYLINE = 'RELEASE_KEEPOUT_HOVERPOLYLINE';
export const CLICK_COMPLEMENT_POINT_ON_KEEPOUT_POLYLINE = 'CLICK_COMPLEMENT_POINT_ON_KEEPOUT_POLYLINE';
export const CLICK_DELETE_POINT_ON_KEEPOUT_POLYLINE = 'CLICK_DELETE_POINT_ON_KEEPOUT_POLYLINE';
export const SET_KEEPOUT_PICKEDPOINT = 'SET_KEEPOUT_PICKEDPOINT';
export const MOVE_KEEPOUT_PICKEDPOINT = 'MOVE_KEEPOUT_PICKEDPOINT';
export const RELEASE_KEEPOUT_PICKEDPOINT = 'RELEASE_KEEPOUT_PICKEDPOINT';

/*
  uiStateManager.js
 */
export const SET_UI_STATE_READY_DRAWING = 'SET_UI_STATE_READY_DRAWING';
export const SET_UI_STATE_DRAWING_FOUND = 'SET_UI_STATE_DRAWING_FOUND';
export const SET_UI_STATE_FOUND_DREW = 'SET_UI_STATE_FOUND_DREW';
export const SET_UI_STATE_EDITING_FOUND = 'SET_UI_STATE_EDITING_FOUND';
export const SET_UI_STATE_DRAWING_INNER = 'SET_UI_STATE_DRAWING_INNER';
export const SET_UI_STATE_INNER_DREW = 'SET_UI_STATE_INNER_DREW';
export const SET_UI_STATE_DRAWING_KEEPOUT = 'SET_UI_STATE_DRAWING_KEEPOUT';
export const SET_UI_STATE_EDITING_KEEPOUT = 'SET_UI_STATE_EDITING_KEEPOUT';
export const SET_PREVIOUS_UI_STATE = 'SET_PREVIOUS_UI_STATE';
export const SET_UI_STATE_EDITING_3D = 'SET_UI_STATE_EDITING_3D';
export const SET_UI_STATE_SETUP_PV = 'SET_UI_STATE_SETUP_PV';

/*
  buildingManager.js
 */
export const INIT_BUILDING = 'INIT_BUILDING';
export const UPDATE_BUILDING = 'UPDATE_BUILDING';
export const SAVE_BUILDING_INFO_FIELDS = 'SAVE_BUILDING_INFO_FIELDS';
export const BIND_FOUNDATION_POLYLINE = 'BIND_FOUNDATION_POLYLINE';
export const BIND_FOUNDATION_POLYGONS = 'BIND_FOUNDATION_POLYGONS';
export const BIND_NORMALKEEPOUT = 'BIND_NORMALKEEPOUT';
export const BIND_PASSAGE = 'BIND_PASSAGE';
export const BIND_VENT = 'BIND_VENT';
export const BIND_TREE = 'BIND_TREE';
export const BIND_ENV = 'BIND_ENV';
export const RESET_BUILDING = 'RESET_BUILDING';

/*
  keepoutManager.js
 */
export const BIND_ALL_KEEPOUT = 'BIND_ALL_KEEPOUT';

/*
  drawingPolygonManager.js
 */
export const CREATE_POLYGON_FOUNDATION = 'CREATE_POLYGON_FOUNDATION';
export const CREATE_WALL = 'CREATE_WALL';
export const CREATE_POLYGON_FOUNDATION_EXCLUDE_SETBACK = 'CREATE_POLYGON_FOUNDATION_EXCLUDE_SETBACK';
export const SET_BACKENDLOADING_TRUE = 'SET_BACKENDLOADING_TRUE';
export const SET_BACKENDLOADING_FALSE = 'SET_BACKENDLOADING_FALSE';

/*
  drawingKeepoutPolygonManager.js
 */
export const CREATE_ALL_NORMAL_KEEPOUT_POLYGON = 'CREATE_ALL_NORMAL_KEEPOUT_POLYGON';
export const CREATE_ALL_PASSAGE_KEEPOUT_POLYGON = 'CREATE_ALL_PASSAGE_KEEPOUT_POLYGON';
export const CREATE_ALL_VENT_KEEPOUT_POLYGON = 'CREATE_ALL_VENT_KEEPOUT_POLYGON';
export const CREATE_ALL_TREE_KEEPOUT_POLYGON = 'CREATE_ALL_TREE_KEEPOUT_POLYGON';
export const CREATE_ALL_ENV_KEEPOUT_POLYGON = 'CREATE_ALL_ENV_KEEPOUT_POLYGON';

/*
  debugRender.js
 */
export const SET_DEBUGPOINTS = 'SET_DEBUGPOINTS';
export const SET_DEBUGPOLYLINES = 'SET_DEBUGPOLYLINES';

 /**
 *  drawingRooftopManager.js
 */
export const BUILD_3D_ROOFTOP_MODELING = 'BUILD_3D_ROOFTOP_MODELING';
export const INIT_EDGES_MAP = 'INIT_EDGES_MAP';
export const INIT_NODES_COLLECTION = 'INIT_NODES_COLLECTION';
export const SEARCH_ALL_ROOF_PLANES = 'SEARCH_ALL_ROOF_PLANES';
export const CALCULATE_OBLIQUITY_And_BREAING = 'CALCULATE_OBLIQUITY_And_BREAING';
export const CALCULATE_HIGHEST_LOWEST_NODES = 'CALCULATE_HIGHEST_LOWEST_NODES';
export const CHECK_EDGE_TYPE_OF_PATH = 'CHECK_EDGE_TYPE_OF_PATH';