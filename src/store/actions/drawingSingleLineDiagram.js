import Konva from 'konva';
import { Stage, Layer, Rect, Text } from 'react-konva';

import * as actions from './index'
import * as actionTypes from './actionTypes';
import { element } from 'prop-types';
import gridLogo from '../../assets/images/grid.png';
export const initStage = (layer) => (dispatch, getState) => {
  // let layer = new Konva.Layer();
  let size_times = 30;
  let stageSize = [window.innerWidth, window.innerHeight];
  let backgroundGrid = backgroundGrids(layer, size_times);

  let currentBuilding = getState().buildingManagerReducer
  .workingBuilding;
  // console.log("CHECK SLD")
  if (currentBuilding !== null) {
    const allInverters = Object.keys(currentBuilding.inverters)
    .flatMap(roofIndex =>
      currentBuilding.inverters[roofIndex].map(inverter => inverter)
    );

    // console.log(allInverters)
    let numOfInverter = allInverters.length;
    let nextStartPosition = [280, window.innerHeight * 0.15];
    let inverterConnectList = [];
    let inverterDist = null;
    for (let i = 0; i < allInverters.length; i++) {
      let currentInverter = allInverters[i];
      let numOfPancels = 0;
      
      // currentInverter.mpptSetup.forEach(element => {
      //   element.forEach(item => {
      //     if
      //     numOfPancels+=1;
      //   })
      // });
      let PancelsOfInverter = currentInverter.mpptSetup.flatMap(element => element).filter(item => item > 0);
      console.log("mppt: "+ PancelsOfInverter);

      if (i === 0) {
        let pancelCollection = panelArrayCollection(layer, nextStartPosition ,PancelsOfInverter, currentInverter.panelPerString);
        let combinerCollection = CombinerBoxCollections(layer, nextStartPosition,pancelCollection.distance, pancelCollection.connectPoint1, pancelCollection.connectPoint2, PancelsOfInverter);
        let disconnectCellection = DisconnectCollection(layer, nextStartPosition, combinerCollection.distance, 1, PancelsOfInverter);
        // console.log(disconnectCellection.connectPoint);
        ConnectConbinerToDisconnect(layer, combinerCollection.connectPoints, disconnectCellection.connectPoint);
        let InvertersCollection = InverterCollection(layer, nextStartPosition ,disconnectCellection.distance, 1, disconnectCellection.numOfAccess, disconnectCellection.accessOutPoint);

        nextStartPosition = pancelCollection.startPosition;
        inverterConnectList.push(InvertersCollection.connectPoint);
        inverterDist = InvertersCollection.distance;
      } else {
        let pancelCollection = panelArrayCollection(layer, nextStartPosition ,PancelsOfInverter,currentInverter.panelPerString);
        let combinerCollection = CombinerBoxCollections(layer, nextStartPosition,pancelCollection.distance, pancelCollection.connectPoint1, pancelCollection.connectPoint2, PancelsOfInverter);
        let disconnectCellection = DisconnectCollection(layer, nextStartPosition, combinerCollection.distance, 1, PancelsOfInverter);
        // console.log(disconnectCellection.connectPoint);
        ConnectConbinerToDisconnect(layer, combinerCollection.connectPoints, disconnectCellection.connectPoint);
        let InvertersCollection = InverterCollection(layer, nextStartPosition ,disconnectCellection.distance, 1, disconnectCellection.numOfAccess, disconnectCellection.accessOutPoint);
        nextStartPosition = pancelCollection.startPosition;
        inverterConnectList.push(InvertersCollection.connectPoint)
      }
      


    };
    stageSize[1] = nextStartPosition[1];
    let inverterConnecterComponent = InterConnecter(layer, inverterDist, inverterConnectList);
    let AC_Disconnectc_Component = ACDisconnect(layer, inverterConnecterComponent.distance, inverterConnecterComponent.connectPoint);
    let ServerPanelComponent = ServerPanel(layer, AC_Disconnectc_Component.distance, AC_Disconnectc_Component.connectPoint);
    let MeterComponent = Meter(layer, ServerPanelComponent.distance, ServerPanelComponent.connectPoint);
    stageSize[0] = MeterComponent.maxWidth;


  }
  if (stageSize[0] < window.innerWidth) {
    stageSize[0] = window.innerWidth;
  }
  if (stageSize[1] < window.innerHeight) {
    stageSize[1] = window.innerHeight;
  }
  return dispatch({
    type: actionTypes.INIT_STAGE,
    stageWidth: stageSize[0],
    stageHeight: stageSize[1],
    layer: layer
  });
}


export const backgroundGrids = (layer, size_times) => {

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
}


