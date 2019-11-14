import * as actionTypes from './actionTypes';
import Node from '../../infrastructure/edgesMap/node/node';
import Edge from '../../infrastructure/edgesMap/edge/edge';
import EdgesMap from '../../infrastructure/edgesMap/edgesMap';
import * as MathHelper from '../../infrastructure/math/RoofTop_MathHelper';
import * as MathCoordHelp from '../../infrastructure/math/math';
import Coordinate from '../../infrastructure/point/coordinate';
import  * as Cesium from 'cesium';

export const initEdgesMap = () => {
  return({
    type: actionTypes.INIT_EDGES_MAP
  });
};


export const build3DRoofTopModeling = () => (dispatch, getState) => {
  let buildingOutline = getState().undoableReducer.present.drawingManagerReducer.drawingPolyline.getPointsCoordinatesArray();
  let buildingCoordinatesSize = buildingOutline.length;
  buildingOutline.splice(buildingCoordinatesSize - 3,3);
  const polylinesRelation = getState().undoableReducer.present.drawingInnerManagerReducer.pointsRelation;
  const foundPolylines = getState().undoableReducer.present.drawingInnerManagerReducer.foundPolylines;
  const hipPolylines = getState().undoableReducer.present.drawingInnerManagerReducer.hipPolylines;
  const ridgePolylines = getState().undoableReducer.present.drawingInnerManagerReducer.ridgePolylines;
  let newNodeCollection = [];
  let newInnerEdgeCollection = [];
  let newOuterEdgeCollection = [];
  let pathInformationCollection = [];

  initNodesCollection(buildingOutline, newNodeCollection, newOuterEdgeCollection);
  newInnerEdgeCollection = initEdgeMap(polylinesRelation, newNodeCollection, foundPolylines, hipPolylines, ridgePolylines).newInnerEdgeCollection;
  pathInformationCollection = searchAllRoofPlanes(newInnerEdgeCollection,newOuterEdgeCollection,newNodeCollection).pathCollection;
 
  return dispatch({
    type: actionTypes.BUILD_3D_ROOFTOP_MODELING,
    nodesCollection: newNodeCollection,
    OuterEdgesCollection: newOuterEdgeCollection,
    InnerEdgeCollection: newInnerEdgeCollection,
    AllRoofPlanePaths: pathInformationCollection
  });
}

export const initNodesCollection = (buildingOutline, newNodeCollection, newOuterEdgeCollection) => {

  // Build outer edges-points relations
  for (let i = 0; i < buildingOutline.length; i+=3) {
    newNodeCollection.push(new Node(null, buildingOutline[i], buildingOutline[i + 1], 5, 0 ));
  }

  for (let noteIndex = 0; noteIndex < newNodeCollection.length; ++noteIndex) {
    if (noteIndex === (newNodeCollection.length - 1) ) {
      newOuterEdgeCollection.push(new Edge(noteIndex, 0, null, null, "OuterEdge", newNodeCollection[noteIndex], newNodeCollection[0] ));
      newNodeCollection[noteIndex].addChild(0);
      newNodeCollection[0].addChild(noteIndex);
    } else {
      newOuterEdgeCollection.push(new Edge(noteIndex, noteIndex + 1, null, null, "OuterEdge", newNodeCollection[noteIndex], newNodeCollection[noteIndex + 1]) );
      newNodeCollection[noteIndex].addChild(noteIndex+1);
      newNodeCollection[noteIndex+1].addChild(noteIndex);
    }
  }

  return ({
    type: actionTypes.INIT_NODES_COLLECTION,
    nodesCollection: newNodeCollection,
    OuterEdgesCollection: newOuterEdgeCollection
  });
}

