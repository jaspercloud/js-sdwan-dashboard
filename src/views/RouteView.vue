
<style scoped></style>

<template>
    <div style="padding: 10px;">
        <EditRouteDialog v-model:visible="editRouteDialogVisible" :data="editRouteDialogData" @commit="onCommit">
        </EditRouteDialog>
        <el-card shadow="always">
            <div class="flex direction-column">
                <div>
                    <el-button type="primary" @click="addItem">新增</el-button>
                </div>
                <el-table :data="tableData" border style="margin-top: 20px;">
                    <el-table-column prop="id" label="id" width="80" />
                    <el-table-column prop="destination" label="目标网段" />
                    <el-table-column prop="nexthop" label="下一跳" />
                    <el-table-column prop="remark" label="备注" />
                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button link type="danger" size="small" @click="deleteItem(scope)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script>
import EditRouteDialog from '../components/EditRouteDialog.vue'
import axios from 'axios';
export default {
    components: {
        EditRouteDialog
    },
    data() {
        return {
            tableData: [],
            editRouteDialogVisible: false,
            editRouteDialogData: {}
        }
    },
    async mounted() {
        await this.loadList()
    },
    methods: {
        async loadList() {
            let { status, data } = await axios.get("/api/route/list")
            this.tableData = data.data
        },
        async onCommit(form) {
            console.log(form)
            let { status, data } = await axios.post("/api/route/save", form)
            await this.loadList()
        },
        addItem() {
            this.editRouteDialogData = {}
            this.editRouteDialogVisible = true
        },
        async deleteItem(item) {
            let { status, data } = await axios.delete(`/api/route/${item.row.id}`)
            if (200 != status) {
                ElMessage({
                    message: 'http error',
                    type: 'danger'
                })
                return
            }
            await this.loadList()
        }
    }
}
</script>