export const panelArrayCollection = (layer, startPosition ,PancelsOfInverter, PanelPerString) =>{
  let w_min = 150;
  let h_min = 75;
  let stroke_Width = 2;
  let font_size = Math.floor(h_min / 5);
  let connectAccess1 = [];
  let connectAccess2 = [];
  let startX = startPosition[0];
  let startY = startPosition[1];
  let numOfArray = PancelsOfInverter.length;
  for (let i = 0; i < numOfArray; ++i) {
   
    // startPoint
    if (window.innerWidth * 0.12 > w_min) {
      w_min = window.innerWidth * 0.12
    }
    if (window.innerHeight * 0.1 > h_min) {
      h_min = window.innerHeight * 0.1
    }

    if (startX < window.innerWidth * 0.1) startX = window.innerWidth * 0.1;
    startY = startPosition[1] + (h_min * 1.8) * i;
    // draw dash boundary box
    let panelArrayBounary = new Konva.Rect({
      x: startX,
      y: startY,
      width:  w_min,
      height: h_min,
      stroke: 'white',
      strokeWidth: 3,
      dash: [15, 5]
    })
    layer.add(panelArrayBounary);

    let firstPanelWidth = w_min* 0.2;
    let firstPanelHeight = h_min * 0.15;

    // draw first row of panels array
    let startPanelPointX = startX + w_min * 0.1;
    let startPanelPointY = startY + h_min * 0.1;

    let firstPanelOfFirtRow = new Konva.Rect({
      x: startPanelPointX,
      y: startPanelPointY,
      width: firstPanelWidth,
      height: firstPanelHeight,
      stroke: 'white',
      strokeWidth: stroke_Width,
      
    })
    layer.add(firstPanelOfFirtRow);

    let leftTriangle = new Konva.Line({
      points: [startPanelPointX, startPanelPointY, 
        startPanelPointX + firstPanelWidth * 0.3, 
        startPanelPointY + firstPanelHeight* 0.5, 
        startPanelPointX, startPanelPointY + firstPanelHeight],
      stroke: 'white',
      strokeWidth: stroke_Width,
      lineCap: 'round',
      lineJoin: 'round'
    });
    layer.add(leftTriangle);

    let panelIndex = new Konva.Text({
      x: startPanelPointX + firstPanelWidth * 0.5,
      y: startPanelPointY + firstPanelHeight * 0.1,
      text: '1',
      fontSize: font_size,
      fontFamily: 'Calibri',
      fill: 'white'
    });
    layer.add(panelIndex);

    let connectLine1 = new Konva.Line({
      points: [startPanelPointX + firstPanelWidth, 
        startPanelPointY + firstPanelHeight* 0.5, 
        startPanelPointX + firstPanelWidth * 1.3, 
        startPanelPointY + firstPanelHeight* 0.5],
      stroke: 'white',
      strokeWidth: stroke_Width,
      lineCap: 'round',
      lineJoin: 'round'
    });

    layer.add(connectLine1);

    // draw second panel of the first row
    let secondPanelWidth = w_min* 0.2;
    let secondPanelHeight = h_min * 0.15;
    let secondPanelStartPointX = startPanelPointX + w_min * 0.26;
    let secondPanelStartPointY = startPanelPointY;

    let secondPanelOfFirtRow = new Konva.Rect({
      x: secondPanelStartPointX,
      y: secondPanelStartPointY,
      width: secondPanelWidth,
      height: secondPanelHeight,
      stroke: 'white',
      strokeWidth: stroke_Width,
      
    })
    layer.add(secondPanelOfFirtRow);

    let leftTriangleTwo = new Konva.Line({
      points: [secondPanelStartPointX, secondPanelStartPointY, 
        secondPanelStartPointX + secondPanelWidth * 0.3, secondPanelStartPointY + secondPanelHeight* 0.5, 
        secondPanelStartPointX, secondPanelStartPointY + secondPanelHeight],
      stroke: 'white',
      strokeWidth: stroke_Width,
      lineCap: 'round',
      lineJoin: 'round'
    });
    layer.add(leftTriangleTwo);

    let panelIndex2 = new Konva.Text({
      x: secondPanelStartPointX + secondPanelWidth * 0.5,
      y: secondPanelStartPointY + secondPanelHeight * 0.1,
      text: '2',
      fontSize: font_size,
      fontFamily: 'Calibri',
      fill: 'white'
    });
    layer.add(panelIndex2);

    let connectLine2 = new Konva.Line({
      points: [secondPanelStartPointX + secondPanelWidth, 
        secondPanelStartPointY + secondPanelHeight* 0.5, 
        secondPanelStartPointX + secondPanelWidth * 1.8, 
        secondPanelStartPointY + secondPanelHeight* 0.5],
      stroke: 'white',
      strokeWidth: stroke_Width,
      lineCap: 'round',
      lineJoin: 'round'
    });

    layer.add(connectLine2);

    // Copper
    let circle = new Konva.Circle({
      x: secondPanelStartPointX + secondPanelWidth * 1.4, 
      y: secondPanelStartPointY + secondPanelHeight* 0.5,
      radius: secondPanelHeight * 0.25,
      fill: 'white',
      // stroke: 'black',
      // strokeWidth: 4
    });
    layer.add(circle);

    // Copper Line
    let CopperLine = new Konva.Line({
      points: [secondPanelStartPointX + secondPanelWidth * 1.4, secondPanelStartPointY + secondPanelHeight* 0.5,
        secondPanelStartPointX + secondPanelWidth * 1.4, secondPanelStartPointY - secondPanelHeight* 0.25, 
        secondPanelStartPointX + secondPanelWidth * 0.7, secondPanelStartPointY - secondPanelHeight],
      stroke: 'white',
      strokeWidth: stroke_Width,
      lineCap: 'round',
      lineJoin: 'round'
    });
    layer.add(CopperLine);

    // Copper Value
    let CopperValue = new Konva.Text({
      x: secondPanelStartPointX,
      y: secondPanelStartPointY - secondPanelHeight * 2,
      text: '10 AWG Copper',
      fontSize: font_size,
      fontFamily: 'Calibri',
      fill: 'white'
    });
    layer.add(CopperValue);

    //last panel of the first row 
    let lastPanelWidth = w_min* 0.2;
    let lastPanelHeight = h_min * 0.15;
    let lastPanelStartPointX = secondPanelStartPointX + secondPanelWidth * 1.8;
    let lastPanelStartPointY = secondPanelStartPointY;

    let lastPanelOfFirtRow = new Konva.Rect({
      x: lastPanelStartPointX,
      y: lastPanelStartPointY,
      width: lastPanelWidth,
      height: lastPanelHeight,
      stroke: 'white',
      strokeWidth: stroke_Width,
      
    })
    layer.add(lastPanelOfFirtRow);

    let leftTriangleThree = new Konva.Line({
      points: [lastPanelStartPointX, lastPanelStartPointY, 
        lastPanelStartPointX + lastPanelWidth * 0.3, lastPanelStartPointY + lastPanelHeight* 0.5, 
        lastPanelStartPointX, lastPanelStartPointY + lastPanelHeight],
      stroke: 'white',
      strokeWidth: stroke_Width,
      lineCap: 'round',
      lineJoin: 'round'
    });
    connectAccess1.push([lastPanelStartPointX + lastPanelWidth, lastPanelStartPointY + lastPanelHeight* 0.5]);
    
    layer.add(leftTriangleThree);

    // dynamic value
    let panelIndex3 = new Konva.Text({
      x: lastPanelStartPointX + lastPanelWidth * 0.5,
      y: lastPanelStartPointY + lastPanelHeight * 0.1,
      text: PanelPerString,
      fontSize: font_size,
      fontFamily: 'Calibri',
      fill: 'white'
    });
    layer.add(panelIndex3);

    // =====================Array Information===============
    let StringCount = new Konva.Text({
      x: startPanelPointX + font_size,
      y: startPanelPointY + firstPanelHeight * 1.5,
      text: 'String Count: ' + PancelsOfInverter[i],
      fontSize: font_size,
      fontFamily: 'Calibri',
      fill: 'white'
    });
    layer.add(StringCount);

    let ModuleCount = new Konva.Text({
      x: startPanelPointX + font_size,
      y: startPanelPointY + firstPanelHeight * 1.5 + font_size,
      text: 'Module Count: ' + PancelsOfInverter[i] * PanelPerString,
      fontSize: font_size,
      fontFamily: 'Calibri',
      fill: 'white'
    });
    layer.add(ModuleCount);
    if (PancelsOfInverter[i] > 2) {
      let suspensionLine =  new Konva.Line({
        points: [startPanelPointX, startPanelPointY + firstPanelHeight * 1.5 + 10, startPanelPointX, startPanelPointY + firstPanelHeight * 1.5 + font_size + 25],
        stroke: 'white',
        strokeWidth: stroke_Width * 2,
        lineCap: 'round',
        lineJoin: 'round',
        dash: [1,10]
      });
      layer.add(suspensionLine); 
    }
    

    // =====================SECOND ROW =====================
    // draw first panel of second row
    if (PancelsOfInverter[i] > 1) {
      let firstPanelSecondRow_Width = w_min* 0.2;
      let firstPanelSecondRow_Height = h_min * 0.15;
      let firstPanelSecondRow_StartPointX = startX + w_min * 0.1;
      let firstPanelSecondRow_StartPointY = startY + h_min * 0.75;

      let firstPanelOfSecondRow = new Konva.Rect({
        x: firstPanelSecondRow_StartPointX,
        y: firstPanelSecondRow_StartPointY,
        width: firstPanelSecondRow_Width,
        height: firstPanelSecondRow_Height,
        stroke: 'white',
        strokeWidth: stroke_Width,
        
      })
      layer.add(firstPanelOfSecondRow);


      let leftTriangleSecondRow = new Konva.Line({
        points: [firstPanelSecondRow_StartPointX, firstPanelSecondRow_StartPointY, 
          firstPanelSecondRow_StartPointX + firstPanelSecondRow_Width * 0.3, firstPanelSecondRow_StartPointY + firstPanelSecondRow_Height* 0.5, 
          firstPanelSecondRow_StartPointX, firstPanelSecondRow_StartPointY + firstPanelSecondRow_Height],
        stroke: 'white',
        strokeWidth: stroke_Width,
        lineCap: 'round',
        lineJoin: 'round'
      });
      layer.add(leftTriangleSecondRow);

      let panelIndexSecondRow = new Konva.Text({
        x: firstPanelSecondRow_StartPointX + firstPanelSecondRow_Width * 0.5,
        y: firstPanelSecondRow_StartPointY + firstPanelSecondRow_Height * 0.1,
        text: '1',
        fontSize: font_size,
        fontFamily: 'Calibri',
        fill: 'white'
      });
      layer.add(panelIndexSecondRow);

      let connectLine1SecondRow = new Konva.Line({
        points: [firstPanelSecondRow_StartPointX + firstPanelSecondRow_Width, 
          firstPanelSecondRow_StartPointY + firstPanelSecondRow_Height* 0.5, 
          firstPanelSecondRow_StartPointX + firstPanelSecondRow_Width * 1.3, 
          firstPanelSecondRow_StartPointY + firstPanelSecondRow_Height* 0.5],
        stroke: 'white',
        strokeWidth: stroke_Width,
        lineCap: 'round',
        lineJoin: 'round'
      });

      layer.add(connectLine1SecondRow);

      // draw second panel of the second row
      let secondPanelWidthSecondRow = w_min* 0.2;
      let secondPanelHeightSecondRow = h_min * 0.15;
      let secondPanelStartPointXSecondRow = firstPanelSecondRow_StartPointX + firstPanelSecondRow_Width * 1.3;
      let secondPanelStartPointYSecondRow = firstPanelSecondRow_StartPointY;

      let secondPanelOfSecondRow = new Konva.Rect({
        x: secondPanelStartPointXSecondRow,
        y: secondPanelStartPointYSecondRow,
        width: secondPanelWidthSecondRow,
        height: secondPanelHeightSecondRow,
        stroke: 'white',
        strokeWidth: stroke_Width,
        
      })
      layer.add(secondPanelOfSecondRow);

      let leftTriangleTwoSecondRow = new Konva.Line({
        points: [secondPanelStartPointXSecondRow, secondPanelStartPointYSecondRow, 
          secondPanelStartPointXSecondRow + secondPanelWidthSecondRow * 0.3, secondPanelStartPointYSecondRow + secondPanelHeightSecondRow* 0.5, 
          secondPanelStartPointXSecondRow, secondPanelStartPointYSecondRow + secondPanelHeightSecondRow],
        stroke: 'white',
        strokeWidth: stroke_Width,
        lineCap: 'round',
        lineJoin: 'round'
      });
      layer.add(leftTriangleTwoSecondRow);

      let panelIndex2SecondRow = new Konva.Text({
        x: secondPanelStartPointXSecondRow + secondPanelWidthSecondRow * 0.5,
        y: secondPanelStartPointYSecondRow + secondPanelHeightSecondRow * 0.1 ,
        text: '2',
        fontSize: font_size,
        fontFamily: 'Calibri',
        fill: 'white'
      });
      layer.add(panelIndex2SecondRow);

      let connectLine2SecondRow = new Konva.Line({
        points: [secondPanelStartPointXSecondRow + secondPanelWidthSecondRow, 
          secondPanelStartPointYSecondRow + secondPanelHeightSecondRow* 0.5, 
          secondPanelStartPointXSecondRow + secondPanelWidthSecondRow * 1.8, 
          secondPanelStartPointYSecondRow + secondPanelHeightSecondRow* 0.5],
        stroke: 'white',
        strokeWidth: stroke_Width,
        lineCap: 'round',
        lineJoin: 'round'
      });

      layer.add(connectLine2SecondRow);

      // last panel of second row
      let lastPanelRow3Width = w_min* 0.2;
      let lastPanelRow3Height = h_min * 0.15;
      let lastPanelRow3StartPointX = secondPanelStartPointXSecondRow + secondPanelWidthSecondRow * 1.8;
      let lastPanelRow3StartPointY = secondPanelStartPointYSecondRow;

      let lastPanelOfRow3 = new Konva.Rect({
        x: lastPanelRow3StartPointX,
        y: lastPanelRow3StartPointY,
        width: lastPanelRow3Width,
        height: lastPanelRow3Height,
        stroke: 'white',
        strokeWidth: stroke_Width,
        
      })
      layer.add(lastPanelOfRow3);

      let leftTriangleThreeRow3 = new Konva.Line({
        points: [lastPanelRow3StartPointX, lastPanelRow3StartPointY, 
          lastPanelRow3StartPointX + lastPanelRow3Width * 0.3, lastPanelRow3StartPointY + lastPanelRow3Height* 0.5, 
          lastPanelRow3StartPointX, lastPanelRow3StartPointY + lastPanelRow3Height],
        stroke: 'white',
        strokeWidth: stroke_Width,
        lineCap: 'round',
        lineJoin: 'round'
      });
      
      connectAccess2.push([lastPanelRow3StartPointX + lastPanelRow3Width, lastPanelRow3StartPointY + lastPanelRow3Height* 0.5]);
      
      layer.add(leftTriangleThreeRow3);

      // dynamic value
      let panelIndex3Row3 = new Konva.Text({
        x: lastPanelRow3StartPointX + lastPanelRow3Width * 0.5,
        y: lastPanelRow3StartPointY + lastPanelRow3Height * 0.1,
        text: PanelPerString,
        fontSize: font_size,
        fontFamily: 'Calibri',
        fill: 'white'
      });
      layer.add(panelIndex3Row3);
    } else {
      connectAccess2.push([null, null]);
    }


    //bottom Value
    let bottomValue = new Konva.Text({
      x: startX + w_min * 0.25,
      y: startY + h_min * 1.05,
      text: 'CS6X - 300P',
      fontSize: font_size,
      fontFamily: 'Calibri',
      fill: 'white'
    });
    layer.add(bottomValue);
  }
  
  return({
    type: actionTypes.PANEL_ARRAY_COLLECTION,
    layer: layer,
    distance: [w_min, h_min],
    startPosition: [startX, startY + (h_min * 1.8)],
    connectPoint1: connectAccess1,
    connectPoint2: connectAccess2
  });
}


