<template>
    <div class="flex direction-column">
        <div>
            <el-button type="primary" @click="openAddDialog">新增</el-button>
            <el-button type="primary" @click="list">刷新</el-button>
        </div>
        <el-table :data="tableData" stripe style="height: 100%;" max-height="auto">
            <el-table-column prop="id" label="序号" width="80" />
            <el-table-column prop="name" label="名称" width="120" show-overflow-tooltip />
            <el-table-column prop="description" label="描述" width="120" show-overflow-tooltip />
            <el-table-column prop="vip" label="分配地址" show-overflow-tooltip />
            <el-table-column prop="ip" label="公网地址" show-overflow-tooltip />
            <el-table-column prop="mac" label="物理地址" show-overflow-tooltip />
            <el-table-column prop="os" label="操作系统类型" show-overflow-tooltip />
            <el-table-column prop="mesh" label="节点类型" width="100">
                <template #default="scope">
                    <div v-if="scope.row.mesh">网关</div>
                    <div v-else>终端</div>
                </template>
            </el-table-column>
            <el-table-column prop="online" label="在线状态" width="100">
                <template #default="scope">
                    <div v-if="scope.row.online" style="display: inline-block;color:#13ce66;">在线</div>
                    <div v-else style="display: inline-block;color:#f56c6c;">离线</div>
                </template>
            </el-table-column>
            <el-table-column label="是否启用" width="120">
                <template #default="scope">
                    <el-switch v-model="scope.row.enable" disabled class="switch" />
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="200">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click="openTestDialog(scope.row)">测试</el-button>
                    <el-button link type="primary" size="small" @click="openDetailDialog(scope.row)">详情</el-button>
                    <el-button link type="primary" size="small" @click="openEditDialog(scope.row)">编辑</el-button>
                    <el-button link type="danger" size="small" @click="del(scope.row)">删除</el-button>
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
                <el-form-item label="物理地址">
                    <el-input v-model="dialog.form.mac" :disabled="dialog.type === 'edit'" />
                </el-form-item>
                <el-form-item label="应用到分组">
                    <el-select multiple v-model="dialog.form.groupIdList" placeholder="请选择">
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
        <el-dialog v-model="testDialog.visible" title="测试" width="500" :before-close="testDialogHandleClose"
            :close-on-click-modal="false">
            <el-form :model="dialog.form" label-position="top" label-width="auto">
                <el-form-item label="IP地址">
                    <el-input v-model="testDialog.form.ip" placeholder="请输入IP地址" @keyup.enter.native="test">
                        <template #append>
                            <el-button icon="Search" @click="test" />
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="结果">
                    <el-timeline>
                        <el-timeline-item v-for="item in testDialog.form.msgList" hide-timestamp="true" center="true"
                            :type="item.success ? 'success' : 'danger'">
                            {{ item.msg }}
                        </el-timeline-item>
                    </el-timeline>
                </el-form-item>
            </el-form>
            <el-text type="info">模拟测试，结果可做参考</el-text>
        </el-dialog>
        <el-dialog v-model="nodeDetailDialog.visible" title="节点详情" width="1000" :close-on-click-modal="false">
            <el-scrollbar height="600px">
                <div class="flex direction-column">
                    <el-descriptions title="基本信息" :column="3" border style="margin-bottom: 20px;">
                        <el-descriptions-item label="名称">{{ nodeDetailDialog.form.name }}</el-descriptions-item>
                        <el-descriptions-item label="分配地址">{{ nodeDetailDialog.form.vip }}</el-descriptions-item>
                        <el-descriptions-item label="在线状态">
                            <div v-if="nodeDetailDialog.form.online" style="display: inline-block;color:#13ce66;">
                                在线
                            </div>
                            <div v-else style="display: inline-block;color:#f56c6c;">离线</div>
                        </el-descriptions-item>
                        <el-descriptions-item prop="mesh" label="节点类型">
                            <div v-if="nodeDetailDialog.form.mesh">网关</div>
                            <div v-else>终端</div>
                        </el-descriptions-item>
                        <el-descriptions-item label="公网地址">{{ nodeDetailDialog.form.ip }}</el-descriptions-item>
                        <el-descriptions-item label="物理地址">{{ nodeDetailDialog.form.mac }}</el-descriptions-item>
                        <el-descriptions-item label="客户端版本">
                            {{ nodeDetailDialog.form.nodeVersion }}
                        </el-descriptions-item>
                        <el-descriptions-item label="操作系统类型">{{ nodeDetailDialog.form.os }}</el-descriptions-item>
                        <el-descriptions-item label="操作系统版本">
                            {{ nodeDetailDialog.form.osVersion }}
                        </el-descriptions-item>
                        <el-descriptions-item label="描述">
                            {{ nodeDetailDialog.form.description }}
                        </el-descriptions-item>
                    </el-descriptions>
                    <el-descriptions title="ICE列表">
                        <el-descriptions-item>
                            <el-table :data="nodeDetailDialog.form.addressList">
                                <el-table-column prop="type" label="地址类型" />
                                <el-table-column prop="provider" label="提供方" />
                                <el-table-column prop="info" label="连接信息" />
                            </el-table>
                        </el-descriptions-item>
                    </el-descriptions>
                    <el-descriptions title="节点列表">
                        <el-descriptions-item>
                            <el-table :data="nodeDetailDialog.form.nodeList">
                                <el-table-column prop="name" label="名称" show-overflow-tooltip />
                                <el-table-column prop="mac" label="物理地址" />
                                <el-table-column prop="vip" label="分配地址" />
                                <el-table-column prop="online" label="在线状态">
                                    <template #default="scope">
                                        <div v-if="scope.row.online" style="display: inline-block;color:#13ce66;">在线
                                        </div>
                                        <div v-else style="display: inline-block;color:#f56c6c;">离线</div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-descriptions-item>
                    </el-descriptions>
                    <el-descriptions title="路由">
                        <el-descriptions-item>
                            <el-table :data="nodeDetailDialog.form.routeList">
                                <el-table-column prop="name" label="名称" width="120" show-overflow-tooltip />
                                <el-table-column prop="description" label="描述" width="120" show-overflow-tooltip />
                                <el-table-column prop="destination" label="目标地址" />
                                <el-table-column label="是否启用" width="120">
                                    <template #default="scope">
                                        <el-switch v-model="scope.row.enable" disabled class="switch" />
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-descriptions-item>
                    </el-descriptions>
                    <el-descriptions title="路由规则">
                        <el-descriptions-item>
                            <el-text type="info">提示: 数值越小，优先级越高</el-text>
                            <el-table :data="nodeDetailDialog.form.routeRuleList">
                                <el-table-column prop="name" label="名称" width="120" show-overflow-tooltip />
                                <el-table-column prop="description" label="描述" width="120" show-overflow-tooltip />
                                <el-table-column prop="level" label="优先级" width="120" />
                                <el-table-column label="策略" width="120">
                                    <template #default="scope">
                                        <span v-if="scope.row.strategy === 'Allow'" style="color:#13ce66;">允许</span>
                                        <span v-if="scope.row.strategy === 'Reject'" style="color:#f56c6c;">拒绝</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="direction" label="方向" width="120">
                                    <template #default="scope">
                                        <span v-if="scope.row.direction === 'Input'">入口</span>
                                        <span v-if="scope.row.direction === 'Output'">出口</span>
                                        <span v-if="scope.row.direction === 'All'">全部</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="规则">
                                    <template #default="scope">
                                        <el-tag v-for="tag in scope.row.ruleList" :key="tag">
                                            {{ tag }}
                                        </el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column label="是否启用" width="120">
                                    <template #default="scope">
                                        <el-switch v-model="scope.row.enable" disabled class="switch" />
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-descriptions-item>
                    </el-descriptions>
                    <el-descriptions title="地址转换">
                        <el-descriptions-item>
                            <el-table :data="nodeDetailDialog.form.vnatList">
                                <el-table-column prop="name" label="名称" width="120" show-overflow-tooltip />
                                <el-table-column prop="description" label="描述" width="120" show-overflow-tooltip />
                                <el-table-column prop="srcCidr" label="源地址" />
                                <el-table-column prop="dstCidr" label="目标地址" />
                                <el-table-column label="是否启用" width="120">
                                    <template #default="scope">
                                        <el-switch v-model="scope.row.enable" disabled class="switch" />
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-descriptions-item>
                    </el-descriptions>
                    <el-descriptions title="归属分组">
                        <el-descriptions-item>
                            <el-table :data="nodeDetailDialog.form.groupList">
                                <el-table-column prop="name" label="名称" show-overflow-tooltip />
                                <el-table-column prop="description" label="描述" show-overflow-tooltip />
                            </el-table>
                        </el-descriptions-item>
                    </el-descriptions>
                </div>
            </el-scrollbar>
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
            testDialog: {
                visible: false,
                ip: "",
                msgList: []
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
            let { status, data } = await http.post(`/api/node/list`, {})
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
                this.dialog.visible = false
                await this.list()
            })
        },
        openTestDialog(row) {
            this.testDialog = {
                visible: true,
                form: {
                    nodeId: row.id,
                    ip: "",
                    msgList: []
                }
            }
        },
        testDialogHandleClose(done) {
            done()
        },
        async test() {
            this.testDialog.form.msgList = []
            let { status, data } = await http.post(`/api/node/test`, this.testDialog.form)
            this.testDialog.form.msgList = data
            console.log(this.testDialog.form)
        }
    }
}
</script>