import Konva from 'konva';
import { Stage, Layer, Rect, Text } from 'react-konva';

import * as mathHelp from '../../infrastructure/math/SketchDiagramHelper';
import * as actions from './index'
import * as actionTypes from './actionTypes';


export const initStageSketchDiagram = (layer, group ,screenWidth, screenHeight) => (dispatch, getState) => {
    let currentBuilding = getState().buildingManagerReducer
    .workingBuilding;
    let currentBuildingPara = getState().buildingManagerReducer
    .buildingInfoFields;

    let keekoutCollections = getState().undoableReducer.present.drawingKeepoutPolygonManagerReducer;


    // console.log(currentBuilding)
    // console.log(currentBuildingPara)
    let size_times = 5;
    let gradient = 50;

    let backgroundColor = new Konva.Rect({
      x: 0,
      y: 0,
      width: window.innerWidth * size_times,
      height: window.innerHeight * size_times,
      fill: '#15152e',
    });

    layer.add(backgroundColor);

    for (let i = 0; i < window.innerHeight * size_times / 50; ++i) {
        let gridHorizontalLine = new Konva.Line({
            points: [0, i * 50 , window.innerWidth * size_times, i * 50],
            stroke: '#7b7b85',
            strokeWidth: 1.5,
            lineCap: 'round',
            lineJoin: 'round'
        });
        layer.add(gridHorizontalLine);
    }
    for (let i = 0; i < window.innerHeight * size_times / 10; ++i) {
        let gridHorizontalLine2 = new Konva.Line({
            points: [0, i * 10 , window.innerWidth * size_times, i * 10],
            stroke: '#3f3f4c',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round'
        });
        layer.add(gridHorizontalLine2);
    }
    for (let j = 0; j < window.innerWidth * size_times / 50; ++j) {
        let gridVerticalLine = new Konva.Line({
            points: [j * 50, 0 , j * 50, window.innerHeight * size_times],
            stroke: '#7b7b85',
            strokeWidth: 1.5,
            lineCap: 'round',
            lineJoin: 'round'
        });
        layer.add(gridVerticalLine);
    }
    for (let j = 0; j < window.innerWidth * size_times / 10; ++j) {
        let gridVerticalLine2 = new Konva.Line({
            points: [j * 10, 0 , j * 10, window.innerHeight * size_times],
            stroke: '#3f3f4c',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round'
        });
        layer.add(gridVerticalLine2);
    }


    if (currentBuilding != null) {
      console.log("building 2d")
      let AutoScale = null;
      let startPosition = null;
      let startPosition_stage = null;
      if (currentBuildingPara.type === 'FLAT') {
        console.log("Flat Building")

        // console.log("wiring: "+currentBuilding.getWiringCoordinates());
        startPosition = currentBuilding.getRoofCoordinates()[0][0];

        let BuildingRoof = mathHelp.convertFlatFoundationto2D(currentBuilding.getRoofCoordinates()[0]);
        AutoScale = mathHelp.calculateAutoScale(BuildingRoof[1], screenHeight);

        let buildingOutline = drawFlatBuildingOutline(group, BuildingRoof[0],BuildingRoof[1], AutoScale, screenWidth, screenHeight);
        startPosition_stage = buildingOutline.startNodePosition;

        let BuildingRoofSetBack = mathHelp.convertFlatFoundationSetBackTo2D(startPosition,currentBuilding.getRoofExcludeStbCoordinates()[0]);
        let buildingSetBack = drawFlatBuildingSetBack(group, BuildingRoofSetBack[0],BuildingRoofSetBack[1], AutoScale, buildingOutline.startNodePosition);

        let SolarPanelArrays = mathHelp.convertSolarPanelto2D(startPosition,currentBuilding.getPVCoordinates());
        let buildingPanelArrays = drawSolarPanel(group, SolarPanelArrays[0], SolarPanelArrays[1], AutoScale, buildingOutline.startNodePosition);

        let WiringCollection = mathHelp.convertWiringto2D(startPosition, currentBuilding.getWiringCoordinates());
        let buildingWiringCollection = drawWiring(group, WiringCollection[0], WiringCollection[1], AutoScale, buildingOutline.startNodePosition);



      }
      if (currentBuilding.type === "PITCHED") {
        console.log("Pitched Building")
        startPosition = currentBuilding.getRoofCoordinates()[0][0];
        for (let i = 0; i < currentBuilding.getRoofCoordinates().length; i++) {
          if (i === 0) {
            let BuildingRoof = mathHelp.convertFlatFoundationto2D(currentBuilding.getRoofCoordinates()[i]);
            AutoScale = mathHelp.calculateAutoScale(BuildingRoof[1], screenHeight);
            let buildingOutline = drawFlatBuildingOutline(group, BuildingRoof[0],BuildingRoof[1], AutoScale, screenWidth, screenHeight);
            startPosition_stage = buildingOutline.startNodePosition;

          } else {
            let PitchedRoofOutline = mathHelp.convertFlatFoundationSetBackTo2D(startPosition,currentBuilding.getRoofCoordinates()[i]);
            let PitchedBuildingSetBack = drawPitchedBuildingOutline(group, PitchedRoofOutline[0],PitchedRoofOutline[1], AutoScale, startPosition_stage);
          }
        }

        for (let i = 0; i < currentBuilding.getRoofExcludeStbCoordinates().length; i++) {
          let BuildingRoofSetBack = mathHelp.convertFlatFoundationSetBackTo2D(startPosition, currentBuilding.getRoofExcludeStbCoordinates()[i]);
          let buildingSetBack = drawFlatBuildingSetBack(group, BuildingRoofSetBack[0], BuildingRoofSetBack[1], AutoScale, startPosition_stage);
        }
        let SolarPanelArrays = mathHelp.convertSolarPanelto2D(startPosition,currentBuilding.getPVCoordinates());
        let buildingPanelArrays = drawSolarPanel(group, SolarPanelArrays[0], SolarPanelArrays[1], AutoScale, startPosition_stage);
        let WiringCollection = mathHelp.convertWiringto2D(startPosition, currentBuilding.getWiringCoordinates());
        let buildingWiringCollection = drawWiring(group, WiringCollection[0], WiringCollection[1], AutoScale, startPosition_stage);
      }

      if (keekoutCollections.normalKeepout.length > 0) {
        // console.log(keekoutCollections.normalKeepout)
        keekoutCollections.normalKeepout.forEach(element => {
          let keepout = mathHelp.convertKeepoutTo2D(startPosition, element.getOutlinePart2Coordinates ());
          let keepout_Setback = drawKeepoutSetBack(group, keepout[0], keepout[1], AutoScale, startPosition_stage)
        });
      }
      console.log("阴影")
      console.log(currentBuilding.getShadowCoordinates())
      currentBuilding.getShadowCoordinates().forEach(element => {
        console.log(' - ' + element)
        if (element.keepoutType === 'normal') {
          let keepoutShadow = mathHelp.convertNormalShadowto2D(startPosition, element.shadowCoordinates);
          let keepout = mathHelp.convertKeepoutTo2D(startPosition,element.keepoutCoordinates )
          let centerNode = mathHelp.calculateCenterofPolygon(keepout[0], keepout[1], AutoScale, startPosition_stage)
          let keepOutShadowSketch = drawNormalShadow(group, keepoutShadow[0], keepoutShadow[1], AutoScale, startPosition_stage, centerNode ,gradient);
        } else if (element.keepoutType === 'vent' || element.keepoutType === 'passage'){
          let keepoutShadow = mathHelp.convertNormalShadowto2D(startPosition, element.shadowCoordinates);
          let keepout = mathHelp.convertKeepoutTo2D(startPosition,element.keepoutCoordinates )
          let centerNode = mathHelp.calculateCenterofPolygon(keepout[0], keepout[1], AutoScale, startPosition_stage)
          let keepOutShadowSketch = drawNormalShadow(group, keepoutShadow[0], keepoutShadow[1], AutoScale, startPosition_stage, centerNode ,gradient);
        }  else if (element.keepoutType === 'tree') {
          let keepoutShadow = mathHelp.convertNormalShadowto2D(startPosition, element.shadowCoordinates);
          let keepout = mathHelp.convertKeepoutTo2D(startPosition,element.keepoutCoordinates )

        }
      })

      if (currentBuilding.type === 'FLAT') {
        currentBuilding.getParapetShadowCoordinates().forEach(element => {
          let ParaetShadow = mathHelp.convertParapetShadowto2D(startPosition, element.shadowCoordinates, element.keepoutCoordinates);
          console.log(element.shadowCoordinates)
          let ParapetShadowSketch = drawParapetShadow(group, ParaetShadow[0], ParaetShadow[1], AutoScale, startPosition_stage, ParaetShadow[2], ParaetShadow[3], gradient);
        })
      }
      if (keekoutCollections.normalKeepout.length > 0) {
        // console.log(keekoutCollections.normalKeepout)
        keekoutCollections.normalKeepout.forEach(element => {
          let keepout = mathHelp.convertKeepoutTo2D(startPosition, element.getOutlineCoordinates());
          let keepout_Poly = drawKeepOut(group, keepout[0], keepout[1], AutoScale, startPosition_stage)
        });
      }
      if (keekoutCollections.passageKeepout.length > 0) {
        // console.log(keekoutCollections.passageKeepout)
        keekoutCollections.passageKeepout.forEach(element => {
          let keepout = mathHelp.convertKeepoutTo2D(startPosition, element.getOutlineCoordinates());
          // console.log(element.getOutlineCoordinates())
          let keepout_Poly = drawFlatKeepout(group, keepout[0], keepout[1], AutoScale, startPosition_stage)
        });
      }
      if (keekoutCollections.ventKeepout.length > 0) {
        // console.log(keekoutCollections.ventKeepout)
        keekoutCollections.ventKeepout.forEach(element => {
          let keepout = mathHelp.convertKeepoutTo2D(startPosition, element.getOutlineCoordinates());
          // console.log(keepout)
          let keepout_Poly = drawFlatKeepout(group, keepout[0], keepout[1], AutoScale, startPosition_stage)
        });
      }
      if (keekoutCollections.treeKeepout.length > 0) {
        // console.log(keekoutCollections.treeKeepout)
        keekoutCollections.treeKeepout.forEach(element => {
          let keepout = mathHelp.convertKeepoutTo2D(startPosition, element.getOutlineCoordinates());
          // console.log(keepout)
          let keepout_Poly = drawTree(group, keepout[0], keepout[1], AutoScale, startPosition_stage)
        });
      }
      if (keekoutCollections.envKeepout.length > 0) {
        // console.log(keekoutCollections.envKeepout)
        keekoutCollections.envKeepout.forEach(element => {
          let keepout = mathHelp.convertKeepoutTo2D(startPosition, element.getOutlineCoordinates());
          // console.log(keepout)
          let keepout_Poly = drawKeepOut(group, keepout[0], keepout[1], AutoScale, startPosition_stage)
        });
      }

      layer.add(group);

      drawColorBar(layer, screenWidth*0.9, screenHeight*0.2, gradient);

    }



  return({
    type: actionTypes.INIT_STAGE_SKETCH_DIAGRAM,
    stageWidth: window.innerWidth,
    stageHeight: window.innerHeight,
    layer: layer
  });
}

