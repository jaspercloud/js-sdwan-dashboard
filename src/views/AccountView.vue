<template>
    <div class="flex flex-item justify-center align-center" style="height: 100%;">
        <el-card style="width: 480px;padding: 50px;">
            <el-form :model="form" label-width="auto" label-position="top">
                <el-form-item label="账号">
                    <el-input v-model="form.username" size="large" />
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.password" type="password" :show-password="true" size="large" />
                </el-form-item>
            </el-form>
            <el-button type="primary" style="width: 100%;margin-top: 50px;" size="large" @click="login"
                :loading="loading">登录</el-button>
        </el-card>
    </div>
</template>
<script>
import http from '../api';
import cookie from 'js-cookie'
export default {
    data() {
        return {
            form: {
                username: "",
                password: "",
                loading: false
            }
        }
    },
    methods: {
        async login() {
            this.loading = true
            let { status, data } = await http.post(`/api/account/login`, this.form)
            this.loading = false
            cookie.set("Access-Token", data.accessToken)
            if (null == data.tenantId) {
                this.$router.replace("/rootSpace")
            } else {
                sessionStorage.setItem("tenantId", data.tenantId)
                this.$router.replace("/tenantSpace")
            }
        }
    }
}
</script>