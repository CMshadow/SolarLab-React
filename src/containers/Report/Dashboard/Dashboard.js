import React, { Component } from 'react';
import { Layout, Menu, Row, Icon, BackTop, Button, notification } from 'antd';
import logo from '../image/logo-black.png';
import * as html2pdf from 'html2pdf.js';
import * as html2canvas from 'html2canvas';

import Overview from "./Cards/Overview";
import IconSummary from './Cards/IconSummary';
import Financial from './Cards/Financial';
import PVProduction from "./Cards/PVProduction";
import Losses from "./Cards/Losses";
import Equipment from "./Cards/Equipment";
import DateStatisticSelectGroup from "./Cards/DateStatisticSelectGroup";

import './print-display.css';

const { Header, Footer, Content } = Layout;

class Dashboard extends Component {

  render () {
    return (
      <Layout id='report-layout' className="non-print" style={{paddingTop: 64, overflow: 'auto'}}>
        <Header id='report-header' data-html2canvas-ignore="true" style={{height: 64, backgroundColor: '#fff', boxShadow: '0 2px 8px #f0f1f2' }}>
          <a href="/" style={{ float: 'left', display: 'block', height: 32, lineHeight: '32px', margin: 16 }}>
            <img src={logo} alt="logo" style={{ height: 32 }}/>
          </a>

          <Menu
            theme="light"
            mode="horizontal"
            selectable={false}
            style={{ lineHeight: '63px', borderBottom: 'none', float: 'right' }}
          >
            <Menu.Item key="1" onClick={() => {
              const element = document.getElementById('report-layout');
              const worker = new html2pdf.Worker();
              const opt = {
                pagebreak: { mode: 'avoid-all', avoid: ['#report-layout', '#report-header', '#report','#myoverview', '#test'] },
                // html2canvas: {ignoreElements: elem => {return elem.id !== 'report-header'}},
                jsPDF: { orientation: 'l' }
              };
              worker.set(opt).from(element).save();
            }}>
              <Icon type="download"/> Download PDF
            </Menu.Item>
          </Menu>
        </Header>
        <br/>

        <Content id='report' style={{ maxWidth: 1000, margin: 'auto', align:'center', textAlign:'center'}}>
          <Row id='myoverview' type="flex" justify='center' gutter={[16, 16]}>
            <Overview />
          </Row>

          <Row id='test' type="flex" justify='center' gutter={[16, 16]}>
            <IconSummary span={1} type='panel'  />
            <IconSummary span={1} type='dollar' />
            <IconSummary span={1} type='factory'/>
            <IconSummary span={1} type='house'  />
          </Row>

          <Row type="flex" justify='center' gutter={[16, 16]} >
            <Financial />
          </Row>
          <Row type="flex" justify='center' gutter={[16, 16]} >
            <PVProduction />
            <Losses />
          </Row>

          <Row type="flex" justify='center' gutter={[16, 16]}>
            <DateStatisticSelectGroup span={4} />
            <Equipment span={4} />
          </Row>
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          SolarLab ©2019 Powered by Albedo Inc.
        </Footer>

        <BackTop />
      </Layout>
    )
  }
}

export default Dashboard;
