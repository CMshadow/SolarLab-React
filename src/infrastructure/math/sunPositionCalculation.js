const PI = Math.PI;
const sin = Math.sin;
const cos = Math.cos;
const tan = Math.tan;
const asin = Math.asin;
const atan2 = Math.atan2;
const RadtoDeg = 180 / PI;
const DegtoRad = PI / 180;
const pow = Math.pow;

export const calculateD = (year, month, day, hour) => {
  let a = parseInt((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  let JDN = day + hour / 24 + parseInt((153 * m + 2) / 5) + 365 * y + parseInt(y / 4) - parseInt(y / 100) + parseInt(y / 400) - 32045 - 0.5;
  //console.log(JDN - 2451545);
  return (JDN - 2451545.0);
}

// the ecliptic longitude
export const eclipticLongtitude = (D) => {
  let meanLongitude = (280.459 + 0.98564736 * D);
  let meanAnomaly = (357.529 + 0.98560028 * D);
  return ((meanLongitude + 1.915 * Math.sin(meanAnomaly % 360 * PI / 180) + 0.020 * Math.sin(2 * meanAnomaly % 360 * PI / 180)) % 360) * PI / 180;
}
// the distance of the Sun from the Earth
export const distanceStoE = (meanAnomaly) => {
  return 1.00014 - 0.01671 * Math.cos(meanAnomaly) - 0.00014 * Math.cos(2 * meanAnomaly);
}

export const mod = (n, m) => {
  return ((n % m) + m) % m;
}

export const isLeapYear = (year) => {
  if ((year & 3) != 0) {
      return 0;
  }
  else if ((year % 100) != 0 || (year % 400) == 0) {
      return 1;
  }
  return 0;
}

export const dateToday = (year, month, day) => {
  if (!isLeapYear(year) && month > 2 && day > 28) {
      return -1;
  }
  let date = new Date(year, month - 1, day);
  let end = new Date(year, 0, 0);
  let diff = 0;
  let days = 1000 * 60 * 60 * 24;
  diff = date - end;
  let doy = (Math.floor(diff / days));
  return doy;
}

export const sign = (x) => {
  if (x > 0) {
      return 1;
  }
  else if (x = 0) {
      return 0;
  }
  return -1;
}


export const sunEl_Range = (sunEl, min, max) => {
  return (sunEl > min) && (sunEl <= max);
}


export const sunPosition = (year, month, day, hour, longitude, latitude, UTCOffset) =>  {
  let inverse_Longitude = -longitude;
  // console.log("longitude: "+inverse_Longitude);
  // console.log("latitude: "+latitude);
  let TZone = -1 * UTCOffset;
  let dayOfYear = dateToday(year, month, day);
  ////console.log("day of year: "+dayOfYear);
  let Abber = 20 / 3600;
  ////console.log("Abber: "+Abber);
  let LatR = latitude * DegtoRad;
  ////console.log("LatR: "+ LatR);
  let univDate = dayOfYear + Math.floor((hour + TZone) / 24);
  ////console.log("univDate :"+univDate);
  let univHr = mod((hour + TZone), 24);
  ////console.log("univHr: "+univHr);
  let Yr = year - 1900;
  ////console.log("Yr: "+Yr);
  let YrBegin = 365 * Yr + Math.floor((Yr - 1) / 4) - 0.5;
  ////console.log("YrBegin: "+YrBegin);
  let Ezero = YrBegin + univDate;
  ////console.log("Ezero: "+Ezero);
  let T = Ezero / 36525;
  ////console.log("T: "+T);
  let GMST0 = 6 / 24 + 38 / 1440 + (45.836 + 8640184.542 * T + 0.0929 * T * T) / 86400;
  ////console.log("GMST0: "+CMST0);
  GMST0 = 360 * (GMST0 - Math.floor(GMST0));
  ////console.log("GMST0: "+GMST0);
  let GMSTi = mod((GMST0 + 360 * (1.0027379093 * univHr / 24)), 360);
  ////console.log("GMSTi: "+GMSTi);
  let locAST = mod((360 + GMSTi - inverse_Longitude), 360);
  ////console.log("locAST: "+locAST);
  let EpochDate = Ezero + univHr / 24;
  ////console.log("EpochDate: "+EpochDate);
  let T1 = EpochDate / 36525;
  ////console.log("T1: "+T1);
  let ObliquityR = DegtoRad * (23.452294 - 0.0130125 * T1 - 0.00000164 * pow(T1, 2) + 0.000000503 * pow(T1, 3));
  ////console.log("ObliquityR: "+ObliquityR);
  let MlPerigee = 281.22083 + 0.0000470684 * EpochDate + 0.000453 * pow(T1, 2) + 0.000003 * pow(T1, 3);
  ////console.log("MlPerigee: "+MlPerigee);
  let MeanAnom = mod((358.47583 + 0.985600267 * EpochDate - 0.00015 * pow(T1, 2) - 0.000003 * pow(T1, 3)), 360);
  ////console.log("MeanAnom: "+MeanAnom);
  let Eccen = 0.01675104 - 0.0000418 * T1 - 0.000000126 * pow(T1, 2);
  ////console.log("Eccen: "+Eccen);
  let EccenAnom = MeanAnom;
  let E = 0;
  while (Math.max(Math.abs(EccenAnom - E)) > 0.0001) {
      E = EccenAnom;
      EccenAnom = MeanAnom + RadtoDeg * Eccen * sin(DegtoRad * E);
  }
  ////console.log("EccenAnom: "+EccenAnom);
  //let TrueAnom = 2 * (RadtoDeg * atan2(pow((1 + Eccen)/(1 - Eccen),0.5) * tan(DegtoRad * EccenAnom / 2), 1)%360) ;
  //2 * mod(RadtoDeg * atan2(((1 + Eccen) ./ (1 - Eccen)).^ 0.5 .* tan(DegtoRad * EccenAnom / 2), 1), 360)
  //let TrueAnom =     2 * ((RadtoDeg * atan2((pow((1 + Eccen) / (1 - Eccen)),0.5) * tan(DegtoRad * EccenAnom / 2), 1))% 360) ;
  let TrueAnom = 2 * (mod((RadtoDeg * atan2((pow((1 + Eccen) / (1 - Eccen), 0.5) * tan(DegtoRad * EccenAnom / 2)), 1)), 360));
  //(pow((1 + Eccen)/(1 - Eccen), 0.5) * tan(DegtoRad * EccenAnom / 2))
  ////console.log("TrueAnom: "+TrueAnom);
  let EcLon = mod((MlPerigee + TrueAnom), 360) - Abber;
  ////console.log("EcLon: "+EcLon);
  let EcLonR = DegtoRad * EcLon;
  ////console.log("EcLonR： "+EcLonR);
  let DecR = asin(sin(ObliquityR) * sin(EcLonR));
  ////console.log("DecR: "+DecR);
  let Dec = RadtoDeg * DecR;
  ////console.log("Dec: "+Dec);
  let RtAscen = RadtoDeg * atan2(cos(ObliquityR) * (sin(EcLonR)), cos(EcLonR));
  ////console.log("RtAscen: "+RtAscen);
  let HrAngle = locAST - RtAscen;
  let HrAngleR = DegtoRad * HrAngle;
  if (Math.abs(HrAngle) > 180) {
      HrAngle = HrAngle - 360 * sign(HrAngle);
  }
  ////console.log("HrAngle: "+HrAngle);
  ////console.log("HrAngleR: "+HrAngleR);
  let SunAz = RadtoDeg * atan2(-1 * sin(HrAngleR), cos(LatR) * tan(DecR) - sin(LatR) * cos(HrAngleR));
  //SunAz = RadtoDeg .* atan2(-1 * sin(HrAngleR), cos(LatR) .* tan(DecR) - sin(LatR) .* cos(HrAngleR));
  //let HrAngle = HrAngle - (360 * sign(HrAngle) * (abs(HrAngle) > 180));
  if (SunAz < 0) {
      SunAz += 360;
  }
  // console.log("SunAz: "+SunAz);
  let SunEl = asin(cos(LatR) * cos(DecR) * (cos(HrAngleR)) + sin(LatR) * sin(DecR)) * RadtoDeg;
  ////console.log("SunEl: "+SunEl);
  let SolarTime = (180 + HrAngle) / 15;
  ////console.log("SolarTime: "+SolarTime);
  let TanEl = tan(DegtoRad * SunEl);
  let Refract = 0 + sunEl_Range(SunEl, 5, 85) * (58.1 / TanEl - 0.07 / pow(TanEl, 3) + 0.000086 / pow(TanEl, 5)) +
      sunEl_Range(SunEl, 0.0575, 5) * (SunEl * (-518.2 + SunEl * (103.4 + SunEl * (-12.79 + SunEl * 0.711))) + 1735) +
      sunEl_Range(SunEl, -1, -0.575) * ((-20.774 / TanEl));
  Refract = Refract * (283 / (273 + 12)) * 101325 / 101325 / 3600;
  let ApparentSunEl = SunEl + Refract;
  // console.log("ApparentSunEl: "+ApparentSunEl);
  return [ApparentSunEl, SunAz];
}
