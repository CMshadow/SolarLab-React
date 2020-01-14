import uuid from 'uuid/v1';

import Building from '../building/building';

class BuildingGroup {
  constructor (buidingGroupId, buildingName, buildingArray) {
    this.buidingGroupId = buidingGroupId || uuid();
    this.buildingName = buildingName || '';
    this.buildingArray = buildingArray || [];
  }

  static fromBuildingGroup(buildingGroup) {
    const newBuildingGroupId = buildingGroup.buidingGroupId;
    const newBuildingName = buildingGroup.buildingName;
    const newBuildingArray = buildingGroup.buildingArray;
    return new BuildingGroup(
      newBuildingGroupId, newBuildingName, newBuildingArray
    );
  }

  addBuilding = (building) => {
    if (building instanceof Building) {
      this.buildingArray.push(building);
    } else {
      throw new Error('Object is not a building');
    }
  }
}

export default BuildingGroup;