export const drawFlatBuildingOutline = (layer, AngleList, DistanceList, scale, screenWidth, screenHeight) => {
    let verticesList = [screenWidth * 0.45, screenHeight * 0.05];
    for(let i = 0; i < AngleList.length; i++){
        let nextPosition = mathHelp.calculateNextPosition(AngleList[i],DistanceList[i]*scale,
            verticesList[0], verticesList[1] );
        verticesList.push(nextPosition[0], nextPosition[1]);
    }
    let poly = new Konva.Line({
        points: verticesList,
        // fillLinearGradientStartPoint: { x: 600, y: 400 },
        // fillLinearGradientEndPoint: { x: 550, y: 350 },
        // fillLinearGradientColorStops: [0, 'red', 1, 'yellow'],
        fill: '#acafac',
        stroke: '#84848a',
        strokeWidth: 0,
        closed : true,
    });
    layer.add(poly);

    return({
      type: actionTypes.DRAW_FLAT_BUILDING_OUTLINE,
      startNodePosition: [verticesList[0],verticesList[1]],
      layer: layer
    });
}

export const drawPitchedBuildingOutline = (layer, AngleList, DistanceList, scale, start) => {
  let verticesList = [];
  for(let i = 0; i < AngleList.length; i++){
      let nextPosition = mathHelp.calculateNextPosition(AngleList[i],DistanceList[i]*scale,
          start[0], start[1] );
      verticesList.push(nextPosition[0], nextPosition[1]);
  }
  let poly = new Konva.Line({
      points: verticesList,
      fill: '#acafac',
      stroke: '#84848a',
      strokeWidth: 0,
      closed : true,
  });
  layer.add(poly);

  return({
    type: actionTypes.DRAW_PITCHED_BUILDING_SET_BACK,
    // flatBuildingSetBack: poly,
    layer: layer
  });
}

 export const drawFlatBuildingSetBack = (layer, SetBackAngleList, SetbackDistList, scale, start) => {
  let verticesList = [];
  for(let i = 0; i < SetBackAngleList.length; i++){
      let nextPosition = mathHelp.calculateNextPosition(SetBackAngleList[i],SetbackDistList[i]*scale,
          start[0], start[1] );
      verticesList.push(nextPosition[0], nextPosition[1]);
  }
  let poly = new Konva.Line({
      points: verticesList,
      // fillLinearGradientStartPoint: { x: 600, y: 400 },
      // fillLinearGradientEndPoint: { x: 550, y: 350 },
      // fillLinearGradientColorStops: [0, 'red', 1, 'yellow'],
      fill: '#fff800',
      stroke: '#84848a',
      strokeWidth: 0,
      closed : true,
  });
  layer.add(poly);

  return({
    type: actionTypes.DRAW_FLAT_BUILDING_SET_BACK,
    flatBuildingSetBack: poly,
    layer: layer
  });
}

