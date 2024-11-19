<template>
    <div style="padding: 20px;">
        <div class="header flex direction-row-reverse">
            <el-button type="primary" size="large" @click="openAddDialog">新增</el-button>
        </div>
        <div style="margin-top: 20px;">
            <el-space wrap>
                <div v-for="item in tableData" :key="item.id">
                    <el-card style="width: 350px;">
                        <template #header>
                            <div class="flex">
                                <div class="flex-item">{{ item.name }}</div>
                                <el-button link type="primary" @click="openEditDialog(item)">编辑</el-button>
                            </div>
                        </template>
                        <el-descriptions :column="2">
                            <el-descriptions-item label="状态">{{ item.enable }}</el-descriptions-item>
                            <el-descriptions-item label="是否需要认证">{{ item.nodeGrant }}</el-descriptions-item>
                            <el-descriptions-item label="地址池">{{ item.cidr }}</el-descriptions-item>
                            <el-descriptions-item label="编码">{{ item.code }}</el-descriptions-item>
                            <el-descriptions-item label="在线数">{{ item.onlineNode }}</el-descriptions-item>
                            <el-descriptions-item label="总数">{{ item.totalNode }}</el-descriptions-item>
                            <el-descriptions-item label="描述">{{ item.description }}</el-descriptions-item>
                        </el-descriptions>
                        <div class="flex flex-item">
                            <el-button style="width: 100%;" type="primary" @click="enter(item)">进入</el-button>
                        </div>
                    </el-card>
                </div>
            </el-space>
            <el-dialog v-model="dialog.visible" :title="showTitle" width="500" :before-close="dialogHandleClose"
                :close-on-click-modal="false">
                <el-form :model="dialog.form" label-position="right" label-width="auto">
                    <el-form-item label="名称">
                        <el-input v-model="dialog.form.name" />
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input v-model="dialog.form.description" />
                    </el-form-item>
                    <el-form-item label="编码">
                        <el-input v-model="dialog.form.code" :disabled="dialog.type === 'edit'" />
                    </el-form-item>
                    <el-form-item label="账号">
                        <el-input v-model="dialog.form.username" :disabled="dialog.type === 'edit'" />
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="dialog.form.password" type="password" />
                    </el-form-item>
                    <el-form-item label="地址池">
                        <el-input v-model="dialog.form.cidr" placeholder="192.168.1.0/24"
                            :disabled="dialog.type === 'edit'" />
                    </el-form-item>
                    <el-form-item label="stunServer">
                        <tag-x v-model="dialog.form.stunServerList" placeholder="192.168.1.1:8080" />
                    </el-form-item>
                    <el-form-item label="relayServer">
                        <tag-x v-model="dialog.form.relayServerList" placeholder="192.168.1.1:8080" />
                    </el-form-item>
                    <el-form-item label="是否需要认证">
                        <el-switch v-model="dialog.form.nodeGrant" class="switch" />
                    </el-form-item>
                    <el-form-item label="是否启用">
                        <el-switch v-model="dialog.form.enable" class="switch" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <div class="footer flex direction-column">
                        <el-button type="primary" @click="saveOrUpdate">
                            确定
                        </el-button>
                        <el-button type="danger" v-if="dialog.type === 'edit'" @click="del(dialog.form)">
                            删除
                        </el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
    </div>
</template>
<style>
.header {
    width: 100%;
}

.footer .el-button+.el-button {
    margin-left: 0px;
    margin-top: 10px;
}
</style>
<script>
import { ElMessageBox } from 'element-plus';
import TagX from '../components/TagX.vue';
import http from '../api';

export default {
    components: {
        "tag-x": TagX
    },
    data() {
        return {
            dialog: {
                visible: false,
                type: "",
                title: "",
                form: {}
            },
            tableData: [
            ]
        }
    },
    mounted() {
        this.list()
    },
    computed: {
        showTitle() {
            let title = ""
            switch (this.dialog.type) {
                case "add":
                    title = "新增"
                    break
                case "edit":
                    title = "编辑"
                    break
            }
            return title
        }
    },
    methods: {
        dialogHandleClose(done) {
            done()
        },
        openAddDialog() {
            this.dialog = {
                visible: true,
                type: "add",
                form: {
                    name: "",
                    description: "",
                    code: "",
                    username: "",
                    password: "",
                    cidr: "",
                    stunServerList: [],
                    relayServerList: [],
                    nodeGrant: true,
                    enable: true
                }
            }
        },
        async openEditDialog(row) {
            let { status, data } = await http.get(`/api/tenant/detail/${row.id}`)
            this.dialog = {
                visible: true,
                type: "edit",
                form: data
            }
        },
        async list() {
            let { status, data } = await http.get(`/api/tenant/list`)
            this.tableData = data
        },
        async saveOrUpdate() {
            switch (this.dialog.type) {
                case "add":
                    await this.save()
                    break
                case "edit":
                    await this.edit()
                    break
            }
            await this.list()
        },
        async save() {
            let { status, data } = await http.post(`/api/tenant/add`, this.dialog.form)
            this.dialog.visible = false
            this.list()
        },
        async edit() {
            let { status, data } = await http.post(`/api/tenant/edit`, this.dialog.form)
            this.dialog.visible = false
        },
        del(row) {
            ElMessageBox.confirm(
                '是否删除?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }
            ).then(async () => {
                let { status, data } = await http.post(`/api/tenant/del`, {
                    id: row.id
                })
                this.dialog.visible = false
                await this.list()
            })
        },
        enter(row) {
            window.open(`/tenantSpace?tenantId=${row.id}`, '_blank');
        }
    }
}
</script>