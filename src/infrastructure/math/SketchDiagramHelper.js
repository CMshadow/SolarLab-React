import * as Cesium from 'cesium';


export const radians_to_degrees = (radians) => {
  const pi = Math.PI;
  return radians * 180 / pi;
}

export const degrees_to_radians = (degrees) => {
  const pi = Math.PI;
  return degrees * (pi/180);
}

export const calculate_bearing_by_two_lon_lat = (longitude1, latitude1, longitude2, latitude2) => {
  let longitude_in_radians1 = degrees_to_radians(longitude1);
  let latitude_in_radians1 = degrees_to_radians(latitude1);
  let longitude_in_radians2 = degrees_to_radians(longitude2);
  let latitude_in_radians2 = degrees_to_radians(latitude2);

  let y = Math.sin(longitude_in_radians2-longitude_in_radians1) * Math.cos(latitude_in_radians2);
  let x = Math.cos(latitude_in_radians1)*Math.sin(latitude_in_radians2) - Math.sin(latitude_in_radians1)*Math.cos(latitude_in_radians2)*Math.cos(longitude_in_radians2-longitude_in_radians1);
  let brng = radians_to_degrees(Math.atan2(y, x));

  return (brng+360)%360;
}


export const convertFlatFoundationto2D = (tempBase) => {
  let angleList = [];
  let distanceList = [];
  // console.log(tempBase)
  let startPos = tempBase[0];
  for(let i = 1; i < tempBase.length - 1; i++){
      let nextAngle = calculate_bearing_by_two_lon_lat(startPos[0],startPos[1],tempBase[i][0],tempBase[i][1]);
      angleList.push(nextAngle);
      distanceList.push(Cesium.Cartesian3.distance(
        Cesium.Cartesian3.fromDegrees(startPos[0],startPos[1]), 
        Cesium.Cartesian3.fromDegrees(tempBase[i][0],tempBase[i][1])));

  }
  // console.log("flat ang "+angleList)
  // console.log("flat dis "+distanceList)
  return [angleList,distanceList];
}

export const convertFlatFoundationSetBackTo2D = (tempBase,extruded_outer_nodes_list) => {
  let setback_angleList = [];
  let setback_distList = [];
  let startPos = tempBase;
  for(let i = 0; i < extruded_outer_nodes_list.length;i++){
      let location = extruded_outer_nodes_list[i];
      let nextAngle = calculate_bearing_by_two_lon_lat(startPos[0],startPos[1],location[0],location[1]);
      setback_angleList.push(nextAngle);
      setback_distList.push(Cesium.Cartesian3.distance
        (Cesium.Cartesian3.fromDegrees
        (startPos[0],startPos[1]), Cesium.Cartesian3.fromDegrees
        (location[0],location[1])));
  }
  return [setback_angleList,setback_distList];
}

export const convertSolarPanelto2D = (startPos, pv_panels_collection) => {
  let angleList = [];
  let distanceList = [];

  for (let i = 0; i < pv_panels_collection.length; i++) {
      for (let j = 0; j < pv_panels_collection[i].length - 1; j++){
        // console.log("hahahahaha"+pv_panels_collection[i])
        let nextAngle = calculate_bearing_by_two_lon_lat(startPos[0],startPos[1],
          pv_panels_collection[i][j][0],
          pv_panels_collection[i][j][1]);
        angleList.push(nextAngle);
        distanceList.push(Cesium.Cartesian3.distance(
          Cesium.Cartesian3.fromDegrees(startPos[0],startPos[1]), 
          Cesium.Cartesian3.fromDegrees(pv_panels_collection[i][j][0],
            pv_panels_collection[i][j][1])));
          
      }
  }

  return [angleList,distanceList];

}

export const convertParapetShadowto2D = (startPos, shadow_outline_collection, center_Collection) => {

  // var tempBase_Whole = Building_object.shadow_outline_collection[i];

  var angleList_whole = [];
  var distanceList_whole = [];
  var center_angleList = [];
  var center_distanceList = [];

  //计算转化后阴影坐标
  for(var i = 0; i < shadow_outline_collection.length; i++){
      //console.log("location: "+ Cesium.Cartesian3.fromDegrees(tempBase[i],tempBase[i+1]));
      var nextAngle = calculate_bearing_by_two_lon_lat(startPos[0],startPos[1],shadow_outline_collection[i][0],shadow_outline_collection[i][1]);
      angleList_whole.push(nextAngle);
      distanceList_whole.push(Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(startPos[0],startPos[1]), Cesium.Cartesian3.fromDegrees(shadow_outline_collection[i][0],shadow_outline_collection[i][1])));
  }
  //计算转化后阴影重心
  for(var k = 0; k < center_Collection.length; k++){
      //console.log("location: "+ Cesium.Cartesian3.fromDegrees(tempBase[i],tempBase[i+1]));
      var nextAngle = calculate_bearing_by_two_lon_lat(startPos[0],startPos[1],center_Collection[k][0],center_Collection[k][1]);
      center_angleList.push(nextAngle);
      center_distanceList.push(Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(startPos[0],startPos[1]), Cesium.Cartesian3.fromDegrees(center_Collection[k][0],center_Collection[k][1])));
  }

  return [angleList_whole, distanceList_whole, center_angleList, center_distanceList];

}

