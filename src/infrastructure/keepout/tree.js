import Keepout from './keepout';

class Tree extends Keepout {

  constructor (
    id = null, type = 'TREE', drew = null, editing = null, treeHt = null,
    radius = null, outline = null, polygon = null, polygonPart2 = null
  ) {
    super(id, type, drew, editing, outline, polygon, polygonPart2);
    this.height = treeHt ? treeHt : 0;
    this.radius = radius ? radius : 5;
  }

  static fromKeepout (
    tree, height = null, radius = null, outline = null, polygon = null,
    polygonPart2 = null
  ) {
    const newId = tree.id;
    const newType = tree.type;
    const newDrew = tree.finishedDrawing;
    const newIsEditing = tree.isEditing;
    const newHt = height ? height : tree.height;
    const newRadius = radius ? radius : tree.radius;
    const newOutlinePolyline = outline ? outline : tree.outlinePolyline;
    const newOutlinePolygon = polygon ? polygon : tree.outlinePolygon;
    const newOutlinePolygonPart2 =
      polygonPart2 ?
      polygonPart2 :
      tree.outlinePolygonPart2;
    return new Tree(newId, newType, newDrew, newIsEditing, newHt, newRadius,
      newOutlinePolyline, newOutlinePolygon, newOutlinePolygonPart2
    );
  }
}

export default Tree;
