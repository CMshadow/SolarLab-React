import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import CustomLayout from './hoc/Layout/Layout';
import ModelingPage from './components/ModelingPage/ModelingPage';
import SketchDiagram from './components/SketchDiagram/SketchDiagram';


class App extends Component {
  render () {
    return (
      <div>
        <CustomLayout>
          <Switch>
            <Route path="/Modeling" exact component={ModelingPage} />
            <Route path='/SketchDiagram'  component={SketchDiagram} />
            
          </Switch>
        </CustomLayout>
      </div>
    )
  }
}

export default withRouter(connect(null, null)(App));
