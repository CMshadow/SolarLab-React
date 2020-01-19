import { notification } from 'antd';

const warningNotification = (message, description, duration=null) => {
  return notification.warning({
    message: message,
    description: description,
    duration: duration ? duration : 4,
    style: {
      marginTop: 55,
    },
  });
};

export default warningNotification;
