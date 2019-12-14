import * as turf from '@turf/turf';
import * as Cesium from 'cesium';
import * as martinez from 'martinez-polygon-clipping';

import * as actionTypes from '../actions/actionTypes';
import {
  shadow_vector,
  getRatio,
  projectPlaneOnAnother,
  getPlaneEquationForPoint
} from '../../infrastructure/math/shadowHelper';
import Polygon from "../../infrastructure/Polygon/Polygon";
import Polyline from '../../infrastructure/line/polyline';
import Shadow from "../../infrastructure/Polygon/shadow";
import Point from '../../infrastructure/point/point';
import FoundLine from '../../infrastructure/line/foundLine';

export const projectAllShadow = (sunPositionCollection) =>
(dispatch, getState) => {
  const normalKeepout =
    getState().undoableReducer.present.drawingKeepoutPolygonManagerReducer
    .normalKeepout;
  const treeKeepout =
    getState().undoableReducer.present.drawingKeepoutPolygonManagerReducer
    .treeKeepout;
  const envKeepout =
    getState().undoableReducer.present.drawingKeepoutPolygonManagerReducer
    .envKeepout;
  const buildingParapet =
    getState().undoableReducer.present.drawingPolygonManagerReducer
    .BuildingParapet;
  let foundationPolygons = null;
  if (getState().buildingManagerReducer.workingBuilding.type === 'FLAT') {
    foundationPolygons =
      getState().undoableReducer.present.drawingPolygonManagerReducer
      .BuildingFoundation;
  } else {
    foundationPolygons =
      getState().undoableReducer.present.drawingRooftopManagerReducer
      .RooftopCollection.rooftopCollection;
  }

  const shadowPolygons = foundationPolygons.flatMap(roofPolygon => {
    const foundationPoints = roofPolygon.convertHierarchyToPoints();
    const foundationHeight = getState().buildingManagerReducer.workingBuilding
      .foundationHeight;
    const normalKeepoutShadows = projectNormalKeepoutShadow(
      normalKeepout, foundationPoints, sunPositionCollection
    )
    return normalKeepoutShadows.map(obj => {
      const shadowHier = Polygon.makeHierarchyFromGeoJSON(
        obj.geoJSON, foundationHeight, 0.01
      );
      const shadowPolygon = new Shadow(
        null, null, shadowHier, null, Cesium.Color.DARKGREY.withAlpha(0.75)
      );
      return {
        from: obj.kptId,
        to: roofPolygon.entityId,
        polygon: shadowPolygon
      };
    })
  })
  const shadowPolygonsDict = {}
  shadowPolygons.forEach(obj =>{
    shadowPolygonsDict[obj.polygon.entityId] = obj
  });

  return dispatch({
    type: actionTypes.PROJECT_ALL_SHADOW,
    shadows: shadowPolygonsDict
  });
}

