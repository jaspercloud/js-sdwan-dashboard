import axios from 'axios'
import { ElMessage } from 'element-plus'

const http = axios.create({
    timeout: 3000
});

let { status, data } = await http.post("/api/account/login", {
    "username": "root",
    "password": "root"
})
console.log(data)

http.interceptors.request.use(config => {
    config.headers["Access-Token"] = data.accessToken
    let tenantId = sessionStorage.getItem("tenantId")
    if (null != tenantId) {
        config.headers["X-Tenant-Id"] = tenantId
    }
    return config;
}, error => {
    // 请求错误处理
    return Promise.reject(error);
});
http.interceptors.response.use(
    response => {
        // 请求成功处理
        return response;
    },
    error => {
        if (error.response) {
            // 客户端请求错误处理
            const { status } = error.response;
            if (status != 200) {
                ElMessage.error(error.response.data)
            }
        }
        return Promise.reject(error);
    }
);
export default http