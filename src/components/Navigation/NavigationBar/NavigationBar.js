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
      <Menu.Item key='1'>主页</Menu.Item>
      <Menu.Item key='2'>3D建模</Menu.Item>
      <Menu.Item key='3'>2D图纸</Menu.Item>
      <Menu.Item key='4'>报告</Menu.Item>
    </Menu>
  )
}

export default NavigationBar;
