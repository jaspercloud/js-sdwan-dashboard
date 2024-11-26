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
            <el-table-column prop="destination" label="目标地址" width="180" />
            <el-table-column label="节点列表">
                <template #default="scope">
                    <el-tag v-for="tag in scope.row.nodeList" :key="tag.id">
                        {{ showTag(tag) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="是否启用" width="120">
                <template #default="scope">
                    <el-switch v-model="scope.row.enable" disabled class="switch" />
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="150">
                <template #default="scope">
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
                <el-form-item label="目标地址">
                    <el-input v-model="dialog.form.destination" placeholder="192.168.1.1/24" />
                </el-form-item>
                <el-form-item label="节点列表">
                    <el-select multiple collapse-tags collapse-tags-tooltip v-model="dialog.form.nodeIdList"
                        placeholder="请选择">
                        <el-option v-for="item in dialog.nodeList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="应用到分组">
                    <el-select multiple collapse-tags collapse-tags-tooltip v-model="dialog.form.groupIdList"
                        placeholder="请选择">
                        <el-option v-for="item in dialog.groupList" :key="item.id" :label="item.name"
                            :value="item.id" />
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
            let { status: nodeStatus, data: nodeData } = await http.get(`/api/node/list`)
            let { status: groupStatus, data: groupData } = await http.get(`/api/group/list`)
            this.dialog = {
                visible: true,
                type: "add",
                nodeList: nodeData,
                groupList: groupData,
                form: {
                    name: "",
                    description: "",
                    destination: "",
                    nodeIdList: [],
                    groupIdList: [],
                    enable: true
                }
            }
        },
        async openEditDialog(row) {
            let { status, data } = await http.get(`/api/route/detail/${row.id}`)
            let { status: nodeStatus, data: nodeData } = await http.get(`/api/node/list`)
            let { status: groupStatus, data: groupData } = await http.get(`/api/group/list`)
            let nodeIdList = []
            data.nodeList.forEach(e => {
                nodeIdList.push(e.id)
            })
            let groupIdList = []
            data.groupList.forEach(e => {
                groupIdList.push(e.id)
            })
            this.dialog = {
                visible: true,
                type: "edit",
                nodeList: nodeData,
                groupList: groupData,
                form: {
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    destination: data.destination,
                    nodeIdList: nodeIdList,
                    groupIdList: groupIdList,
                    enable: data.enable
                }
            }
        },
        async list() {
            let { status, data } = await http.get(`/api/route/list`)
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
            let { status, data } = await http.post(`/api/route/add`, this.dialog.form)
            this.dialog.visible = false
            this.list()
        },
        async edit() {
            let { status, data } = await http.post(`/api/route/edit`, this.dialog.form)
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
                let { status, data } = await http.post(`/api/route/del`, {
                    id: row.id
                })
                this.dialog.visible = false
                await this.list()
            })
        },
        showTag(e) {
            let label = e.name
            if (null == label) {
                label = e.mac
            }
            return label
        }
    }
}
</script>