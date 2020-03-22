import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDrone } from '@fortawesome/pro-light-svg-icons'
import {
  Divider,
  Row,
  Col,
  Button,
  Icon
} from 'antd';
import { FormattedMessage } from 'react-intl';

import * as actions from '../../../../store/actions/index';

const HomePanel = (props) => {
  return (
    <div style={{padding: '24px 10px 20px', overflow: 'auto'}}>
      <Row>
        <Col span={18} offset={3}>
          <Button type='primary' shape='round' size='large' block ghost
            onClick={props.setUIStateManageBuilding}
          >
            <Icon type='bars'/><FormattedMessage id='manageBuilding' />
          </Button>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={18} offset={3}>
          <Button type='primary' shape='round' size='large' block ghost
            onClick={props.setUIStateCreateNewBuilding}
          >
            <Icon type='plus'/><FormattedMessage id='createNewBuilding' />
          </Button>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={18} offset={3}>
        <Button type='primary' shape='round' size='large' block ghost disabled>
          <FontAwesomeIcon icon={faDrone} />
          <FormattedMessage id='manageDroneModel' />
        </Button>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    uiState:
      state.undoable.present.uiStateManager.uiState,
    workingBuilding:
      state.undoable.present.buildingManager.workingBuilding
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUIStateCreateNewBuilding: () => dispatch(
      actions.setUIStateCreateNewBuilding()
    ),
    setUIStateManageBuilding: () => dispatch(actions.setUIStateManageBuilding())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePanel);
