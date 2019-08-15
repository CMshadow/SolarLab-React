import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScreenSpaceEventHandler } from 'resium';

import CustomPoint from '../../components/CesiumComponents/point/point';
import CustomPolyline from '../../components/CesiumComponents/polyline/polyline';

class CesiumRender extends Component {

  render () {
    let polylines = (<CustomPolyline key={this.props.polyline.entityId} {...this.props.polyline} />)

    let points = this.props.points.map(elem => (
      <CustomPoint key={elem.entityId} {...elem} />
    ));

    return (
      <div>
        {points}
        {polylines}
        <ScreenSpaceEventHandler useDefault={false}/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    points: state.cesiumReducer.points,
    polyline: state.cesiumReducer.polyline
  };
}

export default connect(mapStateToProps)(CesiumRender);
