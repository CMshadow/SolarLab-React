import React from 'react';
// import Konva from 'konva';
// import { Stage, Layer, Rect, Text } from 'react-konva';
import SketchStage from '../../containers/SketchDiagram/SketchDiagram';
import LeftSider from '../../containers/SketchDiagram/SketchDiagramUI/LeftSider/LeftSider';
import Aux from '../../hoc/Auxiliary/Auxiliary'

const SketchDiagram = () => {
    return(
      <Aux>
        <SketchStage />
        <LeftSider />
      </Aux>

    );
}

export default SketchDiagram;
