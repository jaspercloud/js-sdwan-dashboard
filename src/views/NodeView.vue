<style scoped></style>

<template>
    <div style="padding: 10px;">
        <el-card shadow="always">
            <div class="flex direction-column">
                <div class="flex direction-row-reverse">
                    <el-button type="primary" @click="loadList">刷新</el-button>
                </div>
                <el-table :data="tableData" border style="margin-top: 20px;">
                    <el-table-column prop="id" label="id" width="80" />
                    <el-table-column prop="vip" label="vip" />
                    <el-table-column prop="macAddress" label="macAddress" />
                    <el-table-column prop="remark" label="remark" />
                    <el-table-column prop="online" label="online" />
                    <el-table-column label="op">
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
import axios from 'axios';
import { ElMessage } from 'element-plus'
export default {
    data() {
        return {
            tableData: []
        }
    },
    async mounted() {
        await this.loadList()
    },
    methods: {
        async loadList() {
            let { status, data } = await axios.get("/api/node/list")
            if (200 != status) {
                ElMessage({
                    message: 'http error',
                    type: 'danger'
                })
                return
            }
            this.tableData = data.data
        },
        async deleteItem(item) {
            let { status, data } = await axios.delete(`/api/node/${item.row.id}`)
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