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
import * as classes from './drawingkeepoutList.module.css';
import { emptyListTemplate } from '../../../../../components/ui/EmptyTemplate/emptyListTemplate';
import CreateKeepoutForm from './createKeepoutForm';

const DrawKeepoutList = (props) => {

  const createNewKeepoutCard = (
    <Card
      bordered={false}
    >
      <CreateKeepoutForm />
    </Card>
  )

  const keepoutCard = (keepoutProps) => {
    console.log(keepoutProps)
    return (
      <Card
        className={classes.keepoutCard}
        hoverable
        bordered={true}
        actions={[
          <Button type="primary" icon='setting' shape='circle' size='small' ghost />,
          <Button type="primary" icon='edit' shape='circle' size='small' ghost />,
          <Button type='danger' icon='delete' shape='circle' size='small' ghost />,
        ]}
      >
        {keepoutProps.type}
      </Card>
    );
  };

  const header = (
    <Layout>
    <Row>
      <Col span={22}>
        <h3>Keepouts</h3>
      </Col>
      <Col span={2}>
        <Button
          type='primary'
          size='small'
          shape='circle'
          icon={props.initialForm ? 'minus' : 'plus'}
          onClick={
            props.initialForm ?
            props.setInitialFormFalse :
            props.setInitialFormTrue
          }
          ghost
        />
      </Col>
    </Row>
    <Row>
      {props.initialForm ? createNewKeepoutCard : null}
    </Row>
    </Layout>
  )

  const list = (
    <ConfigProvider renderEmpty={() => emptyListTemplate({type: 'Keepout'})}>
      <List
        header={header}
        dataSource={props.keepoutList}
        renderItem={item => (
          <List.Item className={classes.keepoutListItem}>
            {keepoutCard(item)}
          </List.Item>
        )}
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
    initialForm:
      state.undoableReducer.present.drawingKeepoutManagerReducer.initialForm,
    keepoutList:
      state.undoableReducer.present.drawingKeepoutManagerReducer.keepoutList,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setInitialFormTrue: () => dispatch(actions.setInitialFormTrue()),
    setInitialFormFalse: () => dispatch(actions.setInitialFormFalse()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawKeepoutList);
