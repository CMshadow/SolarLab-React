import React from 'react';
import { connect } from 'react-redux';
import {
  Divider,
  Button
} from 'antd';
import * as turf from '@turf/turf';

import {makeUnionPolygonGeoJson} from '../../../../infrastructure/math/geoJSON';
import * as actions from '../../../../store/actions/index';
import * as MyMath from '../../../../infrastructure/math/math';
import Coordinate from '../../../../infrastructure/point/coordinate';
import MathLine from '../../../../infrastructure/math/mathLine';
import MathLineCollection from '../../../../infrastructure/math/mathLineCollection';
import Point from '../../../../infrastructure/point/point';
import Polyline from '../../../../infrastructure/line/polyline';
import FoundLine from '../../../../infrastructure/line/foundLine';
import Polygon from '../../../../infrastructure/Polygon/Polygon';
import PV from '../../../../infrastructure/Polygon/PV';

const comparator1 = (cor1, cor2) => {
  return (cor1.lon - cor2.lon);
};

const comparator2 = (cor1, cor2) => {
  return (cor1.lat - cor2.lat);
};

const sortByCor1 = (obj1, obj2) => {
  return (obj1.cor.lon - obj2.cor.lon);
};

const sortByDist1 = (obj1, obj2) => {
  return (obj1.dist - obj2.dist);
};

