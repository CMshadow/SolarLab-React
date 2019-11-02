import React from 'react';
import { connect } from 'react-redux';
import { Layout, Menu, Icon } from 'antd';
import 'antd/dist/antd.css';

const { Header, Content, Footer, Sider } = Layout;



const ModelingPage = (props) => {
  return (
    <Layout>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Icon type="project" />
            <span>Projects</span>
          </Menu.Item>
          <Menu.Item key="2">
            <span>Panel Library</span>
          </Menu.Item>
          <Menu.Item key="3">
            <span>Inverter Library</span>
          </Menu.Item>
          <Menu.Item key="4">
            <span>My Drone Models</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
        </Content>
      </Layout>
    </Layout>
  );
};

const mapStateToProps = state => {
  return {
    initialCor: state.cesiumReducer.initialCor,
  };
}

export default connect(mapStateToProps)(ModelingPage);
