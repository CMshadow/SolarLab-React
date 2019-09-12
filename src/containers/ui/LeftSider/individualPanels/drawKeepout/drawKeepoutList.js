import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/pro-light-svg-icons'
import {
  Layout,
  ConfigProvider,
  List,
  Card,
  Row,
  Col,
  Button,
} from 'antd';

import * as actions from '../../../../../store/actions/index';
import { emptyListTemplate } from '../../../../../components/ui/EmptyTemplate/emptyListTemplate';
import CreateKeepoutForm from './createKeepoutForm';

const DrawFoundButton = (props) => {

  const createNewKeepoutCard = (
    <Card
      bordered={false}
    >
      <CreateKeepoutForm />
    </Card>
  )

  const header = (
    <Layout>
    <Row>
      <Col span={22}>
        <h3>Keepout</h3>
      </Col>
      <Col span={2}>
        <Button type='primary' size='small'shape='circle' icon='plus' ghost />
      </Col>
    </Row>
    <Row>
      {createNewKeepoutCard}
    </Row>
    </Layout>
  )

  const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ];

  const list = (
    <ConfigProvider renderEmpty={() => emptyListTemplate({type: 'Keepout'})}>
      <List
        header={header}
        renderItem={item => <List.Item>{item}</List.Item>}
      >
      </List>
    </ConfigProvider>
  )

  return (
    <Row>
      <Col span={20} offset={2}>
        {list}
      </Col>
    </Row>
  );
};

const mapStateToProps = state => {
  return {
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    enableRotate: () => dispatch(actions.enableRotate()),
    disableRotate: () => dispatch(actions.disableRotate()),
    setUIStateDrawingFound: () => dispatch(actions.setUIStateDrawingFound()),
    setUIStateFoundDrew: () => dispatch(actions.setUIStateFoundDrew()),
    setUIStateEditingFound: () => dispatch(actions.setUIStateEditingFound())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawFoundButton);
