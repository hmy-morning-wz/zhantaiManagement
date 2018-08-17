import axios from 'axios'
import EventManaer from "../common/EventManager"
// http响应拦截器
let intance=axios.create({
    baseURL: window.location.origin+'/stage',
    timeout: 100000,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        "Access-Control-Allow-Credentials":"true"
    },

    withCredentials: true
})
intance.interceptors.response.use(data => {
    if(typeof data.data===typeof "1"){
        data.data=JSON.parse(data.data)
    }
    if(data.data.errorCode==="200018"){
        EventManaer.emitter("logout",{})
    }

    return data
}, error => {
    return Promise.reject(error)
});
export default intance