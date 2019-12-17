import * as turf from '@turf/turf';
import * as Cesium from 'cesium';
import * as martinez from 'martinez-polygon-clipping';

import * as actionTypes from '../actions/actionTypes';
import {
  shadow_vector,
  getRatio,
  projectPlaneOnAnother,
  getPlaneEquationForPoint,
  generateTreePolygon,
  projectTreeOnPlane
} from '../../infrastructure/math/shadowHelper';
import Polygon from "../../infrastructure/Polygon/Polygon";
import Polyline from '../../infrastructure/line/polyline';
import Shadow from "../../infrastructure/Polygon/shadow";
import Point from '../../infrastructure/point/point';
import FoundLine from '../../infrastructure/line/foundLine';
import normalKeepout from '../../infrastructure/keepout/normalKeepout';

const convertParapetToNormalKeepout = (buildingParapet) => {
  //女儿墙转换为普通障碍物
  const parapetToNormalKeepout = [];
  for (let seg = 0; seg < buildingParapet.maximumHeight.length - 1; seg++){
    const startPoint = new Point(
      buildingParapet.positions[seg * 2],
      buildingParapet.positions[seg * 2 + 1],
      buildingParapet.maximumHeight[seg]
    );
    const endPoint = new Point(
      buildingParapet.positions[seg * 2 + 2],
      buildingParapet.positions[seg * 2 + 3],
      buildingParapet.maximumHeight[seg + 1]
    );
    const offsetStartPoint = Point.destination(
      startPoint, Point.bearing(startPoint, endPoint) + 90, 0.01
    );
    const offsetEndPoint = Point.destination(
      endPoint, Point.bearing(startPoint, endPoint) + 90, 0.01
    );
    const hierarchy = Polygon.makeHierarchyFromPolyline(
      new FoundLine([
        startPoint, endPoint, offsetEndPoint, offsetStartPoint, startPoint
      ])
    );
    parapetToNormalKeepout.push(new normalKeepout(
      buildingParapet.entityId, null, null, null, null, null, null,
      new Polygon(null, null, null, hierarchy)
    ));
  }
  return parapetToNormalKeepout;
}

