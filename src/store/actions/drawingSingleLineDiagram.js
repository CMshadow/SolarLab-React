import Konva from 'konva';
import { Stage, Layer, Rect, Text } from 'react-konva';

import * as actions from './index'
import * as actionTypes from './actionTypes';

export const initStage = (layer) => {
  // let layer = new Konva.Layer();
  
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

    let pancelCollection = panelArrayCollection(layer, 4);
    let combinerCollection = CombinerBoxCollections(layer, 250, pancelCollection.connectPoint1, pancelCollection.connectPoint2, 4);
    DisconnectCollection(layer, combinerCollection.distance, 3 ,2);
  return({
    type: actionTypes.INIT_STAGE,
    stageWidth: window.innerWidth,
    stageHeight: window.innerHeight,
    layer: layer
  });
}

export const panelArrayCollection = (layer, numOfArray) =>{
  let w_min = 250;
  let h_min = 125;
  let stroke_Width = 2;
  let font_size = 15;
  let connectAccess1 = [];
  let connectAccess2 = [];
  for (let i = 0; i < numOfArray; ++i) {
   
    // startPoint
    
    if (window.innerWidth * 0.12 > w_min) {
      w_min = window.innerWidth * 0.1
    }
    if (window.innerHeight * 0.1 > h_min) {
      h_min = window.innerHeight * 0.1
    }
    
    let startX = window.innerWidth * 0.1;
    let startY = (window.innerHeight * 0.15) + (h_min * 1.8) * i;
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
      text: '21',
      fontSize: font_size,
      fontFamily: 'Calibri',
      fill: 'white'
    });
    layer.add(panelIndex3);

    // =====================Array Information===============
    let StringCount = new Konva.Text({
      x: startPanelPointX,
      y: startPanelPointY + firstPanelHeight * 1.5,
      text: 'String Count: 2',
      fontSize: font_size,
      fontFamily: 'Calibri',
      fill: 'white'
    });
    layer.add(StringCount);

    let ModuleCount = new Konva.Text({
      x: startPanelPointX,
      y: startPanelPointY + firstPanelHeight * 1.5 + 30,
      text: 'Module Count: 42',
      fontSize: font_size,
      fontFamily: 'Calibri',
      fill: 'white'
    });
    layer.add(ModuleCount);

    // =====================SECOND ROW =====================
    // draw first panel of second row
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
      y: secondPanelStartPointYSecondRow + secondPanelHeightSecondRow * 0.1,
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
      text: '21',
      fontSize: font_size,
      fontFamily: 'Calibri',
      fill: 'white'
    });
    layer.add(panelIndex3Row3);

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
    distance: w_min,
    connectPoint1: connectAccess1,
    connectPoint2: connectAccess2
  });
}


export const CombinerBoxCollections = (layer, distance, connectPoint1, connectPoint2, numOfCombiner) => {
  let w_min = 125;
  let h_min = 125;
  let stroke_Width = 2;
  let font_size = 15;
  let nextDistance = 0;
  // startPoint
  for (let i = 0; i < numOfCombiner; ++i) {
    if (window.innerWidth * 0.05 > w_min) {
      w_min = window.innerWidth * 0.05;
      h_min = window.innerWidth * 0.05
    }
    // if (window.innerHeight * 0.1 > h_min) {
    //   h_min = window.innerHeight * 0.1
    // }
    
    let startX = window.innerWidth * 0.1 + distance * 1.3;
    let startY = (window.innerHeight * 0.15) + (h_min * 1.8) * i;

    let panelArrayBounary = new Konva.Rect({
        x: startX,
        y: startY,
        width:  w_min,
        height: h_min,
        stroke: 'white',
        strokeWidth: stroke_Width
    })
    layer.add(panelArrayBounary);
    nextDistance = startX + window.innerWidth * 0.01;

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
  


  return({
    type: actionTypes.COMBINER_BOX_COLLECTIONS,
    connectPoint: null,
    distance: nextDistance,
    layer: layer
  });

}


export const DisconnectCollection = (layer, distance, numOfDisconnect ,inverterAccess) => {
  let w_min = 100;
  let h_min = 125 + (inverterAccess - 2) * 15;
  let stroke_Width = 2;
  let font_size = 15;
 
  for (let i = 0; i < numOfDisconnect; ++i) {
    if (window.innerWidth * 0.05 > w_min) {
      w_min = window.innerWidth * 0.05;
    }
    
    // if (window.innerHeight * 0.1 > h_min) {
    //   h_min = window.innerHeight * 0.1
    // }
    
    let startX = window.innerWidth * 0.1 + distance;
    let startY = (window.innerHeight * 0.15) + (h_min * 1.8) * i;

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
    let circleAccessInList = [];
    let circleAccessOutList = [];
    for (let i = 1; i <= inverterAccess; ++i) {
      let circle1 = new Konva.Circle({
        x: startX + 0.2 * w_min, 
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
      circleAccessOutList.push([startX + 0.8 * w_min, startY + (h_min / (inverterAccess + 1)) * i ])
      layer.add(circle2);

      let switchOffsetY = h_min / (inverterAccess + 1);
      let switchOffsetX = startX + 0.3 * w_min;
      let switchLine = new Konva.Line({
        points: [switchOffsetX, startY + (switchOffsetY) * (i - 0.3), startX + 0.8 * w_min, startY + (h_min / (inverterAccess + 1)) * i ],
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
      layer.add(accessOutLine);
    }
    
  }
  

  
  return({
    type: actionTypes.DISCONNECT_CELLECTION,
    connectPoint: null,
    layer: layer
  });
}
