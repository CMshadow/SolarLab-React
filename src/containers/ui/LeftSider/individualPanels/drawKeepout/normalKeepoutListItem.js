import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faCog, faTrash } from '@fortawesome/pro-light-svg-icons'
import {
  List,
  Button,
  Card
} from 'antd';

import * as actions from '../../../../../store/actions/index';
import * as classes from './normalKeepoutListItem.module.css';
import EditKeepoutForm from './editKeepoutForm';

class NormalKeepoutListItem extends Component {
  state = {
    enableEdit: false,
    enableDrawing: false
  };

  toggleEdit = () => {
    this.setState({
      enableEdit: !this.state.enableEdit
    });
  };

  toggleDrawing = () => {
    this.setState({
      enableDrawing: !this.state.enableDrawing
    });
    if (this.props.uiState === 'DRAWING_KEEPOUT') {
      this.props.setPreviousUIState();
    } else {
      this.props.setUIStateDrawingKeepout();
    }
  };

  render() {
    const editCard = (
      <Card
        className = {classes.editCard}
        bordered={false}
        bodyStyle={{padding: '5px'}}
      >
        <EditKeepoutForm {...this.props} toggleEdit={this.toggleEdit}/>
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
            disabled={this.props.uiState === 'DRAWING_KEEPOUT'}
            onClick={this.toggleEdit}
            ghost={!this.state.enableEdit}
          >
            <FontAwesomeIcon icon={faCog} />
          </Button>,
          <Button
            type="primary"
            shape='circle'
            size='small'
            disabled={
              this.props.uiState === 'DRAWING_KEEPOUT' &&
              !this.state.enableDrawing
            }
            onClick={this.toggleDrawing}
            ghost={!this.state.enableDrawing}
          >
            <FontAwesomeIcon icon={faPen} />
          </Button>,
          <Button
            type='danger'
            shape='circle'
            size='small'
            disabled={this.props.uiState === 'DRAWING_KEEPOUT'}
            onClick={() => this.props.deleteKeepout(this.props.id)}
            ghost
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>,
        ]}
      >
        Keepout
      </List.Item>
    );
  }
};

const mapStateToProps = state => {
  return {
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteKeepout: (id) => dispatch(actions.deleteKeepout(id)),
    setPreviousUIState: () => dispatch(actions.setPreviousUIState()),
    setUIStateDrawingKeepout: () => dispatch(actions.setUIStateDrawingKeepout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NormalKeepoutListItem);
