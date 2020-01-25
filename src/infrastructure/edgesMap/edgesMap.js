import uuid from 'uuid/v1';

class EdgesMap {

  /**
   *Creates an instance of EdgesMap.
   * @param {string} [id=null] unique id of the EdgesMap, automatic generate one if not provided

   * @param {[Node, Node, ...]} [nodesCollection=null] An array that contains both inner and outer Nodes users created sorted by creation order.
   * @param {[Edge, Edge, ...]} [outerEdgeCollection=null] An array that contains only outer edges tagged by users
   * @param {[Edge, Edge, ...]} [innerEdgeCollection=null] An array that contains only inner edges tagged by users
   * @memberof EdgesMap  An array that contains innerEdgeCollection and outerEdgeCollection
   */
  constructor(
    id = null,
    nodesCollection = null,
    outerEdgeCollection = null,
    innerEdgeCollection = null
  ){
  this.id = id ? id: uuid();
  this.nodesCollection = nodesCollection ? nodesCollection: [];
  this.outerEdgeCollection = outerEdgeCollection ? outerEdgeCollection: [];
  this.innerEdgeCollection = innerEdgeCollection ? innerEdgeCollection: [];
  this.edgeList = [this.innerEdgeCollection,this.outerEdgeCollection];
  }


  /**
   * Add a new Node into NodesCollections, the node could only be either inner or outer
   * @param {Node}  Node An Node that will be added into nodeCollection
   */
  expandNodesCollection = (newNode) => {
    this.nodesCollection.push(newNode);
  }

  /**
   * Add a new outer Edge into OuterEdgeCollections, the edge could only be outer edge
   * @param {Edge}  Edge An Edge that will be added into OuterEdgeCollections
   */
  expandOuterEdgeCollection = (newEdge) => {
    this.outerEdgeCollection.push(newEdge);
  }

  /**
   * Add a new inner Edge into InnerEdgeCollections, the edge could only be inner edge
   * @param {Edge}  Edge An Edge that will be added into InnerEdgeCollections
   */
  expandInnerEdgeCollection = (newEdge) => {
    this.innerEdgeCollection.push(newEdge);
  }

  /**
   * return the current Edge List that contains both InnerEdgeCollections and OuterEdgeCollections
   * @return {EdgeList}  EEdgeList = [InnerEdgeCollections, OuterEdgeCollections]
   */
  getEdgeList = () => {
    return this.edgeList;
  }

}

export default EdgesMap;
