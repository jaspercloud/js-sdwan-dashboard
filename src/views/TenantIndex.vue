<template>
    <el-container style="height: 100%;">
        <el-aside style="height: 100%;">
            <el-menu :default-active="onRoutes" style="height: 100%;" router="true">
                <el-menu-item index="/tenantIndex/node">
                    <span>节点管理</span>
                </el-menu-item>
                <el-menu-item index="/tenantIndex/route">
                    <span>路由管理</span>
                </el-menu-item>
                <el-menu-item index="/tenantIndex/rule">
                    <span>规则管理</span>
                </el-menu-item>
                <el-menu-item index="/tenantIndex/vnat">
                    <span>地址转换</span>
                </el-menu-item>
                <el-menu-item index="/tenantIndex/group">
                    <span>分组管理</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-main>
            <RouterView class="flex-item" style="height: 100%;" />
        </el-main>
    </el-container>
</template>
<style></style>

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
};
</script>