export const drawKeepoutSetBack = (layer, SetBackAngleList, SetbackDistList, scale, start) => {
  let verticesList = [];
  for(let i = 0; i < SetBackAngleList.length; i++){
      let nextPosition = mathHelp.calculateNextPosition(SetBackAngleList[i],SetbackDistList[i]*scale,
          start[0], start[1] );
      verticesList.push(nextPosition[0], nextPosition[1]);
  }
  let poly = new Konva.Line({
      points: verticesList,
      // fillLinearGradientStartPoint: { x: 600, y: 400 },
      // fillLinearGradientEndPoint: { x: 550, y: 350 },
      // fillLinearGradientColorStops: [0, 'red', 1, 'yellow'],
      fill: '#acafac',
      stroke: '#84848a',
      strokeWidth: 0,
      closed : true,
  });
  layer.add(poly);

  return({
    type: actionTypes.DRAW_FLAT_BUILDING_SET_BACK,
    flatBuildingSetBack: poly,
    layer: layer
  });
}

export const drawSolarPanel = (layer, SolarPanelAngle, SolarPanelDist, scale, start) => {
  let panelPositionList = [];
  for(let i = 0; i < SolarPanelAngle.length; i++){
      let nextPosition = mathHelp.calculateNextPosition(SolarPanelAngle[i],SolarPanelDist[i]*scale,
          start[0], start[1] );
      panelPositionList.push(nextPosition[0], nextPosition[1]);
  }
  let solarPanelArrays = [];
  for (let j = 0; j < panelPositionList.length; j+=8) {
      let poly = new Konva.Line({
          points: [panelPositionList[j],panelPositionList[j+1],
              panelPositionList[j+2],panelPositionList[j+3],
              panelPositionList[j+4],panelPositionList[j+5],
              panelPositionList[j+6],panelPositionList[j+7]],
          fill: '#212127',
          stroke: '#84848a',
          strokeWidth: 0.5,
          closed : true,
      });
      layer.add(poly);
      solarPanelArrays.push(poly);
  }
  return({
    type: actionTypes.DRAW_SOLAR_PANEL,
    solarPanelArrayCollection: solarPanelArrays,
    layer: layer
  });
}


