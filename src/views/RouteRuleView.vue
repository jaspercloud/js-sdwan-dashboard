<template>
    <div class="flex direction-column">
        <div>
            <el-button type="primary" @click="openAddDialog">新增</el-button>
        </div>
        <el-table :data="tableData" stripe style="height: 100%;" max-height="auto">
            <el-table-column prop="id" label="序号" width="120" />
            <el-table-column prop="name" label="名称" width="120" />
            <el-table-column prop="description" label="描述" width="120" />
            <el-table-column prop="direction" label="方向" width="120">
                <template #default="scope">
                    <span v-if="scope.row.direction === 'Input'">入口</span>
                    <span v-if="scope.row.direction === 'Output'">出口</span>
                </template>
            </el-table-column>
            <el-table-column label="规则">
                <template #default="scope">
                    {{ scope.row.ruleList.join(", ") }}
                </template>
            </el-table-column>
            <el-table-column label="是否启用" width="120">
                <template #default="scope">
                    <el-switch v-model="scope.row.enable" disabled class="switch" />
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="300">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click="openEditDialog(scope.row)">编辑</el-button>
                    <el-button link type="primary" size="small" @click="del(scope.row)">删除</el-button>
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
                <el-form-item label="方向">
                    <el-select v-model="dialog.form.direction" placeholder="请选择">
                        <el-option v-for="item in directionOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="规则">
                    <tag-x v-model="dialog.form.ruleList" placeholder="192.168.1.1/24"></tag-x>
                </el-form-item>
                <el-form-item label="分组列表">
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
import TagX from '../components/TagX.vue';
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
            directionOptions: [
                {
                    "label": "入口",
                    "value": "Input"
                },
                {
                    "label": "出口",
                    "value": "Output"
                }
            ],
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
                    direction: "",
                    ruleList: [],
                    groupIdList: [],
                    enable: true
                }
            }
        },
        async openEditDialog(row) {
            let { status, data } = await http.get(`/api/route-rule/detail/${row.id}`)
            let { status: groupStatus, data: groupData } = await http.get(`/api/group/list`)
            this.dialog = {
                visible: true,
                type: "edit",
                groupList: groupData,
                form: data
            }
        },
        async list() {
            let { status, data } = await http.get(`/api/route-rule/list`)
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
            let { status, data } = await http.post(`/api/route-rule/add`, this.dialog.form)
            this.dialog.visible = false
            this.list()
        },
        async edit() {
            let { status, data } = await http.post(`/api/route-rule/edit`, this.dialog.form)
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
                let { status, data } = await http.post(`/api/route-rule/del`, {
                    id: row.id
                })
                this.dialog.visible = false
                await this.list()
            })
        }
    }
}
</script>