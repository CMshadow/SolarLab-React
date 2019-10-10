import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPen,
  faCog,
  faTrash,
  faCheck
} from '@fortawesome/pro-light-svg-icons'
import {
  List,
  Button,
  Card
} from 'antd';

import * as actions from '../../../../../store/actions/index';
import * as classes from './keepoutListItem3D.module.css';
import * as uiStateJudge from '../../../../../infrastructure/ui/uiStateJudge';
import EditKeepoutForm3D from './editKeepoutForm3D';

class KeepoutListItem extends Component {
  state = {
    enableEdit: false,
  };

  toggleEdit = () => {
    this.setState({
      enableEdit: !this.state.enableEdit
    });
  };

  render() {
    const editCard = (
      <Card
        className = {classes.editCard}
        bordered={false}
        bodyStyle={{padding: '5px'}}
      >
        <EditKeepoutForm3D {...this.props} toggleEdit={this.toggleEdit}/>
      </Card>
    );
    return (
      <List.Item
        extra={this.state.enableEdit ? editCard : null}
        actions={[
          <Button
            type="primary"
            shape='circle'
            size='small'
            onClick={this.toggleEdit}
            ghost={!this.state.enableEdit}
          >
            <FontAwesomeIcon icon={faCog} />
          </Button>
        ]}
      >
        {this.props.type}
      </List.Item>
    );
  }
};

export default KeepoutListItem;