export const drawWiring = (layer, wiring_AngleList, wiring_DistList, scale, start) => {

  for(let i = 0; i < wiring_AngleList.length; i++){
    let verticesList = [];
    for(let j = 0; j < wiring_AngleList[i].length; ++j){
      let nextPosition = mathHelp.calculateNextPosition(wiring_AngleList[i][j],wiring_DistList[i][j]*scale,start[0], start[1]);
        verticesList.push(nextPosition[0], nextPosition[1]);
    }
    let poly = new Konva.Line({
          points: verticesList,
          stroke: '#c2c2c2',
          strokeWidth: 3,
          lineCap: 'round',
          lineJoin: 'round'
    });
    layer.add(poly);

  }
  return({
    type: actionTypes.DRAW_WIRING,
    // wiringCollection: verticesList,
    layer: layer
  });
}

export const drawKeepOut = (layer, AngleList, DistanceList, scale, start) => {
  let verticesList = [];
  for(let i = 0; i < AngleList.length; i++){
      let nextPosition = mathHelp.calculateNextPosition(AngleList[i],DistanceList[i]*scale,
          start[0], start[1] );
      verticesList.push(nextPosition[0], nextPosition[1]);
  }
  let poly = new Konva.Line({
    points: verticesList,
    fill: '#212127',
    stroke: '#84848a',
    strokeWidth: 0,
    closed : true,
    shadowColor: 'red',
    shadowBlur: 25,
    shadowOffset: { x: 0, y: 0 },
    shadowOpacity: 1
  });
  layer.add(poly);
  return({
    type: actionTypes.DRAW_KEEPOUT,
    // wiringCollection: verticesList,
    layer: layer
  });
}

