import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import CustomLayout from './hoc/Layout/Layout';
import ModelingPage from './components/ModelingPage/ModelingPage';
import HomePage from './components/Home/Home';

class App extends Component {
  render () {
    return (
      <div>
        <CustomLayout>
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path='/modeling' exact component={ModelingPage} />
          </Switch>
        </CustomLayout>
      </div>
    )
  }
}

export default withRouter(connect(null, null)(App));