export const convertNormalShadowto2D = (startPos, shadow_outline_collection) => {

  // var tempBase_Whole = Building_object.shadow_outline_collection[i];

  var angleList_whole = [];
  var distanceList_whole = [];


  //计算转化后阴影坐标
  for(var i = 0; i < shadow_outline_collection.length; i++){
      //console.log("location: "+ Cesium.Cartesian3.fromDegrees(tempBase[i],tempBase[i+1]));
      var nextAngle = calculate_bearing_by_two_lon_lat(startPos[0],startPos[1],shadow_outline_collection[i][0],shadow_outline_collection[i][1]);
      angleList_whole.push(nextAngle);
      distanceList_whole.push(Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(startPos[0],startPos[1]), Cesium.Cartesian3.fromDegrees(shadow_outline_collection[i][0],shadow_outline_collection[i][1])));
  }
  return [angleList_whole, distanceList_whole];

}


export const convertWiringto2D = (startPos, wiring_solution_collection) => {
  // 成功生成走线，转化并存储走线&桥架 2D图数据
    let wirings_angle = [];
    let wirings_distance = [];

    for(let i = 0; i < wiring_solution_collection.length; ++i){
        //对于每一个WIRING object
        // console.log("tt: "+wiring_solution_collection[i]);
        let wiring_angleList = [];
        let wiring_distList = [];
        for(let j = 0; j < wiring_solution_collection[i].length; j++ ){
            let nextAngle = calculate_bearing_by_two_lon_lat(startPos[0],startPos[1],
                wiring_solution_collection[i][j][0],
                wiring_solution_collection[i][j][1]);
            wiring_angleList.push(nextAngle);
            wiring_distList.push(Cesium.Cartesian3.distance(
              Cesium.Cartesian3.fromDegrees(startPos[0],startPos[1]),
              Cesium.Cartesian3.fromDegrees(wiring_solution_collection[i][j][0],
              wiring_solution_collection[i][j][1])));
        }

        wirings_angle.push(wiring_angleList);
        wirings_distance.push(wiring_distList);
    }

    return [wirings_angle,wirings_distance]
}

export const convertKeepoutTo2D = (startPos, individual_keepout) => {
  var angleList = [];
  var distanceList = [];
 
  for(var i = 0; i < individual_keepout.length;i++){
      var nextAngle = calculate_bearing_by_two_lon_lat(startPos[0],startPos[1],individual_keepout[i][0],individual_keepout[i][1]);
      angleList.push(nextAngle);
      distanceList.push(
        Cesium.Cartesian3.distance(
        Cesium.Cartesian3.fromDegrees(startPos[0],startPos[1]), 
        Cesium.Cartesian3.fromDegrees(individual_keepout[i][0],individual_keepout[i][1])));
  }
   return [angleList, distanceList];
}



export const calculateNextPosition = (angle, length, x, y) => {
  let sin = 0;
  let cos = 0;
  let x_Dis = 0;
  let y_Dis = 0;
  if( 0 <= angle && angle < 90){//quadrant I
      sin = Math.sin((90-angle)*Math.PI/180);
      cos = Math.cos((90-angle)*Math.PI/180);
      x_Dis = length*cos;
      y_Dis = -length*sin;

  }
  else if( 90 <= angle && angle < 180){//quadrant II
      sin = Math.sin((angle-90)*Math.PI/180);
      cos = Math.cos((angle-90)*Math.PI/180);
      x_Dis = length*cos;
      y_Dis = length*sin;
  }
  else if( 180 <= angle && angle < 270){//quadrant III
      sin = Math.sin((270-angle)*Math.PI/180);
      cos = Math.cos((270-angle)*Math.PI/180);
      x_Dis = -length*cos;
      y_Dis = length*sin;

  }
  else if( 270 <= angle && angle < 360){//quadrant IV
      sin = Math.sin((angle-270)*Math.PI/180);
      cos = Math.cos((angle-270)*Math.PI/180);
      x_Dis = -length*cos;
      y_Dis = -length*sin;
  }
  return [x+x_Dis,y+y_Dis];
}


export const calculateAutoScale = (PolygonDistList, maxHeight) => {
  let maxLength = PolygonDistList[0];
  for (let i = 1; i < PolygonDistList.length; ++i) {
    if (PolygonDistList[i] > maxLength){
      maxLength = PolygonDistList[i];
    }
  }
  return (maxHeight*0.9)/maxLength;
}


