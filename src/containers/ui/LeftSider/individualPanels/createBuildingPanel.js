import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  Form,
  Input,
  InputNumber,
  Divider,
  Tooltip,
  Icon,
  Select,
  Row,
  Col,
  Button,
  Radio
} from 'antd';

import * as classes from './createBuildingPanel.module.css';
import * as actions from '../../../../store/actions/index';
import {calculateFlatRoofPanel} from './setUpPVPanel';
import FoundLine from '../../../../infrastructure/line/foundLine';
const { Option } = Select;

const data = [
  [
    {
      "points": [
        {
          "lon": -117.841507405121,
          "lat": 33.646656467021,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b9290-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841593827239,
          "lat": 33.646662953105,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b9291-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841475778861,
          "lat": 33.646935617694,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b9292-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841317977958,
          "lat": 33.647007936946,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b9293-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841594626782,
          "lat": 33.647243227606,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b9294-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841338274037,
          "lat": 33.647428418236,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b9295-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841280334176,
          "lat": 33.647344640541,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b9296-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841378191474,
          "lat": 33.647236630627,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b9297-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.84118195647,
          "lat": 33.647047839452,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b9298-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841187844944,
          "lat": 33.647042245262,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b9299-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841184663182,
          "lat": 33.647034775965,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b929a-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841367651136,
          "lat": 33.647112332992,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b929b-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841328618832,
          "lat": 33.647158465505,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b929c-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841479671349,
          "lat": 33.647214374864,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b929d-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841383770681,
          "lat": 33.647239139343,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b929e-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841484139079,
          "lat": 33.647279677416,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b929f-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.84134591845,
          "lat": 33.647357867216,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b92a0-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841351990314,
          "lat": 33.647365305556,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b92a1-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841505662743,
          "lat": 33.647278374842,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b92a2-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841413088177,
          "lat": 33.647240984646,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b92a3-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841510319393,
          "lat": 33.647215876579,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b92a4-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841345022829,
          "lat": 33.647154695031,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b92a5-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841383661947,
          "lat": 33.647109027225,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b92a6-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.84119916082,
          "lat": 33.647030828861,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b92a7-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841351824228,
          "lat": 33.646929455378,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b92a8-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.84150287555,
          "lat": 33.646735849254,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b92a9-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841507405121,
          "lat": 33.646656467021,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064b9290-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        }
      ],
      "entityId": "064bb9a0-f5e6-11e9-a91b-e53911ef197f",
      "name": "polyline",
      "color": {
        "red": 1,
        "green": 1,
        "blue": 1,
        "alpha": 1
      },
      "show": true,
      "width": 4
    },
    []
  ],
  [
    {
      "points": [
        {
          "lon": -117.841108895414,
          "lat": 33.64661742827,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9a1-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.84118870587,
          "lat": 33.64661631685,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9a2-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841238530487,
          "lat": 33.646914288214,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9a3-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841419825994,
          "lat": 33.646649894102,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9a4-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841496636011,
          "lat": 33.646655658786,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9a5-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841492223368,
          "lat": 33.646732991643,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9a6-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841343718436,
          "lat": 33.646923334003,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9a7-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841182729282,
          "lat": 33.647030236068,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9a8-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.84117016723,
          "lat": 33.647000746211,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9a9-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841125477412,
          "lat": 33.647028558859,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9aa-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841160804276,
          "lat": 33.647067934538,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9ab-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841179606108,
          "lat": 33.647050072352,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9ac-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841218781268,
          "lat": 33.647491206254,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9ad-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841048481357,
          "lat": 33.647486390031,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9ae-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841043119574,
          "lat": 33.64703439994,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9af-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.840791723912,
          "lat": 33.647201550937,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9b0-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.84095575971,
          "lat": 33.647381101995,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9b1-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.84081174931,
          "lat": 33.64747423875,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9b2-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.840542023912,
          "lat": 33.64718629593,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9b3-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.840890601955,
          "lat": 33.647018649973,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9b4-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.840714888643,
          "lat": 33.646962431202,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9b5-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.840554775627,
          "lat": 33.64667043704,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9b6-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.840639598209,
          "lat": 33.64664824434,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9b7-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.840786912464,
          "lat": 33.646886680474,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9b8-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.840986085019,
          "lat": 33.647008201388,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9b9-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.840878092661,
          "lat": 33.647064945351,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9ba-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.840643589566,
          "lat": 33.647226378625,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9bb-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.840781478823,
          "lat": 33.64727578763,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9bc-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.840685074717,
          "lat": 33.64731926349,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9bd-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.840863313955,
          "lat": 33.647389368806,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9be-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.840867929005,
          "lat": 33.647381237506,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9bf-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.840708969855,
          "lat": 33.647318715475,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9c0-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.840806215125,
          "lat": 33.647274860269,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9c1-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.840664092351,
          "lat": 33.64722393429,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9c2-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.840884444393,
          "lat": 33.647072242707,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9c3-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.84100526905,
          "lat": 33.64700875608,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9c4-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.840795353829,
          "lat": 33.646880680738,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9c5-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.840650055925,
          "lat": 33.646645508217,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9c6-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.840732062106,
          "lat": 33.646624052391,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9c7-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.840956404688,
          "lat": 33.646922284851,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9c8-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841008082106,
          "lat": 33.64661883217,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9c9-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841098093858,
          "lat": 33.64661757869,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9ca-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841112539535,
          "lat": 33.647441629212,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9cb-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841123341531,
          "lat": 33.647441497985,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9cc-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841108895414,
          "lat": 33.64661742827,
          "height": 5,
          "heightOffset": 0,
          "entityId": "064bb9a1-f5e6-11e9-a91b-e53911ef197f",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        }
      ],
      "entityId": "064bb9cd-f5e6-11e9-a91b-e53911ef197f",
      "name": "polyline",
      "color": {
        "red": 1,
        "green": 1,
        "blue": 1,
        "alpha": 1
      },
      "show": true,
      "width": 4
    },
    []
  ]
]

