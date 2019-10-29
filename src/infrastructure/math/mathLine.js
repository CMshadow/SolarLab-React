class MathLine {
  constructor(originCor=null, brng=null, dist=null) {
    this.originCor = originCor ? originCor : null;
    this.brng = brng !== null ? brng : null;
    this.dist = dist ? dist : null;
  }
}

export default MathLine;
