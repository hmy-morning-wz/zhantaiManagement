import {notification} from 'antd';
const notice = (type,message,desc) => {
    notification[type]({
        message: message,
        description: desc,
    });
};
export default notice