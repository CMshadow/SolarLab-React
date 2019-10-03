import * as actionTypes from './actionTypes';
import Node from '../../infrastructure/edgesMap/node/node';
import Edge from '../../infrastructure/edgesMap/edge/edge';
import EdgesMap from '../../infrastructure/edgesMap/edgesMap';
import * as MathHelper from '../../infrastructure/math/RoofTop_MathHelper';
export const initEdgesMap = () => {
  return({
    type: actionTypes.INIT_EDGES_MAP
  });
};

export const initNodesCollection = (buildingOutline, polylinesRelation) => {

  let newNodeCollection = [];
  let newOuterEdgeCollection = [];
  let newInnerEdgeCollection = [];
  let pathCoordinatesCollection = [];
  // Build outer edges-points relations
  for (let i = 0; i < buildingOutline.length; i+=3) {
    newNodeCollection.push(new Node(null, buildingOutline[i], buildingOutline[i + 1], 5, 0 ));
  }

  for (let noteIndex = 0; noteIndex < newNodeCollection.length; ++noteIndex) {
    console.log('noteIndex: '+ noteIndex);
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
  // for (let i = 0; i < newOuterEdgeCollection.length; ++i) {
  //   console.log('outer: '+newOuterEdgeCollection[i].showEdge());
  // }
  let hipCollecton = [];
  let ridgeCollection = [];
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
          endNode = (polylinesRelation[key]['connectPolyline'][i]['points'][0]['lon'] === startNode.lon && polylinesRelation[key]['connectPolyline'][i]['points'][0]['lat'] === startNode.lat) ? polylinesRelation[key]['connectPolyline'][i]['points'][1] : polylinesRelation[key]['connectPolyline'][i]['points'][0];
        } 
      }
    }
    if (polylinesRelation[key]['type'] === "IN") {
      startNode = new Node(null, polylinesRelation[key]['object']['lon'], polylinesRelation[key]['object']['lat'], 7, 0 );
      for (let i = 0; i < polylinesRelation[key]['connectPolyline'].length; ++i) {
        if (polylinesRelation[key]['connectPolyline'][i]['type'] === 'RIDGE') {
          endNode = (polylinesRelation[key]['connectPolyline'][i]['points'][0]['lon'] === startNode.lon && polylinesRelation[key]['connectPolyline'][i]['points'][0]['lat'] === startNode.lat) ? polylinesRelation[key]['connectPolyline'][i]['points'][1] : polylinesRelation[key]['connectPolyline'][i]['points'][0];
        } 
      } 
    }
    if (startNode !== null && endNode !== null ) {
      indexStart = MathHelper.findNodeIndex(newNodeCollection, startNode.lon, startNode.lat);
      indexEnd = MathHelper.findNodeIndex(newNodeCollection, endNode['lon'], endNode['lat']);
      newInnerEdgeCollection.push(new Edge(indexStart, indexEnd, null, null));
      newNodeCollection[indexStart].addChild(indexEnd);
      newNodeCollection[indexEnd].addChild(indexStart);
    } 
  });

  // let path = MathHelper.searchAllPossibleRoofTops([newInnerEdgeCollection,newOuterEdgeCollection],newNodeCollection);

  // for (let i = 0; i < path.length; ++i) {
  //   let roofPlaneCoordinateArray = [];
  //   console.log('plane:' + i + ': ['+path[i]+']');
  //   for (let nodeIndex of path[i]) {

  //     roofPlaneCoordinateArray.push(newNodeCollection[nodeIndex].lon);
  //     roofPlaneCoordinateArray.push(newNodeCollection[nodeIndex].lat);
  //     roofPlaneCoordinateArray.push(newNodeCollection[nodeIndex].height);
  //     console.log(newNodeCollection[nodeIndex].present());

  //   }
  //   console.log('plane:' + i + ': ['+roofPlaneCoordinateArray+']');
  //   pathCoordinatesCollection.push(roofPlaneCoordinateArray);
  // }

  pathCoordinatesCollection = searchAllRoofPlanes(newInnerEdgeCollection,newOuterEdgeCollection,newNodeCollection).pathCollection;

  return ({
    type: actionTypes.INIT_NODES_COLLECTION,
    nodesCollection: newNodeCollection,
    OuterEdgesCollection: newOuterEdgeCollection,
    InnerEdgeCollection: newInnerEdgeCollection,
    AllRoofPlanePaths: pathCoordinatesCollection
  });
}

export const searchAllRoofPlanes = (InnerEdgeCollection, OuterEdgesCollection, NodesCollection) => {
  let pathCoordinatesCollection = [];
  let path = MathHelper.searchAllPossibleRoofTops([InnerEdgeCollection,OuterEdgesCollection],NodesCollection);
  for (let i = 0; i < path.length; ++i) {
    let roofPlaneCoordinateArray = [];
    console.log('plane:' + i + ': ['+path[i]+']');
    for (let nodeIndex of path[i]) {

      roofPlaneCoordinateArray.push(NodesCollection[nodeIndex].lon);
      roofPlaneCoordinateArray.push(NodesCollection[nodeIndex].lat);
      roofPlaneCoordinateArray.push(NodesCollection[nodeIndex].height);
    }
    console.log('plane:' + i + ': ['+roofPlaneCoordinateArray+']');
    pathCoordinatesCollection.push(roofPlaneCoordinateArray);
  }
  return({
    type: actionTypes.SEARCH_ALL_ROOF_PLANES,
    pathCollection: pathCoordinatesCollection
  });
}