export const calculateFlatRoofPanelSection1 = (
  RoofFoundLine, allKeepoutFoundLine, rotationAngle, panelWidth, panelLength,
  height, widthOffset, lengthOffset, panelTiltAngle, initalArraySequenceNum
) => {

  // 屋顶顶点sequence转换为顶点、朝向、边距离sequence
  const rooftopLineCollection = MathLineCollection.fromPolyline(RoofFoundLine);
  // 障碍物顶点sequence转换为顶点、朝向、边距离sequence
  const allKeepoutLineCollection = [];
  allKeepoutFoundLine.forEach(kpt =>
    allKeepoutLineCollection.push(MathLineCollection.fromPolyline(kpt))
  );
  console.log(rooftopLineCollection)

  let maxPanelNum = 0;
  let drawingSequence = [];

  // 太阳能板起伏角度的cos
  const panelCos = Math.cos(panelTiltAngle * Math.PI / 180.0);
  // 太阳能板起伏角度的sin
  const panelSin = Math.sin(panelTiltAngle * Math.PI / 180.0);
  // 太阳能板旋转角度cos
  const rotationCos = Math.cos(rotationAngle * Math.PI / 180.0);

  // 板斜摆之后实际对应外切矩形宽度 - 双排板
  const edgeLengthCorrespondingPanelWidth = panelWidth * panelCos / rotationCos;
  // 板间距斜摆之后实际对应外切矩形宽度
  const edgeLengthCorrespondingWidthOffset = widthOffset / rotationCos;

  // 每次向下平移0.1m，最多需要测试的铺板方案数
  const maximumPlansToTry = parseInt(
    (panelWidth * panelCos) + widthOffset / 0.1, 10
  );

  // west - 外切矩形的西侧longitude
  // north - 外切矩形的北侧latitude
  // south - 外切矩形的南侧latitude
  const boundings = MyMath.generateBoundingWNES(RoofFoundLine);
  const west = boundings[0];
  const north = boundings[2];
  const south = boundings[3];

  for (let planIndex = 0; planIndex < maximumPlansToTry; planIndex++) { // maximumPlansToTry
    // 阵列编码
    let arraySequenceNum = initalArraySequenceNum;

    let breakable = 0;

    // 统计该方案总共能铺板数量
    let totalPossiblePanels = 0;
    const possibleDrawingSequence = [];

    // 北侧参考点，兼起始点
    let tempNorthCoordinate = Coordinate.destination(
      new Coordinate(west, north, height),
      0,
      planIndex * 0.1 / rotationCos
    );

    // 行数
    let rowNum = 0;
    while (breakable !== 2) {
      // corNorthList - 北线交点坐标array
      const corNorthList = [];
      // 计算多边形每条线与北线的交点坐标，如果存在加入到corNorthList
      rooftopLineCollection.mathLineCollection.forEach(mathLine => {
        // northJoint - 交点坐标，格式为[longitude，latitude]
        const northJoint = Coordinate.intersection(
          tempNorthCoordinate, -rotationAngle + 90,
          mathLine.originCor, mathLine.brng
        );
        if (northJoint !== undefined) {
          if (Coordinate.surfaceDistance(northJoint, mathLine.originCor) <
          mathLine.dist) {
            corNorthList.push({cor:northJoint, type:'wall'});
          }
        }
      });
      // 将corNorthList里的坐标从西至东排序
      corNorthList.sort(sortByCor1);

      // 南侧参考点
      let tempSouthCoordinate = Coordinate.destination(
        tempNorthCoordinate,
        180,
        edgeLengthCorrespondingPanelWidth
      );
      // corSouthList - 南参考线交点坐标array
      const corSouthList = [];
      // 计算多边形每条线与北线的交点坐标，如果存在加入到corNorthList
      rooftopLineCollection.mathLineCollection.forEach(mathLine => {
        // northJoint - 交点坐标，格式为[longitude，latitude]
        const southJoint = Coordinate.intersection(
          tempSouthCoordinate, -rotationAngle + 90,
          mathLine.originCor, mathLine.brng
        );
        if (southJoint !== undefined) {
          if (Coordinate.surfaceDistance(southJoint, mathLine.originCor) <
          mathLine.dist) {
            corSouthList.push({cor:southJoint, type:'wall'});
          }
        }
      });
      // 将corNorthList里的坐标从西至东排序
      corSouthList.sort(sortByCor1);

      // 北线有交点 & breakable = 0 -> 开始与房屋相交
      if (corNorthList.length !== 0 && breakable === 0) {
        breakable = 1;
      }
      // 北线不再有交点 & breakable = 1 -> 开始不再与房屋相交，可以不再循环
      if (corNorthList.length === 0 && breakable === 1) {
        breakable = 2;
      }

      // 如果corNorthList里面只有一个交点，则跳入下一行
      if (corNorthList.length === 1 || corSouthList.length === 1) {
        tempNorthCoordinate = Coordinate.destination(
          tempSouthCoordinate,
          180,
          edgeLengthCorrespondingWidthOffset
        );
        continue;
      }

      // 针对corNorthList中的交点，两两一组
      for (let e = 0; e < corNorthList.length; e += 2) {
        // corNorthLeft - 北参考线靠西的交点
        const corNorthLeft = corNorthList[e].cor;
        // corNorthRight - 北参考线靠东的交点
        const corNorthRight = corNorthList[e + 1].cor;

        // 将北参考线的两交点转换到南参考线的位置
        var corNorthLeftToSouth = Coordinate.destination(
          corNorthLeft,
          -rotationAngle + 180,
          panelWidth * panelCos
        );
        var corNorthRightToSouth = Coordinate.destination(
          corNorthRight,
          -rotationAngle + 180,
          panelWidth * panelCos
        );

        for (var f = 0; f < corSouthList.length; f += 2) {
          // corSouthLeft - 南参考线靠西的交点
          const corSouthLeft = corSouthList[f].cor;
          // corSouthRight - 南参考线靠东的交点
          const corSouthRight = corSouthList[f + 1].cor;

          // 跳过这一组坐标的条件
          // 南坐标不在北坐标的范围内
          if (
            (corSouthLeft.lon > corNorthRightToSouth.lon) ||
            (corSouthRight.lon < corNorthLeftToSouth.lon)
          ) {
            continue;
          }

          // 西-南北比较西侧最靠里的点
          let leftRefCor = null;
          if (corNorthLeftToSouth.lon > corSouthLeft.lon) {
            leftRefCor = corNorthLeftToSouth;
          } else {
            leftRefCor = corSouthLeft;
          }
          // DrawingHelper.generate_point_by_lon_lat_size_color(leftRefCor[0], leftRefCor[1], 10, Cesium.Color.YELLOW)

          // 东-南北比较东侧最靠里的点
          let rightRefCor = null;
          if (corNorthRightToSouth.lon < corSouthRight.lon) {
            rightRefCor = corNorthRightToSouth;
          } else {
            rightRefCor = corSouthRight;
          }
          // DrawingHelper.generate_point_by_lon_lat_size_color(rightRefCor[0], rightRefCor[1], 10, Cesium.Color.GREEN)

          let rightRefCorToNorth = Coordinate.destination(
            rightRefCor,
            -rotationAngle,
            panelWidth * panelCos
          );
          let leftRefCorToNorth = Coordinate.destination(
            leftRefCor,
            -rotationAngle,
            panelWidth * panelCos
          );
          // push([顶点坐标，朝向，边距离])
          const boxBot = new MathLine(
            leftRefCor,
            90 - rotationAngle,
            Coordinate.surfaceDistance(leftRefCor, rightRefCor)
          );
          const boxRight = new MathLine(
            rightRefCor,
            -rotationAngle,
            Coordinate.surfaceDistance(rightRefCor, rightRefCorToNorth)
          );
          const boxTop = new MathLine(
            rightRefCorToNorth,
            -rotationAngle - 90,
            Coordinate.surfaceDistance(rightRefCorToNorth, leftRefCorToNorth)
          );
          const boxLeft = new MathLine(
            leftRefCorToNorth,
            -rotationAngle - 180,
            Coordinate.surfaceDistance(leftRefCorToNorth, leftRefCor)
          );
          // 可能铺板矩形四条边的顶点，朝向，距离
          let possibleBoxLineCollection = new MathLineCollection(
            [boxBot, boxRight, boxTop, boxLeft]
          );

          // 检查有没有房屋顶点在矩形内
          rooftopLineCollection.mathLineCollection.forEach(roofLine => {
            if (MyMath.corWithinLineCollectionPolygon(
              possibleBoxLineCollection, roofLine.originCor)
            ) {
              // 稍微偏移的测试点
              const tempTestCor = Coordinate.destination(
                roofLine.originCor, roofLine.brng, 0.1
              );
              // 在矩形内房屋顶点在南线上的坐标
              var newRefCorSouth = Coordinate.intersection(
                roofLine.originCor, -rotationAngle + 180,
                leftRefCor, -rotationAngle + 90
              );
              // 在矩形内房屋顶点在北线上的坐标
              var newRefCorNorth = Coordinate.destination(
                newRefCorSouth, -rotationAngle, panelWidth * panelCos
              );

              // 将现有矩形分为左矩形
              const leftboxBot = new MathLine(
                leftRefCor,
                90 - rotationAngle,
                Coordinate.surfaceDistance(leftRefCor, newRefCorSouth)
              );
              const leftboxRight = new MathLine(
                newRefCorSouth,
                -rotationAngle,
                Coordinate.surfaceDistance(newRefCorSouth, newRefCorNorth)
              );
              const leftboxTop = new MathLine(
                newRefCorNorth,
                -rotationAngle - 90,
                Coordinate.surfaceDistance(newRefCorNorth, leftRefCorToNorth)
              );
              const leftboxLeft = new MathLine(
                leftRefCorToNorth,
                -rotationAngle - 180,
                Coordinate.surfaceDistance(leftRefCorToNorth, leftRefCor)
              );
              const leftPossibleBoxLineCollection = new MathLineCollection(
                [leftboxBot, leftboxRight, leftboxTop, leftboxLeft]
              );

              // 和右矩形
              const rightboxBot = new MathLine(
                newRefCorSouth,
                90 - rotationAngle,
                Coordinate.surfaceDistance(newRefCorSouth, rightRefCor)
              );
              const rightboxRight = new MathLine(
                rightRefCor,
                -rotationAngle,
                Coordinate.surfaceDistance(rightRefCor, rightRefCorToNorth)
              );
              const rightboxTop = new MathLine(
                rightRefCorToNorth,
                -rotationAngle - 90,
                Coordinate.surfaceDistance(rightRefCorToNorth, newRefCorNorth)
              );
              const rightboxLeft = new MathLine(
                newRefCorNorth,
                -rotationAngle - 180,
                Coordinate.surfaceDistance(newRefCorNorth, newRefCorSouth)
              );
              const rightPossibleBoxLineCollection = new MathLineCollection(
                [rightboxBot, rightboxRight, rightboxTop, rightboxLeft]
              );

              // 检测稍微偏移的测试点在左矩形还是右矩形里
              if (
                MyMath.corWithinLineCollectionPolygon(
                  leftPossibleBoxLineCollection, tempTestCor
                )
              ) {
                // 如果在左矩形 将铺板空间更新为右矩形
                possibleBoxLineCollection = rightPossibleBoxLineCollection;
                leftRefCor = newRefCorSouth;
                leftRefCorToNorth = newRefCorNorth;
              } else {
                // 否则将铺板空间更新为左矩形
                possibleBoxLineCollection = leftPossibleBoxLineCollection;
                rightRefCor = newRefCorSouth;
                rightRefCorToNorth = newRefCorNorth;
              }
            }
          });
          // DrawingHelper.generate_line_by_array_color([rightRefCor[0],rightRefCor[1],leftRefCor[0],leftRefCor[1],leftRefCorToNorth[0],leftRefCorToNorth[1],rightRefCorToNorth[0],rightRefCorToNorth[1],rightRefCor[0],rightRefCor[1]],Cesium.Color.BLACK)

          // 检测可能铺板矩形是否有内部障碍物
          // 重新整理一个可能铺板矩形的顶点坐标sequence
          const insdeBoxKeepoutCors = [];
          let saveRightRefCor = true;
          insdeBoxKeepoutCors.push({cor: leftRefCor, type: 'left'});

          // 记录在可能铺板矩形里的障碍物顶点 和 与障碍物的交点
          const insideBoxKeepout = [];
          allKeepoutLineCollection.forEach((kpt, kptIndex) => {
            // 按障碍物分组
            insideBoxKeepout.push([]);
            kpt.mathLineCollection.forEach(kptMathLine => {

              // 北线与障碍物有没有交点
              const northJoint = Coordinate.intersection(
                leftRefCorToNorth, -rotationAngle + 90,
                kptMathLine.originCor, kptMathLine.brng
              );
              if (northJoint !== undefined) {
                if (
                  Coordinate.surfaceDistance(northJoint, leftRefCorToNorth) <
                  Coordinate.surfaceDistance(leftRefCorToNorth, rightRefCorToNorth) &&
                  Coordinate.surfaceDistance(northJoint, kptMathLine.originCor) <
                  kptMathLine.dist
                ) {
                  // DrawingHelper.generate_point_by_lon_lat_size_color(northJoint[0], northJoint[1], 20, Cesium.Color.RED)
                  insideBoxKeepout[kptIndex].push({
                    cor: northJoint,
                    dist: Coordinate.surfaceDistance(northJoint, leftRefCorToNorth),
                    type: 'north'
                  });
                }
              }

              // 南线与障碍物有没有交点
              const southJoint = Coordinate.intersection(
                leftRefCor, -rotationAngle + 90,
                kptMathLine.originCor, kptMathLine.brng
              );
              if (southJoint !== undefined) {
                if (
                  Coordinate.surfaceDistance(southJoint, leftRefCor) <
                  Coordinate.surfaceDistance(leftRefCor, rightRefCor) &&
                  Coordinate.surfaceDistance(southJoint, kptMathLine.originCor) <
                  kptMathLine.dist
                ) {
                  // DrawingHelper.generate_point_by_lon_lat_size_color(southJoint[0], southJoint[1], 20, Cesium.Color.BLUE)
                  insideBoxKeepout[kptIndex].push({
                    cor: southJoint,
                    dist: Coordinate.surfaceDistance(southJoint, leftRefCor),
                    type: 'south'
                  });
                }
              }

              // 西侧与障碍物有没有交点
              const westJoint = Coordinate.intersection(
                leftRefCorToNorth, -rotationAngle + 180,
                kptMathLine.originCor, kptMathLine.brng
              );
              if (westJoint !== undefined) {
                if (
                  Coordinate.surfaceDistance(westJoint, leftRefCorToNorth) <
                  Coordinate.surfaceDistance(leftRefCorToNorth, leftRefCor) &&
                  Coordinate.surfaceDistance(westJoint, kptMathLine.originCor) <
                  kptMathLine.dist
                ) {
                  // DrawingHelper.generate_point_by_lon_lat_size_color(westJoint[0], westJoint[1], 20, Cesium.Color.RED)
                  insideBoxKeepout[kptIndex].push({
                    cor: westJoint, dist: 0, type: 'west'
                  });
                }
              }

              // 东侧与障碍物有没有交点
              const eastJoint = Coordinate.intersection(
                rightRefCorToNorth, -rotationAngle + 180,
                kptMathLine.originCor, kptMathLine.brng
              );
              if (eastJoint !== undefined) {
                if (
                  Coordinate.surfaceDistance(eastJoint, rightRefCorToNorth) <
                  Coordinate.surfaceDistance(rightRefCorToNorth, rightRefCor) &&
                  Coordinate.surfaceDistance(eastJoint, kptMathLine.originCor) <
                  kptMathLine.dist
                ) {
                  // DrawingHelper.generate_point_by_lon_lat_size_color(eastJoint[0], eastJoint[1], 20, Cesium.Color.BLUE)
                  insideBoxKeepout[kptIndex].push({
                    cor: eastJoint,
                    dist: Coordinate.surfaceDistance(rightRefCor, leftRefCor),
                    type: 'east'
                  });
                }
              }

              // 有没有障碍物顶点在可能铺板矩形里面
              if (
                MyMath.corWithinLineCollectionPolygon(
                  possibleBoxLineCollection, kptMathLine.originCor
                )
              ) {
                var intersectionCor = Coordinate.intersection(
                  kptMathLine.originCor, -rotationAngle - 90,
                  leftRefCorToNorth, -rotationAngle + 180
                );
                insideBoxKeepout[kptIndex].push({
                  cor: kptMathLine.originCor,
                  dist: Coordinate.surfaceDistance(
                    kptMathLine.originCor, intersectionCor
                  ),
                  type: 'node'
                });
                // DrawingHelper.generate_point_by_lon_lat_size_color(kptMathLine.originCor[0],kptMathLine.originCor[1],25,Cesium.Color.ORANGE)
              }
            });
            // 如果某个障碍物确定与可能铺板矩形相交或在内部
            if (insideBoxKeepout[kptIndex].length >= 2) {
              // 按照离可能铺板矩形左边的距离从近到远排序
              insideBoxKeepout[kptIndex].sort(sortByDist1);

              // 将排序后最近的点映射到南线上的坐标 加入 重新整理可能铺板矩形的顶点坐标sequence
              if (insideBoxKeepout[kptIndex][0].type === 'west') {
                // 如果在左线上
                insdeBoxKeepoutCors.splice(0, 1);
              } else if (insideBoxKeepout[kptIndex][0].type === 'south') {
                // 如果是南线交点不需要映射
                insdeBoxKeepoutCors.push({
                  cor: insideBoxKeepout[kptIndex][0].cor,
                  type: 'keepout_start'
                });
                // DrawingHelper.generate_point_by_lon_lat_size_color(insideBoxKeepout[kptIndex][0][0][0],insideBoxKeepout[kptIndex][0][0][1],20,Cesium.Color.RED)
              } else {
                // 否则映射
                insdeBoxKeepoutCors.push({
                  cor: Coordinate.intersection(
                    insideBoxKeepout[kptIndex][0].cor, -rotationAngle + 180,
                    leftRefCor, -rotationAngle + 90
                  ),
                  type: 'keepout_start'
                });
                // DrawingHelper.generate_point_by_lon_lat_size_color(lalala[0],lalala[1],20,Cesium.Color.RED)
              }

              // 将排序后最远的点映射到南线上的坐标 加入 重新整理可能铺板矩形的顶点坐标sequence
              if (insideBoxKeepout[kptIndex].slice(-1)[0].type === 'east') {
                // 如果在右线上
                saveRightRefCor = false;
              } else if (insideBoxKeepout[kptIndex].slice(-1)[0].type === 'south') {
                // 如果是南线交点不需要映射
                insdeBoxKeepoutCors.push({
                  cor: insideBoxKeepout[kptIndex].slice(-1)[0].cor,
                  type: 'keepout_end'
                });
                // DrawingHelper.generate_point_by_lon_lat_size_color(insideBoxKeepout[kptIndex][insideBoxKeepout[kptIndex].length-1][0][0],insideBoxKeepout[kptIndex][insideBoxKeepout[kptIndex].length-1][0][1],20,Cesium.Color.BLUE)
              } else {
                // 否则映射
                insdeBoxKeepoutCors.push({
                  cor: Coordinate.intersection(
                    insideBoxKeepout[kptIndex].slice(-1)[0].cor,
                    -rotationAngle + 180,
                    leftRefCor, -rotationAngle + 90
                  ),
                  type: 'keepout_end'
                });
                // DrawingHelper.generate_point_by_lon_lat_size_color(lalala[0],lalala[1],20,Cesium.Color.BLUE)
              }
            }
          });

          if (saveRightRefCor === true) {
            insdeBoxKeepoutCors.push({
              cor: rightRefCor, type: 'right'
            });
          }
          insdeBoxKeepoutCors.sort(sortByCor1);

          // 铺板空间里头点数不为2的倍数的极端情况
          if (insdeBoxKeepoutCors.length % 2 !== 0) {
            continue;
          }
          // 最终每组铺板空间
          for (
            let splitIndex = 0;
            splitIndex < insdeBoxKeepoutCors.length;
            splitIndex += 2
          ) {
            const leftToNorth = Coordinate.destination(
              insdeBoxKeepoutCors[splitIndex].cor,
              -rotationAngle,
              panelWidth * panelCos
            );
            const rightToNorth = Coordinate.destination(
              insdeBoxKeepoutCors[splitIndex+1].cor,
              -rotationAngle,
              panelWidth * panelCos,
            );

            //检查铺板空间够不够长
            const max_horizental_dist_in_row = Coordinate.surfaceDistance(
              leftToNorth, rightToNorth
            );
            // DrawingHelper.generate_line_by_array_color([insdeBoxKeepoutCors[splitIndex][0], insdeBoxKeepoutCors[splitIndex][1], insdeBoxKeepoutCors[splitIndex+1][0], insdeBoxKeepoutCors[splitIndex+1][1], rightToNorth[0], rightToNorth[1], leftToNorth[0], leftToNorth[1], insdeBoxKeepoutCors[splitIndex][0], insdeBoxKeepoutCors[splitIndex][1]],Cesium.Color.fromRandom({alpha : 1.0}))
            //col_check - 检查该列空间是否够放一组阵列
            const col_check = max_horizental_dist_in_row - panelLength;
            //cols - 该列能摆板的阵列数
            let cols = 0;
            if (col_check >= 0) {
              cols = parseInt(col_check / (panelLength + lengthOffset), 10) + 1;
            }
            for (let c = 0; c < cols; c++) {
              totalPossiblePanels += 1;
              const PVWestCor = Coordinate.destination(
                insdeBoxKeepoutCors[splitIndex].cor,
                -rotationAngle + 90,
                c * (panelLength + lengthOffset)
              );
              const PVEastCor = Coordinate.destination(
                PVWestCor, -rotationAngle + 90, panelLength
              );
              const PVWestNorthCor = Coordinate.destination(
                PVWestCor, -rotationAngle, panelWidth * panelCos
              );
              PVWestNorthCor.setCoordinate(
                null, null, height + panelSin * panelWidth
              );
              const PVEastNorthCor = Coordinate.destination(
                PVEastCor, -rotationAngle, panelWidth * panelCos
              );
              PVEastNorthCor.setCoordinate(
                null, null, height + panelSin * panelWidth
              );
              const pvPolyline = new Polyline([
                Point.fromCoordinate(PVWestCor),
                Point.fromCoordinate(PVEastCor),
                Point.fromCoordinate(PVEastNorthCor),
                Point.fromCoordinate(PVWestNorthCor)
              ])
              const pv = new PV(
                null, null, Polygon.makeHierarchyFromPolyline(pvPolyline)
              );
              let rowPos = null;
              if (c === 0 && c === cols-1) {
                rowPos = 'single'
              } else if (c === 0) {
                rowPos = 'start'
              } else if (c === cols-1) {
                rowPos = 'end'
              } else {
                rowPos = 'mid'
              }
              possibleDrawingSequence.push({
                pv:pv,
                height:height,
                rowPos: rowPos,
                sequence:arraySequenceNum,
                col:c, row:rowNum
              });
            }
          }
          // //同行不同段拥有相同array sequence num
          // if(cols > 0) arraySequenceNum+=1;
        }
      }
      // 更新下一行的 tempNorthCoordinate
      tempNorthCoordinate = Coordinate.destination(tempSouthCoordinate, 180, edgeLengthCorrespondingWidthOffset);
      // 行数++
      rowNum++;
    }
    // 判断是不是最大铺板方案
    if (totalPossiblePanels > maxPanelNum) {
      maxPanelNum = totalPossiblePanels;
      drawingSequence = possibleDrawingSequence;
    }
  }
  return [maxPanelNum, drawingSequence];
};



