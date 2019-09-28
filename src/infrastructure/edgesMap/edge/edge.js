import React from 'react';
import uuid from 'uuid/v1';
import  * as Cesium from 'cesium';

class Edge {
  constructor(
    startNode,
    endNode,
    clockWise = null,
    counterWise = null
  ){
  this.startNode = startNode;
  this.endNode = endNode;
  this.clockWise = clockWise ? clockWise : 0;
  this.counterWise = counterWise ? counterWise : 0;
  }

  showEdge = () => {
    return 'edge: from ' + this.startNode + ' to ' + this.endNode;
  }
}

export default Edge;