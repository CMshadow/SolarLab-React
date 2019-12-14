import * as actionTypes from '../actions/actionTypes';

import * as Cesium from 'cesium';
import { projectEverything } from '../../infrastructure/math/shadowHelper';
import Polygon from "../../infrastructure/Polygon/Polygon";
import Polyline from '../../infrastructure/line/polyline';
import Shadow from "../../infrastructure/Polygon/shadow";

export const projectAllShadow = (
  normal, tree, env, wall, foundationPolygon, sunPositionCollection
) => (dispatch, getState) => {
  const foundationHeight = getState().buildingManagerReducer.workingBuilding
    .foundationHeight;
  var list_of_shadows = projectEverything(
    normal, tree, env, wall, foundationPolygon, sunPositionCollection
  );
  var list_of_shadow_polygons = {};

  list_of_shadows.forEach(obj => {
    const shadowHier = Polygon.makeHierarchyFromGeoJSON(obj.geoJSON, foundationHeight, 0.01);
    const shadowPolygon = new Shadow(
      null, null, shadowHier, null, Cesium.Color.DARKGREY.withAlpha(0.75)
    );
    var shadow_info = {};
    shadow_info["from"] = obj.kptId;
    shadow_info["to"] = obj.foundationId;
    shadow_info["polygon"] = shadowPolygon;
    list_of_shadow_polygons[shadowPolygon.entityId] = shadow_info;
  })

  return dispatch({
    type: actionTypes.PROJECT_ALL_SHADOW,
    shadows: list_of_shadow_polygons
  });
}
