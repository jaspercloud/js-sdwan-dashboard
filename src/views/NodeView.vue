<template>
    <div class="flex direction-column">
        <div>
            <el-button type="primary" @click="openAddDialog">新增</el-button>
        </div>
        <el-table :data="tableData" stripe style="height: 100%;" max-height="auto">
            <el-table-column prop="id" label="序号" width="120" />
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="description" label="描述" />
            <el-table-column prop="vip" label="分配地址" />
            <el-table-column prop="ip" label="公网地址" />
            <el-table-column prop="mac" label="物理地址" />
            <el-table-column prop="online" label="在线状态">
                <template #default="scope">
                    {{ showOnlineStatus(scope.row) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="300">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click="openDetailDialog(scope.row)">详情</el-button>
                    <el-button link type="primary" size="small" @click="openEditDialog(scope.row)">编辑</el-button>
                    <el-button link type="primary" size="small" @click="del(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog v-model="dialog.visible" :title="showTitle" width="500" :before-close="dialogHandleClose">
            <el-form :model="dialog.form" label-position="right" label-width="auto">
                <el-form-item label="名称">
                    <el-input v-model="dialog.form.name" />
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="dialog.form.description" />
                </el-form-item>
                <el-form-item label="物理地址">
                    <el-input v-model="dialog.form.mac" />
                </el-form-item>
                <el-form-item label="分组">
                    <el-select multiple collapse-tags collapse-tags-tooltip v-model="dialog.form.groupIdList"
                        placeholder="请选择">
                        <el-option v-for="item in dialog.groupList" :key="item.id" :label="item.name" :value="item.id">
                            <span style="float: left">{{ item.name }}</span>
                            <span style="float: right;">
                                <span v-if="item.defaultGroup">默认</span>
                            </span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否启用">
                    <el-switch v-model="dialog.form.enable" class="switch" />
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
        <el-dialog v-model="nodeDetailDialog.visible" title="节点详情" width="800">
            <el-scrollbar height="600px">
                <div class="flex direction-column">
                    <el-descriptions title="基本信息" :column="3" border style="margin-bottom: 20px;">
                        <el-descriptions-item label="名称">{{ nodeDetailDialog.form.name }}</el-descriptions-item>
                        <el-descriptions-item label="描述">{{ nodeDetailDialog.form.description }}</el-descriptions-item>
                        <el-descriptions-item label="在线状态">
                            {{ showOnlineStatus(nodeDetailDialog.form) }}
                        </el-descriptions-item>
                        <el-descriptions-item label="分配地址">{{ nodeDetailDialog.form.vip }}</el-descriptions-item>
                        <el-descriptions-item label="公网地址">{{ nodeDetailDialog.form.ip }}</el-descriptions-item>
                        <el-descriptions-item label="物理地址">{{ nodeDetailDialog.form.mac }}</el-descriptions-item>
                    </el-descriptions>
                    <el-descriptions title="路由">
                        <el-descriptions-item>
                            <el-table :data="nodeDetailDialog.form.routeList">
                                <el-table-column prop="name" label="名称" width="120" />
                                <el-table-column prop="description" label="描述" width="120" />
                                <el-table-column prop="destination" label="目标地址" />
                            </el-table>
                        </el-descriptions-item>
                    </el-descriptions>
                    <el-descriptions title="路由规则">
                        <el-descriptions-item>
                            <el-table :data="nodeDetailDialog.form.routeRuleList">
                                <el-table-column prop="name" label="名称" width="120" />
                                <el-table-column prop="description" label="描述" width="120" />
                                <el-table-column prop="direction" label="方向" width="120">
                                    <template #default="scope">
                                        <span v-if="scope.row.direction === 'Input'">入口</span>
                                        <span v-if="scope.row.direction === 'Output'">出口</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="ruleList" label="规则" />
                            </el-table>
                        </el-descriptions-item>
                    </el-descriptions>
                    <el-descriptions title="地址转换">
                        <el-descriptions-item>
                            <el-table :data="nodeDetailDialog.form.vnatList">
                                <el-table-column prop="name" label="名称" width="120" />
                                <el-table-column prop="description" label="描述" width="120" />
                                <el-table-column prop="srcCidr" label="源地址" />
                                <el-table-column prop="dstCidr" label="目标地址" />
                            </el-table>
                        </el-descriptions-item>
                    </el-descriptions>
                    <el-descriptions title="分组管理">
                        <el-descriptions-item>
                            <el-table :data="nodeDetailDialog.form.groupList">
                                <el-table-column prop="name" label="名称" />
                                <el-table-column prop="description" label="描述" />
                            </el-table>
                        </el-descriptions-item>
                    </el-descriptions>
                </div>
            </el-scrollbar>
        </el-dialog>
    </div>
</template>
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
            nodeDetailDialog: {
                visible: false,
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
        async openAddDialog() {
            let { status: groupStatus, data: groupData } = await http.get(`/api/group/list`)
            this.dialog = {
                visible: true,
                type: "add",
                groupList: groupData,
                form: {
                    name: "",
                    description: "",
                    mac: "",
                    groupIdList: [],
                    enable: true
                }
            }
        },
        async openEditDialog(row) {
            let { status, data } = await http.get(`/api/node/detail/${row.id}`)
            let { status: groupStatus, data: groupData } = await http.get(`/api/group/list`)
            let groupIdList = []
            data.groupList.forEach(e => {
                groupIdList.push(e.id)
            })
            data.groupIdList = groupIdList
            this.dialog = {
                visible: true,
                type: "edit",
                groupList: groupData,
                form: data
            }
        },
        async openDetailDialog(row) {
            let { status, data } = await http.get(`/api/node/detail/${row.id}`)
            this.nodeDetailDialog = {
                visible: true,
                form: data
            }
        },
        async list() {
            let { status, data } = await http.get(`/api/node/list`)
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
            let { status, data } = await http.post(`/api/node/add`, this.dialog.form)
            this.dialog.visible = false
            this.list()
        },
        async edit() {
            let { status, data } = await http.post(`/api/node/edit`, this.dialog.form)
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
                let { status, data } = await http.post(`/api/node/del`, {
                    id: row.id
                })
                await this.list()
            })
        },
        showOnlineStatus(row) {
            return row.online ? "在线" : "不在线"
        }
    }
}
</script>