class CreateBuildingPanel extends PureComponent {
  state = {
    mode: this.props.buildingInfoFields.mode,
    type: this.props.buildingInfoFields.type
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.setUIStateReadyDrawing();
        this.props.initBuilding(values);
        console.log('[Create Building Panel] Your are creating a new building')
      }
    });
  };

  componentWillUnmount = () => {
    this.props.saveBuildingInfoFields(this.props.form.getFieldsValue());
  };

  numberInputRules = [{
    type: 'number',
    message: 'Please provide a valid number'
  },{
    required: true,
    message: 'Cannot be empty'
  }];
  rowLayout = {label: {span: 12, offset: 2}, field: {span: 8}};

  render () {
    const { getFieldDecorator } = this.props.form;

    const optionalFoundHtInput = (
      <Form.Item>
        <Row>
          <Col {...this.rowLayout.label}>
            <Tooltip
              placement="topLeft"
              title="The height of the building foundation"
            >
              <Row>
                <Col span={20}>
                  <h4>Building Height</h4>
                </Col>
                <Col span={4}>
                  <Icon type="question-circle" />
                </Col>
              </Row>
            </Tooltip>
          </Col>
          <Col {...this.rowLayout.field}>
            {getFieldDecorator('foundHt', {
              rules: [...this.numberInputRules],
              initialValue: this.props.buildingInfoFields.foundHt
            })(
              <InputNumber
                className={classes.inputArea}
                min={0}
                max={500}
                step={0.1}
                formatter={value => `${value}m`}
                parser={value => value.replace('m', '')}
              />
            )}
          </Col>
        </Row>
      </Form.Item>
    );
    const optionalParapetHtInput = (
      <Form.Item>
        <Row>
          <Col {...this.rowLayout.label}>
            <Tooltip
              placement="topLeft"
              title="The height of parapet beyond the rooftop"
            >
              <Row>
                <Col span={20}>
                  <h4>Parapet Height</h4>
                </Col>
                <Col span={4}>
                  <Icon type="question-circle" />
                </Col>
              </Row>
            </Tooltip>
          </Col>
          <Col {...this.rowLayout.field}>
            {getFieldDecorator('parapetHt', {
              rules: [...this.numberInputRules],
              initialValue: this.props.buildingInfoFields.parapetHt
            })(
              <InputNumber
                className={classes.inputArea}
                min={0}
                max={5}
                step={0.1}
                formatter={value => `${value}m`}
                parser={value => value.replace('m', '')}
              />
            )}
          </Col>
        </Row>
      </Form.Item>
    );
    const optionalHipStbInput = (
      <Form.Item>
        <Row>
          <Col {...this.rowLayout.label}>
            <Tooltip
              placement="topLeft"
              title="The setback distance from hips towards fields of the roof"
            >
              <Row>
                <Col span={20}>
                  <h4>Hip Setback</h4>
                </Col>
                <Col span={4}>
                  <Icon type="question-circle" />
                </Col>
              </Row>
            </Tooltip>
          </Col>
          <Col {...this.rowLayout.field}>
            {getFieldDecorator('hipStb', {
              rules: [...this.numberInputRules],
              initialValue: this.props.buildingInfoFields.hipStb
            })(
              <InputNumber
                className={classes.inputArea}
                min={0}
                max={5}
                step={0.1}
                formatter={value => `${value}m`}
                parser={value => value.replace('m', '')}
              />
            )}
          </Col>
        </Row>
      </Form.Item>
    );
    const optionalRidgeStbInput = (
      <Form.Item>
        <Row>
          <Col {...this.rowLayout.label}>
            <Tooltip
              placement="topLeft"
              title="The setback distance from ridges towards fields of the roof"
            >
              <Row>
                <Col span={20}>
                  <h4>Ridge Setback</h4>
                </Col>
                <Col span={4}>
                  <Icon type="question-circle" />
                </Col>
              </Row>
            </Tooltip>
          </Col>
          <Col {...this.rowLayout.field}>
            {getFieldDecorator('ridgeStb', {
              rules: [...this.numberInputRules],
              initialValue: this.props.buildingInfoFields.ridgeStb
            })(
              <InputNumber
                className={classes.inputArea}
                min={0}
                max={5}
                step={0.1}
                formatter={value => `${value}m`}
                parser={value => value.replace('m', '')}
              />
            )}
          </Col>
        </Row>
      </Form.Item>
    );

    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        {/*Bulding name Input*/}
        <Form.Item>
          <Row>
            <Col span={20} offset={2}>
              <h3> Building Name </h3>
            </Col>
          </Row>
          <Row>
            <Col span={20} offset={2}>
              {getFieldDecorator('name', {
                initialValue: this.props.buildingInfoFields.name,
                rules: [{
                  required: true,
                  message: 'Please provide a building name'
                }],})(
                  <Input
                    placeholder='Your building name'
                    allowClear
                    autoComplete="off"/>
                )
              }
            </Col>
          </Row>
        </Form.Item>

        {/*Bulding type Select*/}
        <Form.Item>
          <Row>
            <Col span={10} offset={2}>
              <h4> Building Type </h4>
            </Col>
            <Col span={10}>
              {getFieldDecorator('type', {
                initialValue: this.props.buildingInfoFields.type
              })(
                <Select
                  className={classes.inputArea}
                  onChange={(value,option) => {
                    this.setState({type:value});
                  }}>
                  <Option value='FLAT'>Flat Roof</Option>
                  <Option value='PITCHED'>Pitched Roof</Option>
                </Select>
              )}
            </Col>
          </Row>
        </Form.Item>

        {/*All heights input go to here*/}
        <Divider />
        <Form.Item>
          <Row>
            <Col span={12} offset={2}>
              <h3>Working on </h3>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span={20}>
              {getFieldDecorator('mode', {
                initialValue: this.state.mode
              })(
                <Radio.Group
                  onChange={event => {
                    this.setState({mode: event.target.value});
                  }}
                  buttonStyle='solid'
                >
                  <Radio.Button value="2D">Satellite Map</Radio.Button>
                  <Radio.Button value="3D">Drone 3D Model</Radio.Button>
                </Radio.Group>
              )}
            </Col>
          </Row>
        </Form.Item>
        {this.state.mode === '3D' ? null : optionalFoundHtInput}
        {this.state.mode === '2D' &&
          this.state.type === 'FLAT' ?
          optionalParapetHtInput :
          null
        }

        {/*All setbacks inputs go to here*/}
        <Divider />
        <Form.Item>
          <Row>
            <Col {...this.rowLayout.label}>
              <Tooltip
                placement="topLeft"
                title="The setback distance from eaves towards building inside"
              >
                <Row>
                  <Col span={20}>
                    <h4>Eave Setback</h4>
                  </Col>
                  <Col span={4}>
                    <Icon type="question-circle" />
                  </Col>
                </Row>
              </Tooltip>
            </Col>
            <Col {...this.rowLayout.field}>
              {getFieldDecorator('eaveStb', {
                rules: [...this.numberInputRules],
                initialValue: this.props.buildingInfoFields.eaveStb
              })(
                <InputNumber
                  className={classes.inputArea}
                  min={0}
                  max={10}
                  step={0.1}
                  formatter={value => `${value}m`}
                  parser={value => value.replace('m', '')}
                />
              )}
            </Col>
          </Row>
        </Form.Item>
        {this.state.type  === 'PITCHED' ?
          optionalHipStbInput :
          null
        }
        {this.state.type  === 'PITCHED' ?
          optionalRidgeStbInput :
          null
        }

        {/*The button to validate & process to create a new building*/}
        <Row type="flex" justify="center">
          <Col span={16}>
            <Button type='primary' shape='round' icon='plus' size='large'
              htmlType="submit" block
            >
              Create a Building
            </Button>
          </Col>
        </Row>
      </Form>
      <Button onClick={() => {
        let panelLayout = [0,[]];
        data.forEach(partialRoof => {
          const output = calculateFlatRoofPanel(
            FoundLine.fromPolyline(partialRoof[0]),
            partialRoof[1].map(d => FoundLine.fromPolyline(d)),
            'center',
            360, 2, 1, 5, 0.1, 0, 30, 0
          );
          panelLayout[0] += output[0];
          panelLayout[1] = panelLayout[1].concat(output[1]);
        })
        this.props.initEditingPanels(panelLayout[1]);
      }}>TEST</Button>
    </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    buildingInfoFields: state.buildingManagerReducer.buildingInfoFields
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUIStateReadyDrawing: () => dispatch(actions.setUIStateReadyDrawing()),
    initBuilding: (values) => dispatch(actions.initBuilding(values)),
    saveBuildingInfoFields: (values) => dispatch(actions.saveBuildingInfoFields(values)),
    initEditingPanels: (panels) => dispatch(actions.initEditingPanels(panels)),
    setDebugPolylines: (polylines) => dispatch(actions.setDebugPolylines(polylines)),
    setDebugPoints: (points) => dispatch(actions.setDebugPoints(points))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'createBuilding' })(CreateBuildingPanel));
