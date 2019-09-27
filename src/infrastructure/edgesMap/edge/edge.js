import React from 'react';
import uuid from 'uuid/v1';
import  * as Cesium from 'cesium';

class Edge {
  constructor(
    startNode = null,
    endNode = null,
    clockWise = null,
    counterWise = null
  ){
  this.startNode = startNode ? startNode : null;
  this.endNode = endNode ? endNode : null;
  this.clockWise = clockWise ? clockWise : 0;
  this.counterWise = counterWise ? counterWise : 0;
  }
}

export default Edge;