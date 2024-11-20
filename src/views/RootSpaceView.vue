<template>
    <el-container style="height: 100%;">
        <el-header style="background-color: #409EFF;">
            <h3 style="margin-left: 20px;color: #ffffff;">netThunder</h3>
        </el-header>
        <el-container>
            <el-aside style="height: 100%;" class="flex direction-column">
                <el-menu :default-active="onRoutes" style="height: 100%;" router="true" class="flex-item">
                    <el-menu-item index="/rootSpace/tenant">
                        <span>租户管理</span>
                    </el-menu-item>
                    <el-menu-item index="/rootSpace/appVersion">
                        <span>客户端管理</span>
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