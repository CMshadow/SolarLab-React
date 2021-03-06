class Edge {

  /**
   *Creates an instance of Edge.
   * @param {Number} startNode the integer that presents the index of start Node located in the NodesCollections of EdgesMap
   * @param {Number} endNode  the integer that presents the index of end Node located in the NodesCollections of EdgesMap
   * @param {Number} [clockWise=null] the integer that presents the result of clockwise comparator, init result is 0
   * @param {Number} [counterWise=null] the integer that presents the result of counterwise comparator, init result is 0
   * @param {String} [type=null] identify the edge type, either "OuterEgde" , "Hip" or "Ridge"
   * @param {Node} startNodePara the start Node located in the NodesCollections of EdgesMap
   * @param {Node} endNodePara  the end Node located in the NodesCollections of EdgesMap
   * @memberof Edge A structure that contains two Nodes, presents the edge of the rooftop. A edge could be outer edge or inner edge.
   */
  constructor(
    startNode,
    endNode,
    clockWise = null,
    counterWise = null,
    type = null,
    startNodePara = null,
    endNodePara = null
  ){

  this.startNode = startNode;
  this.endNode = endNode;
  this.clockWise = clockWise ? clockWise : 0;
  this.counterWise = counterWise ? counterWise : 0;
  this.type = type ? type : null;
  this.startNodePara = startNodePara;
  this.endNodePara = endNodePara;
  }

}

export default Edge;
