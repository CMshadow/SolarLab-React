import Konva from 'konva';
import { Stage, Layer, Rect, Text } from 'react-konva';

import * as mathHelp from '../../infrastructure/math/SketchDiagramHelper';
import * as actions from './index'
import * as actionTypes from './actionTypes';

let Shadow_Summer_AngleList = [203.6306115739924,202.6185143511102,193.33976794096097,191.5393838426062,189.03376278005598,198.42533890265324,201.66638679691025];
let Shadow_Summer_DistanceList = [28.39150282959019,28.31844680411861,27.77452575639235,27.556007085648414,25.278367752113983,23.451479901559246,23.830051733407995];

let Shadow_Whole_AngleList = [205.82251788159206,203.75620693154826,203.6306115739924,202.6185143511102,193.33976794096097,191.5393838426062,189.95869507233905,187.1601120421614,186.17700253613287,186.4998866385308,196.78555982074656,204.19201156169558];
let Shadow_Whole_DistanceList = [27.136581821115527,28.353321512593233,28.39150282959019,28.31844680411861,27.77452575639235,27.556007085648414,26.165245794818684,23.923648408618945,23.081346644784666,22.851143969012522,20.877163209330327,22.54215049912012];




export const initStageSketchDiagram = (layer, group ,screenWidth, screenHeight) => (dispatch, getState) => {
    let currentBuilding = getState().buildingManagerReducer
    .workingBuilding;
    let currentBuildingPara = getState().buildingManagerReducer
    .buildingInfoFields;

    let keekoutCollections = getState().undoableReducer.present.drawingKeepoutPolygonManagerReducer;


    // console.log(currentBuilding)
    // console.log(currentBuildingPara)
    let size_times = 5;
    

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

      console.log(currentBuilding.getShadowCoordinates())
      console.log(currentBuilding.getShadowCoordinates()[0])

      if (keekoutCollections.normalKeepout.length > 0) {
        // console.log(keekoutCollections.normalKeepout)
        keekoutCollections.normalKeepout.forEach(element => {
          let keepout = mathHelp.convertKeepoutTo2D(startPosition, element.getOutlineCoordinates());
          // console.log(keepout)
          let keepout_Poly = drawKeepOut(group, keepout[0], keepout[1], AutoScale, startPosition_stage)
        });
      }
      if (keekoutCollections.passageKeepout.length > 0) {
        console.log(keekoutCollections.passageKeepout)
        keekoutCollections.passageKeepout.forEach(element => {
          let keepout = mathHelp.convertKeepoutTo2D(startPosition, element.getOutlineCoordinates());
          console.log(element.getOutlineCoordinates())
          let keepout_Poly = drawKeepOut(group, keepout[0], keepout[1], AutoScale, startPosition_stage)
        });
      }
      if (keekoutCollections.ventKeepout.length > 0) {
        // console.log(keekoutCollections.ventKeepout)
        keekoutCollections.ventKeepout.forEach(element => {
          let keepout = mathHelp.convertKeepoutTo2D(startPosition, element.getOutlineCoordinates());
          // console.log(keepout)
          let keepout_Poly = drawKeepOut(group, keepout[0], keepout[1], AutoScale, startPosition_stage)
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



    }
   
    layer.add(group);

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
      fill: '#e6e225',
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

//画全年阴影渐变色
export const drawWholeShadow = (layer,Shadow_Whole_AngleList, Shadow_Whole_DistanceList, scale, start, centerNode) => {
  console.log(centerNode);
  for(let i = 0; i < Shadow_Whole_AngleList.length; i++){
    let verticesList = [];
    for(let j = 0; j < Shadow_Whole_AngleList[i].length; j++){
      let nextPosition = this.calculateNextPosition(Shadow_Whole_AngleList[i][j],Shadow_Whole_DistanceList[i][j]*scale,
          start[0], start[1]);
        verticesList.push(nextPosition[0], nextPosition[1]);
    }
    let gradient = this.gradient;
    let colorFull = this.calculateGradientColor();

    let poly = new Konva.Line({
        points: verticesList,
        fill: colorFull[0],
        stroke: '#84848a',
        strokeWidth: 0,
        //closed : true,
        opacity: 0.1
    });
    layer.add(poly);
    let newCoordXY = [];
    for (let k = 0; k < verticesList.length; k+=2) {
      let newCoordX = this.calculateGradientCorrdinate(verticesList[k],centerNode[i][0],gradient);
      let newCoordY = this.calculateGradientCorrdinate(verticesList[k+1],centerNode[i][1],gradient);
      newCoordXY.push(newCoordX);
      newCoordXY.push(newCoordY);
    }
    for (let level = 0; level < gradient; level++) {
      let newShadow = [];
    for (let x = 0; x < newCoordXY.length; ++x) {
      newShadow.push(newCoordXY[x][level]);
    }
    newShadow.push(centerNode[i]);
    //console.log(colorList[gradient-level-1]);
    let poly1 = new Konva.Line({
        points: newShadow,
        fill: colorFull[level],
        stroke: '#84848a',
        strokeWidth: 0,
        closed : true,
        opacity: 0.5
          
    });
    layer.add(poly1);
    }
  }
}