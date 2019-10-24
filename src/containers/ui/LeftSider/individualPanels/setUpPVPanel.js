import React from 'react';
import { connect } from 'react-redux';
import * as Cesium from 'cesium';
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

const sortByCor1 = (obj1, obj2) => {
  return (obj1.cor.lon - obj2.cor.lon);
};

const sortByCor2 = (obj1, obj2) => {
  return (obj1.cor.lat - obj2.cor.lat);
};

const sortByDist1 = (obj1, obj2) => {
  return (obj1.dist - obj2.dist);
};

export const calculateFlatRoofPanel = (
  RoofFoundLine, allKeepoutFoundLine, align, rotationAngle, panelWidth, panelLength,
  height, widthOffset, lengthOffset, panelTiltAngle, initialArraySqeuenceNum, props
) => {
  //朝向转换为 正北0度 正南180度 正东90度 正西270度 区间为-180到180度之间
  rotationAngle = -(rotationAngle + 180);
  if (rotationAngle > 180) {
    rotationAngle = rotationAngle - 360;
  }
  else if (rotationAngle < -180) {
    rotationAngle = rotationAngle + 360;
  }

  // 屋顶顶点sequence转换为顶点、朝向、边距离sequence
  const rooftopLineCollection = MathLineCollection.fromPolyline(RoofFoundLine);
  // 障碍物顶点sequence转换为顶点、朝向、边距离sequence
  const allKeepoutLineCollection = [];
  allKeepoutFoundLine.forEach(kpt =>
    allKeepoutLineCollection.push(MathLineCollection.fromPolyline(kpt))
  );

  // bounding box west, east, north, south
  const boundingWENS = MyMath.generateBoundingWENS(RoofFoundLine);
  // west - 外切矩形的西侧longitude
  // east - 外切矩形的东侧longitude
  // north - 外切矩形的北侧latitude
  // south - 外切矩形的南侧latitude
  const west = boundingWENS[0];
  const east = boundingWENS[1];
  const north = boundingWENS[2];
  const south = boundingWENS[3];

  // 太阳能板起伏角度的cos
  const panelCos = Math.cos(panelTiltAngle * Math.PI / 180.0);
  // 太阳能板起伏角度的sin
  const panelSin = Math.sin(panelTiltAngle * Math.PI / 180.0);
  // 太阳能板旋转角度cos
  const rotationCos = Math.cos(rotationAngle * Math.PI / 180.0);


  // 板斜摆之后实际对应外切矩形宽度
  let edgeLengthCorrespondingPanelWidth = panelWidth * panelCos / rotationCos;
  if (rotationAngle === 90 || rotationAngle === -90) {
    edgeLengthCorrespondingPanelWidth = panelWidth * panelCos;
  }
  // 板间距斜摆之后实际对应外切矩形宽度
  let edgeLengthCorrespondingWidthOffset = widthOffset / rotationCos;
  if (rotationAngle === 90 || rotationAngle === -90) {
    edgeLengthCorrespondingWidthOffset = widthOffset;
  }

  // 每次向下平移0.1m，最多需要测试的铺板方案数
  const maximumPlansToTry = parseInt(
    ((panelWidth * panelCos) + widthOffset) / 0.1, 10
  );

  let rotationMode = null;
  let rowDirection = null;
  //输入朝向180到90
  if (rotationAngle >= 0 && rotationAngle < 90) {
    rotationMode = 1;
    rowDirection = 180;
  }
  //输入朝向90
  else if (rotationAngle === 90) {
    rotationMode = 2;
    rowDirection = 90;
  }
  //输入朝向90到0
  else if (rotationAngle > 90 && rotationAngle < 180) {
    rotationMode = 3;
    rowDirection = 90;
  }

  //铺板数据
  let maxPanelNum = 0;
  let drawingSequence = [];

  for (let planIndex = 0; planIndex < maximumPlansToTry; planIndex++) {
    // 阵列编码
    let arraySequenceNum = initialArraySqeuenceNum;

    let breakable = 0;

    // 统计该方案总共能铺板数量
    let totalPossiblePanels = 0;
    const possibleDrawingSequence = [];

    // 北侧参考点，兼起始点
    let tempNorthCoordinate = null;
    switch (rotationMode) {
      default:
      case 1:
        tempNorthCoordinate = Coordinate.destination(
          new Coordinate(west, north, height),
          rowDirection,
          planIndex * 0.1 / rotationCos
        );
        break;
      case 2:
        tempNorthCoordinate = Coordinate.destination(
          new Coordinate(west, south, height),
          rowDirection,
          planIndex * 0.1
        );
        break;
      case 3:
        tempNorthCoordinate = Coordinate.destination(
          new Coordinate(west, south, height),
          rowDirection,
          planIndex * 0.1 / rotationCos
        );
        break;
    }
    console.log(tempNorthCoordinate)

    // 行数
    let rowNum = 0;
    while (breakable !== 2) {
      // corNorthList - 北线交点坐标array
      const corNorthList = [];
      // 计算多边形每条线与北线的交点坐标，如果存在加入到corNorthList
      rooftopLineCollection.mathLineCollection.forEach(mathLine => {
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
      // 计算每个障碍物每条线与北线的交点坐标，如果存在加入到corNorthList
      allKeepoutLineCollection.forEach(kptLineCollection =>
        kptLineCollection.mathLineCollection.forEach(mathLine => {
          const northJoint = Coordinate.intersection(
            tempNorthCoordinate, -rotationAngle + 90,
            mathLine.originCor, mathLine.brng
          );
          if (northJoint !== undefined) {
            if (Coordinate.surfaceDistance(northJoint, mathLine.originCor) <
            mathLine.dist) {
              corNorthList.push({cor:northJoint, type:'keepout'});
            }
          }
        })
      )
      // 将corNorthList里的坐标排序
      switch (rotationMode) {
        default:
        case 1:
          corNorthList.sort(sortByCor1);
          break;
        case 3:
        case 2:
          corNorthList.sort(sortByCor2);
          break;
      }
      console.log(corNorthList)
      console.log(tempNorthCoordinate)

      // 南侧参考点
      let tempSouthCoordinate = Coordinate.destination(
        tempNorthCoordinate,
        rowDirection,
        edgeLengthCorrespondingPanelWidth
      );
      // corSouthList - 南参考线交点坐标array
      const corSouthList = [];
      // 计算多边形每条线与北线的交点坐标，如果存在加入到corNorthList
      rooftopLineCollection.mathLineCollection.forEach(mathLine => {
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
      // 计算每个障碍物每条线与北线的交点坐标，如果存在加入到corSouthList
      allKeepoutLineCollection.forEach(kptLineCollection =>
        kptLineCollection.mathLineCollection.forEach(mathLine => {
          const southJoint = Coordinate.intersection(
            tempSouthCoordinate, -rotationAngle + 90,
            mathLine.originCor, mathLine.brng
          );
          if (southJoint !== undefined) {
            if (Coordinate.surfaceDistance(southJoint, mathLine.originCor) <
            mathLine.dist) {
              corSouthList.push({cor:southJoint, type:'keepout'});
            }
          }
        })
      )
      // 将corSouthList里的坐标排序
      switch (rotationMode) {
        default:
        case 1:
          corSouthList.sort(sortByCor1);
          break;
        case 3:
        case 2:
          corSouthList.sort(sortByCor2);
          break;
      }

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
          rowDirection,
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
        const corNorthLeftToSouth = Coordinate.destination(
          corNorthLeft,
          -rotationAngle + 180,
          panelWidth * panelCos
        );
        const corNorthRightToSouth = Coordinate.destination(
          corNorthRight,
          -rotationAngle + 180,
          panelWidth * panelCos
        );

        for (let f = 0; f < corSouthList.length; f += 2) {
          // corSouthLeft - 南参考线靠西的交点
          const corSouthLeft = corSouthList[f].cor;
          // corSouthRight - 南参考线靠东的交点
          const corSouthRight = corSouthList[f + 1].cor;

          // 跳过这一组坐标的条件
          // 南坐标不在北坐标的范围内
          switch (rotationMode) {
            default:
            case 1:
              if (
                (corSouthLeft.lon > corNorthRightToSouth.lon) ||
                (corSouthRight.lon < corNorthLeftToSouth.lon)
              ) continue;
              break;
            case 3:
            case 2:
              if (
                (corSouthLeft.lat > corNorthRightToSouth.lat) ||
                (corSouthRight.lat < corNorthLeftToSouth.lat)
              ) continue;
              break;
          }

          // 西-南北比较西侧最靠里的点
          let leftRefCor = null;
          switch (rotationMode) {
            default:
            case 1:
              if (corNorthLeftToSouth.lon > corSouthLeft.lon) {
                leftRefCor = corNorthLeftToSouth;
              } else {
                leftRefCor = corSouthLeft;
              }
              break;
            case 3:
            case 2:
              if (corNorthLeftToSouth.lat > corSouthLeft.lat) {
                leftRefCor = corNorthLeftToSouth;
              } else {
                leftRefCor = corSouthLeft;
              }
              break;
          }

          // 东-南北比较东侧最靠里的点
          let rightRefCor = null;
          switch (rotationMode) {
            default:
            case 1:
              if (corNorthRightToSouth.lon < corSouthRight.lon) {
                rightRefCor = corNorthRightToSouth;
              } else {
                rightRefCor = corSouthRight;
              }
              break;
            case 3:
            case 2:
              if (corNorthRightToSouth.lat < corSouthRight.lat) {
                rightRefCor = corNorthRightToSouth;
              } else {
                rightRefCor = corSouthRight;
              }
          }

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

          // 检查有没有房屋顶点或障碍物顶点在矩形内
          const allRoofLineCorInBox = [];
          rooftopLineCollection.mathLineCollection.forEach(roofLine => {
            if (MyMath.corWithinLineCollectionPolygon(
              possibleBoxLineCollection, roofLine.originCor)
            ) {
              allRoofLineCorInBox.push(roofLine.originCor)
            }
          });
          allKeepoutLineCollection.forEach(kptMathLine => {
            kptMathLine.mathLineCollection.forEach(kptLine => {
              if (MyMath.corWithinLineCollectionPolygon(
                possibleBoxLineCollection, kptLine.originCor)
              ) {
                allRoofLineCorInBox.push(kptLine.originCor)
              }
            });
          })
          const leftCors = [];
          const rightCors = [];
          const boxMidCorToSouth = Coordinate.intersection(
            Coordinate.destination(
            possibleBoxLineCollection.mathLineCollection[0].originCor,
            Coordinate.bearing(
              possibleBoxLineCollection.mathLineCollection[0].originCor,
              possibleBoxLineCollection.mathLineCollection[2].originCor
            ),
            0.5 * Coordinate.surfaceDistance(
              possibleBoxLineCollection.mathLineCollection[0].originCor,
              possibleBoxLineCollection.mathLineCollection[2].originCor
            )
          ), -rotationAngle + 180,
            possibleBoxLineCollection.mathLineCollection[0].originCor,
            -rotationAngle + 90
          );
          const distSeperation = Coordinate.surfaceDistance(
            possibleBoxLineCollection.mathLineCollection[0].originCor,
            boxMidCorToSouth
          );
          allRoofLineCorInBox.forEach(cor => {
            const corToSouth = Coordinate.intersection(
              cor, -rotationAngle + 180,
              possibleBoxLineCollection.mathLineCollection[0].originCor,
              -rotationAngle + 90
            );
            const distToMid = Coordinate.surfaceDistance(
              corToSouth, boxMidCorToSouth
            );
            if (
              Coordinate.surfaceDistance(
                corToSouth,
                possibleBoxLineCollection.mathLineCollection[0].originCor
              ) < distSeperation
            ) {
              leftCors.push({cor: corToSouth, dist: distToMid});
            } else {
              rightCors.push({cor: corToSouth, dist: distToMid});
            }
          })
          leftCors.sort(sortByDist1)
          rightCors.sort(sortByDist1)
          if (leftCors.length !== 0) {
            leftRefCor = leftCors[0].cor;
            leftRefCorToNorth = Coordinate.destination(
              leftRefCor,
              -rotationAngle,
              panelWidth * panelCos
            );
          }
          if (rightCors.length !== 0) {
            rightRefCor = rightCors[0].cor;
            rightRefCorToNorth = Coordinate.destination(
              rightRefCor,
              -rotationAngle,
              panelWidth * panelCos
            );
          }
          if(leftCors.length > 0 || rightCors.length > 0) {
            const newboxBot = new MathLine(
              leftRefCor,
              90 - rotationAngle,
              Coordinate.surfaceDistance(leftRefCor, rightRefCor)
            );
            const newboxRight = new MathLine(
              rightRefCor,
              -rotationAngle,
              Coordinate.surfaceDistance(rightRefCor, rightRefCorToNorth)
            );
            const newboxTop = new MathLine(
              rightRefCorToNorth,
              -rotationAngle - 90,
              Coordinate.surfaceDistance(rightRefCorToNorth, leftRefCorToNorth)
            );
            const newboxLeft = new MathLine(
              leftRefCorToNorth,
              -rotationAngle - 180,
              Coordinate.surfaceDistance(leftRefCorToNorth, leftRefCor)
            );
            // 可能铺板矩形四条边的顶点，朝向，距离
            possibleBoxLineCollection = new MathLineCollection(
              [newboxBot, newboxRight, newboxTop, newboxLeft]
            );
          }



          // 检查可能铺板矩形是否在房屋外部/障碍物内部，如果存在跳过该可能铺板矩形
          let midTestCor = Coordinate.destination(
            possibleBoxLineCollection.mathLineCollection[0].originCor,
            Coordinate.bearing(
              possibleBoxLineCollection.mathLineCollection[0].originCor,
              possibleBoxLineCollection.mathLineCollection[2].originCor
            ),
            0.5 * Coordinate.surfaceDistance(
              possibleBoxLineCollection.mathLineCollection[0].originCor,
              possibleBoxLineCollection.mathLineCollection[2].originCor
            )
          );
          if (!MyMath.corWithinLineCollectionPolygon(
            rooftopLineCollection, midTestCor
          )) continue;
          let boxWithinKpt = false;
          allKeepoutLineCollection.forEach(kptMathLine => {
            if (MyMath.corWithinLineCollectionPolygon(
              kptMathLine, midTestCor
            )) boxWithinKpt = true;
          })
          if (boxWithinKpt) continue;

          //检查铺板空间够不够长
          const max_horizental_dist_in_row = Coordinate.surfaceDistance(
            possibleBoxLineCollection.mathLineCollection[0].originCor,
            possibleBoxLineCollection.mathLineCollection[1].originCor
          );
          //col_check - 检查该列空间是否够放一组阵列
          const col_check = max_horizental_dist_in_row - panelLength;
          //cols - 该列能摆板的阵列数
          let cols = 0;
          if (col_check >= 0) {
            cols = parseInt(col_check / (panelLength + lengthOffset), 10) + 1;
          }

          let startingGap = null;
          if (align === 'left') {
            startingGap = 0;
          }
          else if (align === 'center') {
            startingGap = (max_horizental_dist_in_row - panelLength -
            (cols - 1) * (panelLength + lengthOffset)) / 2;
          }
          else {
            startingGap = (max_horizental_dist_in_row - panelLength -
            (cols - 1) * (panelLength + lengthOffset))
          }

          for (let c = 0; c < cols; c++) {
            totalPossiblePanels += 1;
            const PVWestCor = Coordinate.destination(
              possibleBoxLineCollection.mathLineCollection[0].originCor,
              -rotationAngle + 90,
              c * (panelLength + lengthOffset) + startingGap
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
              Point.fromCoordinate(PVWestCor, 0.01),
              Point.fromCoordinate(PVEastCor, 0.01),
              Point.fromCoordinate(PVEastNorthCor, 0.01),
              Point.fromCoordinate(PVWestNorthCor, 0.01)
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
          // 阵列编号++
          arraySequenceNum++;
        }
      }
      // 更新下一行的 tempNorthCoordinate
      tempNorthCoordinate = Coordinate.destination(
        tempSouthCoordinate, rowDirection,
        edgeLengthCorrespondingWidthOffset
      );
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
}

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
      finalCombi = geoFoundation.map(geo => {
        const diff = turf.difference(geo, keepoutCombi);
        if (typeof(diff.geometry.coordinates[0][0][0]) === 'number') {
          diff.geometry.coordinates = [diff.geometry.coordinates];
          return diff;
        } else {
          return diff;
        }
      });
    }
    else if (geoPassageKeepoutInOne.geometry.coordinates.length !== 0) {
      keepoutCombi = geoPassageKeepoutInOne;
      if(geoVentKeepoutInOne.geometry.coordinates.length !== 0) {
        keepoutCombi = turf.union(keepoutCombi, geoVentKeepoutInOne);
      }
      finalCombi = geoFoundation.map(geo => {
        const diff = turf.difference(geo, keepoutCombi);
        if (typeof(diff.geometry.coordinates[0][0][0]) === 'number') {
          diff.geometry.coordinates = [diff.geometry.coordinates];
          return diff;
        } else {
          return diff;
        }
      });
    }
    else if (geoVentKeepoutInOne.geometry.coordinates.length !== 0) {
      keepoutCombi = geoVentKeepoutInOne;
      finalCombi = geoFoundation.map(geo => {
        const diff = turf.difference(geo, keepoutCombi);
        if (typeof(diff.geometry.coordinates[0][0][0]) === 'number') {
          diff.geometry.coordinates = [diff.geometry.coordinates];
          return diff;
        } else {
          return diff;
        }
      });
    }
    else {
      finalCombi = geoFoundation
      finalCombi.forEach(geo =>
        geo.geometry.coordinates = [[...geo.geometry.coordinates]]
      );
    }
    return finalCombi;
  }

  const makeRequestData = (props) => {
    const finalCombi = makeCombiGeometry(props);
    // console.log(finalCombi)
    const requestData = []
    finalCombi.forEach(roof => {
      roof.geometry.coordinates.forEach(partialRoof => {
        // console.log(partialRoof)
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
      const output = calculateFlatRoofPanel(
        partialRoof[0], partialRoof[1], 'right', 45, 2, 1, 5, 0.1, 0, 30, 0, props
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
    initEditingPanels: (panels) => dispatch(actions.initEditingPanels(panels)),
    setDebugPolylines: (polylines) => dispatch(actions.setDebugPolylines(polylines)),
    setDebugPoints: (points) => dispatch(actions.setDebugPoints(points))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SetUpPVPanel);
