import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Button, Spin } from 'antd';
import Konva from 'konva';
import { Stage, Layer, Rect, Text } from 'react-konva';

import * as actions from '../../store/actions/index';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import LeftSider from './SketchDiagramUI/LeftSider/LeftSider';

const { Content } = Layout;

class SketchDiagram extends Component {
  state = {
    // button: <Button
    //   type = 'primary'
    //   size = 'large'
    //   shape = 'round'
    //   block
    //   onClick = {() => {
    //     // this.props.createSingleLineDiagram();
    //     console.log("tset")
    //     this.initState();
    //   }}
    // >Generate 2D Diagram</Button>
  }

  componentDidMount() {
    /*
    // log stage react wrapper
    console.log(this.refs.stage);
    // log Konva.Stage instance
    console.log(this.refs.stage.getStage());
    */
    this.initState();

  }
  initState() {

    this.stage = this.refs.stage.getStage();
    this.gradient = 50;
    this.Sketch = new Konva.Layer();
    this.FlatGroup = new Konva.Group({
      draggable: true
    });
    //draw grid background
    this.props.createSketchDiagram(this.Sketch, this.FlatGroup, window.innerWidth, window.innerHeight);
    // //draw flat building
    console.log(window.innerWidth)
    this.stage.add(this.Sketch);
  }

  render(){
    console.log(window.innerWidth)
    return (
      <Aux>
        {/* {this.state.button} */}
        <Spin 
          
          tip={<h1 style={{paddingTop: "10px", color: "#4b77bf"} }>  
            Loading POA Irradiance... </h1>}
          size = "large"
          spinning={!this.props.spinON}
          style = {{position: "absolute", top: (window.innerHeight/2)}}
        >
        
          <Stage
            ref="stage"
            style={{position: "absolute", top:64, left:0, right:0, bottom:0}}
            height={window.innerHeight - 64}
            width={window.innerWidth}
          />
        </Spin>
          
        
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    // buildingDiagramStageWidth:
    //   state.drawingSingleLineDiagramReducer.backgroundRect,
    // buildingDiagramStageHeight:
    //   state.drawingSingleLineDiagramReducer.stageHeight,
    // buildingDiagramLayer:
    // state.drawingSingleLineDiagramReducer.layer
    spinON: 
      state.undoable.present.drawingSketchDiagramManager.spinON
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createSketchDiagram: (layer, group, screenWidth, screenHeight) =>
      dispatch(actions.initStageSketchDiagram(layer, group, screenWidth, screenHeight)),
 };
};

export default connect(mapStateToProps,mapDispatchToProps)(SketchDiagram);