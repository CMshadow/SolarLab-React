import { getAltitudeAzimuth } from './pointCalculation'
import Coordinate from '../point/coordinate';
import Point from '../point/point';

/**
 * Search all possible roof planes based on the edgeMap of the current building
 * @param  {[InnerEdgeCollection, OuterEdgeCollection]} [edgeList] EdgeMap that contains both inner and outer EdgesCollection
 * @param {[Node, Node, ...]}  [nodesCollection] An array that contains all nodes of the building rooftop, each node could be either inner or outer node
 * @return {[RoofPlane1, RoofPlane2, ...]}   An collection that contains of all roof plane paths
 */
export const searchAllPossibleRoofTops = (edgeList, nodesCollection) => {
  let result = [];
  let path = null;
  for (let i = 0; i < edgeList[0].length; ++i ) {
    let vertex_stact = [];
    let start_point = edgeList[0][i].startNode;
    // clockwise
    if (edgeList[0][i].clockWise === 0) {
      edgeList[0][i].clockWise = 1;
      path = checkClockWise(edgeList[0][i], start_point, 1, edgeList, nodesCollection, vertex_stact);
      result.push(path);
    }
  }
  for (let i = 0; i < edgeList[0].length; ++i) {
    let vertex_stact = [];
    let start_point = edgeList[0][i].startNode;
    //counterclockwise
    if (edgeList[0][i].counterWise === 0) {
      edgeList[0][i].counterWise = 1;
      path = checkClockWise(edgeList[0][i], start_point, 0, edgeList, nodesCollection, vertex_stact);
      result.push(path);
    }
  }
  return result;
}
/**
 * Check the Clock Wise starting from the given start edge
 * @param  {Edge} [start_edge] A Edge that represents the edge where we start to search
 * @param {Number}  [start_point] An number that represents the index of the start node in the
 *                                NodeCollection, this node is the start node of the start_edge
 * @param {Number}  [flag] An number that represents the direction we are searching.
 *                         If flag equals to 1, we are doing the clockwise searching.
 *                         If flag equals to 0, we are doing the counterclockwise searching.
 *                         Flag can only be either 1 or 0, no other valid values available.
 * @param  {[InnerEdgeCollection, OuterEdgeCollection]} [edges] EdgeMap that contains both inner and outer EdgesCollection
 * @param {[Node, Node, ...]}  [node_list] An array that contains all nodes of the building rooftop, each node could be either inner or outer node
 * @param {[Node, Node, ...]}  [vertex_stact] An Stack of Nodes that represents one possible path of a roof
 * @return {[RoofPlane1, RoofPlane2, ...]}   An collection that contains of all roof plane paths
 */
export const checkClockWise = (start_edge, start_point, flag, edges, node_list, vertex_stact) => {
  let startNode = start_edge.startNode;
  let endNode = start_edge.endNode;
  while(true) {
    vertex_stact.push(startNode);
    if (endNode === start_point)
      break;
    let endNode_adjacent_list = node_list[endNode].children;
    let closest_edge = null;
    let k = null;
    if (endNode_adjacent_list[0] !== startNode) {
      closest_edge = endNode_adjacent_list[0];
      k = 1;
    } else {
      closest_edge = endNode_adjacent_list[1];
      k = 2;
    }
    for (; k < endNode_adjacent_list.length; ++k) {
      if (endNode_adjacent_list[k] !== startNode && clockwise_comparator(endNode_adjacent_list[k],closest_edge, startNode, endNode, node_list, flag) < 0){
        closest_edge = endNode_adjacent_list[k];
      }
    }
    var index = find_index(endNode, closest_edge, edges[0]);
    if (index !== -1) {
      if (flag === 1){
        if (edges[0][index].startNode === endNode){
          edges[0][index].clockWise = 1;
        } else {
          edges[0][index].counterWise = 1;
        }
      } else if (flag === 0) {
        if (edges[0][index].startNode === endNode) {
          edges[0][index].counterWise = 1;
        } else {
          edges[0][index].clockWise = 1;
        }
      }
    }
    startNode = endNode;
    endNode = closest_edge;
  }
  return vertex_stact;
}
/**
 * Find the index of a specific inner edge located in the innerEdgeCollection
 * @param {Number} [startNode] An number that represents the index of the start node of the edge
 * @param {Number} [endNode] An number that represents the index of the start node of the edge
 * @param  {Edge} [inner_edges] A inner edge
 * @return {Number}   An number that represents the index of a specific inner edge located in the innerEdgeCollection
 */