export const CombinerBoxCollections = (layer, startPosition ,distance, connectPoint1, connectPoint2, PancelsOfInverter) => {
  let w_min = distance[1];
  let h_min = distance[1];
  let stroke_Width = 2;
  let font_size = Math.floor(h_min / 7);
  let nextDistance = 0;
  let startX = startPosition[0] + distance[0] * 1.3;
  let startY = startPosition[1];
  let connectPointsList = [];
  // startPoint

  let numOfCombiner = PancelsOfInverter.length;
  for (let i = 0; i < numOfCombiner; ++i) {
    if (window.innerWidth * 0.05 > w_min) {
      w_min = window.innerWidth * 0.05;
      h_min = window.innerWidth * 0.05
    }

    startY = startPosition[1] + (distance[1] * 1.8) * i;
    if (PancelsOfInverter[i] > 1) {
      let panelArrayBounary = new Konva.Rect({
          x: startX,
          y: startY,
          width:  w_min,
          height: h_min,
          stroke: 'white',
          strokeWidth: stroke_Width
      })
      layer.add(panelArrayBounary);
    }
    nextDistance = startX + window.innerWidth * 0.01;
    if (PancelsOfInverter[i] === 1) {
      let connectPoint1X = startX + w_min;
      let connectPoint1Y = connectPoint1[i][1];
      let connectLineFirstRow = new Konva.Line({
        points: [connectPoint1[i][0], connectPoint1[i][1], connectPoint1X, connectPoint1Y],
        stroke: 'white',
        strokeWidth: stroke_Width,
        lineCap: 'round',
        lineJoin: 'round'
      });
      layer.add(connectLineFirstRow);
      connectPointsList.push([connectPoint1X, connectPoint1Y]);
    }
    if (PancelsOfInverter[i] > 1) {
      // first row
      let connectPoint1X = startX + w_min * 0.25;
      let connectPoint1Y = connectPoint1[i][1];
      let connectLineFirstRow = new Konva.Line({
        points: [connectPoint1[i][0], connectPoint1[i][1], connectPoint1X, connectPoint1Y],
        stroke: 'white',
        strokeWidth: stroke_Width,
        lineCap: 'round',
        lineJoin: 'round'
      });
      layer.add(connectLineFirstRow);

      let circle1Row1 = new Konva.Circle({
        x: connectPoint1X, 
        y: connectPoint1Y,
        radius: 3,
        fill: 'white',
        // stroke: 'black',
        // strokeWidth: 4
      });
      layer.add(circle1Row1);

      let connectSplinePoint1X = connectPoint1X + w_min * 0.25;
      let connectSplinePoint1Y = connectPoint1Y;
      let splineRow1 = new Konva.Line({
        points: [connectPoint1X, connectPoint1Y, 
          connectPoint1X + w_min * 0.25 * 0.3 , connectPoint1Y - h_min * 0.05, 
          connectPoint1X + w_min * 0.25 * 0.6 , connectPoint1Y + h_min * 0.05, 
          connectSplinePoint1X, connectSplinePoint1Y],
        stroke: 'white',
        strokeWidth: 2,
        lineJoin: 'round',
        /*
        * line segments with a length of 33px
        * with a gap of 10px
        */
        lineCap: 'round',
        tension: 0.5
      });
      layer.add(splineRow1);

      let circle2Row1 = new Konva.Circle({
        x: connectSplinePoint1X, 
        y: connectSplinePoint1Y,
        radius: 3,
        fill: 'white',
        // stroke: 'black',
        // strokeWidth: 4
      });
      layer.add(circle2Row1);

      let shortConnectLineRow1_pointX = connectSplinePoint1X + w_min * 0.1;
      let shortConnectLineRow1_pointY = connectSplinePoint1Y
      let shortConnectLineRow1 = new Konva.Line({
        points: [connectSplinePoint1X, connectSplinePoint1Y, shortConnectLineRow1_pointX, shortConnectLineRow1_pointY],
        stroke: 'white',
        strokeWidth: stroke_Width,
        lineCap: 'round',
        lineJoin: 'round'
      });
      layer.add(shortConnectLineRow1);

      // second row  
      let connectPoint2X = startX + w_min * 0.25;
      let connectPoint2Y = connectPoint2[i][1];
      let connectLineSecondRow = new Konva.Line({
        points: [connectPoint2[i][0], connectPoint2[i][1], connectPoint2X, connectPoint2Y],
        stroke: 'white',
        strokeWidth: stroke_Width,
        lineCap: 'round',
        lineJoin: 'round'
      });
      layer.add(connectLineSecondRow);

      let circle2 = new Konva.Circle({
        x: connectPoint2X, 
        y: connectPoint2Y,
        radius: 3,
        fill: 'white',

      });
      layer.add(circle2);

      let connectSplinePoint1XRow2 = connectPoint2X + w_min * 0.25;
      let connectSplinePoint1YRow2 = connectPoint2Y;
      let splineRow2 = new Konva.Line({
        points: [connectPoint2X, connectPoint2Y, 
          connectPoint2X + w_min * 0.25 * 0.3 , connectPoint2Y - h_min * 0.05, 
          connectPoint2X + w_min * 0.25 * 0.6 , connectPoint2Y + h_min * 0.05, 
          connectSplinePoint1XRow2, connectSplinePoint1YRow2],
        stroke: 'white',
        strokeWidth: 2,
        lineJoin: 'round',
        /*
        * line segments with a length of 33px
        * with a gap of 10px
        */
        lineCap: 'round',
        tension: 0.5
      });
      layer.add(splineRow2);

      let circle2Row2 = new Konva.Circle({
        x: connectSplinePoint1XRow2, 
        y: connectSplinePoint1YRow2,
        radius: 3,
        fill: 'white',
        // stroke: 'black',
        // strokeWidth: 4
      });
      layer.add(circle2Row2);

      let shortConnectLineRow2_pointX = connectSplinePoint1XRow2 + w_min * 0.1;
      let shortConnectLineRow2_pointY = connectSplinePoint1YRow2
      let shortConnectLineRow2 = new Konva.Line({
        points: [connectSplinePoint1XRow2, connectSplinePoint1YRow2, shortConnectLineRow2_pointX, shortConnectLineRow2_pointY],
        stroke: 'white',
        strokeWidth: stroke_Width,
        lineCap: 'round',
        lineJoin: 'round'
      });
      layer.add(shortConnectLineRow2);

      // connect row 1 and row 2
      let jointPointX = shortConnectLineRow2_pointX;
      let jointPointY = 0.5 * shortConnectLineRow2_pointY  + shortConnectLineRow1_pointY * 0.5;
      let jointLine = new Konva.Line({
        points: [shortConnectLineRow1_pointX, shortConnectLineRow1_pointY, shortConnectLineRow2_pointX, shortConnectLineRow2_pointY],
        stroke: 'white',
        strokeWidth: stroke_Width,
        lineCap: 'round',
        lineJoin: 'round'
      });
      layer.add(jointLine);
      connectPointsList.push([jointPointX, (shortConnectLineRow1_pointY + shortConnectLineRow2_pointY) /2 ]);
      // Copper
      // add lineCircle 
      let topPointX = 0.5 * (connectPoint2X - connectPoint2[i][0]) + connectPoint2[i][0];
      let topPointY = -(connectPoint2Y - connectPoint1Y) * 0.1 + connectPoint1Y;
      let lineCircle = new Konva.Ellipse({
        x: topPointX,
        y: (connectPoint2Y - connectPoint1Y) * 0.5 + connectPoint1Y,
        radiusX: 10,
        radiusY: (connectPoint2Y - connectPoint1Y) * 0.6,
        stroke: 'white',
        strokeWidth: stroke_Width
      });
      layer.add(lineCircle);

      
      let circleCopperLine = new Konva.Line({
        points: [topPointX, topPointY, topPointX, topPointY - h_min * 0.1, startX, startY - h_min * 0.1],
        stroke: 'white',
        strokeWidth: stroke_Width,
        lineCap: 'round',
        lineJoin: 'round'
      });
      layer.add(circleCopperLine);

      let CopperValue = new Konva.Text({
        x: startX,
        y: startY - h_min * 0.1 - font_size,
        text: '10 AWG Copper',
        fontSize: font_size,
        fontFamily: 'Calibri',
        fill: 'white'
      });
      layer.add(CopperValue);

      //bottom Value
      let bottomValue = new Konva.Text({
        x: startX,
        y: startY + h_min * 1.05,
        text: '2 Circut Combiner',
        fontSize: font_size,
        fontFamily: 'Calibri',
        fill: 'white'
      });
      layer.add(bottomValue);
    }
    
  }
  


  return({
    type: actionTypes.COMBINER_BOX_COLLECTIONS,
    connectPoints: connectPointsList,
    distance: [nextDistance, h_min],
    layer: layer
  });

}

