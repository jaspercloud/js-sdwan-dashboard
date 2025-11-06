<template>
    <div class="flex direction-column">
        <div class="flex">
            <el-button type="primary" @click="openAddDialog">新增</el-button>
            <el-button type="primary" @click="list">刷新</el-button>
        </div>
        <el-row :gutter="20" style="margin-top: 20px;">
            <el-col :span="4">
                <el-form-item label="分组">
                    <el-select multiple collapse-tags v-model="search.groupIdList" placeholder="请选择" @change="list">
                        <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id">
                            {{ item.name }}
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="只显示启用的">
                    <el-switch class="switch" v-model="search.enable" @change="list" />
                </el-form-item>
            </el-col>
        </el-row>
        <div>
            <el-text type="info">提示: 数值越小，优先级越高</el-text>
        </div>
        <el-table :data="tableData" stripe style="height: 100%;margin-top: 20px;" max-height="auto">
            <el-table-column prop="id" label="序号" width="80" />
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
                <el-form-item label="策略">
                    <el-select v-model="dialog.form.strategy" placeholder="请选择">
                        <el-option v-for="item in strategyOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="方向">
                    <el-select v-model="dialog.form.direction" placeholder="请选择">
                        <el-option v-for="item in directionOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="规则">
                    <tag-group v-model="dialog.form.ruleList" placeholder="192.168.1.1/24"></tag-group>
                </el-form-item>
                <el-form-item label="应用到分组">
                    <el-select multiple v-model="dialog.form.groupIdList" placeholder="请选择">
                        <el-option v-for="item in dialog.groupList" :key="item.id" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="优先级">
                    <div class="flex direction-column flex-item">
                        <el-input v-model="dialog.form.level" type="number" />
                        <div>
                            <el-text type="info">提示: 数值越小，优先级越高</el-text>
                        </div>
                    </div>
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
import TagGroup from '../components/TagGroup.vue';
export default {
    components: {
        "tag-group": TagGroup
    },
    data() {
        return {
            groupList: [],
            search: {
                groupIdList: [],
                enable: false,
            },
            dialog: {
                visible: false,
                type: "",
                title: "",
                form: {}
            },
            strategyOptions: [
                {
                    "label": "允许",
                    "value": "Allow"
                },
                {
                    "label": "拒绝",
                    "value": "Reject"
                }
            ],
            directionOptions: [
                {
                    "label": "全部",
                    "value": "All"
                },
                {
                    "label": "入口 | 拦截源地址",
                    "value": "Input"
                },
                {
                    "label": "出口 | 拦截目标地址",
                    "value": "Output"
                }
            ],
            tableData: [
            ]
        }
    },
    async mounted() {
        let { status, data } = await http.get(`/api/group/list`)
        this.groupList = data
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
            let { status, data } = await http.post(`/api/route-rule/list`, this.search)
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