import React from 'react';
import * as MathHelper from '../math/sunPositionCalculation';
import  * as Cesium from 'cesium';


class Time {
  constructor(
    year = null,
    month = null, 
    day = null, 
    startHour = null, 
    endHour = null,
    UTCOffset = null
  ){
    this.year = year ? year : 2019;
    this.month = month ? month : 6; 
    this.day = day ? day : 23;
    this.startHour = startHour ? startHour : 10;
    this.endHour = endHour ? endHour : 16;
    this.UTCOffset = UTCOffset ? UTCOffset : -7;
  }

  static CopyTime (
    Time,
    year = null,
    month = null, 
    day = null, 
    startHour = null, 
    endHour = null,
    UTCOffset = null
  ){
    let newYear = year ? year : Time.year;
    let newMonth = month ? month : Time.month;
    let newDay = day ? day : Time.day;
    let newStarHour = startHour ? startHour : Time.startHour;
    let newEndHour = endHour ? endHour : Time.endHour;
    let newUTCOffset = UTCOffset ? UTCOffset : Time.UTCOffset;

  }


}

export default Time;