export const ConnectConbinerToDisconnect = (layer, CombinerAccessList, DisconnectAccessList) => {
  for (let i = 0; i < CombinerAccessList.length; i++) {
    let midPointX = CombinerAccessList[i][0] + (i + 1) * [(DisconnectAccessList[i][0] - CombinerAccessList[i][0]) / (CombinerAccessList.length + 1)];
    let midPointY = (CombinerAccessList[i][1] + DisconnectAccessList[i][1]) / 2;
    let stroke_Width = 2;
    let switchLine1 = new Konva.Line({
      points: [CombinerAccessList[i][0], CombinerAccessList[i][1], midPointX, CombinerAccessList[i][1], midPointX, midPointY, midPointX, DisconnectAccessList[i][1], DisconnectAccessList[i][0], DisconnectAccessList[i][1]],
      stroke: 'white',
      strokeWidth: stroke_Width,
      lineCap: 'round',
      lineJoin: 'round'
    });
    layer.add(switchLine1);
  }
}


export const DisconnectCollection = (layer, startPosition, distance, numOfDisconnect ,PancelsOfInverter) => {
  let inverterAccess = PancelsOfInverter.length;
  
  let w_min = 50;
  let h_min = 65 + (inverterAccess - 2) * 15;
  let stroke_Width = 2;
  let font_size = Math.floor(w_min / 5);
  let nextDistance = 0;
  let circleAccessInList = [];
  let circleAccessOutList = [];
  if (font_size < 12) {
    font_size = 12;
  }

  for (let i = 0; i < numOfDisconnect; ++i) {
    if (window.innerWidth * 0.05 > w_min) {
      w_min = window.innerWidth * 0.05;
    }
  
    let startX = startPosition[0] + distance[0];
    let startY = startPosition[1] + (distance[1] * 1.8) * i;
    nextDistance = startX + 2 * w_min;
    let panelArrayBounary = new Konva.Rect({
      x: startX,
      y: startY,
      width:  w_min,
      height: h_min,
      stroke: 'white',
      strokeWidth: stroke_Width
    })
    layer.add(panelArrayBounary);

    // add switch
    
    for (let i = 1; i <= inverterAccess; ++i) {
      let circle1 = new Konva.Circle({
        x: startX + 0.25 * w_min, 
        y: startY + (h_min / (inverterAccess + 1)) * i,
        radius: 5,
        fill: 'white',
        // stroke: 'black',
        // strokeWidth: 4
      });
      circleAccessInList.push([startX + 0.2 * w_min, startY + (h_min / (inverterAccess + 1)) * i ])
      layer.add(circle1);

      let circle2 = new Konva.Circle({
        x: startX + 0.8 * w_min, 
        y: startY + (h_min / (inverterAccess + 1)) * i,
        radius: 5,
        fill: 'white',
        // stroke: 'black',
        // strokeWidth: 4
      });
      
      layer.add(circle2);

      let switchOffsetY = h_min / (inverterAccess + 1);
      let switchOffsetX = startX + 0.3 * w_min;
      let switchLine = new Konva.Line({
        points: [switchOffsetX, startY + (switchOffsetY) * (i - 0.5), startX + 0.8 * w_min, startY + (h_min / (inverterAccess + 1)) * i ],
        stroke: 'white',
        strokeWidth: stroke_Width,
        lineCap: 'round',
        lineJoin: 'round'
      });
      layer.add(switchLine);

      // add accessOut line
      let accessOutLine = new Konva.Line({
        points: [startX + 0.8 * w_min, startY + (h_min / (inverterAccess + 1)) * i, startX + 1.2 * w_min, startY + (h_min / (inverterAccess + 1)) * i ],
        stroke: 'white',
        strokeWidth: stroke_Width,
        lineCap: 'round',
        lineJoin: 'round'
      });
      // outConnectPoints.push([startX + 1.2 * w_min, startY + (h_min / (inverterAccess + 1)) * i]);
      circleAccessOutList.push([startX + 1.2 * w_min, startY + (h_min / (inverterAccess + 1)) * i ])
      layer.add(accessOutLine);

      // bottom value
      let bottomValue = new Konva.Text({
        x: startX,
        y: startY + h_min * 1.05,
        text: 'Disconnect',
        fontSize: font_size,
        fontFamily: 'Calibri',
        fill: 'white'
      });
      layer.add(bottomValue);
    }
  }
  
  return({
    type: actionTypes.DISCONNECT_CELLECTION,
    connectPoint: circleAccessInList,
    accessOutPoint: circleAccessOutList,
    distance: [nextDistance, distance[1] * 1.8],
    numOfAccess: inverterAccess,
    layer: layer
  });
}

