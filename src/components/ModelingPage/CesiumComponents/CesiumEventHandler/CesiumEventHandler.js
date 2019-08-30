import React from 'react';
import { ScreenSpaceEventHandler } from 'resium';
import * as Cesium from 'cesium';

import LeftClickHandler from './IndividualEventHandler/LeftClick';
import LeftDownHandler from './IndividualEventHandler/LeftDown';
import LeftUpHandler from './IndividualEventHandler/LeftUp';
import RightClickHandler from './IndividualEventHandler/RightClick';
import MouseMoveHandler from './IndividualEventHandler/MouseMove';

const CesiumEventHandlers = () => {
  return (
    <ScreenSpaceEventHandler>
       <LeftClickHandler />
       <LeftDownHandler />
       <LeftUpHandler />
       <RightClickHandler />
       <MouseMoveHandler/>
    </ScreenSpaceEventHandler>
  );
};

export default CesiumEventHandlers;
