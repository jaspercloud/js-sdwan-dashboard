<template>
    <el-container style="height: 100%;">
        <el-header style="background-color: #409EFF;">
            <el-row>
                <el-col :span="12">
                    <h3 style="margin-left: 20px;color: #ffffff;">{{ tenant.name }}</h3>
                </el-col>
                <el-col :span="12" class="flex-item direction-row-reverse align-center">
                    <el-dropdown @command="clickMenu">
                        <el-button circle size="large">
                            <el-icon>
                                <User />
                            </el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="openUpdatePwdDialog">修改密码</el-dropdown-item>
                                <el-dropdown-item command="exit">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-col>
            </el-row>
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
                    <el-menu-item index="/tenantSpace/vnat">
                        <span>地址转换</span>
                    </el-menu-item>
                    <el-menu-item index="/tenantSpace/rule">
                        <span>规则管理</span>
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
    </el-container>
    <update-password-dialog v-model="updatePasswordDialogVisible" />
</template>
<style scoped>
.el-col-12 {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
}
</style>
<script>
import http from '../api';
import UpdatePasswordDialog from '../components/UpdatePasswordDialog.vue';
export default {
    components: {
        "update-password-dialog": UpdatePasswordDialog
    },
    data() {
        return {
            onRoutes: this.$route.path,
            tenant: {},
            updatePasswordDialogVisible: false
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
    },
    methods: {
        openUpdatePwdDialog() {
            this.updatePasswordDialogVisible = true
        },
        exit() {
            this.$router.replace("/")
        },
        clickMenu(command) {
            console.log(this[command]())
        }
    }
};
</script>