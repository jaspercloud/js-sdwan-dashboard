
<style scoped></style>

<template>
    <div style="padding: 10px;" class="flex flex-item">
        <EditRouteDialog v-model:visible="editRouteDialogVisible" :data="editRouteDialogData" @commit="onCommit">
        </EditRouteDialog>
        <el-card ref="routeCard" shadow="always" class="flex-item">
            <div class="flex direction-column">
                <div class="flex direction-row">
                    <div class="flex flex-item">
                        <el-button type="primary" @click="addItem">新增</el-button>
                    </div>
                    <div class="flex flex-item direction-row-reverse">
                        <el-button type="primary" @click="loadList">刷新</el-button>
                    </div>
                </div>
                <el-table :data="tableData" border style="margin-top: 20px;" :height="tableHeight">
                    <el-table-column prop="id" label="id" width="80" />
                    <el-table-column prop="destination" label="目标网段" />
                    <el-table-column prop="nexthop" label="下一跳" />
                    <el-table-column prop="remark" label="备注" />
                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button link type="danger" size="small" @click="deleteItemDialog(scope)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios';
import EditRouteDialog from '../components/EditRouteDialog.vue'
export default {
    components: {
        EditRouteDialog
    },
    data() {
        return {
            tableHeight: 0,
            tableData: [],
            editRouteDialogVisible: false,
            editRouteDialogData: {}
        }
    },
    async mounted() {
        let that = this
        let card = this.$refs.routeCard
        card.$nextTick(() => {
            let height = card.$el.offsetHeight - 2 * 20 - 32 - 20
            that.tableHeight = height
        })
        await this.loadList()
    },
    methods: {
        async loadList() {
            let { status, data } = await axios.get("/api/route/list")
            this.tableData = data.data
        },
        async onCommit(form, done) {
            let { status, data } = await axios.post("/api/route/save", form)
            if (200 != status) {
                ElMessage({
                    message: 'http error',
                    type: 'danger'
                })
                return
            }
            if (2002 == data.code) {
                ElMessage({
                    message: 'CIDR格式错误',
                    type: 'danger'
                })
                return
            }
            done()
            await this.loadList()
        },
        addItem() {
            this.editRouteDialogData = {}
            this.editRouteDialogVisible = true
        },
        deleteItemDialog(item) {
            ElMessageBox.confirm(
                '是否确认删除?',
                '提示',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).then(() => {
                this.deleteItem(item)
            })
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