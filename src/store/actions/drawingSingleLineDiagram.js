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


    let w = 300;
    let h = 200;
    let startX = window.innerWidth * 0.1;
    let startY = window.innerHeight * 0.1;
    let panelArrayBounary = new Konva.Rect({
      x: startX,
      y: startY,
      width: startX + w/2,
      height: startY + h/2,
      
      stroke: 'white',
      strokeWidth: 3,
      dash: [15, 10]
    })

    layer.add(panelArrayBounary);

  return({
    type: actionTypes.INIT_STAGE,
    stageWidth: window.innerWidth,
    stageHeight: window.innerHeight,
    layer: layer
  });
}