export const InverterCollection = (layer, startPosition ,distance, numOfInverter, accessNum ,connectPoints) => {
  let w_min = 65;
  let h_min = 65;
  let stroke_Width = 2;
  let font_size = Math.floor(h_min / 7);
  let connectPointList = [];
  let nextDistance = 0;
  // let accessNum = 2;
  for (let i = 0; i < numOfInverter; ++i) {
    if (window.innerWidth * 0.05 > w_min) {
      w_min = window.innerWidth * 0.05;
      h_min = window.innerWidth * 0.05;
      font_size = Math.floor(h_min / 7);
    }

    let startX = startPosition[0] * 0.05 + distance[0];
    let startY = startPosition[1] + (distance[1]) * i;

    let inverterArrayBounary = new Konva.Rect({
      x: startX,
      y: startY,
      width:  w_min,
      height: h_min,
      stroke: 'white',
      strokeWidth: stroke_Width
    })
    layer.add(inverterArrayBounary);
    nextDistance = startX + w_min;

    for (let j = 1; j <= accessNum; ++j) {
      let circle1 = new Konva.Circle({
        x: startX, 
        y: startY + ((h_min / (accessNum + 1)) * j),
        radius: 5,
        fill: 'white',
        // stroke: 'black',
        // strokeWidth: 4
      });
      layer.add(circle1);
      let index = i * accessNum + j - 1;
      if (connectPoints[index][1] !== startY + (h_min / (accessNum + 1)) * j ) {
        // let breakPoint = [connectPoint[0], startY + (h_min / 2)]
        let connectLineToInterConnecter = new Konva.Line({
          points: [startX, startY + (h_min / (accessNum + 1)) * j, 
            connectPoints[index][0], startY + (h_min / (accessNum + 1)) * j, 
            connectPoints[index][0], connectPoints[index][1] ],
          stroke: 'white',
          strokeWidth: stroke_Width,
          lineCap: 'round',
          lineJoin: 'round'
        });
        layer.add(connectLineToInterConnecter);
      } else {
        let connectLineToInterConnecter = new Konva.Line({
          points: [startX, startY + (h_min / (accessNum + 1)) * (j), connectPoints[index][0], connectPoints[index][1] ],
          stroke: 'white',
          strokeWidth: stroke_Width,
          lineCap: 'round',
          lineJoin: 'round'
        });
        layer.add(connectLineToInterConnecter);
      }

    }

    let circle2 = new Konva.Circle({
      x: startX + w_min, 
      y: startY + h_min * 0.5,
      radius: 5,
      fill: 'white',
      // stroke: 'black',
      // strokeWidth: 4
    });
    layer.add(circle2);

    let connectOutLine = new Konva.Line({
      points: [startX + w_min, startY + h_min * 0.5, startX + w_min * 1.5, startY + h_min * 0.5],
      stroke: 'white',
      strokeWidth: stroke_Width,
      lineCap: 'round',
      lineJoin: 'round',
      tension: 0.5
    });
    layer.add(connectOutLine);
    connectPointList.push([startX + w_min * 1.5, startY + h_min * 0.5]);
    
    let inverterDiagonalLine = new Konva.Line({
      points: [startX + w_min, startY, startX, startY + h_min],
      stroke: 'white',
      strokeWidth: stroke_Width,
      lineCap: 'round',
      lineJoin: 'round'
    });
    layer.add(inverterDiagonalLine);
    
    let inverterDashLine = new Konva.Line({
      points: [startX + w_min * 0.1, startY + h_min * 0.1, startX + w_min * 0.5, startY + h_min * 0.1],
      stroke: 'white',
      strokeWidth: stroke_Width,
      lineCap: 'round',
      lineJoin: 'round',
      dash: [1, 5]
    });
    layer.add(inverterDashLine);

    let inverterStraightLine = new Konva.Line({
      points: [startX + w_min * 0.1, startY + h_min * 0.15, startX + w_min * 0.5, startY + h_min * 0.15],
      stroke: 'white',
      strokeWidth: stroke_Width,
      lineCap: 'round',
      lineJoin: 'round'
    });
    layer.add(inverterStraightLine);

    let inverterCurveLine = new Konva.Line({
      points: [startX + w_min * 0.5, startY + h_min * 0.75, startX + w_min * 0.6, startY + h_min * 0.65, startX + w_min * 0.75, startY + h_min * 0.85, startX + w_min * 0.85, startY + h_min * 0.75],
      stroke: 'white',
      strokeWidth: stroke_Width,
      lineCap: 'round',
      lineJoin: 'round',
      tension: 0.5
    });
    layer.add(inverterCurveLine);

    

    // bottom value
    let bottomValue = new Konva.Text({
      x: startX,
      y: startY + h_min * 1.05,
      text: 'Survey Triplepower \n 20000 TL-US',
      fontSize: font_size,
      fontFamily: 'Calibri',
      fill: 'white'
    });
    layer.add(bottomValue);

  }
  
  return({
    type: actionTypes.INVERTER_COLLECTION,
    connectPoint: connectPointList[0],
    distance: nextDistance,
    layer: layer
  });
}