export const calculateGradientCorrdinate = (start, end, gradient) => {
  let diff = (end - start)/gradient;
  let origin = start;
  let resultCoordiante = [];
  for(let i = 1; i < gradient; ++i){
    origin += diff;
    resultCoordiante.push(origin);
  }
  return resultCoordiante;
}

export const rgbToHex = (rgb) => { 
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
     hex = "0" + hex;
  }
  return hex;
}

export const calculateCenterofPolygon = (PolygonAngleList, PolygonDistList, scale, start) => {

  let verticesList = [];
  for(let j = 0; j < PolygonAngleList.length; j++){
    let nextPosition = calculateNextPosition(PolygonAngleList[j],PolygonDistList[j]*scale,
        start[0], start[1] );
      verticesList.push(nextPosition[0], nextPosition[1]);
  }
  let totalLong = 0
  let totalLat = 0
  for (let i = 0; i < verticesList.length; i+=2){
    totalLong += verticesList[i];
    totalLat += verticesList[i+1];
  }
  let count = verticesList.length/2
  let center = [totalLong/count,totalLat/count];
  return center
}

export const convertColorHex = (r,g,b) => {   
  let R_VALUE = rgbToHex(r);
  let G_VALUE = rgbToHex(g);
  let B_VALUE = rgbToHex(b);
  return "#"+R_VALUE+G_VALUE+B_VALUE;
};

export const calculateGradientColor = (gradient) => {
  // let gradient = this.gradient;
  let startR = 255, startG = 255, startB = 0;
  let endR = 255, endG = 0, endB = 0;
  let colorFull = [];
  let average_R = Math.ceil((endR - startR)/(gradient*0.7));
  let average_G = Math.ceil((endG - startG)/(gradient*0.7));
  let average_B = Math.ceil((endB - startB)/(gradient*0.7));				
  for (let i = 0; i < gradient; ++i){
    if(i< gradient*0.7){
      startR += average_R;
      startG += average_G;
      startB += average_B;
    }
    else{
      startR = endR;
      startG = endG;
      startB = endB;
    }
    let newColor = convertColorHex(startR,startG,startB);
    colorFull.push(newColor)
  }
  return colorFull;
}

export const calculateDistanceForTree = (point1, point2) => {
  return Math.sqrt((point1[0] - point2[0])*(point1[1] - point2[0]), (point1[1] - point2[1])*(point1[1] - point2[1]))
}

export const convertInverterto2D = (startPos, inverter_polygon_center) => {
  var inverter_angle_list= [];
  var inverter_distList = [];
  let nextAngle = calculate_bearing_by_two_lon_lat(startPos[0],startPos[1],inverter_polygon_center.lon,inverter_polygon_center.lat);
  inverter_angle_list.push(nextAngle);
  inverter_distList.push(Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(startPos[0],startPos[1]), Cesium.Cartesian3.fromDegrees(inverter_polygon_center.lon,inverter_polygon_center.lat)));

  return [inverter_angle_list, inverter_distList];
}

export const covnertSubPolylineto2D = (startPos, inline_polyline_nodes_coordinates) => {

    var bridging_inline_angleList = [];
    var bridging_inline_distList = [];

    for(var i = 0; i < inline_polyline_nodes_coordinates.length; i+=3 ){

        var nextAngle = calculate_bearing_by_two_lon_lat(startPos[0],startPos[1],
        inline_polyline_nodes_coordinates[i],
        inline_polyline_nodes_coordinates[i+1]);
        bridging_inline_angleList.push(nextAngle);
        bridging_inline_distList.push(Cesium.Cartesian3.distance(
        Cesium.Cartesian3.fromDegrees(startPos[0],startPos[1]),
        Cesium.Cartesian3.fromDegrees(inline_polyline_nodes_coordinates[i],
        inline_polyline_nodes_coordinates[i+1])));
    }
    return[bridging_inline_angleList, bridging_inline_distList];
}


export const covnertBridgeMainPolylineto2D = (startPos, inline_polyline_nodes_coordinates) => {

  var bridging_inline_angleList = [];
  var bridging_inline_distList = [];

  for(var i = 0; i < inline_polyline_nodes_coordinates.length; i+=3 ){

      var nextAngle = calculate_bearing_by_two_lon_lat(startPos[0],startPos[1],
      inline_polyline_nodes_coordinates[i],
      inline_polyline_nodes_coordinates[i+1]);
      bridging_inline_angleList.push(nextAngle);
      bridging_inline_distList.push(Cesium.Cartesian3.distance(
      Cesium.Cartesian3.fromDegrees(startPos[0],startPos[1]),
      Cesium.Cartesian3.fromDegrees(inline_polyline_nodes_coordinates[i],
      inline_polyline_nodes_coordinates[i+1])));
  }
  return[bridging_inline_angleList, bridging_inline_distList];
}