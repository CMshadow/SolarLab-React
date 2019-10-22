import * as Cesium from 'cesium';

import Coordinate from '../point/coordinate';

export const coordinateToVector = (coordinate) => {
  const latRadians = Cesium.Math.toRadians(coordinate.lat);
  const lonRadians = Cesium.Math.toRadians(coordinate.lon);

  const x = Math.cos(latRadians) * Math.cos(lonRadians);
  const y = Math.cos(latRadians) * Math.sin(lonRadians);
  const z = Math.sin(latRadians);

  return [x, y, z];
};

export const vectorToCoordinate = (v, height) => {
  const latRadians = Math.atan2(v[2], Math.sqrt(v[0] * v[0] + v[1] * v[1]));
  const lonRadians = Math.atan2(v[1], v[0]);

  return new Coordinate(
    Cesium.Math.toDegrees(lonRadians),
    Cesium.Math.toDegrees(latRadians),
    height
  );
};

export const greatCircle = (coordinate, bearing) => {
  const latRadians = Cesium.Math.toRadians(coordinate.lat);
  const lonRadians = Cesium.Math.toRadians(coordinate.lon);
  const brngRadians = Cesium.Math.toRadians(bearing);

  const x = Math.sin(lonRadians) * Math.cos(brngRadians) -
    Math.sin(latRadians) * Math.cos(lonRadians) * Math.sin(brngRadians);
  const y = -Math.cos(lonRadians) * Math.cos(brngRadians) -
    Math.sin(latRadians) * Math.sin(lonRadians) * Math.sin(brngRadians);
  const z = Math.cos(latRadians) * Math.sin(brngRadians);

  return [x, y, z];
};

export const cross = (v1, v2) => {
  const x = v1[1] * v2[2] - v1[2] * v2[1];
  const y = v1[2] * v2[0] - v1[0] * v2[2];
  const z = v1[0] * v2[1] - v1[1] * v2[0];

  return [x, y, z];
};

export const dot = (v1, v2) => {
  return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
};

export const plus = (v1, v2) => {
  return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
};























// 给入 [[经度，纬度], [经度，纬度], ...]，返回[最左侧经度，最右侧经度，最北侧纬度，最南侧纬度]
export const generateBoundingWNES = (foundLine) => {
  // pointsSequence中分类东西南北坐标
  const lons = [];
  const lats = [];
  foundLine.getPointsCoordinatesArray(false).slice(0, -1).forEach(cor => {
    lons.push(cor[0]);
    lats.push(cor[1]);
  });

  // 东南西北极值
  const west = Math.min.apply(null, lons);
  const east = Math.max.apply(null, lons);
  const north = Math.max.apply(null, lats);
  const south = Math.min.apply(null, lats);
  return [west, east, north, south];
};

export const corWithinLineCollectionPolygon =
(polygonMathLineCollection, testCor) => {
  const temp = [];
  polygonMathLineCollection.mathLineCollection.forEach(mathLine => {
    const bearing = Coordinate.bearing(mathLine.originCor, testCor);
    if (bearing === mathLine.brng) return false;
    const intersectCor =
      Coordinate.intersection(mathLine.originCor, mathLine.brng, testCor, 0);
    if (intersectCor !== undefined) {
      const trueDist =
        Coordinate.surfaceDistance(mathLine.originCor, intersectCor);
      if (trueDist < mathLine.dist) temp.push(intersectCor);
    }
  });
  if (temp.length % 2 === 1) return true;
  else return false;
};

export const corCrossOverLineCollectionPolygon =
(polygonMathLineCollection, testCor, testBrng) => {
  polygonMathLineCollection.mathLineCollection.forEach(mathLine => {
    const intersectCor =
      Coordinate.intersection(
        mathLine.originCor, mathLine.brng, testCor, testBrng
      );
    if (intersectCor !== undefined) {
      const trueDist =
        Coordinate.surfaceDistance(mathLine.originCor, intersectCor);
      if (trueDist < mathLine.dist & !Coordinate.isEqual(intersectCor, mathLine.originCor) & !Coordinate.isEqual(intersectCor, testCor)) return true;
    }
  });
  return false;
};