export const InterConnecter = (layer, distance, connectPoints) => {
  let numOfInverter = connectPoints.length;
  let w_min = 65;
  let h_min = 100 + numOfInverter * 10;
  let stroke_Width = 2;
  let font_size = Math.floor(w_min / 5);
  let connectPointList = [];
  let nextDistance = 0;

  
  if (window.innerWidth * 0.05 > w_min) {
      w_min = window.innerWidth * 0.05;
  }

  let startX = window.innerWidth * 0.05 + distance;
  let startY = (window.innerHeight * 0.15);
  nextDistance = startX + w_min;
  // + (h_min * 1.8) * i
  let InterConnecterBounary = new Konva.Rect({
    x: startX,
    y: startY,
    width:  w_min,
    height: h_min,
    stroke: 'white',
    strokeWidth: stroke_Width
  })
  layer.add(InterConnecterBounary);

  for (let i = 1; i <= numOfInverter; ++i) {
    let circle = new Konva.Circle({
      x: startX, 
      y: startY + (h_min / (numOfInverter + 1)) * i,
      radius: 5,
      fill: 'white',
      // stroke: 'black',
      // strokeWidth: 4
    });
    layer.add(circle);
    
    // connect to Inverter
    console.log(connectPoints[i])
    if (connectPoints[i - 1][1] !== startY + (h_min / (numOfInverter + 1)) * i ) {
      // let breakPoint = [connectPoint[0], startY + (h_min / 2)]
      let connectLineToInterConnecter = new Konva.Line({
        points: [startX, startY + (h_min / (numOfInverter + 1)) * i, 
          connectPoints[i - 1][0], startY + (h_min / (numOfInverter + 1)) * i, 
          connectPoints[i - 1][0], connectPoints[i - 1][1] ],
        stroke: 'white',
        strokeWidth: stroke_Width,
        lineCap: 'round',
        lineJoin: 'round'
      });
      layer.add(connectLineToInterConnecter);
    } else {
      let connectLineToInterConnecter = new Konva.Line({
        points: [startX, startY + (h_min / (numOfInverter + 1)) * (i), connectPoints[i - 1][0], connectPoints[i - 1][1] ],
        stroke: 'white',
        strokeWidth: stroke_Width,
        lineCap: 'round',
        lineJoin: 'round'
      });
      layer.add(connectLineToInterConnecter);
    }



    // connectLine
    let connectLine = new Konva.Line({
      points: [startX, startY + (h_min / (numOfInverter + 1)) * i, startX + w_min * 0.2, startY + (h_min / (numOfInverter + 1)) * i],
      stroke: 'white',
      strokeWidth: stroke_Width,
      lineCap: 'round',
      lineJoin: 'round',
      tension: 0.5
    });
    layer.add(connectLine);

    // 
    let busLineCircle1Row1 = new Konva.Circle({
      x: startX + w_min * 0.2, 
      y: startY + (h_min / (numOfInverter + 1)) * i,
      radius: 3,
      fill: 'white',
      // stroke: 'black',
      // strokeWidth: 4
    });
    layer.add(busLineCircle1Row1); 

    let busCurveLineRow1 =  new Konva.Line({
      points: [startX + w_min * 0.2, startY + (h_min / (numOfInverter + 1)) * i,
         startX + w_min * 0.275, startY + (h_min / (numOfInverter + 1)) * i - 10, 
         startX + w_min * 0.35, startY + (h_min / (numOfInverter + 1)) * i],
      stroke: 'white',
      strokeWidth: stroke_Width,
      lineCap: 'round',
      lineJoin: 'round',
      tension: 0.5
    });
    layer.add(busCurveLineRow1);

    let busLineCircle2Row1 = new Konva.Circle({
      x: startX + w_min * 0.35, 
      y: startY + (h_min / (numOfInverter + 1)) * i,
      radius: 3,
      fill: 'white',
      // stroke: 'black',
      // strokeWidth: 4
    });
    layer.add(busLineCircle2Row1); 

    let connectToBusLine = new Konva.Line({
      points: [startX + w_min * 0.35, startY + (h_min / (numOfInverter + 1)) * i,
        startX + w_min * 0.5, startY + (h_min / (numOfInverter + 1)) * i],
      stroke: 'white',
      strokeWidth: stroke_Width,
      lineCap: 'round',
      lineJoin: 'round',
      tension: 0.5
    });
    layer.add(connectToBusLine);
    //
    let busLine =  new Konva.Line({
      points: [startX + w_min * 0.65, startY + h_min * 0.15, startX + w_min * 0.5, startY + h_min * 0.15, startX + w_min * 0.5, startY + (h_min / (numOfInverter + 1)) * i],
      stroke: 'white',
      strokeWidth: stroke_Width,
      lineCap: 'round',
      lineJoin: 'round',
    });
    layer.add(busLine);

    let busLineCircle1 = new Konva.Circle({
      x: startX + w_min * 0.65, 
      y: startY + h_min * 0.15,
      radius: 3,
      fill: 'white',
      // stroke: 'black',
      // strokeWidth: 4
    });
    layer.add(busLineCircle1); 

    let busCurveLine =  new Konva.Line({
      points: [startX + w_min * 0.65, startY + h_min * 0.15, startX + w_min * 0.75, startY + h_min * 0.1, startX + w_min * 0.85, startY + h_min * 0.15],
      stroke: 'white',
      strokeWidth: stroke_Width,
      lineCap: 'round',
      lineJoin: 'round',
      tension: 0.5
    });
    layer.add(busCurveLine);

    let busLineCircle2 = new Konva.Circle({
      x: startX + w_min * 0.85, 
      y: startY + h_min * 0.15,
      radius: 3,
      fill: 'white',
      // stroke: 'black',
      // strokeWidth: 4
    });
    layer.add(busLineCircle2); 
  }

  let busConnectLine =  new Konva.Line({
    points: [startX + w_min * 0.85, startY + h_min * 0.15, startX + w_min * 1.2, startY + h_min * 0.15 ],
    stroke: 'white',
    strokeWidth: stroke_Width,
    lineCap: 'round',
    lineJoin: 'round'
  });
  layer.add(busConnectLine);

  // bottom value
  let bottomValue = new Konva.Text({
    x: startX,
    y: startY + h_min * 1.05,
    text: '20 Circut Interconnect',
    fontSize: font_size,
    fontFamily: 'Calibri',
    fill: 'white'
  });
  layer.add(bottomValue);

  return({
    type: actionTypes.INVERTER_CONNECTER,
    connectPoint: [startX + w_min * 1.2, startY + h_min * 0.15],
    distance: nextDistance,
    layer: layer
  });
}


