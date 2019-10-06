import uuid from 'uuid/v1';

// const capitalizeFirstLetter = (string) => {
//     return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
// };

class Keepout {

  constructor (id = null, type = null, drew = null, editing = null) {
    this.id = id ? id : uuid();
    this.type = type ? type : 'KEEPOUT';
    this.finishedDrawing = drew ? drew : false;
    this.isEditing = editing ? editing : false;
  }

  setFinishedDrawing = () => {
    this.finishedDrawing = true;
  }

  setIsEditing = () => {
    this.isEditing = true;
  }

  unsetIsEditing = () => {
    this.isEditing = false;
  }

  static fromKeepout (keepout) {
    const newId = keepout.id;
    const newType = keepout.type;
    const newDrew = keepout.finishedDrawing;
    const newIsEditing = keepout.isEditing;
    return new Keepout(newId, newType, newDrew, newIsEditing);
  }
}

export default Keepout;