const SetUpPVPanel = (props) => {

  const makeCombiGeometry = (props) => {
    const geoFoundation =
      props.workingBuilding.foundationPolygonExcludeStb.map(polygon =>
        polygon.toFoundLine().makeGeoJSON()
      );
    const geoNormalKeepout =
      props.allNormalKeepout.map(kpt => kpt.keepout.outlinePolygonPart2
      .toFoundLine().makeGeoJSON())
    const geoPassageKeepout =
      props.allPassageKeepout.map(kpt => kpt.keepout.outlinePolygon
      .toFoundLine().makeGeoJSON())
    const geoVentKeepout =
      props.allVentKeepout.map(kpt => kpt.keepout.outlinePolygon.toFoundLine()
      .makeGeoJSON())
    const geoNormalKeepoutInOne = makeUnionPolygonGeoJson(geoNormalKeepout);
    const geoPassageKeepoutInOne = makeUnionPolygonGeoJson(geoPassageKeepout);
    const geoVentKeepoutInOne = makeUnionPolygonGeoJson(geoVentKeepout);

    let keepoutCombi = null;
    let finalCombi = null;
    if (geoNormalKeepoutInOne.geometry.coordinates.length !== 0) {
      keepoutCombi = geoNormalKeepoutInOne
      if(geoPassageKeepoutInOne.geometry.coordinates.length !== 0) {
        keepoutCombi = turf.union(keepoutCombi, geoPassageKeepoutInOne);
      }
      if(geoVentKeepoutInOne.geometry.coordinates.length !== 0) {
        keepoutCombi = turf.union(keepoutCombi, geoVentKeepoutInOne);
      }
      finalCombi = geoFoundation.map(geo => turf.difference(geo, keepoutCombi));
    }
    else if (geoPassageKeepoutInOne.geometry.coordinates.length !== 0) {
      keepoutCombi = geoPassageKeepoutInOne;
      if(geoVentKeepoutInOne.geometry.coordinates.length !== 0) {
        keepoutCombi = turf.union(keepoutCombi, geoVentKeepoutInOne);
      }
      finalCombi = geoFoundation.map(geo => turf.difference(geo, keepoutCombi));
    }
    else if (geoVentKeepoutInOne.geometry.coordinates.length !== 0) {
      keepoutCombi = geoVentKeepoutInOne;
      finalCombi = geoFoundation.map(geo => turf.difference(geo, keepoutCombi));
    }
    else {
      finalCombi = geoFoundation;
    }
    return finalCombi;
  }

  const makeRequestData = (props) => {
    const finalCombi = makeCombiGeometry(props);
    console.log(finalCombi)
    const requestData = []
    finalCombi.forEach(roof => {
      roof.geometry.coordinates.forEach(partialRoof => {
        console.log(partialRoof)
        const startAndLastPoint = new Point(
          partialRoof[0][0][0], partialRoof[0][0][1],
          props.workingBuilding.foundationHeight
        );
        const roofFoundLine = new FoundLine([
          startAndLastPoint,
          ...(partialRoof[0].slice(1,-1).map(cor => new Point(
            cor[0], cor[1], props.workingBuilding.foundationHeight
          ))),
          startAndLastPoint
        ]);
        const allKeepoutFoundLine = partialRoof.slice(1).map(kpt => {
          const startAndLastPoint = new Point(
            kpt[0][0], kpt[0][1], props.workingBuilding.foundationHeight
          );
          return new FoundLine([
            startAndLastPoint,
            ...(kpt.slice(1,-1).map(cor => new Point(
              cor[0], cor[1], props.workingBuilding.foundationHeight
            ))),
            startAndLastPoint
          ]);
        })
        requestData.push([roofFoundLine, allKeepoutFoundLine]);
      })
    })
    console.log(requestData)
    let panelLayout = [0,[]];
    requestData.forEach(partialRoof => {
      const output = calculateFlatRoofPanelSection1(
        partialRoof[0], partialRoof[1], 0, 2, 1, 5, 0.1, 0, 10, 0
      );
      panelLayout[0] += output[0];
      panelLayout[1] = panelLayout[1].concat(output[1]);
    })
    props.initEditingPanels(panelLayout[1]);
  }

  const testButton = (
    <Button
      type = 'danger'
      size = 'large'
      shape = 'round'
      block
      onClick = {() => {
        makeRequestData(props)
      }}
    >TEST BUTTON</Button>
  )

  return (
    <div>
      {testButton}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,
    workingBuilding: state.buildingManagerReducer.workingBuilding,
    allNormalKeepout: state.keepoutManagerReducer.normalKeepout,
    allPassageKeepout: state.keepoutManagerReducer.passageKeepout,
    allVentKeepout: state.keepoutManagerReducer.ventKeepout
  };
};

const mapDispatchToProps = dispatch => {
  return {
    initEditingPanels: (panels) => dispatch(actions.initEditingPanels(panels))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SetUpPVPanel);
