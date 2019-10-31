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

class RoofList3D extends Component {

  generateListItems = (item) => {
    return <RoofListItem3D {...item} />
  };

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
              dataSource={this.props.buildingFoundation}
              renderItem={item => (this.generateListItems(item))}
            />
          </ConfigProvider>
        </Col>
      </Row>
    );
  };
};

const mapStateToProps = state => {
  return {
    buildingFoundation:
      state.undoableReducer.present.drawingPolygonManagerReducer.BuildingFoundation,
  };
};

export default connect(mapStateToProps)(RoofList3D);
