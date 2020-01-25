import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ConfigProvider,
  Table,
  Row,
  Col,
  Button,
  Divider
} from 'antd';
import { FormattedMessage } from 'react-intl';

import {
  emptyListTemplate
} from '../../../../components/ui/EmptyTemplate/emptyListTemplate';
import * as actions from '../../../../store/actions/index';

class ManageBuildingPanel extends Component {

  // expandedRowRender = (inverter, inverterInd) => {
  //   const columns = [
  //     {
  //       title: 'Status',
  //       key: 'state',
  //       width: '60%',
  //       render: wiring => (
  //         <Progress
  //           strokeColor={{
  //             '0%': '#108ee9',
  //             '100%': '#87d068',
  //           }}
  //           percent={
  //             wiring.allPanels.length === 0 ?
  //             0 :
  //             Math.ceil(wiring.allPanels.length / inverter.panelPerString * 100)
  //           }
  //           size='small'
  //           status={
  //             inverter.panelPerString === wiring.allPanels.length ?
  //             'success' :
  //             'active'
  //           }
  //         />
  //       ),
  //     },
  //     {
  //       title: 'Action',
  //       dataIndex: 'action',
  //       key: 'action',
  //       width: '40%',
  //       render: (wiring, record, wiringInd) => {
  //         const menu = (
  //           <Menu>
  //             <Menu.Item
  //               key='1'
  //               onClick = {() => {
  //                 this.props.setUIStateManualWiring();
  //                 this.props.manualWiring(this.props.roofIndex, inverterInd, wiringInd);
  //               }}
  //             >
  //               <FormattedMessage id='wiring_manual' />
  //             </Menu.Item>
  //           </Menu>
  //         );
  //         if (record.allPanels.length === 0) {
  //           if (
  //             this.props.roofSpecParams[this.props.roofIndex].mode ===
  //             'individual'
  //           ) {
  //             return (
  //               <Dropdown.Button
  //                 overlay={menu}
  //                 icon={<Icon type='down' />}
  //                 disabled={
  //                   (this.props.uiState === 'EDITING_WIRING' ||
  //                   this.props.uiState === 'DRAGGING_WIRING') &&
  //                   (wiringInd !== this.props.editingWiringIndex ||
  //                   inverterInd !== this.props.editingInverterIndex)
  //                 }
  //                 onClick = {() => {
  //                   this.props.autoWiring(this.props.roofIndex, inverterInd, wiringInd);
  //                 }}
  //               >
  //                 <FormattedMessage id='wiring_auto' />
  //               </Dropdown.Button>
  //             )
  //           } else {
  //             return (
  //               <Button
  //                 disabled={
  //                   (this.props.uiState === 'EDITING_WIRING' ||
  //                   this.props.uiState === 'DRAGGING_WIRING') &&
  //                   (wiringInd !== this.props.editingWiringIndex ||
  //                   inverterInd !== this.props.editingInverterIndex)
  //                 }
  //                 onClick = {() => {
  //                   this.props.autoWiring(this.props.roofIndex, inverterInd, wiringInd);
  //                 }}
  //               >
  //                 Wiring
  //               </Button>
  //             )
  //           }
  //         } else {
  //           return (
  //             <Button
  //               disabled={
  //                 (this.props.uiState === 'EDITING_WIRING' ||
  //                 this.props.uiState === 'DRAGGING_WIRING') &&
  //                 (wiringInd !== this.props.editingWiringIndex ||
  //                 inverterInd !== this.props.editingInverterIndex)
  //               }
  //               onClick = {() => {
  //                 if (this.props.uiState === 'SETUP_WIRING') {
  //                   this.props.setUIStateEditingWiring();
  //                   this.props.editWiring(this.props.roofIndex, inverterInd, wiringInd);
  //                 } else {
  //                   this.props.setUIStateSetUpWiring();
  //                   this.props.stopEditWiring();
  //                 }
  //               }}
  //             >
  //               {
  //                 this.props.uiState === 'SETUP_WIRING' ||
  //                 wiringInd !== this.props.editingWiringIndex ||
  //                 inverterInd !== this.props.editingInverterIndex ?
  //                 <FormattedMessage id='edit_wiring' /> :
  //                 <FormattedMessage id='stop_editing_wiring' />
  //               }
  //             </Button>
  //           );
  //         }
  //       },
  //     },
  //   ];
  //
  //   const data = inverter.wiring;
  //   return (
  //     <Table
  //       size='middle'
  //       showHeader={false}
  //       columns={columns}
  //       dataSource={data}
  //       pagination={false}
  //       rowKey={record => record.entityId}
  //     />
  //   );
  // };

  columns = [
    {
      title: <FormattedMessage id='buildingName' />,
      dataIndex: 'buildingName',
      key: 'name',
      width: '100%',
      ellipsis: true
    }
  ];

  render () {
    return (
      <div style={{padding: '10px 10px 20px', overflow: 'auto'}}>
        <Row>
          <Col span={20} offset={2}>
            <Button shape='circle' icon='arrow-left'
              onClick={this.props.setUIStateIdel}
            />
          </Col>
        </Row>
        <Divider style={{margin: '10px 0px'}}/>
        <Row>
          <Col span={24}>
            <ConfigProvider renderEmpty={() => emptyListTemplate({type: 'Building'})}>
              <Table
                size='middle'
                pagination={false}
                columns={this.columns}
                // expandedRowRender={
                //   (inverter, inverterInd) =>
                //   this.expandedRowRender(inverter, inverterInd)
                // }
                dataSource={this.props.buildingCollection}
                rowKey={record => record.buildingGroupId}
              />,
            </ConfigProvider>
          </Col>
        </Row>
      </div>
    );
  };
};

const mapStateToProps = state => {
  return {
    buildingCollection:
      state.undoable.present.projectManager.projectInfo.buildingCollection
  };
};

const mapDispatchToProps = dispatch => {
  return {
    autoWiring: (roofInd, inverterInd, wiringInd) => dispatch(
      actions.autoWiring(roofInd, inverterInd, wiringInd)
    ),
    manualWiring: (roofInd, inverterInd, wiringInd) => dispatch(
      actions.manualWiring(roofInd, inverterInd, wiringInd)
    ),
    editWiring: (roofInd, inverterInd, wiringInd) => dispatch(
      actions.editWiring(roofInd, inverterInd, wiringInd)
    ),
    stopEditWiring: () => dispatch(actions.stopEditWiring()),
    setUIStateEditingWiring: () => dispatch(
      actions.setUIStateEditingWiring()
    ),
    setUIStateSetUpWiring: () => dispatch(
      actions.setUIStateSetUpWiring()
    ),
    setUIStateManualWiring: () => dispatch(
      actions.setUIStateManualWiring()
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageBuildingPanel);