export const drawFlatKeepout = (layer, AngleList, DistanceList, scale, start) => {
  let verticesList = [];
  for(let i = 0; i < AngleList.length; i++){
      let nextPosition = mathHelp.calculateNextPosition(AngleList[i],DistanceList[i]*scale,
          start[0], start[1] );
      verticesList.push(nextPosition[0], nextPosition[1]);
  }
  let poly = new Konva.Line({
    points: verticesList,
    fill: '#212127',
    stroke: '#84848a',
    strokeWidth: 0,
    closed : true,

  });
  layer.add(poly);
  return({
    type: actionTypes.DRAW_KEEPOUT,
    // wiringCollection: verticesList,
    layer: layer
  });
}

export const drawTree = (layer, AngleList, DistanceList, scale, start) => {
  let verticesList = [];
  for(let i = 0; i < AngleList.length; i++){
      let nextPosition = mathHelp.calculateNextPosition(AngleList[i],DistanceList[i]*scale,
          start[0], start[1] );
      verticesList.push(nextPosition[0], nextPosition[1]);
  }
  let poly = new Konva.Line({
    points: verticesList,
    fill: '#35a142',
    stroke: '#26732f',
    strokeWidth: 0,
    closed : true,
    // shadowColor: 'red',
    // shadowBlur: 25,
    // shadowOffset: { x: 0, y: 0 },
    // shadowOpacity: 1
  });
  layer.add(poly);
  return({
    type: actionTypes.DRAW_KEEPOUT,
    // wiringCollection: verticesList,
    layer: layer
  });
}


