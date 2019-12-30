import React from 'react';
import { Icon } from 'antd';
import { FormattedMessage } from 'react-intl';

export const emptyListTemplate = (props) => (
  <div style={{ textAlign: 'center' }}>
    <Icon type="frown" style={{ fontSize: 20 }} />
    <p><FormattedMessage id='no' /><FormattedMessage id={props.type} /></p>
  </div>
);
