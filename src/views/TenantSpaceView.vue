<template>
    <el-container style="height: 100%;">
        <el-aside style="height: 100%;">
            <el-menu :default-active="onRoutes" style="height: 100%;" router="true">
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
        </el-aside>
        <el-main>
            <RouterView class="flex-item" style="height: 100%;" />
        </el-main>
    </el-container>
</template>
<script>
export default {
    data() {
        return {
            onRoutes: this.$route.path
        };
    },
    watch: {
        $route(to, from) {
            this.onRoutes = to.path;
        },
    },
    mounted() {
        let tenantId = this.$route.query.tenantId
        if (null != tenantId) {
            sessionStorage.setItem("tenantId", tenantId)
            this.$router.replace("/tenantSpace")
        }
    }
};
</script>