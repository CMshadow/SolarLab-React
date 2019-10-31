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
import KeepoutListItem3D from './keepoutListItem3D';

class KeepoutList3D extends Component {

  generateListItems = (item) => {
    return <KeepoutListItem3D {...item} />
  };

  render () {
    const header = (
      <Row type="flex" justify="center">
        <h3>Adjust Keepouts</h3>
      </Row>
    );

    return (
      <Row>
        <Col span={20} offset={2}>
          <ConfigProvider renderEmpty={() => emptyListTemplate({type: 'Keepout'})}>
            <List
              header={header}
              size='large'
              dataSource={this.props.keepoutList}
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
    keepoutList:
      state.undoableReducer.present.drawingKeepoutManagerReducer.keepoutList,
  };
};

export default connect(mapStateToProps)(KeepoutList3D);
