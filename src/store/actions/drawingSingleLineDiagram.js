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

    panelArrayCollection(layer);
  return({
    type: actionTypes.INIT_STAGE,
    stageWidth: window.innerWidth,
    stageHeight: window.innerHeight,
    layer: layer
  });
}

export const panelArrayCollection = (layer) =>{
  let w_min = 350;
  let h_min = 225;
  let stroke_Width = 2;
  // startPoint
  let startX = window.innerWidth * 0.1;
  let startY = window.innerHeight * 0.15;
  if (window.innerWidth * 0.12 > w_min) {
    w_min = window.innerWidth * 0.1
  }
  if (window.innerHeight * 0.1 > h_min) {
    h_min = window.innerHeight * 0.1
  }
  // draw dash boundary box
  let panelArrayBounary = new Konva.Rect({
    x: startX,
    y: startY,
    width:  w_min,
    height: h_min,
    stroke: 'white',
    strokeWidth: 3,
    dash: [15, 15]
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
    fontSize: 30,
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
    fontSize: 30,
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
    fontSize: 20,
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
  layer.add(leftTriangleThree);

  // dynamic value
  let panelIndex3 = new Konva.Text({
    x: lastPanelStartPointX + lastPanelWidth * 0.5,
    y: lastPanelStartPointY + lastPanelHeight * 0.1,
    text: '21',
    fontSize: 30,
    fontFamily: 'Calibri',
    fill: 'white'
  });
  layer.add(panelIndex3);

  // =====================Array Information===============
  let StringCount = new Konva.Text({
    x: startPanelPointX,
    y: startPanelPointY + firstPanelHeight * 1.5,
    text: 'String Count: 2',
    fontSize: 30,
    fontFamily: 'Calibri',
    fill: 'white'
  });
  layer.add(StringCount);

  let ModuleCount = new Konva.Text({
    x: startPanelPointX,
    y: startPanelPointY + firstPanelHeight * 1.5 + 30,
    text: 'Module Count: 42',
    fontSize: 30,
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
    fontSize: 30,
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
    fontSize: 30,
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
  layer.add(leftTriangleThreeRow3);

  // dynamic value
  let panelIndex3Row3 = new Konva.Text({
    x: lastPanelRow3StartPointX + lastPanelRow3Width * 0.5,
    y: lastPanelRow3StartPointY + lastPanelRow3Height * 0.1,
    text: '21',
    fontSize: 30,
    fontFamily: 'Calibri',
    fill: 'white'
  });
  layer.add(panelIndex3Row3);

  //bottom Value
  let bottomValue = new Konva.Text({
    x: startX + w_min * 0.25,
    y: startY + h_min * 1.05,
    text: 'CS6X - 300P',
    fontSize: 30,
    fontFamily: 'Calibri',
    fill: 'white'
  });
  layer.add(bottomValue);
  return({
    type: actionTypes.PANEL_ARRAY_COLLECTION,
    layer: layer
  });
}

