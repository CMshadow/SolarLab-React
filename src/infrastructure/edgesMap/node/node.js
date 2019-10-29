import React from 'react';
import uuid from 'uuid/v1';
import  * as Cesium from 'cesium';



class Node {

  /**
   *Creates an instance of Node.
   * @param {string} [id=null]  unique id of the polyline, automatic generate one if not provided
   * @param {Number} [lon=null] the lontitude of the coordinate, fixed
   * @param {Number} [lat=null] the latitude of the coordinate, fixed
   *                                to 12 decimalplaces
   * @param {Number} [height=null] the height of the coordinate, fixed
   *                                to 12 decimalplaces
   * @param {Number} [bound=null] A integer that presents the type of a node 
   *                              {  0: Outer Node,
   *                                 1: Inner Node,
   *                                 -1: Keepout Node,
   *                                 -2: Shadow Node
   *                              }
   * @memberof Node A structure that presents the point created by users' click operation. A Node could be defined as inner node or outer node.
   */
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
  this.bound = bound ? bound : 0;
  this.children = [];
  }

  /**
   * Add a node index into Node.children, which implies that this node can be directly reached from the current from the current Node.
   * @param {Number}  Number The index of a Node that can be reached from current Node. 
   */
  addChild = (childIndex) => {
    this.children.push(childIndex);
  }

}

export default Node;