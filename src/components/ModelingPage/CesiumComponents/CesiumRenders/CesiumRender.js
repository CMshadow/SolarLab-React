import React from 'react';

import DrawingManagerRender from './DrawingManagerRender';
import Drawing3DFoundManagerRender from './Drawing3DFoundManagerRender/Drawing3DFoundMangerRender';
const CesiumRender = () => {
  return (
    <div>
      <DrawingManagerRender />
      <Drawing3DFoundManagerRender />
    </div>
  );
};

export default CesiumRender;
