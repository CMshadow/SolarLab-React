import Building from '../building/building';

/**
 * A Object designed for holding/managing all Building objects;
 */
class BuildingCollection {
  /**
   * BuildingCollection has a array containing Building objects
   */
  constructor () {
    this.buildingArray = [];
  }

  /**
   * number of Building objects in the collection
   * @return {int} number of Building objects in the collection
   */
  get length () {
    return this.buildingArray.length;
  }

  /**
   * add a new Building object at the end of the collection
   * @param {int}      position the index position of the Building object to
   *                            be added
   * @param {Building} building the Building object to be added
   */
  addBuilding = (position, building) => {
    if (building instanceof Building) {
      return this.buildingArray.splice(position, 0, building);
    } else {
      throw new Error('Adding object is not a Building object');
    }
  };

  /**
   * get the Building object in the collection by index
   * @param  {int}      index   the index of the Building object
   * @return {Building}         the Building object
   */
  getBuildingByIndex = (index) => {
    if (index < this.length) {
      return this.buildingArray[index];
    } else {
      throw new Error('The index is beyond BuildingCollection length');
    }
  }

  /**
   * delete the Building oject at the index position
   * @param  {int}      index   the index of the Building object to be deleted
   * @return {Building}         the deleted Building object
   */
  deleteBuildingByIndex = (index) => {
    if (index < this.length) {
      const deletedBuilding = this.buildingArray.splice(index, 1);
      return deletedBuilding[0];
    } else {
      throw new Error('The index is beyond BuildingCollection length');
    }
  }
}

export default BuildingCollection;
