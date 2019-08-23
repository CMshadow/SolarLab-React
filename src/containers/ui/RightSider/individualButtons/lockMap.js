import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  Tooltip,
  Row,
  Button,
} from 'antd';

import * as actions from '../../../../store/actions/index';


class LockMap extends PureComponent {

  toggleRotate = () => {
    if (this.props.enableRotateStatus) {
      this.props.disableRotate();
    } else {
      this.props.enableRotate();
    }
  };

  render () {
    return (
      <Row>
        <Tooltip
          placement='bottomRight'
          title={
            this.props.enableRotateStatus ?
            'Lock moving map' :
            'Unlock moving map'
          }
        >
          <Button
            type={
              this.props.enableRotateStatus ?
              'primary' :
              'danger'
            }
            shape='circle'
            icon={
              this.props.enableRotateStatus ?
              'unlock' :
              'lock'
            }
            size='large'
            onClick={this.toggleRotate}
          />
        </Tooltip>
      </Row>
    );
  };
};

const mapStateToProps = state => {
  return {
    enableRotateStatus: state.cesiumReducer.enableRotate
  };
};

const mapDispatchToProps = dispatch => {
  return {
    enableRotate: () => dispatch(actions.enableRotate()),
    disableRotate: () => dispatch(actions.disableRotate()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LockMap);
