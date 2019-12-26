import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { ConfigProvider } from 'antd';

import CustomLayout from './hoc/Layout/Layout';
import ModelingPage from './components/ModelingPage/ModelingPage';
import zhCN from 'antd/es/locale/zh_CN';


class App extends Component {
  render () {
    return (
      <div>
        <ConfigProvider locale={zhCN}>
          <CustomLayout>
            <Switch>
              <Route path="/" exact component={ModelingPage} />
            </Switch>
          </CustomLayout>
        </ConfigProvider>
      </div>
    )
  }
}

export default withRouter(connect(null, null)(App));
