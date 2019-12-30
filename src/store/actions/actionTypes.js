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
export const SET_UI_STATE_EDITING_ROOFTOP = 'SET_UI_STATE_EDITING_ROOFTOP';
export const SET_UI_STATE_SETUP_PV = 'SET_UI_STATE_SETUP_PV';
export const SET_UI_STATE_SETUP_WIRING = 'SET_UI_STATE_SETUP_WIRING';
export const SET_UI_STATE_EDITING_WIRING = 'SET_UI_STATE_EDITING_WIRING';
export const SET_UI_STATE_DRAGGING_WIRING = 'SET_UI_STATE_DRAGGING_WIRING';
export const SET_UI_STATE_MANUAL_WIRING = 'SET_UI_STATE_MANUAL_WIRING';
export const SET_UI_STATE_SETUP_BRIDGING = 'SET_UI_STATE_SETUP_BRIDGING';
export const SET_UI_STATE_PLACE_INVERTER = 'SET_UI_STATE_PLACE_INVERTER';
export const SET_UI_STATE_READY_DRAG_INVERTER = 'SET_UI_STATE_READY_DRAG_INVERTER';
export const SET_UI_STATE_DRAG_INVERTER = 'SET_UI_STATE_DRAG_INVERTER';
export const SET_UI_STATE_EDIT_BRIDGING = 'SET_UI_STATE_EDIT_BRIDGING';
export const SET_UI_STATE_DRAG_BRIDGING = 'SET_UI_STATE_DRAG_BRIDGING';

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
export const BIND_SHADOW = 'BIND_SHADOW';
export const BIND_PARAPET_SHADOW = 'BIND_PARAPET_SHADOW';
export const BIND_PV = 'BIND_PV';
export const BIND_INVERTERS = 'BIND_INVERTERS';
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

/*
  drawingKeepoutPolygonManager.js
 */
export const CREATE_ALL_NORMAL_KEEPOUT_POLYGON = 'CREATE_ALL_NORMAL_KEEPOUT_POLYGON';
export const CREATE_ALL_PASSAGE_KEEPOUT_POLYGON = 'CREATE_ALL_PASSAGE_KEEPOUT_POLYGON';
export const CREATE_ALL_VENT_KEEPOUT_POLYGON = 'CREATE_ALL_VENT_KEEPOUT_POLYGON';
export const CREATE_ALL_TREE_KEEPOUT_POLYGON = 'CREATE_ALL_TREE_KEEPOUT_POLYGON';
export const CREATE_ALL_ENV_KEEPOUT_POLYGON = 'CREATE_ALL_ENV_KEEPOUT_POLYGON';

/*
  editingPVPanelManager.js
 */
export const SETUP_PANEL_PARAMS = 'SETUP_PANEL_PARAMS';
export const INIT_EDITING_PANELS = 'INIT_EDITING_PANELS';
export const CLEAN_EDITING_PANELS = 'CLEAN_EDITING_PANELS';
export const FETCH_USER_PANELS = 'FETCH_USER_PANELS';
export const SET_PV_CONNECTED = 'SET_PV_CONNECTED';
export const SET_PV_DISCONNECTED = 'SET_PV_DISCONNECTED';
export const SET_ROOF_ALL_PV_DISCONNECTED = 'SET_ROOF_ALL_PV_DISCONNECTED';

/*
  editingWiringManager.js
 */
