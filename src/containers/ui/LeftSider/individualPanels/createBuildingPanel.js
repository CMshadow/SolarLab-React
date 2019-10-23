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
import {calculateFlatRoofPanelSection1} from './setUpPVPanel';
import FoundLine from '../../../../infrastructure/line/foundLine';
const { Option } = Select;

const data = [
  [
    {
      "points": [
        {
          "lon": -117.841393252337,
          "lat": 33.647055024357,
          "height": 5,
          "heightOffset": 0,
          "entityId": "761f3e40-f53d-11e9-9afe-ddda8af7839a",
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
          "lon": -117.841286959917,
          "lat": 33.64724448354,
          "height": 5,
          "heightOffset": 0,
          "entityId": "761f3e41-f53d-11e9-9afe-ddda8af7839a",
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
          "lon": -117.840979531104,
          "lat": 33.647220566408,
          "height": 5,
          "heightOffset": 0,
          "entityId": "761f3e42-f53d-11e9-9afe-ddda8af7839a",
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
          "lon": -117.840671744749,
          "lat": 33.647002751391,
          "height": 5,
          "heightOffset": 0,
          "entityId": "761f3e43-f53d-11e9-9afe-ddda8af7839a",
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
          "lon": -117.840601162244,
          "lat": 33.646802617655,
          "height": 5,
          "heightOffset": 0,
          "entityId": "761f3e44-f53d-11e9-9afe-ddda8af7839a",
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
          "lon": -117.841094699907,
          "lat": 33.646833910375,
          "height": 5,
          "heightOffset": 0,
          "entityId": "761f3e45-f53d-11e9-9afe-ddda8af7839a",
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
          "lon": -117.841393252337,
          "lat": 33.647055024357,
          "height": 5,
          "heightOffset": 0,
          "entityId": "761f3e40-f53d-11e9-9afe-ddda8af7839a",
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
      "entityId": "761f3e46-f53d-11e9-9afe-ddda8af7839a",
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
    [
      {
        "points": [
          {
            "lon": -117.841325924976,
            "lat": 33.647023902514,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6550-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841258870829,
            "lat": 33.64702825835,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6551-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841230370795,
            "lat": 33.647094349459,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6552-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841293734138,
            "lat": 33.647119584763,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6553-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.84130713417,
            "lat": 33.647086982028,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6554-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841364184562,
            "lat": 33.64707620778,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6555-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841325924976,
            "lat": 33.647023902514,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6550-f53d-11e9-9afe-ddda8af7839a",
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
        "entityId": "761f6556-f53d-11e9-9afe-ddda8af7839a",
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
      {
        "points": [
          {
            "lon": -117.840935105913,
            "lat": 33.646874161073,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6557-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.840899912246,
            "lat": 33.646852085207,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6558-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.840898061202,
            "lat": 33.646823445722,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6559-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.84084887645,
            "lat": 33.646822622961,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f655a-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.84075351233,
            "lat": 33.646815145475,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f655b-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.840780267983,
            "lat": 33.646857662463,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f655c-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.840804579714,
            "lat": 33.646867085239,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f655d-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.840769466211,
            "lat": 33.646910739316,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f655e-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.840868761111,
            "lat": 33.646901904965,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f655f-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.840935105913,
            "lat": 33.646874161073,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6557-f53d-11e9-9afe-ddda8af7839a",
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
        "entityId": "761f6560-f53d-11e9-9afe-ddda8af7839a",
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
      {
        "points": [
          {
            "lon": -117.841076239466,
            "lat": 33.646849721788,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6561-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841051595441,
            "lat": 33.647073476933,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6562-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.840725734461,
            "lat": 33.646942711769,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6563-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.840721043434,
            "lat": 33.646950812875,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6564-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841060931613,
            "lat": 33.647087207006,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6565-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841086997414,
            "lat": 33.6468505429,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6566-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841076239466,
            "lat": 33.646849721788,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6561-f53d-11e9-9afe-ddda8af7839a",
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
        "entityId": "761f6567-f53d-11e9-9afe-ddda8af7839a",
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
      {
        "points": [
          {
            "lon": -117.841129872421,
            "lat": 33.647123370658,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6568-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841074112079,
            "lat": 33.647150170416,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6569-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841077130088,
            "lat": 33.64715411408,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f656a-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841080549499,
            "lat": 33.647157823769,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f656b-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841084344287,
            "lat": 33.647161271248,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f656c-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841088485572,
            "lat": 33.647164430281,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f656d-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841092941836,
            "lat": 33.647167276826,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f656e-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841097679165,
            "lat": 33.647169789218,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f656f-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841102661505,
            "lat": 33.647171948336,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6570-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841107850936,
            "lat": 33.647173737749,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6571-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841113207965,
            "lat": 33.647175143838,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6572-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.84111869182,
            "lat": 33.647176155901,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6573-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841124260766,
            "lat": 33.647176766236,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6574-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841129872421,
            "lat": 33.647176970199,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6575-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841135484076,
            "lat": 33.647176766236,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6576-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841141053022,
            "lat": 33.647176155901,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6577-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841146536877,
            "lat": 33.647175143838,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6578-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841151893906,
            "lat": 33.647173737749,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6579-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841157083337,
            "lat": 33.647171948336,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f657a-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841162065677,
            "lat": 33.647169789218,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f657b-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841166803006,
            "lat": 33.647167276826,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f657c-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.84117125927,
            "lat": 33.647164430281,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f657d-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841175400555,
            "lat": 33.647161271248,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f657e-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841179195343,
            "lat": 33.647157823769,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f657f-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841182614754,
            "lat": 33.64715411408,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6580-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841185632763,
            "lat": 33.647150170416,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6581-f53d-11e9-9afe-ddda8af7839a",
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
            "lon": -117.841129872421,
            "lat": 33.647123370658,
            "height": 5,
            "heightOffset": 0,
            "entityId": "761f6568-f53d-11e9-9afe-ddda8af7839a",
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
        "entityId": "761f6582-f53d-11e9-9afe-ddda8af7839a",
        "name": "polyline",
        "color": {
          "red": 1,
          "green": 1,
          "blue": 1,
          "alpha": 1
        },
        "show": true,
        "width": 4
      }
    ]
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
        const panelLayout = calculateFlatRoofPanelSection1(
          FoundLine.fromPolyline(data[0][0]), data[0][1].map(d => FoundLine.fromPolyline(d)), 0, 2, 1, 5, 0.1, 0, 0, 0, this.props
        );
        console.log(panelLayout)
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
