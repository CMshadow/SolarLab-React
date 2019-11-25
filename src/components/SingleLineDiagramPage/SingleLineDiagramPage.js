import React from 'react';
// import Konva from 'konva';
// import { Stage, Layer, Star, Text } from 'react-konva';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import LeftSider from '../../containers/singleLineDiagram/ui/LeftSider/LeftSider';
import SingleLineDiagramStage from '../../containers/singleLineDiagram/SingleLineDiagramStage/SingleLineDiagramStage';


const { Content } = Layout;
const SingleLineDiagramPage = () => {

  return(
    <Layout>
        <Content>
          <SingleLineDiagramStage

          />
      </Content>
      
    </Layout>
  );
};


export default SingleLineDiagramPage;