<template>
    <el-container style="height: 100%;">
        <el-header style="background-color: #409EFF;">
            <h3 style="margin-left: 20px;color: #ffffff;">{{ tenant.name }}</h3>
        </el-header>
        <el-container>
            <el-aside style="height: 100%;" class="flex direction-column">
                <el-menu :default-active="onRoutes" router="true" class="flex-item">
                    <el-menu-item index="/tenantSpace/node">
                        <span>节点管理</span>
                    </el-menu-item>
                    <el-menu-item index="/tenantSpace/route">
                        <span>路由管理</span>
                    </el-menu-item>
                    <el-menu-item index="/tenantSpace/rule">
                        <span>规则管理</span>
                    </el-menu-item>
                    <el-menu-item index="/tenantSpace/vnat">
                        <span>地址转换</span>
                    </el-menu-item>
                    <el-menu-item index="/tenantSpace/group">
                        <span>分组管理</span>
                    </el-menu-item>
                </el-menu>
                <el-button size="large">退出</el-button>
            </el-aside>
            <el-main>
                <RouterView class="flex-item" style="height: 100%;" />
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
import http from '../api';
export default {
    data() {
        return {
            onRoutes: this.$route.path,
            tenant: {}
        };
    },
    watch: {
        $route(to, from) {
            this.onRoutes = to.path;
        },
    },
    async mounted() {
        let tenantId = this.$route.query.tenantId
        if (null != tenantId) {
            sessionStorage.setItem("tenantId", tenantId)
            this.$router.replace("/tenantSpace")
        }
        let { status, data } = await http.get(`/api/tenant/current`)
        this.tenant = data
    }
};
</script>