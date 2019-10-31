import * as actionTypes from './actionTypes';
import Node from '../../infrastructure/edgesMap/node/node';
import Edge from '../../infrastructure/edgesMap/edge/edge';
import EdgesMap from '../../infrastructure/edgesMap/edgesMap';
import * as MathHelper from '../../infrastructure/math/RoofTop_MathHelper';
import * as MathCoordHelp from '../../infrastructure/math/math';
import Coordinate from '../../infrastructure/point/coordinate';

export const initEdgesMap = () => {
  return({
    type: actionTypes.INIT_EDGES_MAP
  });
};


export const build3DRoofTopModeling = (buildingOutline, polylinesRelation, foundPolylines, hipPolylines, ridgePolylines) => {
  let newNodeCollection = [];
  let newInnerEdgeCollection = [];
  let newOuterEdgeCollection = [];
  let pathInformationCollection = [];

  initNodesCollection(buildingOutline, newNodeCollection, newOuterEdgeCollection);
  newInnerEdgeCollection = initEdgeMap(polylinesRelation, newNodeCollection, foundPolylines, hipPolylines, ridgePolylines).newInnerEdgeCollection;
  pathInformationCollection = searchAllRoofPlanes(newInnerEdgeCollection,newOuterEdgeCollection,newNodeCollection).pathCollection;
 
  return ({
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
      newOuterEdgeCollection.push(new Edge(noteIndex, 0, null, null));
      newNodeCollection[noteIndex].addChild(0);
      newNodeCollection[0].addChild(noteIndex);
    } else {
      newOuterEdgeCollection.push(new Edge(noteIndex, noteIndex + 1, null, null) );
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
          newInnerEdgeCollection.push(new Edge(indexStart, indexEnd, null, null));
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
      newInnerEdgeCollection.push(new Edge(indexStart, indexEnd, null, null));
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
      roofPlaneParameters: null
    };
    pathParameters.roofPlaneParameters = [...calculateObliquityAndObliquity(NodesCollection, path[i]).roofPlaneParameters];
    for (let nodeIndex of path[i]) {
      pathParameters.roofPlaneCoordinateArray.push(NodesCollection[nodeIndex].lon);
      pathParameters.roofPlaneCoordinateArray.push(NodesCollection[nodeIndex].lat);
      pathParameters.roofPlaneCoordinateArray.push(NodesCollection[nodeIndex].height);
    }
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

    // console.log("intersection test: "+JSON.stringify(possibleInter1) + " and " + JSON.stringify(possibleInter2));
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

