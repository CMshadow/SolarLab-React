
import Building from './building';

class PitchedBuilding extends Building {
  constructor (
    name, serial, foundHt, eaveStb, hipStb, ridgeStb, pitchedRoofPolygons=null,
    pitchedRoofPolygonsExcludeStb=null, shadow=null, pv=null, inverters=null,
    pvParams=null
  ) {
    super(name, serial, foundHt, eaveStb, shadow, pv, inverters, pvParams);
    this.type = 'PITCHED';
    this.hipSetback = hipStb;
    this.ridgeSetback = ridgeStb;
    this.pitchedRoofPolygons = pitchedRoofPolygons;
    this.pitchedRoofPolygonsExcludeStb = pitchedRoofPolygonsExcludeStb;
  }

  bindPitchedPolygon = (polygons) => {
    this.pitchedRoofPolygons = polygons;
  }

  bindPitchedPolygonExcludeStb = (polygons) => {
    this.pitchedRoofPolygonsExcludeStb = polygons;
  }

  static fromBuilding (
    pitchedBuilding, name=null, serial=null, foundHt=null, eaveStb=null,
    hipStb=null, ridgeStb=null, pitchedRoofPolygons=null,
    pitchedRoofPolygonsExcludeStb=null, shadow=null, pv=null, inverters=null,
    pvParams=null
  ) {
    const newName = name ? name : pitchedBuilding.name;
    const newSerial = serial ? serial : pitchedBuilding.serial;
    const newFoundHt = foundHt ? foundHt : pitchedBuilding.foundationHeight;
    const newEaveStb =
      eaveStb !== null ? eaveStb : pitchedBuilding.eaveSetback;
    const newHipStb =
      hipStb !== null ? hipStb : pitchedBuilding.hipSetback;
    const newRidgeStb =
      ridgeStb !== null ? ridgeStb : pitchedBuilding.ridgeSetback;
    const newpitchedRoofPolygons =
      pitchedRoofPolygons ?
      pitchedRoofPolygons :
      pitchedBuilding.pitchedRoofPolygons;
    const newpitchedRoofPolygonsExcludeStb =
      pitchedRoofPolygonsExcludeStb ?
      pitchedRoofPolygonsExcludeStb :
      pitchedBuilding.pitchedRoofPolygonsExcludeStb;
    const newShadow = shadow || pitchedBuilding.shadow;
    const newPV = pv || pitchedBuilding.pv;
    const newInverters = inverters || pitchedBuilding.inverters;
    const newPVParams = pvParams || pitchedBuilding.pvParams;
    return new PitchedBuilding(newName, newSerial, newFoundHt, newEaveStb,
      newHipStb, newRidgeStb, newpitchedRoofPolygons,
      newpitchedRoofPolygonsExcludeStb, newShadow, newPV, newInverters,
      newPVParams
    );
  }

  getRoofCoordinates = () => {
    return this.pitchedRoofPolygons.map(polygon =>
      polygon.convertHierarchyToFoundLine().getPointsCoordinatesArray(false)
    )
  };

  getRoofExcludeStbCoordinates = () => {
    this.pitchedRoofPolygonsExcludeStb.map(polygon =>
      polygon.convertHierarchyToFoundLine().getPointsCoordinatesArray(false)
    )
  };
}

export default PitchedBuilding;