const projectNormalKeepoutShadow = (
  normalKeepout, foundationPoints, sunPositionCollection
) => {
  const all_s_vec = sunPositionCollection.map(dailySunPosition =>
    dailySunPosition.map(solar_position =>
      shadow_vector(solar_position)
    ).filter(vec => vec !== null)
  );

  const plane_equation = getPlaneEquationForPoint(
    foundationPoints[0], foundationPoints[1], foundationPoints[2]
  );

  const list_of_shadows = [];

  normalKeepout.forEach(kpt => {
    const keepoutPoints = kpt.outlinePolygon.convertHierarchyToPoints();
    const ratio = getRatio(keepoutPoints[0].lon, keepoutPoints[0].lat);
    const dailyShadow = all_s_vec.flatMap(daily_s_vec => {
      const PointCount = {};
      // 一天中每个时段一个阴影节点Points array
      const allShadowPoints = daily_s_vec.flatMap(s_vec => {
        const s_ratio = [ratio[0] * s_vec[0], ratio[1] * s_vec[1]];
        const shadow = projectPlaneOnAnother(
          keepoutPoints, foundationPoints, plane_equation, s_ratio, true
        );
        const filteredShadow = shadow.filter(s => s.length > 0);
        filteredShadow.forEach(s =>
          s.forEach(p => {
            p.getCoordinate(true) in PointCount ?
            PointCount[p.getCoordinate(true)] += 1 :
            PointCount[p.getCoordinate(true)] = 1
          })
        );
        return filteredShadow
      });
      // console.log(allShadowPoints)

      // 找当天所有阴影中的共同坐标
      const maxCountCor = Object.keys(PointCount).reduce((maxKey, key) =>
        PointCount[key] > PointCount[maxKey] ?
        key :
        maxKey
      , Object.keys(PointCount)[0]);
      // 找当天所有阴影中只出现一次坐标
      const singleCountCor = Object.keys(PointCount).reduce((acc, key) => {
        if (PointCount[key] === 1) {
          acc.push(key);
        }
        return acc;
      }, []);
      // console.log(singleCountCor)
      const fixedCountCor = Object.keys(PointCount).reduce((acc, key) => {
        if (
          PointCount[key] === PointCount[maxCountCor] &&
          key !== maxCountCor
        ) {
          acc.push(key);
        }
        return acc;
      }, []);
      // console.log(fixedCountCor)

      // 根据共同坐标重新将节点Points array排序
      const reorderedShadowPoints = allShadowPoints.map(pts => {
        const points = pts.map(p => Point.fromPoint(p))
        const matchIndex = points.reduce((matchInd, val, i) =>
          val.getCoordinate(true).toString() === maxCountCor ? i : matchInd
        , 0);
        const placeToTail = points.splice(0, matchIndex);
        const newPoints = points.slice(0, -1).concat(placeToTail);
        newPoints.push(newPoints[0]);
        return newPoints;
      });

      const complementIndexSet = new Set();
      reorderedShadowPoints.forEach(points =>
        points.forEach((p, i) => {
          if (singleCountCor.includes(p.getCoordinate(true).toString())) {
            complementIndexSet.add(i);
          }
        })
      )
      const complementIndex = [...complementIndexSet].sort();
      // console.log(complementIndex)
      const fixedIndexSet = new Set();
      reorderedShadowPoints.forEach(points =>
        points.forEach((p, i) => {
          if (fixedCountCor.includes(p.getCoordinate(true).toString())) {
            fixedIndexSet.add(i);
          }
        })
      )
      const fixedIndex = [...fixedIndexSet].sort();
      // console.log(fixedIndex)

      // console.log(reorderedShadowPoints.map(points=>Polygon.makeHierarchyFromPolyline(new Polyline(points))))
      const complementShadowPoints = [];
      complementIndex.forEach(v => {
        const vertexComboPoints = [reorderedShadowPoints[0][0]];
        fixedIndex.forEach(i => {
          if (i < v && i < reorderedShadowPoints[0].length)
            vertexComboPoints.push(reorderedShadowPoints[0][i])
        });
        reorderedShadowPoints.forEach(points => {
          if (v < points.length)
            vertexComboPoints.push(points[v]);
        })
        fixedIndex.forEach(i => {
          if (i > v && i < reorderedShadowPoints[0].length)
            vertexComboPoints.push(reorderedShadowPoints[0][i])
        });
        vertexComboPoints.push(reorderedShadowPoints[0][0]);
        // console.log(vertexComboPoints)
        if (
          vertexComboPoints.length > 4 &&
          !new Polyline(vertexComboPoints).isSelfIntersection()
        ) {
          complementShadowPoints.push(vertexComboPoints);
        }
      })
      // console.log(complementShadowPoints.map(points=>Polygon.makeHierarchyFromPolyline(new Polyline(points))))

      const allShadowGeoJSON = reorderedShadowPoints
        .map(points => new Polyline(points).makeGeoJSON());
      let combiShadow = {...allShadowGeoJSON[0]};
      allShadowGeoJSON.forEach((geoJSON, i) => {
        if (i !== 0)
        combiShadow = turf.union(combiShadow, geoJSON);
      });

      const complementGeoJSON = complementShadowPoints
        .map(points => new Polyline(points).makeGeoJSON());
      let combiShadow2 = {...complementGeoJSON[0]};
      complementGeoJSON.forEach((geoJSON, i) => {
        if (i !== 0)
        combiShadow2 = turf.union(combiShadow2, geoJSON);
      })

      let finalDailyShadow = null;
      if (Object.keys(combiShadow2).length === 0) {
        finalDailyShadow = combiShadow;
      } else {
        finalDailyShadow = turf.union(combiShadow, combiShadow2);
      }

      return finalDailyShadow;
    });

    let overallShadow = {...dailyShadow[0]};
    dailyShadow.forEach((other, i) => {
      if (i !== 0)
      overallShadow = turf.union(overallShadow, other)
    })

    const intercoordinates = martinez.intersection(
      new FoundLine(foundationPoints.concat(foundationPoints[0])).makeGeoJSON()
      .geometry.coordinates,
      overallShadow.geometry.coordinates,
    );

    intercoordinates.forEach(coordinates => {
      const toPoints = coordinates[0].map(cor => new Point(cor[0], cor[1], 0));
      list_of_shadows.push({
        geoJSON: new FoundLine(toPoints).makeGeoJSON(),
        kptId: kpt.id,
      })
    })
  })
  return list_of_shadows;
}