export const drawParapetShadow = (layer,AngleList, DistanceList, scale, start, centerNodesAngles, centerNodesDist ,gradient) => {
  // console.log(centerNode);
  let verticesList = [];
  for(let i = 0; i < AngleList.length; i++){
      let nextPosition = mathHelp.calculateNextPosition(AngleList[i],DistanceList[i]*scale,
          start[0], start[1] );
      verticesList.push(nextPosition[0], nextPosition[1]);
  }
  let colorFull = mathHelp.calculateGradientColor(gradient);
  console.log("color: "+colorFull)
  let poly = new Konva.Line({
      points: verticesList,
      fill: '#636363',
      stroke: '#84848a',
      strokeWidth: 0,
      closed : true,
      opacity: 0.5
  });
  layer.add(poly);

  // let centerNodesList = [];
  // for(let i = 0; i < centerNodesAngles.length; i++){
  //   let nextPosition = mathHelp.calculateNextPosition(centerNodesAngles[i],centerNodesDist[i]*scale,
  //       start[0], start[1] );
  //   centerNodesList.push(nextPosition[0], nextPosition[1]);
  //   // var circle = new Konva.Circle({
  //   //   x: nextPosition[0],
  //   //   y: nextPosition[1],
  //   //   radius: 5,
  //   //   fill: 'red',
  //   //   stroke: 'black',
  //   //   strokeWidth: 4
  //   // });

  //   // // add the shape to the layer
  //   // layer.add(circle);
  //   let newCoordXY = [];
  //   for (let k = 0; k < verticesList.length; k+=2) {
  //     let newCoordX = null;
  //     let newCoordY = null;
  //     // if(k <= (verticesList.length / 2)) {
  //     //   newCoordX = mathHelp.calculateGradientCorrdinate(verticesList[k],centerNodesList[0], gradient);
  //     //   newCoordY = mathHelp.calculateGradientCorrdinate(verticesList[k+1],centerNodesList[1], gradient);
  //     // } else {
  //       newCoordX = mathHelp.calculateGradientCorrdinate(verticesList[k],nextPosition[0], gradient);
  //       newCoordY = mathHelp.calculateGradientCorrdinate(verticesList[k+1],nextPosition[1], gradient);
  //     // }

  //     newCoordXY.push(newCoordX);
  //     newCoordXY.push(newCoordY);
  //   }
  //   for (let level = 0; level < gradient; level++) {
  //     let newShadow = [];
  //     for (let x = 0; x < newCoordXY.length; ++x) {
  //       newShadow.push(newCoordXY[x][level]);
  //     }
  //     // newShadow.push(centerNodesAngles[0]);
  //     // newShadow.push(centerNodesDist[0]);
  //     //console.log(colorList[gradient-level-1]);
  //     let poly1 = new Konva.Line({
  //         points: newShadow,
  //         fill: colorFull[level],
  //         stroke: '#84848a',
  //         strokeWidth: 0,
  //         closed : true,
  //         opacity: 0 + level * (0.1 / gradient)

  //     });
  //     layer.add(poly1);
  //   }

  // }


}



export const drawNormalShadow = (layer,AngleList, DistanceList, scale, start, centerNode ,gradient) => {
  // console.log(centerNode);
  let verticesList = [];
  for(let i = 0; i < AngleList.length; i++){
      let nextPosition = mathHelp.calculateNextPosition(AngleList[i],DistanceList[i]*scale,
          start[0], start[1] );
      verticesList.push(nextPosition[0], nextPosition[1]);
  }
  let colorFull = mathHelp.calculateGradientColor(gradient);
  console.log("color: "+colorFull)
  let poly = new Konva.Line({
      points: verticesList,
      fill: colorFull[0],
      stroke: '#84848a',
      strokeWidth: 0,
      closed : true,
      opacity: 0.5
  });
  // layer.add(poly);


  let newCoordXY = [];
  for (let k = 0; k < verticesList.length; k+=2) {
    let newCoordX = null;
    let newCoordY = null;
    newCoordX = mathHelp.calculateGradientCorrdinate(verticesList[k],centerNode[0], gradient);
    newCoordY = mathHelp.calculateGradientCorrdinate(verticesList[k+1],centerNode[1], gradient);
    newCoordXY.push(newCoordX);
    newCoordXY.push(newCoordY);
  }
  for (let level = 0; level < gradient; level++) {
    let newShadow = [];
    for (let x = 0; x < newCoordXY.length; ++x) {
      newShadow.push(newCoordXY[x][level]);
    }
    // newShadow.push(centerNodesAngles[0]);
    newShadow.push(centerNode);
    //console.log(colorList[gradient-level-1]);
    let customizeOpacity = 0.3;
    if (level <= 10) {
      customizeOpacity = 0.02;
    }
    if (level > 10 && level < 30) {
      customizeOpacity = 0.1 + level * ( 0.2 / 20);
    }
    let poly1 = new Konva.Line({
        points: newShadow,
        fill: colorFull[level],
        stroke: '#84848a',
        strokeWidth: 0,
        closed : true,
        opacity: customizeOpacity

    });
    layer.add(poly1);
  }

}


