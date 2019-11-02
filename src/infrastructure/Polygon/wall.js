import uuid from 'uuid/v1';
import  * as Cesium from 'cesium';

import Coordinate from '../point/coordinate';
import Point from '../point/point';
import FoundLine from '../line/foundLine';

class Wall {

  constructor(
    id = null,
    name = null,
    positions = null,
    minimumHeight = null,
    maximumHeight = null,
    material= null,
    shadow = null,
    show = null
  ) {
    this.entityId = id ? id : uuid();
    this.name = name ? name: 'Wall';
    this.positions = positions ? [...positions] : [];
    this.minimumHeight =
      minimumHeight ?
      new Array(positions.length/2).fill(minimumHeight) :
      new Array(positions.length/2).fill(0);
    this.maximumHeight =
      maximumHeight ?
      new Array(positions.length/2).fill(maximumHeight) :
      new Array(positions.length/2).fill(0);
    this.material =
      material ?
      material:
      Cesium.Color.fromAlpha(Cesium.Color.DARKGREY, 0.75);
    this.shadow = shadow ? Cesium.ShadowMode.ENABLED : Cesium.ShadowMode.DISABLED;
    this.show = show? show: true;
  }

  static copyWall (
    wall,
    id = null,
    name = null,
    positions = null,
    minimumHeight = true,
    maximumHeight = null,
    material=null,
    shadow=null,
    show=null
  ){
    const newID = id ? id : wall.entityId;
    const newName = name ? name : wall.name;
    const newPositions = positions ? [...positions]: wall.positions;
    const newMinimumHeight = minimumHeight ? minimumHeight: wall.minimumHeight[0];
    const newMaximumHeight = maximumHeight ? maximumHeight: wall.maximumHeight[0];
    const newMaterial = material ? material: wall.material;
    const newShadow = shadow? shadow: true;
    const newShow = show? show: true;
    return new Wall(
      newID, newName, newPositions, newMinimumHeight, newMaximumHeight,
      newMaterial, newShadow, newShow
    );
  };

  static makePositionsFromPolyline = (polyline) => {
    const positions = polyline.points.flatMap(p =>
      p.getCoordinate(true).slice(0, -1)
    )
    return positions;
  }

  setMinimumHeight = (newHeight) => {
    this.minimumHeight = new Array(this.positions.length/2).fill(newHeight);
  };

  setMaximumHeight = (newHeight) => {
    this.maximumHeight = new Array(this.positions.length/2).fill(newHeight);
  };

  setPositions = (newPositions) => {
    this.positions = newPositions;
    this.setMinimumHeight(this.minimumHeight);
    this.setMaximumHeight(this.maximumHeight);
  };

  setColor = (newColor) => {
    this.material = newColor;
  };

}
export default Wall;