export const initEdgeMap = (polylinesRelation, newNodeCollection, foundPolylines, hipPolylines, ridgePolylines) => {
  let hipCollecton = [];
  let ridgeCollection = [];
  let newInnerEdgeCollection = [];
  // Build inner edges-points relations
  Object.keys(polylinesRelation).forEach(function(key) {
    if (polylinesRelation[key]['type'] === "IN") {
      newNodeCollection.push(new Node(null, polylinesRelation[key]['object']['lon'], polylinesRelation[key]['object']['lat'], 7, 1 ));
    }
  });
  Object.keys(polylinesRelation).forEach(function(key) {
    let startNode = null;
    let endNode = null;
    let indexStart = null;
    let indexEnd = null;
    if (polylinesRelation[key]['type'] === "OUT") {
      startNode = new Node(null, polylinesRelation[key]['object']['lon'], polylinesRelation[key]['object']['lat'], 5, 0 );
      for (let i = 0; i < polylinesRelation[key]['connectPolyline'].length; ++i) {
        if (polylinesRelation[key]['connectPolyline'][i]['type'] === 'HIP') {
          endNode = (polylinesRelation[key]['connectPolyline'][i]['points'][0]['lon'] === startNode.lon 
          && polylinesRelation[key]['connectPolyline'][i]['points'][0]['lat'] === startNode.lat) ? 
          polylinesRelation[key]['connectPolyline'][i]['points'][1] : polylinesRelation[key]['connectPolyline'][i]['points'][0];
        } 
        if (startNode !== null && endNode !== null ) {
          indexStart = MathHelper.findNodeIndex(newNodeCollection, startNode.lon, startNode.lat);
          indexEnd = MathHelper.findNodeIndex(newNodeCollection, endNode['lon'], endNode['lat']);
          newInnerEdgeCollection.push(new Edge(indexStart, indexEnd, null, null, "Hip" ,newNodeCollection[indexStart], newNodeCollection[indexEnd] ));
          newNodeCollection[indexStart].addChild(indexEnd);
          newNodeCollection[indexEnd].addChild(indexStart);
        } 
      }
    }
  });

  Object.keys(ridgePolylines).forEach(function(key) {
  
    let startNode = new Node(null, ridgePolylines[key]['points'][0]['lon'], ridgePolylines[key]['points'][0]['lat'], 7, 1 );
    let endNode = new Node(null, ridgePolylines[key]['points'][1]['lon'], ridgePolylines[key]['points'][1]['lat'], 7, 1 );
    if (startNode !== null && endNode !== null ) {
      let indexStart = MathHelper.findNodeIndex(newNodeCollection, startNode.lon, startNode.lat);
      let indexEnd = MathHelper.findNodeIndex(newNodeCollection, endNode.lon, endNode.lat);
      newInnerEdgeCollection.push(new Edge(indexStart, indexEnd, null, null, "Ridge" ,newNodeCollection[indexStart], newNodeCollection[indexEnd]));
      newNodeCollection[indexStart].addChild(indexEnd);
      newNodeCollection[indexEnd].addChild(indexStart);
    } 

  });

  return ({
    newNodeCollection: newNodeCollection,
    newInnerEdgeCollection: newInnerEdgeCollection
  })
}


export const searchAllRoofPlanes = (InnerEdgeCollection, OuterEdgesCollection, NodesCollection) => {
  
  let pathInformationCollection = [];
  let path = MathHelper.searchAllPossibleRoofTops([InnerEdgeCollection,OuterEdgesCollection],NodesCollection);
  for (let i = 0; i < path.length; ++i) {
    let pathParameters = {
      roofPlaneCoordinateArray: [],
      roofPlaneParameters: null,
      roofHighestLowestNodes: null,
      roofEdgesTypeList: null
    };
    pathParameters.roofPlaneParameters = [...calculateObliquityAndObliquity(NodesCollection, path[i]).roofPlaneParameters];
    pathParameters.roofEdgesTypeList = [...checkEdgeTypeOfPath(path[i], NodesCollection, OuterEdgesCollection, InnerEdgeCollection).edgeTypeList];
    // console.log("Roof Edge Type: "+ pathParameters.roofEdgesTypeList )
    for (let nodeIndex of path[i]) {
      pathParameters.roofPlaneCoordinateArray.push(NodesCollection[nodeIndex].lon);
      pathParameters.roofPlaneCoordinateArray.push(NodesCollection[nodeIndex].lat);
      pathParameters.roofPlaneCoordinateArray.push(NodesCollection[nodeIndex].height);
    }
    pathParameters.roofHighestLowestNodes = calculateHighestandLowestNodes(pathParameters.roofPlaneCoordinateArray).highestAndLowestNodes;
    pathInformationCollection.push(pathParameters);

  }
  
  return({
    type: actionTypes.SEARCH_ALL_ROOF_PLANES,
    pathCollection: pathInformationCollection
  });
}

