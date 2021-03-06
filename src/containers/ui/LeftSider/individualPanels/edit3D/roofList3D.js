import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ConfigProvider,
  List,
  Row,
  Col,
} from 'antd';
import { FormattedMessage } from 'react-intl';

import {
  emptyListTemplate
} from '../../../../../components/ui/EmptyTemplate/emptyListTemplate';
import RoofListItem3D from './roofListItem3D';
import PitchedRoofListItem3D from './pitchedRoofListItem3D';

class RoofList3D extends Component {
  state = {
    editingRoofIndex: null
  };

  setEditingRoofIndex = (roofIndex) => {
    this.setState({
      editingRoofIndex: roofIndex
    });
  };

  releaseEditingRoofIndex = () => {
    this.setState({
      editingRoofIndex: null
    });
  };

  render () {
    const header = (
      <Row type="flex" justify="center">
        <h3><FormattedMessage id='adjustRoof' /></h3>
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
                <PitchedRoofListItem3D
                  roofIndex={i}
                  editingRoofIndex={this.state.editingRoofIndex}
                  setEditingRoofIndex={this.setEditingRoofIndex}
                  releaseEditingRoofIndex={this.releaseEditingRoofIndex}
                  {...item}
                />
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
      state.undoable.present.buildingManager.workingBuilding,
    buildingFoundation:
      state.undoable.present.drawingPolygonManager.BuildingFoundation,
    rooftopCollection:
      state.undoable.present.drawingRooftopManager.RooftopCollection
  };
};

export default connect(mapStateToProps)(RoofList3D);
