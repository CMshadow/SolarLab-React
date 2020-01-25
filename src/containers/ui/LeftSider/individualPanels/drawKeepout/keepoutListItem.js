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
import { injectIntl } from 'react-intl';

import * as actions from '../../../../../store/actions/index';
import * as classes from './keepoutListItem.module.css';
import * as uiStateJudge from '../../../../../infrastructure/ui/uiStateJudge';
import EditKeepoutForm from './editKeepoutForm';

class KeepoutListItem extends Component {
  state = {
    enableEdit: false,
    enableDrawing: false,
    editingButton: false,
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
    if (uiStateJudge.isWorkingKeepout(this.props.uiState)) {
      this.props.setPreviousUIState();
      this.props.releaseLinkedKeepoutIndex();
      this.props.enableRotate();
    } else {
      if (this.props.finishedDrawing) {
        this.props.setUIStateEditingKeepout();
      } else {
        this.props.setUIStateDrawingKeepout();
      }
      this.props.initLinkedKeepoutIndex(this.props.id);
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
            disabled={uiStateJudge.isWorkingKeepout(this.props.uiState)}
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
              uiStateJudge.isWorkingKeepout(this.props.uiState) &&
              !this.state.enableDrawing
            }
            onClick={this.toggleDrawing}
            ghost={!this.state.enableDrawing}
          >
            <FontAwesomeIcon
              icon={this.props.finishedDrawing ? faCheck : faPen}
            />
          </Button>,
          <Button
            type='danger'
            shape='circle'
            size='small'
            disabled={uiStateJudge.isWorkingKeepout(this.props.uiState)}
            onClick={() => this.props.deleteKeepout(this.props.id)}
            ghost
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>,
        ]}
      >
        {this.props.intl.formatMessage({id: this.props.type})}
      </List.Item>
    );
  }
};

const mapStateToProps = state => {
  return {
    uiState:
      state.undoable.present.uiStateManager.uiState,
    keepoutList:
      state.undoable.present.drawingKeepoutManager.keepoutList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    enableRotate: () => dispatch(actions.enableRotate()),
    deleteKeepout: (id) => dispatch(actions.deleteKeepout(id)),
    setPreviousUIState: () => dispatch(actions.setPreviousUIState()),
    setUIStateDrawingKeepout: () => dispatch(actions.setUIStateDrawingKeepout()),
    setUIStateEditingKeepout: () => dispatch(actions.setUIStateEditingKeepout()),
    initLinkedKeepoutIndex: (id) => dispatch(actions.initLinkedKeepoutIndex(id)),
    releaseLinkedKeepoutIndex: () => dispatch(
      actions.releaseLinkedKeepoutIndex()
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(KeepoutListItem));
