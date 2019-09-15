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
import CreateKeepoutForm from './createKeepoutForm';
import NormalKeepoutListItem from './normalKeepoutListItem';

class DrawKeepoutList extends Component {
  state = {
    initialForm: false
  }

  toggoleInitialForm = () => {
    this.setState({
      initialForm: !this.state.initialForm
    })
  };

  generateListItems = (item) => {
    switch (item.type) {
      case 'Keepout':
        return <NormalKeepoutListItem {...item} />

      default:
        return <NormalKeepoutListItem {...item} />
    }
  };

  render () {
    const createNewKeepoutCard = (
      <Card
        bordered={false}
        bodyStyle={{padding: '5px'}}
      >
        <CreateKeepoutForm toggoleInitialForm={this.toggoleInitialForm}/>
      </Card>
    );

    const header = (
      <div>
      <Row>
        <Col span={22}>
          <h3>Keepouts</h3>
        </Col>
        <Col span={2}>
          <Button
            type='primary'
            size='small'
            shape='circle'
            disabled={uiStateJudge.isWorkingKeepout(this.props.uiState)}
            icon={this.state.initialForm ? 'minus' : 'plus'}
            onClick={this.toggoleInitialForm}
            ghost
          />
        </Col>
      </Row>
      <Row>
        {this.state.initialForm ? createNewKeepoutCard : null}
      </Row>
      </div>
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
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,
    keepoutList:
      state.undoableReducer.present.drawingKeepoutManagerReducer.keepoutList,
  };
};

export default connect(mapStateToProps)(DrawKeepoutList);
