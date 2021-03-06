import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/pro-light-svg-icons'
import {
  List,
  Button,
  Card
} from 'antd';
import { injectIntl } from 'react-intl';

import * as classes from './keepoutListItem3D.module.css';
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
    // console.log(this.props.type)
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
        {this.props.intl.formatMessage({id: this.props.type})}
      </List.Item>
    );
  }
};

export default injectIntl(KeepoutListItem);
