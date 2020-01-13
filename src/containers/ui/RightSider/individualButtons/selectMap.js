import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Menu, Dropdown, Row, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLayerGroup,
} from '@fortawesome/pro-light-svg-icons'

import * as actions from '../../../../store/actions/index';


class SelectMap extends PureComponent {

  render () {

    const menu = (
      <Menu
        selectedKeys={[this.props.selectedMap]}
        onClick = {(item, key) => {
          this.props.selectMap(item.key);
        }}
      >
        <Menu.Item key='google'>
          <FormattedMessage id='googleMap'/>
        </Menu.Item>
        <Menu.Item key='bing'>
          <FormattedMessage id='bingMap'/>
        </Menu.Item>
        <Menu.Item key='aMap'>
          <FormattedMessage id='aMap'/>
        </Menu.Item>
      </Menu>
    );

    return (
      <Row style={{top:'10px'}}>
        <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
          <Button
            type='primary'
            shape='circle'
            size='large'
          >
            <FontAwesomeIcon icon={faLayerGroup} />
          </Button>
        </Dropdown>
      </Row>
    );
  };
};

const mapStateToProps = state => {
  return {
    selectedMap: state.cesiumReducer.selectedMap
  };
};

const mapDispatchToProps = dispatch => {
  return {
    enableRotate: () => dispatch(actions.enableRotate()),
    disableRotate: () => dispatch(actions.disableRotate()),
    selectMap: (map) => dispatch(actions.selectMap(map))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectMap);