export const ACDisconnect = (layer, distance, connectPoint) => {
  let w_min = 65;
  let h_min = 40;
  let stroke_Width = 2;
  let font_size = Math.floor(h_min / 7);
  
  let nextDistance = 0;


  if (window.innerWidth * 0.05 > w_min) {
      w_min = window.innerWidth * 0.05;
      h_min = w_min / 1.625;
      font_size = Math.floor(h_min / 7);
  }
  if (font_size < 12) {
    font_size = 12;
  }
  let startX = window.innerWidth * 0.05 + distance;
  let startY = (window.innerHeight * 0.15);
  nextDistance = startX + w_min;
  // + (h_min * 1.8) * i
  let ACDisconnecterBounary = new Konva.Rect({
    x: startX,
    y: startY,
    width:  w_min,
    height: h_min,
    stroke: 'white',
    strokeWidth: stroke_Width
  })
  layer.add(ACDisconnecterBounary);

  let circle1 = new Konva.Circle({
    x: startX + 0.25 * w_min, 
    y: startY + (h_min / 2),
    radius: 5,
    fill: 'white',
    // stroke: 'black',
    // strokeWidth: 4
  });
  
  layer.add(circle1);

  let circle2 = new Konva.Circle({
    x: startX + 0.8 * w_min, 
    y: startY + (h_min / 2),
    radius: 5,
    fill: 'white',
    // stroke: 'black',
    // strokeWidth: 4
  });

  layer.add(circle2);
  
  let switchOffsetX = startX + 0.75 * w_min;
  let switchOffsetY = startY + h_min * 0.25;
  let switchLine = new Konva.Line({
    points: [startX + 0.25 * w_min, startY + (h_min / 2), switchOffsetX, switchOffsetY],
    stroke: 'white',
    strokeWidth: stroke_Width,
    lineCap: 'round',
    lineJoin: 'round'
  });
  layer.add(switchLine);

  // add accessOut line
  let accessOutLine = new Konva.Line({
    points: [startX + 0.8 * w_min, startY + (h_min / 2), startX + 1.2 * w_min, startY + (h_min / 2) ],
    stroke: 'white',
    strokeWidth: stroke_Width,
    lineCap: 'round',
    lineJoin: 'round'
  });
  layer.add(accessOutLine);

  // connect to InterConnecter

  if (connectPoint[1] !== startY + (h_min / 2)) {
    // let breakPoint = [connectPoint[0], startY + (h_min / 2)]
    let connectLineToInterConnecter = new Konva.Line({
      points: [startX + 0.25 * w_min, startY + (h_min / 2), connectPoint[0], startY + (h_min / 2), connectPoint[0], connectPoint[1] ],
      stroke: 'white',
      strokeWidth: stroke_Width,
      lineCap: 'round',
      lineJoin: 'round'
    });
    layer.add(connectLineToInterConnecter);
  } else {
    let connectLineToInterConnecter = new Konva.Line({
      points: [startX + 0.25 * w_min, startY + (h_min / 2), connectPoint[0], connectPoint[1] ],
      stroke: 'white',
      strokeWidth: stroke_Width,
      lineCap: 'round',
      lineJoin: 'round'
    });
    layer.add(connectLineToInterConnecter);
  }

  // bottom value
  let bottomValue = new Konva.Text({
    x: startX,
    y: startY + h_min * 1.05,
    text: 'AC Disconnect',
    fontSize: font_size,
    fontFamily: 'Calibri',
    fill: 'white'
  });
  layer.add(bottomValue);

  return({
    type: actionTypes.AC_DISCONNECT,
    connectPoint: [startX + 1.2 * w_min, startY + (h_min / 2)],
    distance: nextDistance,
    layer: layer
  });
}

