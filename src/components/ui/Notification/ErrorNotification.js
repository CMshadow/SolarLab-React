import { notification } from 'antd';

const errorNotification = (message, description, duration=null) => {
  return notification.error({
    message: message,
    description: description,
    duration: duration ? duration : 4,
    style: {
      marginTop: 55,
    },
  });
};

export default errorNotification;
