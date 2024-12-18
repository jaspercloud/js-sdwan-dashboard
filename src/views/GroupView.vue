<template>
    <div class="flex direction-column">
        <div>
            <el-button type="primary" @click="openAddDialog">新增</el-button>
            <el-button type="primary" @click="list">刷新</el-button>
        </div>
        <el-table :data="tableData" stripe style="height: 100%;" max-height="auto">
            <el-table-column prop="id" label="序号" width="80" />
            <el-table-column prop="name" label="名称" show-overflow-tooltip />
            <el-table-column prop="description" label="描述" show-overflow-tooltip />
            <el-table-column prop="nodeCount" label="节点数" />
            <el-table-column prop="routeCount" label="路由数" />
            <el-table-column prop="vnatCount" label="地址转换数" />
            <el-table-column prop="ruleCount" label="规则数" />
            <el-table-column label="默认" width="120">
                <template #default="scope">
                    <span v-if="scope.row.defaultGroup">默认</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="200">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click="manage(scope.row.id)">管理</el-button>
                    <el-button link type="primary" size="small" @click="openEditDialog(scope.row)">编辑</el-button>
                    <el-button v-if="!scope.row.defaultGroup" link type="danger" size="small"
                        @click="del(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog v-model="dialog.visible" :title="showTitle" width="500" :before-close="dialogHandleClose"
            :close-on-click-modal="false">
            <el-form :model="dialog.form" label-position="right" label-width="auto">
                <el-form-item label="名称">
                    <el-input v-model="dialog.form.name" />
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="dialog.form.description" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="saveOrUpdate">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="memberDialog.visible" title="成员管理" width="500" :close-on-click-modal="false">
            <el-form :model="memberDialog.form" label-position="right" label-width="auto">
                <el-form-item label="节点列表">
                    <el-select multiple v-model="memberDialog.form.nodeIdList" placeholder="请选择">
                        <el-option v-for="item in memberDialog.nodeList" :key="item.id" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="路由列表">
                    <el-select multiple v-model="memberDialog.form.routeIdList" placeholder="请选择">
                        <el-option v-for="item in memberDialog.routeList" :key="item.id" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="规则列表">
                    <el-select multiple v-model="memberDialog.form.routeRuleIdList" placeholder="请选择">
                        <el-option v-for="item in memberDialog.routeRuleList" :key="item.id" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="地址转换列表">
                    <el-select multiple v-model="memberDialog.form.vnatIdList" placeholder="请选择">
                        <el-option v-for="item in memberDialog.vnatList" :key="item.id" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="updateMembers">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<style>
.switch {
    --el-switch-on-color: #13ce66;
    --el-switch-off-color: #ff4949
}
</style>
<script>
import { ElMessageBox } from 'element-plus';
import http from '../api';
export default {
    data() {
        return {
            dialog: {
                visible: false,
                type: "",
                title: "",
                form: {}
            },
            memberDialog: {
                visible: false,
                form: {},
                options: []
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
                    description: ""
                }
            }
        },
        openEditDialog(row) {
            this.dialog = {
                visible: true,
                type: "edit",
                form: JSON.parse(JSON.stringify(row))
            }
        },
        async list() {
            let { status, data } = await http.get(`/api/group/list`)
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
            let { status, data } = await http.post(`/api/group/add`, this.dialog.form)
            this.dialog.visible = false
            this.list()
        },
        async manage(id) {
            let { status: groupStatus, data: group } = await http.get(`/api/group/detail/${id}`)
            let { status: nodeStatus, data: nodeData } = await http.post(`/api/node/list`, {})
            let { status: routeStatus, data: routeData } = await http.get(`/api/route/list`)
            let { status: routeRuleStatus, data: routeRuleData } = await http.get(`/api/route-rule/list`)
            let { status: vnatStatus, data: vnatData } = await http.get(`/api/vnat/list`)
            this.memberDialog = {
                visible: true,
                nodeList: nodeData,
                routeList: routeData,
                routeRuleList: routeRuleData,
                vnatList: vnatData,
                form: group
            }
        },
        async edit() {
            let { status, data } = await http.post(`/api/group/edit`, this.dialog.form)
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
                let { status, data } = await http.post(`/api/group/del`, {
                    id: row.id
                })
                this.dialog.visible = false
                await this.list()
            })
        },
        async updateMembers() {
            let { status, data } = await http.post(`/api/group/updateMemberList`, this.memberDialog.form)
            this.memberDialog.visible = false
        }
    }
}
</script>