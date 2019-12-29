import React, { Component } from 'react';
import { Card, Col, Statistic } from "antd";
import { connect } from "react-redux";
import Numeral from "numeral";

import panel from './../../resource/panel.png';
import dollar from './../../resource/dollar.png';
import factory from './../../resource/factory.png';
import house from './../../resource/house.png';

class IconSummary extends Component {
    render () {
        return (
            <Col span={this.props.span * 6} style={{ padding: 8 }}>
                <Card
                    style={{ height: '100%', cursor: 'default', textAlign: 'center' }}
                    hoverable={ true }
                    loading={ !this.props.metadata.loaded }
                >
                    { this.props.metadata.loaded &&
                    <>
                        <img style={{height: 36, margin: 5}} src={this.props.icon[this.props.type].image} alt={this.props.type} />
                        <Statistic
                            title={this.props.icon[this.props.type].title}
                            value={ Numeral(this.props.icon[this.props.type].value).format('0.0 a').split(' ')[0] }
                            suffix={ Numeral(this.props.icon[this.props.type].value).format('0.0 a').split(' ')[1] + this.props.icon[this.props.type].suffix}
                        />
                    </> }
                </Card>
            </Col>
        )
    }
}


// pass data to props
function mapStateToProps(state) {
    if (state.undoableReducer.present.reportManager.metadata.loaded) {
        return {
            metadata: state.undoableReducer.present.reportManager.metadata,
            icon: {
                panel: {
                    image: panel,
                    title: 'PV Installed Capacity',
                    value: state.undoableReducer.present.reportManager.metadata.option.data.PV_Installed_Capacity,
                    suffix: 'W',
                    precision: 1,
                },
                dollar: {
                    image: dollar,
                    title: 'Project Cost',
                    value: state.undoableReducer.present.reportManager.metadata.option.data.Project_Cost,
                    suffix: ' USD',
                    precision: 1,
                },
                factory: {
                    image: factory,
                    title: <div>CO<sub>2</sub> Emission Reduced</div>,
                    value: state.undoableReducer.present.reportManager.metadata.option.data.CO2_Reduced,
                    suffix: 'tons/year',
                    precision: 1,
                },
                house: {
                    image: house,
                    title: 'Annual PV Production',
                    value: state.undoableReducer.present.reportManager.metadata.option.data.Annual_PV_Production,
                    suffix: 'Wh',
                    precision: 1,
                },
            }
        }
    }

    return { metadata: state.undoableReducer.present.reportManager.metadata }
}

export default connect(mapStateToProps)(IconSummary);

