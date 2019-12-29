import { Menu } from 'antd';
import React from 'react';
import 'antd/dist/antd.css';
import { injectIntl, FormattedMessage } from 'react-intl';

const NavigationBar = (props) => {
  return (
    <Menu
      theme='dark'
      mode='horizontal'
      defaultSelectedKeys={['2']}
      style={{ lineHeight: '50px' }}
    >
      <Menu.Item key='1'><FormattedMessage id='home' /></Menu.Item>
      <Menu.Item key='2'><FormattedMessage id='modeling' /></Menu.Item>
      <Menu.Item key='3'><FormattedMessage id='twoD_diagram' /></Menu.Item>
      <Menu.Item key='4'><FormattedMessage id='report' /></Menu.Item>
    </Menu>
  )
}

export default NavigationBar;
