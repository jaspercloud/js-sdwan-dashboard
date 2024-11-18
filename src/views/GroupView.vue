<template>
    <div class="flex direction-column">
        <div>
            <el-button type="primary" @click="openAddDialog">新增</el-button>
        </div>
        <el-table :data="tableData" stripe style="height: 100%;" max-height="auto">
            <el-table-column prop="id" label="序号" width="120" />
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="description" label="描述" />
            <el-table-column label="默认">
                <template #default="scope">
                    <span v-if="scope.row.defaultGroup">默认</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="300">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click="members(scope.row.id)">成员管理</el-button>
                    <el-button link type="primary" size="small" @click="openEditDialog(scope.row)">编辑</el-button>
                    <el-button v-if="!scope.row.defaultGroup" link type="primary" size="small"
                        @click="del(scope.row)">删除</el-button>
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
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="saveOrUpdate">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="memberDialog.visible" title="成员管理" width="500">
            <el-form :model="memberDialog.form" label-position="right" label-width="auto">
                <el-form-item label="成员列表">
                    <el-select multiple collapse-tags collapse-tags-tooltip v-model="memberDialog.form.selectList"
                        placeholder="请选择">
                        <el-option v-for="item in memberDialog.form.options" :key="item.id" :label="item.name"
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
<script>
import http from '../api';
import { ElMessage, ElMessageBox } from 'element-plus'

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
        async members(id) {
            let { status: nodeStatus, data: nodeData } = await http.get(`/api/node/list`)
            let { status: memberStatus, data: memberData } = await http.get(`/api/group/memberList/${id}`)
            let selectList = []
            memberData.forEach(e => {
                selectList.push(e.id)
            });
            this.memberDialog = {
                visible: true,
                form: {
                    id: id,
                    selectList: selectList,
                    options: nodeData
                }
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
            let { status, data } = await http.post(`/api/group/updateMemberList`, {
                groupId: this.memberDialog.form.id,
                memberIdList: this.memberDialog.form.selectList
            })
            this.memberDialog.visible = false
        }
    }
}
</script>