import React, { Component } from 'react';
import { connect } from 'react-redux';
import Konva from 'konva';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { Button } from 'antd';
import * as actions from '../../../store/actions/index';

import Aux from '../../../hoc/Auxiliary/Auxiliary';

class  SingleLineDiagramStage extends Component {

  state = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  componentDidMount() {
    // log stage react wrapper
    // console.log(this.refs.stage);
    // log Konva.Stage instance
    // console.log(this.refs.stage.getStage());
    
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
    this.props.createSingleLineDiagram(this.Sketch);
    // //draw flat building
    this.stage.add(this.Sketch);
    // this.setState({width: this.props.buildingDiagramStageWidth});
    // this.setState({height: this.props.buildingDiagramStageHeight})
    console.log("height: "+this.props.buildingDiagramStageHeight)
  }


  render(){
    return (
      <Aux>
        {/* {this.state.button} */}
        <Stage ref="stage" height={this.props.buildingDiagramStageHeight} width={this.props.buildingDiagramStageWidth}/>
      </Aux>
    );
  } 
  
};


const mapStateToProps = state => {
  return {
    buildingDiagramStageWidth:
      state.drawingSingleLineDiagramReducer.stageWidth,
    buildingDiagramStageHeight:
      state.drawingSingleLineDiagramReducer.stageHeight,
    buildingDiagramLayer:
    state.drawingSingleLineDiagramReducer.layer
    
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createSingleLineDiagram: (layer) =>
      dispatch(actions.initStage(layer)),
 };
};

export default connect(mapStateToProps,mapDispatchToProps)(SingleLineDiagramStage);

