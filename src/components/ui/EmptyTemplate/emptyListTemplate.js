import React from 'react';
import { Icon } from 'antd';

export const emptyListTemplate = (props) => (
  <div style={{ textAlign: 'center' }}>
    <Icon type="frown" style={{ fontSize: 20 }} />
    <p>No {props.type} Yet</p>
  </div>
);