export const ServerPanel = (layer, distance, connectPoint) => {
  let w_min = 70;
  let h_min = 70;
  let stroke_Width = 2;
  let font_size = Math.floor(h_min / 7);
  let nextDistance = 0;


  if (window.innerWidth * 0.05 > w_min) {
      w_min = window.innerWidth * 0.05;
      h_min = window.innerWidth * 0.05;
      font_size = Math.floor(h_min / 7);
  }
  
  let startX = window.innerWidth * 0.05 + distance;
  let startY = (window.innerHeight * 0.15);
  nextDistance = startX + w_min;
  // + (h_min * 1.8) * i
  let ServerPanelBounary = new Konva.Rect({
    x: startX,
    y: startY,
    width:  w_min,
    height: h_min,
    stroke: 'white',
    strokeWidth: stroke_Width
  })
  layer.add(ServerPanelBounary);


  let busLineCircle1Row1 = new Konva.Circle({
      x: startX + w_min * 0.25, 
      y: startY + h_min * 0.35,
      radius: 3,
      fill: 'white',
      // stroke: 'black',
      // strokeWidth: 4
    });
    layer.add(busLineCircle1Row1); 

  let busCurveLineRow1 =  new Konva.Line({
    points: [startX + w_min * 0.25, startY + h_min * 0.35, startX + w_min * 0.375, startY + h_min * 0.25, startX + w_min * 0.5, startY + h_min * 0.35],
    stroke: 'white',
    strokeWidth: stroke_Width,
    lineCap: 'round',
    lineJoin: 'round',
    tension: 0.5
  });
  layer.add(busCurveLineRow1);

  let busLineCircle2Row1 = new Konva.Circle({
    x: startX + w_min * 0.5, 
    y: startY + h_min * 0.35,
    radius: 3,
    fill: 'white',
    // stroke: 'black',
    // strokeWidth: 4
  });
  layer.add(busLineCircle2Row1);  

  let busConnectLine1 =  new Konva.Line({
    points: [startX + w_min * 0.5, startY + h_min * 0.35, startX + w_min * 0.65, startY + h_min * 0.35 ],
    stroke: 'white',
    strokeWidth: stroke_Width,
    lineCap: 'round',
    lineJoin: 'round'
  });
  layer.add(busConnectLine1);

  // suspension points
  let suspensionLine =  new Konva.Line({
    points: [startX + w_min * 0.375, startY + h_min * 0.35,startX + w_min * 0.375, startY + h_min * 0.65],
    stroke: 'white',
    strokeWidth: stroke_Width,
    lineCap: 'round',
    lineJoin: 'round',
    dash: [1, 10]
  });
  layer.add(suspensionLine); 

  let busLineCircle1Row2 = new Konva.Circle({
    x: startX + w_min * 0.25, 
    y: startY + h_min * 0.75,
    radius: 3,
    fill: 'white',
    // stroke: 'black',
    // strokeWidth: 4
  });
  layer.add(busLineCircle1Row2); 

  let busCurveLineRow2 =  new Konva.Line({
    points: [startX + w_min * 0.25, startY + h_min * 0.75, startX + w_min * 0.375, startY + h_min * 0.65, startX + w_min * 0.5, startY + h_min * 0.75],
    stroke: 'white',
    strokeWidth: stroke_Width,
    lineCap: 'round',
    lineJoin: 'round',
    tension: 0.5
  });
  layer.add(busCurveLineRow2);

  let busLineCircle2Row2 = new Konva.Circle({
    x: startX + w_min * 0.5, 
    y: startY + h_min * 0.75,
    radius: 3,
    fill: 'white',
    // stroke: 'black',
    // strokeWidth: 4
  });
  layer.add(busLineCircle2Row2);  


  let busConnectLine2 =  new Konva.Line({
    points: [startX + w_min * 0.5, startY + h_min * 0.75, startX + w_min * 0.65, startY + h_min * 0.75 ],
    stroke: 'white',
    strokeWidth: stroke_Width,
    lineCap: 'round',
    lineJoin: 'round'
  });
  layer.add(busConnectLine2);

  let busLine = new Konva.Line({
    points: [startX + w_min * 0.65, startY + h_min * 0.15, startX + w_min * 0.65, startY + h_min * 0.75 ],
    stroke: 'white',
    strokeWidth: stroke_Width,
    lineCap: 'round',
    lineJoin: 'round'
  });
  layer.add(busLine);

  let busConnectLine3 =  new Konva.Line({
    points: [startX + w_min * 0.65, startY + h_min * 0.15, startX + w_min * 1.2, startY + h_min * 0.15 ],
    stroke: 'white',
    strokeWidth: stroke_Width,
    lineCap: 'round',
    lineJoin: 'round'
  });
  layer.add(busConnectLine3);

  // access out
  if (connectPoint[1] !== startY + h_min * 0.75) {
    // let breakPoint = [connectPoint[0], startY + (h_min / 2)]
    let connectLineToInterConnecter = new Konva.Line({
      points: [startX + 0.25 * w_min, startY + h_min * 0.75, connectPoint[0], startY + h_min * 0.75, connectPoint[0], connectPoint[1] ],
      stroke: 'white',
      strokeWidth: stroke_Width,
      lineCap: 'round',
      lineJoin: 'round'
    });
    layer.add(connectLineToInterConnecter);
  } else {
    let connectLineToInterConnecter = new Konva.Line({
      points: [startX + 0.25 * w_min, startY + h_min * 0.75, connectPoint[0], connectPoint[1] ],
      stroke: 'white',
      strokeWidth: stroke_Width,
      lineCap: 'round',
      lineJoin: 'round'
    });
    layer.add(connectLineToInterConnecter);
  } 

  // bottom value
  let bottomValue = new Konva.Text({
    x: startX,
    y: startY + h_min * 1.05,
    text: 'Server Panel',
    fontSize: font_size,
    fontFamily: 'Calibri',
    fill: 'white'
  });
  layer.add(bottomValue);

  return({
    type: actionTypes.SERVERPANEL,
    connectPoint: [startX + w_min * 1.2, startY + h_min * 0.15],
    distance: nextDistance,
    layer: layer
  });
}

export const Meter = (layer, distance, connectPoint) => {
  let w_min = 30;
  let h_min = 30;
  let stroke_Width = 2;
  let font_size = Math.floor(h_min / 7);
  let nextDistance = 0;
  let finalPosition = null;
  if (font_size < 8) {
    font_size = 8;
  }

  if (window.innerWidth * 0.02 > w_min) {
      w_min = window.innerWidth * 0.02;
      h_min = window.innerWidth * 0.02;
      font_size = Math.floor(h_min / 7);
  }
  if (font_size < 12) {
    font_size = 12;
  }

  let startX = window.innerWidth * 0.02 + distance;
  let startY = (window.innerHeight * 0.15);
  nextDistance = startX + w_min;
  finalPosition = nextDistance + w_min * 2;
  let MeterBounary = new Konva.Rect({
    x: startX,
    y: startY,
    width:  w_min,
    height: h_min,
    stroke: 'white',
    strokeWidth: stroke_Width
  })
  layer.add(MeterBounary);

  let meterCicle = new Konva.Circle({
    x: startX + w_min * 0.5, 
    y: startY + h_min * 0.5,
    radius: w_min * 0.35,
    fill: 'white',
    stroke: 'white',
    strokeWidth: stroke_Width
  });
  layer.add(meterCicle);  

  if (connectPoint[1] !== startY + h_min * 0.5) {
    // let breakPoint = [connectPoint[0], startY + (h_min / 2)]
    let connectLineToInterConnecter = new Konva.Line({
      points: [startX, startY + h_min * 0.5, connectPoint[0], startY + h_min * 0.5, connectPoint[0], connectPoint[1] ],
      stroke: 'white',
      strokeWidth: stroke_Width,
      lineCap: 'round',
      lineJoin: 'round'
    });
    layer.add(connectLineToInterConnecter);
  } else {
    let connectLineToInterConnecter = new Konva.Line({
      points: [startX, startY + (h_min / 2), connectPoint[0], connectPoint[1] ],
      stroke: 'white',
      strokeWidth: stroke_Width,
      lineCap: 'round',
      lineJoin: 'round'
    });
    layer.add(connectLineToInterConnecter);
  } 

  // bottom value
  let bottomValue = new Konva.Text({
    x: startX,
    y: startY + h_min * 1.05,
    text: 'Meter',
    fontSize: font_size,
    fontFamily: 'Calibri',
    fill: 'white'
  });
  layer.add(bottomValue);
  return({
    type: actionTypes.METER,
    connectPoint: [startX + 0.25 * w_min, startY + h_min * 0.75],
    distance: nextDistance,
    maxWidth: finalPosition,
    layer: layer
  });
}