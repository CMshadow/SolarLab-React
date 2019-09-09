import * as Cesium from 'cesium';

import Polyline from './polyline';

class DashedLine extends Polyline {
  constructor (points = null, id = null, name = null, color = null,
    width = null, show = true
  ) {
    super(points, id, name, color, width, show)
    this.color = new Cesium.PolylineDashMaterialProperty({
      color: color ? color : Cesium.Color.RED
    })
  }
}

export default DashedLine;
