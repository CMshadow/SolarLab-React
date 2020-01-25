import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  Tooltip,
  Row,
  Button,
} from 'antd';
import { FormattedMessage } from 'react-intl';

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
      <Row style={{top:'20px'}}>
        <Tooltip
          placement='bottomRight'
          title={
            this.props.enableRotateStatus ?
            <FormattedMessage id='lockMovingMap'/> :
            <FormattedMessage id='unlockMovingMap'/>
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
    enableRotateStatus:
      state.undoable.present.cesiumManager.enableRotate
  };
};

const mapDispatchToProps = dispatch => {
  return {
    enableRotate: () => dispatch(actions.enableRotate()),
    disableRotate: () => dispatch(actions.disableRotate()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LockMap);
