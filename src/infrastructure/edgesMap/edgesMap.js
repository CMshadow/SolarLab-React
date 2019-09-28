import React from 'react';
import uuid from 'uuid/v1';
import  * as Cesium from 'cesium';

import Coordinate from '../point/coordinate';


class EdgesMap {
  constructor(){
  this.nodesCollection = [];//all nodes list sorted by creation
  this.outerEdgeCollection = [];
  this.innerEdgeCollection = [];
  this.edgeList = [this.innerEdgeCollection,this.outerEdgeCollection];
  }


  expandNodesCollection = (newNode) => {
    this.nodesCollection.push(newNode);
  }

  expandOuterEdgeCollection = (newEdge) => {
    this.outerEdgeCollection.push(newEdge);
  }

  expandInnerEdgeCollection = (newEdge) => {
    this.innerEdgeCollection.push(newEdge);
  }

  getEdgeList = () => {
    return this.edgeList;
  }
}

export default EdgesMap;