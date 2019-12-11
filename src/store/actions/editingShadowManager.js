import * as actionTypes from '../actions/actionTypes';

import * as Cesium from 'cesium';
import { projectEverything } from '../../infrastructure/math/shadowHelper';
import Polygon from "../../infrastructure/Polygon/Polygon";
import Polyline from '../../infrastructure/line/polyline';
import Shadow from "../../infrastructure/Polygon/shadow";

export const projectAllShadow = (allKptList, allTreeList, wall, foundationPolygon) => {

  var list_of_shadows = projectEverything(allKptList, allTreeList, wall, foundationPolygon);
  var list_of_shadow_polygons = {};

  for (var i = 0; i < list_of_shadows.length; ++i) {
      var shadow_line = new Polyline(list_of_shadows[i][0]);
      const shadowHier = Polygon.makeHierarchyFromPolyline(shadow_line, null, 0.015);
      const shadowPolygon = new Shadow(
          null, null, shadowHier, null, Cesium.Color.DARKGREY.withAlpha(0.75)
      );
      var shadow_info = {};
      shadow_info["from"] = list_of_shadows[i][1];
      shadow_info["to"] = list_of_shadows[i][2];
      shadow_info["polygon"] = shadowPolygon;
      list_of_shadow_polygons[shadowPolygon.entityId] = shadow_info;
  }

  return {
    type: actionTypes.PROJECT_ALL_SHADOW,
    shadows: list_of_shadow_polygons
  };
}
