import * as Cesium from 'cesium';


// Build outer edges-points relations

// Build inner edges-points relations

// Search all possible roofTop planes
// edges format: [[InnerEdge1, InnerEdge2, ...], [OuterEdge1, OuterEdge2, ...]]
// return format: [[vertices of plane1], [vertices of plane2], ...]
export const searchAllPossibleRoofTops = (edges, node_list) => {

}

// dot cross function 
export const dot_cross = (e1v1, e1v2, e2v1, e2v2) => {
  let x1 = e1v2.x - e1v1.x;
  let y1 = e1v2.y - e1v1.y;
  let x2 = e2v2.x - e2v1.x;
  let y2 = e2v2.y - e2v1.y;
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
  let x1 = node_list[v1].x - node_list[joint].x;
  let y1 = node_list[v1].y - node_list[joint].y;
  let x2 = node_list[v2].x - node_list[joint].x;
  let y2 = node_list[v2].y - node_list[joint].y;
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