export const calculateObliquityAndObliquity = (NodesCollection, path) => {
  let startNode = null;
  let endInnerNode = null;
  let endOuterNode = null;
  let roofBrng = null;
  let obliquity = null;
  console.log("path: "+path);
  for (let i = 0; i < path.length; ++i) {
    let nodeIndex = path[i];
    // console.log("node type: "+nodeIndex +" -> "+NodesCollection[nodeIndex].bound);
    if (NodesCollection[nodeIndex].bound === 0) {
      
      if (i === 0) {
        if (NodesCollection[path[i + 1]].bound === 1 && NodesCollection[path[path.length - 1]].bound === 0) {
          startNode = NodesCollection[nodeIndex];
          endInnerNode = NodesCollection[path[i + 1]];
          endOuterNode = NodesCollection[path[path.length - 1]];
          // direction = "endToStart";
          // console.log('check: '+ path[i + 1] + " - " + nodeIndex + ' - ' + path[path.length - 1] + direction)
          break;
        } else if (NodesCollection[path[i + 1]].bound === 0 && NodesCollection[path[path.length - 1]].bound === 1) {
          startNode = NodesCollection[nodeIndex];
          endOuterNode = NodesCollection[path[i + 1]];
          endInnerNode = NodesCollection[path[path.length - 1]];
          // direction = "startToEnd";
          // console.log('check: '+ path[path.length - 1] + " - " + nodeIndex + ' - ' + path[i + 1] + direction)
          break;
        }
      } 
      
      else {
        if (NodesCollection[path[i + 1]].bound === 1 && NodesCollection[path[i - 1]].bound === 0) {
          startNode = NodesCollection[nodeIndex];
          endInnerNode = NodesCollection[path[i + 1]];
          endOuterNode = NodesCollection[path[i - 1]];
          // direction = "endToStart";
          // console.log('check: '+ path[i + 1] + " - " + nodeIndex + ' - ' + path[i - 1] + direction)
          break;
        } else if (NodesCollection[path[i + 1]].bound === 0 && NodesCollection[path[i - 1]].bound === 1) {
          startNode = NodesCollection[nodeIndex];
          endOuterNode = NodesCollection[path[i + 1]];
          endInnerNode = NodesCollection[path[i - 1]];
          // direction = "startToEnd";
          // console.log('check: '+ path[i - 1] + " - " + nodeIndex + ' - ' + path[i + 1] + direction)
          break;
        }
      }
    }
  }
  if (startNode !== null && endInnerNode !== null && endOuterNode !== null) {
    
    let endInnerCoord =new Coordinate(endInnerNode.lon, endInnerNode.lat, endInnerNode.height);
    let startCoord = new Coordinate(startNode.lon, startNode.lat, startNode.height);
    let endOuterCoord= new Coordinate(endOuterNode.lon, endOuterNode.lat, endOuterNode.height);
    let brng = null;
    let dist = null;
    let shortestDist = null;
    let possibleInter1 = null;
    let possibleInter2 = null;
    let possibleBrng1 = null;
    let possibleBrng2 = null;
    
    
    // if (direction === "startToEnd") {
    brng = Coordinate.bearing(startCoord, endOuterCoord);
    dist = Coordinate.surfaceDistance(startCoord, endOuterCoord);
    possibleBrng1 = brng + 90;
    possibleBrng2 = brng - 90;
    possibleInter1 = Coordinate.intersection(startCoord, brng, endInnerNode, possibleBrng1 );
    possibleInter2 = Coordinate.intersection(startCoord, brng, endInnerNode, possibleBrng2 );
    // }
  
    // console.log("endInner node " + JSON.stringify(endInnerCoord));
    // console.log("start node " + JSON.stringify(startCoord));
    // console.log("endOut node " + JSON.stringify(endOuterCoord));

    if (possibleInter1 === undefined) {
      roofBrng = possibleBrng2;
      shortestDist = Coordinate.surfaceDistance(endInnerCoord, possibleInter2);
    } else if (possibleInter2 === undefined) {
      roofBrng = possibleBrng1;
      shortestDist = Coordinate.surfaceDistance(endInnerCoord, possibleInter1);
    } else {
      if (Coordinate.surfaceDistance(startCoord, possibleInter1) < Coordinate.surfaceDistance(startCoord, possibleInter2)) {
        roofBrng = possibleBrng1;
        shortestDist = Coordinate.surfaceDistance(endInnerCoord, possibleInter1);
      } else {
        roofBrng = possibleBrng2;
        shortestDist = Coordinate.surfaceDistance(endInnerCoord, possibleInter2);
      }
    }
    obliquity = Math.atan2(endInnerNode.height - startNode.height, shortestDist) * 180 / Math.PI;
    
    console.log("brng: "+ roofBrng);
    console.log("obliquity: "+ obliquity);

  }
  return({
    type: actionTypes.CALCULATE_OBLIQUITY_And_BREAING,
    roofPlaneParameters: [roofBrng, obliquity]
  }); 
}


