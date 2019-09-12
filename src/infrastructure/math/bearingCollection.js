class BearingCollection {
  constructor (brngArray) {
    this.brngCollection = [...new Set(brngArray)];
  }

  findClosestBrng(mouse_bearing){
    let brngDiffs = []

    for(const brng of this.brngCollection){
      brngDiffs.push(
        Math.min(
          360 - Math.abs(brng - mouse_bearing), Math.abs(brng-mouse_bearing)
        )
      );
    }

    const closestIndex =
      brngDiffs.reduce((minIndex, currentDiff, index, arr) => {
        return currentDiff < arr[minIndex] ? index : minIndex;
      }, 0);

    return this.brngCollection[closestIndex]
  }
}

export default BearingCollection;