export const projectAllShadow = (sunPositionCollection) =>
(dispatch, getState) => {
  const buildingType = getState().buildingManagerReducer.workingBuilding.type
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
  if (buildingType === 'FLAT') {
    foundationPolygons =
      getState().undoableReducer.present.drawingPolygonManagerReducer
      .BuildingFoundation;
  } else {
    foundationPolygons =
      getState().undoableReducer.present.drawingRooftopManagerReducer
      .RooftopCollection.rooftopCollection;
  }
  const foundationHeight = getState().buildingManagerReducer.workingBuilding
    .foundationHeight;

  // 女儿墙转换为普通障碍物
  const wallKeepout =
    buildingType === 'PITCHED' ||
    buildingParapet.maximumHeight[0] === buildingParapet.minimumHeight[0] ?
    [] :
    convertParapetToNormalKeepout(buildingParapet);

  const shadowPolygons = foundationPolygons.flatMap(roofPolygon => {
    const foundationPoints = roofPolygon.convertHierarchyToPoints();

    const roofAllShadows = [];
    const normalKeepoutShadows = projectKeepoutShadow(
      normalKeepout, foundationPoints, sunPositionCollection, 'normal'
    );
    const envKeepoutShadows = projectKeepoutShadow(
      envKeepout, foundationPoints, sunPositionCollection, 'env'
    );
    const wallKeepoutShadow = projectKeepoutShadow(
      wallKeepout, foundationPoints, sunPositionCollection, 'wall'
    );
    const trimedWallShadows = trimWallShadows(wallKeepoutShadow);
    console.log(trimedWallShadows)

    // 所有阴影geoJSON转Shadow polygon
    normalKeepoutShadows.concat(envKeepoutShadows).concat(trimedWallShadows)
    .forEach(obj => {
      let shadowHier = null;
      if (buildingType === 'FLAT') {
        const shadowPoints = new Shadow(
          null, null, Polygon.makeHierarchyFromGeoJSON(obj.geoJSON)
        ).convertHierarchyToPoints();
        shadowHier = Polygon.makeHierarchyFromPolyline(
          new Polyline(shadowPoints), foundationHeight, 0.015
        );
      } else {
        const shadowPoints = new Shadow(
          null, null,Polygon.makeHierarchyFromGeoJSON(obj.geoJSON)
        ).convertHierarchyToPoints();
        const newHeights = shadowPoints.map(p =>
          Point.heightOfArbitraryNode(roofPolygon, p) + foundationHeight
        );
        shadowPoints.forEach((p, i) =>
          p.setCoordinate(null, null, newHeights[i])
        );
        shadowHier = Polygon.makeHierarchyFromPolyline(
          new Polyline(shadowPoints), null, 0.015
        );
      }
      console.log(shadowHier)
      roofAllShadows.push({
        from: obj.kptId,
        to: roofPolygon.entityId,
        polygon: new Shadow(null, null,
          shadowHier, null, Cesium.Color.DARKGREY.withAlpha(0.75)
        )
      });
    });

    return roofAllShadows;
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

const projectKeepoutShadow = (
  keepout, foundationPoints, sunPositionCollection, keepoutType
) => {
  const all_s_vec = sunPositionCollection.map(dailySunPosition =>
    dailySunPosition.map(solar_position =>
      shadow_vector(solar_position)
    ).filter(vec => vec !== null)
  );

  const plane_equation = getPlaneEquationForPoint(
    foundationPoints[0], foundationPoints[1], foundationPoints[2]
  );

  const keepoutAllShadows = [];

  keepout.forEach(kpt => {
    let keepoutPoints = [];
    let ratio = null;
    let treeCenter = null;
    let treeRadius = null;
    switch (keepoutType) {
      default:
      case 'normal':
      case 'env':
      case 'wall':
        keepoutPoints = kpt.outlinePolygon.convertHierarchyToPoints();
        ratio = getRatio(keepoutPoints[0].lon, keepoutPoints[0].lat);
        break

      case 'tree':
        treeCenter = kpt.outlinePolygon.centerPoint;
        treeRadius = kpt.radius;
        ratio = getRatio(treeCenter.lon, treeCenter.lat);
    }

    const dailyShadow = all_s_vec.flatMap(daily_s_vec => {
      let allShadowPoints = null;
      switch (keepoutType) {
        default:
        case 'normal':
        case 'env':
        case 'wall':
          allShadowPoints = normalKeepoutDailyShadow(
            keepoutPoints, foundationPoints, plane_equation, daily_s_vec, ratio
          );
          break;

        case 'tree':
          allShadowPoints = treeKeepoutDailyShadow(
            keepoutPoints, foundationPoints, plane_equation, daily_s_vec, ratio,
            treeCenter, treeRadius
          );
      }

      const allShadowGeoJSON = allShadowPoints
        .map(points => new Polyline(points).makeGeoJSON());
      if(allShadowGeoJSON.length !== 0) {
        console.log('turf1')
        console.log(allShadowGeoJSON)
        return turf.union(...allShadowGeoJSON);
      } else {
        return {};
      }
    }).filter(s => Object.keys(s).length !== 0);
    let overallShadow = {};
    if(dailyShadow.length !== 0) {
      console.log('turf2')
      console.log(dailyShadow)
      overallShadow = turf.union(...dailyShadow)
    }

    if (
      Object.keys(overallShadow).length !== 0 &&
      overallShadow.geometry.coordinates[0].length > 1
    ) {
      const intercoordinates = martinez.intersection(
        new FoundLine(foundationPoints.concat(foundationPoints[0])).makeGeoJSON()
        .geometry.coordinates,
        overallShadow.geometry.coordinates,
      );

      if (intercoordinates) {
        intercoordinates.forEach(coordinates => {
          const toPoints = coordinates[0].map(cor => new Point(cor[0], cor[1], 0));
          const beaitifiedPoints = beautifyPoints(toPoints)
          keepoutAllShadows.push({
            geoJSON: new FoundLine(beaitifiedPoints).makeGeoJSON(),
            kptId: kpt.id,
          })
        })
      }
    }
  })
  return keepoutAllShadows;
}

const beautifyPoints = (points, angleBar=30, distBar=0.1) => {
  const newPoints = [points[0]]
  let currentStart = points[0];

  points.slice(1).forEach((p,i) => {
    if (Point.surfaceDistance(currentStart, p) > distBar) {
      newPoints.push(p);
      currentStart = Point.fromPoint(p);
    }
  })
  return newPoints;
}

const normalKeepoutDailyShadow = (
  keepoutPoints, foundationPoints, plane_equation, daily_s_vec, ratio
) => {
  const PointCount = {};
  // 一天中每个时段一个阴影节点Points array
  const allShadowPoints = daily_s_vec.flatMap(s_vec => {
    const s_ratio = [ratio[0] * s_vec[0], ratio[1] * s_vec[1]];
    const shadow = projectPlaneOnAnother(
      keepoutPoints, foundationPoints, plane_equation, s_ratio, true
    ).filter(s => s.length > 0);
    shadow.forEach(s =>
      s.forEach(p => {
        p.getCoordinate(true) in PointCount ?
        PointCount[p.getCoordinate(true)] += 1 :
        PointCount[p.getCoordinate(true)] = 1
      })
    );
    return shadow.filter(s => s.length > 0);
  });

  const complementShadowPoints =
    findComplementShadowPoints(allShadowPoints, PointCount);

  return allShadowPoints.concat(complementShadowPoints);
}

const treeKeepoutDailyShadow = (
  keepoutPoints, foundationPoints, plane_equation, daily_s_vec, ratio,
  treeCenter, treeRadius
) => {
  const allShadowPoints = daily_s_vec.flatMap(s_vec => {
    const s_ratio = [ratio[0] * s_vec[0], ratio[1] * s_vec[1]];
    const treePoints = generateTreePolygon(treeCenter, treeRadius, s_ratio, s_vec);
    const trunkPoints = generateTreePolygon(treeCenter, treeRadius / 10, s_ratio, s_vec);
    const shadow = projectTreeOnPlane(
      treeCenter, treePoints, trunkPoints, foundationPoints, plane_equation, s_ratio
    );
    const filteredShadow = shadow.filter(s => s.length > 0);
    return filteredShadow
  });
  return {
    allShadowPoints: allShadowPoints
  };
}

const findComplementShadowPoints = (allShadowPoints, PointCount) => {
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
  const fixedCountCor = Object.keys(PointCount).reduce((acc, key) => {
    if (
      PointCount[key] === PointCount[maxCountCor] &&
      key !== maxCountCor
    ) {
      acc.push(key);
    }
    return acc;
  }, []);

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
  const fixedIndexSet = new Set();
  reorderedShadowPoints.forEach(points =>
    points.forEach((p, i) => {
      if (fixedCountCor.includes(p.getCoordinate(true).toString())) {
        fixedIndexSet.add(i);
      }
    })
  )
  const fixedIndex = [...fixedIndexSet].sort();

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
    if (
      vertexComboPoints.length > 4 &&
      !new Polyline(vertexComboPoints).isSelfIntersection()
    ) {
      complementShadowPoints.push(vertexComboPoints);
    }
  })

  return complementShadowPoints;
}

const trimWallShadows = (wallKeepoutShadow) => {
  console.log(wallKeepoutShadow)
  // 再不闭环的情况下尽可能将女儿墙阴影进行union
  const trimedWallShadows = [];
  let combiWallKeepoutShadow = wallKeepoutShadow[0].geoJSON
  wallKeepoutShadow.forEach((obj, i) => {
    if (i !== 0) {
      console.log(Polygon.makeHierarchyFromGeoJSON(combiWallKeepoutShadow))
      console.log(Polygon.makeHierarchyFromGeoJSON(obj.geoJSON))
      const temp = turf.union(combiWallKeepoutShadow, obj.geoJSON);
      console.log(temp)
      if (temp.geometry.coordinates.length > 1) {
        trimedWallShadows.push(combiWallKeepoutShadow);
        combiWallKeepoutShadow = obj.geoJSON;
      } else {
        combiWallKeepoutShadow = temp;
      }
    }
  })
  trimedWallShadows.push(combiWallKeepoutShadow)
  console.log(trimedWallShadows)

  // union后每个女儿墙阴影取difference避免阴影重贴
  const newTrimedWallShadows = [];
  trimedWallShadows.forEach((shadow, i) => {
    let toCut = {...shadow};
    const tempArray = newTrimedWallShadows.slice(0, i)
      .concat(trimedWallShadows.slice(i+1));
    let othercombi = tempArray[0];
    tempArray.forEach((compare, j) => {
      othercombi = turf.union(othercombi, compare)
    });
    if (othercombi) toCut = turf.difference(toCut, othercombi);
    if (toCut) {
      if (toCut.geometry.type === 'MultiPolygon') {
        toCut.geometry.coordinates.forEach(array => {
          newTrimedWallShadows.push({
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: array
            }
          });
        })
      } else {
        newTrimedWallShadows.push(toCut)
      }
    }
  })
  console.log(newTrimedWallShadows)

  // 所有阴影geoJSON转Shadow polygon
  const finalWallShadows = newTrimedWallShadows.map(obj => {
    return({
      geoJSON: obj,
      kptId: wallKeepoutShadow[0].kptDd,
    });
  });
  console.log(finalWallShadows)
  return finalWallShadows;
}
