import React, { Component } from 'react';
import { Layout, Menu, Row, Icon, BackTop, notification } from 'antd';
import logo from '../image/logo-black.png';

import Overview from "./Cards/Overview";
import IconSummary from './Cards/IconSummary';
import Financial from './Cards/Financial';
import PVProduction from "./Cards/PVProduction";
import Losses from "./Cards/Losses";
import Equipment from "./Cards/Equipment";
import DateStatisticSelectGroup from "./Cards/DateStatisticSelectGroup";
import Preview from "./PrintPreview";

import './print-display.css';

const { Header, Footer, Content } = Layout;

class Dashboard extends Component {
    showPrintWindow = () => {
        if (document.readyState === "complete") {
            // show print window
            window.print();
        }
        else {
            // show notification
            notification.warning({
                message: 'Still Loading...',
                description: 'The page is still loading. Please wait until data has been fully loaded. ',
                placement: 'bottomRight',
            });
        }
    };

    render () {
        return (
            <>
                <Layout className="non-print">
                    <Header style={{ height: 64, backgroundColor: '#fff', boxShadow: '0 2px 8px #f0f1f2' }}>
                        <a href="/" style={{ float: 'left', display: 'block', height: 32, lineHeight: '32px', margin: 16 }}>
                            <img src={logo} alt="logo" style={{ height: 32 }}/>
                        </a>

                        <Menu
                            theme="light"
                            mode="horizontal"
                            selectable={false}
                            style={{ lineHeight: '63px', borderBottom: 'none', float: 'right' }}
                        >
                            <Menu.Item key="1" onClick={this.showPrintWindow}>
                                <Icon type="download"/> Download PDF
                            </Menu.Item>
                        </Menu>
                    </Header>

                    <Content style={{ padding: '8px 50px' }}>
                        <Row type="flex">
                            <Overview span={4} />

                            <IconSummary span={1} type='panel'  />
                            <IconSummary span={1} type='dollar' />
                            <IconSummary span={1} type='factory'/>
                            <IconSummary span={1} type='house'  />

                            <Financial span={4} />
                            <PVProduction span={2} />
                            <Losses span={2} />

                            <DateStatisticSelectGroup span={4} />

                            <Equipment span={4} />
                        </Row>
                    </Content>

                    <Footer style={{ textAlign: 'center' }}>
                        SolarLab ©2019 Powered by SolarNest
                    </Footer>

                    <BackTop />
                </Layout>

                <div className="only-print">
                    <Preview />
                </div>
            </>
        )
    }
}

export default Dashboard;