export const FETCH_USER_INVERTERS = 'FETCH_USER_INVERTERS';
export const SET_UP_INVERTER = 'SET_UP_INVERTER';
export const AUTO_WIRING = 'AUTO_WIRING';
export const MANUAL_WIRING = 'MANUAL_WIRING';
export const MANUAL_WIRING_START = 'MANUAL_WIRING_START';
export const EDIT_WIRING = 'EDIT_WIRING';
export const SET_HOVER_WIRING_POINT = 'SET_HOVER_WIRING_POINT';
export const RELEASE_HOVER_WIRING_POINT = 'RELEASE_HOVER_WIRING_POINT';
export const SET_PICKED_WIRING_POINT = 'SET_PICKED_WIRING_POINT';
export const RELEASE_PICKED_WIRING_POINT = 'RELEASE_PICKED_WIRING_POINT';
export const RELEASE_PV_PANEL = 'RELEASE_PV_PANEL';
export const ATTACH_PV_PANEL = 'ATTACH_PV_PANEL';
export const DYNAMIC_WIRING_LINE = 'DYNAMIC_WIRING_LINE';
export const SET_MOUSE_DRAG_STATUS = 'SET_MOUSE_DRAG_STATUS';
export const STOP_EDIT_WIRING = 'STOP_EDIT_WIRING';
export const SET_BRIDGING_ROOF_AND_INVERTER = 'SET_BRIDGING_ROOF_AND_INVERTER';
export const PLACE_INVERTER = 'PLACE_INVERTER';
export const AUTO_BRIDGING = 'AUTO_BRIDGING';
export const SET_HOVER_INVERTER_CENTER = 'SET_HOVER_INVERTER_CENTER';
export const RELEASE_HOVER_INVERTER_CENTER = 'RELEASE_HOVER_INVERTER_CENTER';
export const DRAG_INVERTER = 'DRAG_INVERTER';
export const SET_HOVER_BRIDGING_POINT = 'SET_HOVER_BRIDGING_POINT';
export const RELEASE_HOVER_BRIDGING_POINT = 'RELEASE_HOVER_BRIDGING_POINT';
export const DRAG_BRIDGING_POINT = 'DRAG_BRIDGING_POINT';
export const SET_HOVER_BRIDGING_MAIN_POLYLINE = 'SET_HOVER_BRIDGING_MAIN_POLYLINE';
export const RELEASE_HOVER_BRIDGING_MAINPOLYLINE = 'RELEASE_HOVER_BRIDGING_MAINPOLYLINE';
export const COMPLEMENT_POINT_ON_BRIDGING = 'COMPLEMENT_POINT_ON_BRIDGING';

/*
  projectManager.js
 */
export const SET_GLOBAL_OPTIMAL = 'SET_GLOBAL_OPTIMAL';
export const SET_BACKENDLOADING_TRUE = 'SET_BACKENDLOADING_TRUE';
export const SET_BACKENDLOADING_FALSE = 'SET_BACKENDLOADING_FALSE';

/*
  debugRender.js
 */
export const SET_DEBUGPOINTS = 'SET_DEBUGPOINTS';
export const SET_DEBUGPOLYLINES = 'SET_DEBUGPOLYLINES';
export const SET_DEBUGPOLYGONS = 'SET_DEBUGPOLYGONS';
export const SET_DEBUGSHADOWPOLYGONS = 'SET_DEBUGSHADOWPOLYGONS';

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
export const UPDATE_SINGLE_ROOF_TOP = 'UPDATE_SINGLE_ROOF_TOP';
export const SHOW_ONLY_ONE_ROOF = 'SHOW_ONLY_ONE_ROOF';
export const SHOW_ALL_ROOF = 'SHOW_ALL_ROOF';
export const SET_HOVER_ROOFTOP_POINT = 'SET_HOVER_ROOFTOP_POINT';
export const RELEASE_HOVER_ROOFTOP_POINT = 'RELEASE_HOVER_ROOFTOP_POINT';
export const SET_PICKED_ROOFTOP_POINT = 'SET_PICKED_ROOFTOP_POINT';
export const RELEASE_PICKED_ROOFTOP_POINT = 'RELEASE_PICKED_ROOFTOP_POINT';

/**
 * editingShadowManager.js
 */
export const PROJECT_ALL_SHADOW = 'PROJECT_ALL_SHADOW';




 /**
 *  drawingSketchDiagram.js
 */
export const INIT_STAGE_SKETCH_DIAGRAM = 'INIT_STAGE_SKETCH_DIAGRAM';
export const DRAW_FLAT_BUILDING_OUTLINE = 'DRAW_FLAT_BUILDING_OUTLINE';
export const DRAW_FLAT_BUILDING_SET_BACK ='DRAW_FLAT_BUILDING_SET_BACK';
export const DRAW_SOLAR_PANEL = 'DRAW_SOLAR_PANEL';
export const DRAW_WIRING = 'DRAW_WIRING';
export const DRAW_PITCHED_BUILDING_SET_BACK = 'DRAW_PITCHED_BUILDING_SET_BACK';
export const DRAW_KEEPOUT ='DRAW_KEEPOUT';