export const calculateHighestandLowestNodes = (path) => {
  let hightest = {
    height: Number.MIN_VALUE,
    index: null,
    coordinate: null
  };
  let lowest = {
    height: Number.MAX_VALUE,
    index: null,
    coordinate: null
  };
  for (let i = 2; i < path.length; i+=3) {
    if (path[i] > hightest.height) {
      hightest.height = path[i];
      hightest.index = i;
    }
    if (path[i] < lowest.height) {
      lowest.height = path[i];
      lowest.index = i;
    }
  }
  return({
    type: actionTypes.CALCULATE_HIGHEST_LOWEST_NODES,
    highestAndLowestNodes: [[path[hightest.index - 2],path[hightest.index - 1], path[hightest.index - 0] ],
          [path[lowest.index - 2],path[lowest.index - 1], path[lowest.index - 0] ]]
  }); 
}

export const checkEdgeTypeOfPath = (path, NodesCollection ,OuterEdgesCollection, InnerEdgeCollection) => {
  let edgeTypeList = [];
  for (let nodeIndex = 0; nodeIndex < path.length; ++nodeIndex) {
    let startNode = path[nodeIndex];
    let endNode = null;
    if (nodeIndex === path.length - 1) {
      endNode = path[0];
    } else {
      endNode = path[nodeIndex + 1];
    }
    if (NodesCollection[startNode].bound + NodesCollection[endNode].bound === 0) {

      for (let edge of OuterEdgesCollection) {
        // console.log('compare out: ' + startNode + " - " + edge.startNode + ', and ' + endNode + ' - ' + edge.endNode)
        if ( (startNode === edge.startNode && endNode === edge.endNode) 
            || (startNode === edge.endNode && endNode === edge.startNode) ) {
          edgeTypeList.push(edge);
        }
      }
    } else {
        for (let edge of InnerEdgeCollection) {
          // console.log('compare in: ' + startNode + " - " + edge.startNode + ', and ' + endNode + ' - ' + edge.endNode)
          if ( (startNode === edge.startNode && endNode === edge.endNode) 
          || (startNode === edge.endNode && endNode === edge.startNode) ) {
            edgeTypeList.push(edge);
          }
        }
    }

  }
  return({
    type: actionTypes.CHECK_EDGE_TYPE_OF_PATH,
    edgeTypeList: edgeTypeList
  }); 
}

/**
   * the possible intersection Coordinate of two Coordinates traveling towards
   * @param  {Number}  roofIndex  the number that indicates the index of the specific polygon that represents an rooftop
   * @param  {Number}  newHighest the new top height of this selected polygon
   * @param  {Number}  newLowest  the new foundation height of this selected polygon
   */
  
// 非完美版： 暂时只支持内点高度一致的屋顶面， 待优化
 
export const updateSingleRoofTop = (roofIndex, newLowest, newHighest) => (dispatch, getState) => {
  let workingRoofTopCollection = getState().undoableReducer.present.drawingRooftopManagerReducer.RooftopCollection;
  console.log("original hierarchy: " + workingRoofTopCollection.rooftopCollection[roofIndex].hierarchy);
  //第 index 个 polygon
  for (let index = 0; index < workingRoofTopCollection.rooftopCollection[roofIndex].edgesCollection.length; ++index ) {
    // 每一个 edge
    let currentEdge =workingRoofTopCollection.rooftopCollection[roofIndex].edgesCollection[index];
    console.log('show edges: ' + currentEdge.type)
    console.log('start para: ' + currentEdge.startNodePara.height)
    console.log('end para: ' + currentEdge.endNodePara.height)
    console.log('----------------------')
    // 更新 坐标
    if (currentEdge.type === 'Hip') {
      if (workingRoofTopCollection.rooftopCollection[roofIndex].hierarchy[index * 3 + 2] === currentEdge.startNodePara.height) {
        workingRoofTopCollection.rooftopCollection[roofIndex].hierarchy[index * 3 + 2] = newLowest;
      } else {
        workingRoofTopCollection.rooftopCollection[roofIndex].hierarchy[index * 3 + 2] = newHighest;
      }
    } else if (currentEdge.type === 'Ridge') {
      workingRoofTopCollection.rooftopCollection[roofIndex].hierarchy[index * 3 + 2] = newHighest;
    } else {
        workingRoofTopCollection.rooftopCollection[roofIndex].hierarchy[index * 3 + 2] = newLowest;
    }
    
    
  }
  console.log("update hierarchy: " + workingRoofTopCollection.rooftopCollection[roofIndex].hierarchy);
  workingRoofTopCollection.rooftopCollection[roofIndex].material = Cesium.Color.RED;
  return dispatch({
    type: actionTypes.UPDATE_SINGLE_ROOF_TOP
  });
}
