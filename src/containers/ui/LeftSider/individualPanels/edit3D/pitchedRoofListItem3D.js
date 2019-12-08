import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/pro-light-svg-icons'
import {
  List,
  Button,
  Card
} from 'antd';

import * as actions from '../../../../../store/actions/index';
import * as classes from './roofListItem3D.module.css';
import * as uiStateJudge from '../../../../../infrastructure/ui/uiStateJudge';
import EditPitchedRoofForm from './editPitchedRoofForm3D';

class PitchedRoofListItem3D extends Component {
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
        <EditPitchedRoofForm {...this.props} toggleEdit={this.toggleEdit}/>
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
            onClick={() => {
              this.toggleEdit();
              console.log(this.props)
            }}
            ghost={!this.state.enableEdit}
          >
            <FontAwesomeIcon icon={faCog} />
          </Button>
        ]}
      >
        {`Pitched Roof ${this.props.roofIndex+1}`}
      </List.Item>
    );
  }
};

export default PitchedRoofListItem3D;
