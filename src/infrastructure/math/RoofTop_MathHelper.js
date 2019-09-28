import * as Cesium from 'cesium';


// Build outer edges-points relations

// Build inner edges-points relations

// Search all possible roofTop planes
// edgesMap format: [[InnerEdge1, InnerEdge2, ...], [OuterEdge1, OuterEdge2, ...]]
// return format: [[vertices of plane1], [vertices of plane2], ...]
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
    if (edgeList[0][i].clockWise === 0) {
      edgeList[0][i].counterWise = 1;
      path = checkClockWise(edgeList[0][i], start_point, 0, edgeList, nodesCollection, vertex_stact);
      result.push(path);
    }
  }
  return result;
}

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


export const findNodeIndex = (NodeCollection, lon, lat) => {
  for (let index = 0; index < NodeCollection.length; ++index) {
    if (NodeCollection[index].lon === lon && NodeCollection[index].lat === lat) {
      return index;
    }
  }
  return null;
}

// dot cross function 
export const dot_cross = (e1v1, e1v2, e2v1, e2v2) => {
  let x1 = e1v2.lon - e1v1.lon;
  let y1 = e1v2.lat - e1v1.lat;
  let x2 = e2v2.lon - e2v1.lon;
  let y2 = e2v2.lat - e2v1.lat;
  return [x1 * x2 + y1 * y2, x1 * y2 - x2 * y1];
}
// clockwise comparater function

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



