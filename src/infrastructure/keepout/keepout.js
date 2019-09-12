import uuid from 'uuid/v1';

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

class Keepout {

  constructor (id = null, type = null) {
    this.id = id ? id : uuid();
    this.type = type ? capitalizeFirstLetter(type) : 'Keepout';
  }
}

export default Keepout;
