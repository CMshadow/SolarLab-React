import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import CustomLayout from './hoc/Layout/Layout';
import ModelingPage from './components/ModelingPage/ModelingPage';
import SingleLineDiagram from './components/SingleLineDiagramPage/SingleLineDiagramPage';

class App extends Component {
  render () {
    return (
      <div>
        <CustomLayout>
          <Switch>
            {/* <Route path="/" exact component={ModelingPage} /> */}
            <Route path='/' exact component={SingleLineDiagram} />
          </Switch>
        </CustomLayout>
      </div>
    )
  }
}

export default withRouter(connect(null, null)(App));
