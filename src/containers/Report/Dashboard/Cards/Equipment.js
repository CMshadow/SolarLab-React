import React, { Component } from 'react';
import { Card, Col, Table } from "antd";
import { connect } from "react-redux";
import Numeral from "numeral";

class Equipment extends Component {
  render () {
    return (
      <Col span={this.props.span * 6} style={{ padding: 8 }}>
        <Card
          title={<b>Equipment</b>}
          style={{ height: '100%', cursor: 'default' }}
          hoverable={ true }
          loading={ !this.props.metadata.loaded }
        >
          { this.props.metadata.loaded &&
          <Table dataSource={this.props.table} bordered={true} pagination={false} size='small'>
            <Table.Column sorter={(a, b) => (a.device > b.device)} title="Device" dataIndex="device" key="device" render={text => <b>{text}</b>} />
            <Table.Column sorter={(a, b) => (a.model > b.model)} title="Model" dataIndex="model" key="model" />
            <Table.Column title="Quantity" dataIndex="quantity" key="quantity" align="right" />
            <Table.Column sorter={(a, b) => (a.capital - b.capital)} title="Capital Cost" dataIndex="capital" key="capital" align="right" render={(value) => Numeral(value).format('$ 0,0.0') } />
          </Table> }
        </Card>
      </Col>
    )
  }
}


// pass data to props
function mapStateToProps(state) {
  const workingBuilding = state.undoable.present.buildingManager.workingBuilding;
  if (state.undoable.present.reportManager.metadata.loaded) {
    return {
      metadata: state.undoable.present.reportManager.metadata,
      table: [
        {
          key: '1',
          device: 'Panel',
          model: state.undoable.present.editingPVPanelManager
            .userPanels[workingBuilding.pvParams[0].selectPanelIndex].panelName,
          quantity: Object.keys(workingBuilding.pv).reduce((acc, key) =>
            acc + workingBuilding.pv[key].reduce((acc2, item) =>
              acc2 + item.length
            , 0)
          , 0),
          capital: state.undoable.present.editingPVPanelManager
            .userPanels[workingBuilding.pvParams[0].selectPanelIndex].cost *
            Object.keys(workingBuilding.pv).reduce((acc, key) =>
              acc + workingBuilding.pv[key].reduce((acc2, item) =>
                acc2 + item.length
              , 0)
            , 0)
        },
        {
          key: '2',
          device: 'Inverter',
          model: state.undoable.present.editingWiringManager
            .userInverters.find(inverter =>
              inverter.inverterID = workingBuilding.inverters[0][0].inverterId
            ).inverterName,
          quantity: workingBuilding.inverters[0].length,
          capital: state.undoable.present.editingWiringManager
            .userInverters.find(inverter =>
              inverter.inverterID = workingBuilding.inverters[0][0].inverterId
            ).cost * workingBuilding.inverters[0].length
        },
        {
          key: '3',
          device: 'Wire',
          model: 'GoldBull (10 AWG)',
          quantity: `${workingBuilding.inverters[0].reduce((acc, inverter) =>
            acc + inverter.bridging.reduce((acc2, bridging) =>
              acc2 + bridging.mainPolyline.polylineLength()
            , 0) + inverter.wiring.reduce((acc3, wiring) =>
              acc3 + wiring.polyline.polylineLength()
            , 0)
          , 0).toFixed(2)} M`,
          capital: 1.13 * workingBuilding.inverters[0].reduce((acc, inverter) =>
            acc + inverter.bridging.reduce((acc2, bridging) =>
              acc2 + bridging.mainPolyline.polylineLength()
            , 0) + inverter.wiring.reduce((acc3, wiring) =>
              acc3 + wiring.polyline.polylineLength()
            , 0)
          , 0),
        }
      ],
    }
  }
  return { metadata: state.undoable.present.reportManager.metadata }
}

export default connect(mapStateToProps)(Equipment);
