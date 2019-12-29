import React, { Component } from 'react';
import { Card, Col, Row, Descriptions, Typography, Divider, Skeleton } from "antd";
import { connect } from "react-redux";
import UtilFunctions from "../../request_functions/UtilFunctions";
import Numeral from "numeral";
const { Title } = Typography;

class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = { isImageLoaded: false };
        this.handleImageLoadedEvent = this.handleImageLoadedEvent.bind(this);
        this.imageRef = React.createRef();
    }

    handleImageLoadedEvent() {
        this.setState({ isImageLoaded: true });
    }

    render () {
        return (
            <Col span={this.props.span * 6} style={{ padding: 8 }}>
                <Card
                    style={{ height: '100%', cursor: 'default' }}
                    hoverable={ true }
                    loading={ !this.props.metadata.loaded }
                >
                    <Title>{ this.props.metadata.loaded ? this.props.metadata.option.data['Project_Name'] : 'Loading...' }</Title>
                    <Divider />

                    <Row type="flex">
                        <Col span={18} style={{ paddingRight: 8 }}>
                            { this.props.metadata.loaded &&
                            <Descriptions title="Overview" size='small' layout="vertical" bordered>
                                <Descriptions.Item label={<b>Project Name</b>} >{ this.props.metadata.option.data['Project_Name'] }</Descriptions.Item>
                                <Descriptions.Item label={<b>Address</b>} >{ this.props.metadata.option.data['Address'] }</Descriptions.Item>
                                <Descriptions.Item label={<b>System Efficiency</b>} >{ Numeral(this.props.metadata.option.data['System_Efficiency']).format('0,0.0') }%</Descriptions.Item>
                                <Descriptions.Item label={<b>kWh/kWp</b>} >{ Numeral(this.props.metadata.option.data['kWh/kWp']).format('0,0.0') }</Descriptions.Item>
                                <Descriptions.Item label={<b>LCOE</b>} >{ Numeral(this.props.metadata.option.data['LCOE']).format('0,0.0') }</Descriptions.Item>
                                <Descriptions.Item label={<b>Payback Period</b>} >{ Numeral(this.props.metadata.option.data['Payback_period']).format('0,0.0') } years</Descriptions.Item>
                                <Descriptions.Item label={<b>Updated by</b>} >{ UtilFunctions.isoStringParser(this.props.metadata.option.data['Project_Updated_Time']) }</Descriptions.Item>
                            </Descriptions> }
                        </Col>

                        <Col span={6} style={{ paddingLeft: 8 }}>
                            <Descriptions title="Layout" />
                            <Skeleton loading={ !this.state.isImageLoaded } active />
                            <img
                                src="/mock/mock_image.jpg"
                                alt="Layout"
                                ref={this.imageRef}
                                onLoad={this.handleImageLoadedEvent}
                                style={{ width: '100%', height: 'auto', display: this.state.isImageLoaded ? 'block' : 'none' }}
                            />
                        </Col>
                    </Row>
                </Card>
            </Col>
        )
    }
}


// pass data to props
function mapStateToProps(state) {
    return { metadata: state.metadata }
}

export default connect(mapStateToProps)(Overview);

