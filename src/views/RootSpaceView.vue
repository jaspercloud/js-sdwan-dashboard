<template>
    <el-container style="height: 100%;">
        <el-aside style="height: 100%;">
            <el-menu :default-active="onRoutes" style="height: 100%;" router="true">
                <el-menu-item index="/rootSpace/tenant">
                    <span>租户管理</span>
                </el-menu-item>
                <el-menu-item index="/rootSpace/appVersion">
                    <span>客户端管理</span>
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
    }
};
</script>