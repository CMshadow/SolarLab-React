import { Menu } from 'antd';
import React from 'react';
import 'antd/dist/antd.css';

const NavigationBar = (props) => {
  return (
    <Menu
      theme='dark'
      mode='horizontal'
      defaultSelectedKeys={['2']}
      style={{ lineHeight: '50px' }}
    >
      <Menu.Item key='1'>Home</Menu.Item>
      <Menu.Item key='2'>Modeling</Menu.Item>
      <Menu.Item key='3'>2D Diagram</Menu.Item>
      <Menu.Item key='4'>Report</Menu.Item>
    </Menu>
  )
}

export default NavigationBar;
