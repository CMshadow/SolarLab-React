import React from 'react';
import uuid from 'uuid/v1';
import  * as Cesium from 'cesium';


class Node {
  constructor(
    id = null,
    lon = null,
    lat = null,
    height = null,
    bound = null,
    
  ){
  this.id = id ? id : uuid();
  this.lon = lon ? lon : null;
  this.lat = lat ? lat : null;
  this.height = height ? height : null;
  this.bound = bound ? bound : 0; // 1 == inner, 0 == outer, -1 == keepout, -2 == shadowing
  this.children = [];
  }

  addChild = (childIndex) => {
    this.children.push(childIndex);
  }

  present = () => {
    return 'node: ' + this.lon + " , " + this.lat + " , " + this.height + ', ' + this.bound ;
  }
}

export default Node;