export const find_index = (startNode, endNode, inner_edges) => {
  let index = -1;
  for (let i = 0; i < inner_edges.length; ++i) {
    if ((inner_edges[i].startNode === startNode && inner_edges[i].endNode === endNode) ||
    (inner_edges[i].startNode === endNode && inner_edges[i].endNode === startNode)) {
      index = i;
      break;
    }
  }
  return index;
}

/**
 * Search all possible roof planes based on the edgeMap of the current building
 * @param  {[InnerEdgeCollection, OuterEdgeCollection]} [toArray=false] EdgeMap that contains both inner and outer EdgesCollection
 * @param {[Node, Node, ...]}  [nodesCollection= null] An array that contains all nodes of the building rooftop, each node could be either inner or outer node
 * @return {[RoofPlane1, RoofPlane2, ...]}   An collection that contains of all roof plane paths
 */
export const findNodeIndex = (NodeCollection, lon, lat) => {
  for (let index = 0; index < NodeCollection.length; ++index) {
    if (NodeCollection[index].lon === lon && NodeCollection[index].lat === lat) {
      return index;
    }
  }
  return null;
}

/**
 * dot cross function
 * @param  {} []
 * @param {}  []
 * @return {Vector}   return a vector
 */
export const dot_cross = (e1v1, e1v2, e2v1, e2v2) => {
  let x1 = e1v2.lon - e1v1.lon;
  let y1 = e1v2.lat - e1v1.lat;
  let x2 = e2v2.lon - e2v1.lon;
  let y2 = e2v2.lat - e2v1.lat;
  return [x1 * x2 + y1 * y2, x1 * y2 - x2 * y1];
}

/**
 * clockwise comparater function
 * @param  {} []
 * @param {}  []
 * @return {Number}   return either 1 or -1
 */
export const clockwise_comparator = (v1, v2, b, joint, node_list, flag) => {
  let dc1 = null;
  let dc2 = null;

  if (flag === 0) {
    dc1 = dot_cross(node_list[joint], node_list[b], node_list[joint], node_list[v1]);
    dc2 = dot_cross(node_list[joint], node_list[b], node_list[joint], node_list[v2]);
  } else {
    dc2 = dot_cross(node_list[joint], node_list[b], node_list[joint], node_list[v1]);
    dc1 = dot_cross(node_list[joint], node_list[b], node_list[joint], node_list[v2]);
  }

  //first consider posive sin() value
  if (dc1[1] < 0 && dc2[1] > 0) {
    return 1;
  }
  if (dc1[1] > 0 && dc2[1] < 0) {
    return -1;
  }
  let x1 = node_list[v1].lon - node_list[joint].lon;
  let y1 = node_list[v1].lat - node_list[joint].lat;
  let x2 = node_list[v2].lon - node_list[joint].lon;
  let y2 = node_list[v2].lat - node_list[joint].lat;
  let length1 = null;
  let length2 = null;
  if (flag === 0) {
      length1 = Math.sqrt(x1 * x1 + y1 * y1);
      length2 = Math.sqrt(x2 * x2 + y2 * y2);
  } else {
      length2 = Math.sqrt(x1 * x1 + y1 * y1);
      length1 = Math.sqrt(x2 * x2 + y2 * y2);
  }

  //choose bigger value of cos() if all sin()s are positive
  if (dc1[1] > 0 && dc2[1] > 0) {
    if (dc1[0] / length1 < dc2[0] / length2) {
        return 1;
    } else {
        return -1;
    }
  }
  //choose smaller value of cos() if all sin()s are negative
  if (dc1[1] < 0 && dc2[1] < 0) {
    if (dc1[0] / length1 > dc2[0] / length2) {
        return 1;
    } else {
        return -1;
    }
  }
}


export const innerEdgeRoofTopTest = () =>{
  let innerPoint1 = new Coordinate(-117.840115555862, 33.646001090657, 6.995);
  let innerPoint2 = new Coordinate(-117.839951401447, 33.64601986082, 6.995);
  let innerPoint3 = new Coordinate(-117.839917727935,33.645815773787,6.995);
  let innerPoint4 = new Coordinate(-117.840084461032, 33.645796708494,6.995);

  var new_height_45 = Coordinate.linearDistance(innerPoint1, innerPoint2);
  console.log("new_height_45: " + new_height_45);
  let test_point1 = new Point(innerPoint1.lon, innerPoint1.lat, innerPoint1.height + new_height_45);
  let test_point2 = new Point(innerPoint2.lon, innerPoint2.lat, innerPoint2.height);
  let test_point3 = new Point(innerPoint3.lon, innerPoint3.lat, innerPoint3.height);
  var al_az = getAltitudeAzimuth(test_point3, test_point2, test_point1);
  console.log("al_az: " + al_az);
}
