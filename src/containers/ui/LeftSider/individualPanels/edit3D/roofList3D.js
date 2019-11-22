import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ConfigProvider,
  List,
  Card,
  Row,
  Col,
  Button,
} from 'antd';

import * as actions from '../../../../../store/actions/index';
import * as uiStateJudge from '../../../../../infrastructure/ui/uiStateJudge';
import {
  emptyListTemplate
} from '../../../../../components/ui/EmptyTemplate/emptyListTemplate';
import RoofListItem3D from './roofListItem3D';
import PitchedRoofListItem3D from './pitchedRoofListItem3D';

class RoofList3D extends Component {

  render () {
    const header = (
      <Row type="flex" justify="center">
        <h3>Adjust Roof</h3>
      </Row>
    );

    return (
      <Row>
        <Col span={20} offset={2}>
          <ConfigProvider renderEmpty={() => emptyListTemplate({type: 'Roof'})}>
            <List
              header={header}
              size='large'
              dataSource={
                this.props.workingBuilding.type === 'FLAT' ?
                this.props.buildingFoundation :
                this.props.rooftopCollection.rooftopCollection
              }
              renderItem={(item,i) => {
                return this.props.workingBuilding.type === 'FLAT' ?
                <RoofListItem3D roofIndex={i} {...item} /> :
                <PitchedRoofListItem3D roofIndex={i} {...item} />
              }}
            />
          </ConfigProvider>
        </Col>
      </Row>
    );
  };
};

const mapStateToProps = state => {
  return {
    workingBuilding:
      state.buildingManagerReducer.workingBuilding,
    buildingFoundation:
      state.undoableReducer.present.drawingPolygonManagerReducer
      .BuildingFoundation,
    rooftopCollection:
      state.undoableReducer.present.drawingRooftopManagerReducer
      .RooftopCollection
  };
};

export default connect(mapStateToProps)(RoofList3D);
