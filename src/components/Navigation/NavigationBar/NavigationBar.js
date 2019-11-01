import { Menu, Avatar} from 'antd';
import React from 'react';
import 'antd/dist/antd.css';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';

const { SubMenu } = Menu;

const NavigationBar = (props) => {

  return (
    <Menu
      theme='dark'
      mode='horizontal'
      style={{ lineHeight: '50px' }}
    >
      {props.projectID ? (
        <Menu.Item key='1'><Link to="/">Home</Link></Menu.Item>,
        <Menu.Item key='2'><Link to="/modeling">Modeling</Link></Menu.Item>,
        <Menu.Item key='3'><Link to="/diagram">2D Diagram</Link></Menu.Item>,
        <Menu.Item key='4'><Link to="/report">Report</Link></Menu.Item>
        ) :
        null
      }
      
      <SubMenu
        title={
          <Avatar
            style={{backgroundColor: '#f56a00', verticalAlign: 'middle'}}
          >U</Avatar>
        }
        style={{ float: 'right' }}
      >
        <Menu.Item key="setting:3">Option 1</Menu.Item>
        <Menu.Item key="setting:4">Option 2</Menu.Item>
      </SubMenu>
    </Menu>
  )
}

const mapStateToProps = state => {
  return {
    projectId: state.projectManagerReducer.projectId
  };
};

export default connect(mapStateToProps)(NavigationBar);
