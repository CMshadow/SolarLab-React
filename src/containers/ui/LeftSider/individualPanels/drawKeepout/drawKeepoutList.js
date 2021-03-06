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
import { FormattedMessage } from 'react-intl';


import * as uiStateJudge from '../../../../../infrastructure/ui/uiStateJudge';
import {
  emptyListTemplate
} from '../../../../../components/ui/EmptyTemplate/emptyListTemplate';
import CreateKeepoutForm from './createKeepoutForm';
import KeepoutListItem from './keepoutListItem';

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
    return <KeepoutListItem {...item} />
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
          <h3><FormattedMessage id='keep_outs' /></h3>
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
    uiState:
      state.undoable.present.uiStateManager.uiState,
    keepoutList:
      state.undoable.present.drawingKeepoutManager.keepoutList,
  };
};

export default connect(mapStateToProps)(DrawKeepoutList);
