import React from 'react';

import DrawingManagerRender from './DrawingManagerRender';
import DrawingInnerManagerRender from './DrawingInnerManagerRender';

const CesiumRender = () => {
  return (
    <div>
      <DrawingManagerRender />
      <DrawingInnerManagerRender />
    </div>
  );
};

export default CesiumRender;
