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
                    <el-table-column prop="vip" label="虚拟IP" />
                    <el-table-column prop="nodeType" label="节点类型" />
                    <el-table-column prop="macAddress" label="网卡地址" />
                    <el-table-column prop="remark" label="备注" />
                    <el-table-column prop="online" label="在线">
                        <template #default="scope">
                            <span v-if="scope.row.online == true">在线</span>
                            <span v-else>离线</span>
                        </template>
                    </el-table-column>
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