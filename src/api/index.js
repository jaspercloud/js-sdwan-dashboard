import axios from 'axios'
import cookie from 'js-cookie'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '../router'

const http = axios.create({
    timeout: 3000
});

http.interceptors.request.use(config => {
    config.headers["Access-Token"] = cookie.get("Access-Token")
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
            if (status == 401) {
                ElMessage.error("登录已失效")
                router.replace("/")
            } else if (status != 200) {
                ElMessage.error(error.response.data)
            }
        }
        return Promise.reject(error);
    }
);
export default http