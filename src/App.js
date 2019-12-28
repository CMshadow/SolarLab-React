import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { ConfigProvider } from 'antd';
import { IntlProvider } from 'react-intl';

import CustomLayout from './hoc/Layout/Layout';
import ModelingPage from './components/ModelingPage/ModelingPage';
import SketchDiagram from './components/SketchDiagram/SketchDiagram';

import zhCN from 'antd/es/locale/zh_CN';


import zh_CN from './locale/zh_CN';
import en_US from './locale/en_US';
import SingleLineDiagram from './components/SingleLineDiagramPage/SingleLineDiagramPage';

class App extends Component {
  render () {
    return (
      <IntlProvider locale={'zh'} messages={zh_CN}>
        <ConfigProvider locale={zhCN}>
          <CustomLayout>
            <Switch>
              <Route path="/Modeling" exact component={ModelingPage} />
              <Route path='/SketchDiagram'  component={SketchDiagram} />
              <Route path='/SingleLineDigram' component={SingleLineDiagram} />
            </Switch>
          </CustomLayout>
        </ConfigProvider>
      </IntlProvider>
    )
  }
}

export default withRouter(connect(null, null)(App));