export const drawColorBar = (layer, Xwidth, Yheight, gradient) => {
  let width_bar= 30;
  let height_bar = 300;
  let colorBar = mathHelp.calculateGradientColor(gradient);
  let rect = [Xwidth,Yheight, Xwidth+width_bar, Yheight, Xwidth+width_bar, Yheight+height_bar, Xwidth,Yheight+height_bar];

  let poly = new Konva.Line({
        points: rect,
  fill: colorBar[0],
        stroke: '#84848a',
        strokeWidth: 0,
        closed : true,
        opacity: 1
    });

  layer.add(poly);
  let newCoordXY = [];
  for (let i = 0; i < rect.length; i+=2) {
    let newCoordX = [];
    let newCoordY = [];
    if(i === 2 || i === 4){
      newCoordX = mathHelp.calculateGradientCorrdinate(rect[i],rect[i],gradient);
      newCoordY = mathHelp.calculateGradientCorrdinate(rect[i+1],rect[7],gradient);
    }
    else{
      newCoordX = mathHelp.calculateGradientCorrdinate(rect[i],rect[6],gradient);
      newCoordY = mathHelp.calculateGradientCorrdinate(rect[i+1],rect[7],gradient);
    }
    newCoordXY.push(newCoordX);
    newCoordXY.push(newCoordY);
  }

  for (let level = 0; level < gradient; level++) {
    let newShadow = []
    for (let i = 0; i < newCoordXY.length; ++i) {
      newShadow.push(newCoordXY[i][level]);
    }
    newShadow.push([rect[6],rect[7]]);
    let poly1 = new Konva.Line({
          points: newShadow,
    fill: colorBar[level],
          stroke: '#84848a',
          strokeWidth: 0,
          closed : true,
          opacity: 0.1
    });
    layer.add(poly1);
    //console.log(level);
  }

  let frameValue = height_bar;
  let height_diff = height_bar/5;
  let frame = [Xwidth+width_bar*1.1,Yheight, Xwidth+width_bar*1.5,Yheight,
        Xwidth+width_bar*1.1, Yheight+height_diff*1, Xwidth+width_bar*1.5, Yheight+height_diff*1,
      Xwidth+width_bar*1.1, Yheight+height_diff*2, Xwidth+width_bar*1.5, Yheight+height_diff*2,
      Xwidth+width_bar*1.1, Yheight+height_diff*3, Xwidth+width_bar*1.5, Yheight+height_diff*3,
      Xwidth+width_bar*1.1, Yheight+height_diff*4, Xwidth+width_bar*1.5, Yheight+height_diff*4,
      Xwidth+width_bar*1.1, Yheight+height_diff*5, Xwidth+width_bar*1.5, Yheight+height_diff*5];

  let frotSize = 15;
  for(let i = 0; i < frame.length; i+=4){
    let line = new Konva.Line({
          points: [frame[i],frame[i+1],frame[i+2],frame[i+3]],
          stroke: '#FFFFFF',
          strokeWidth: 1,
          closed : true
      });
      let frameText = new Konva.Text({
        x: frame[i+2]+frotSize/2,
        y: frame[i+3]-frotSize/2,
        text: frameValue.toString(),
        fontSize: 15,
        fontFamily: 'Calibri',
        fill: 'white'
      });

      frameValue-=height_diff;
      layer.add(line);
      layer.add(frameText);
    }
}
