
import Building from './building';

class PitchedBuilding extends Building {
  constructor (name, serial, foundHt, eaveStb, hipStb, ridgeStb) {
    super(name, serial, foundHt, eaveStb);
    this.type = 'PITCHED';
    this.hipSetback = hipStb;
    this.ridgeSetback = ridgeStb;
  }

  bindFoundPolygon = (Polygon) => {
    this.foundationPolygon = Polygon;
  }
}

export default PitchedBuilding;
