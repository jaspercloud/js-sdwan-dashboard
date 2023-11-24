<style scoped></style>

<template>
    <div style="padding: 10px;" class="flex flex-item">
        <EditNodeDialog v-model:visible="editNodeDialogVisible" :data="editNodeDialogData" @commit="onCommit">
        </EditNodeDialog>
        <el-card ref="nodeCard" shadow="always" class="flex-item">
            <div class="flex direction-column">
                <div class="flex direction-row-reverse">
                    <el-button type="primary" @click="loadList">刷新</el-button>
                </div>
                <el-table :data="tableData" border style="margin-top: 20px;" :height="tableHeight">
                    <el-table-column prop="id" label="id" width="80" />
                    <el-table-column prop="vip" label="虚拟IP" />
                    <el-table-column prop="nodeType" label="节点类型" />
                    <el-table-column prop="macAddress" label="网卡地址" />
                    <el-table-column prop="localAddress" label="内网地址" />
                    <el-table-column label="公网映射地址">
                        <template #default="scope">
                            <el-tooltip effect="dark" :content="scope.row.mappingType" placement="top">
                                <div>{{ scope.row.mappingAddress }}</div>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="中继地址">
                        <template #default="scope">
                            <!-- <div>{{ scope.row.token }}</div> -->
                            <el-tooltip effect="dark" :content="scope.row.token" placement="top">
                                <div>{{ scope.row.relayAddress }}</div>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" />
                    <el-table-column prop="online" label="在线">
                        <template #default="scope">
                            <span v-if="scope.row.online == true">在线</span>
                            <span v-else>离线</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button link type="primary" size="small" @click="editItemDialog(scope)">编辑</el-button>
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
import EditNodeDialog from '../components/EditNodeDialog.vue'
export default {
    components: {
        EditNodeDialog
    },
    data() {
        return {
            tableHeight: 0,
            tableData: [],
            editNodeDialogVisible: false,
            editNodeDialogData: {}
        }
    },
    async mounted() {
        let that = this
        let nodeCard = this.$refs.nodeCard
        nodeCard.$nextTick(() => {
            let height = nodeCard.$el.offsetHeight - 2 * 20 - 32 - 20
            that.tableHeight = height
        })
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
            data.data.forEach(item => {
                if (null == item.addressList) {
                    return
                }
                item.addressList.forEach(address => {
                    let url = new URL(address)
                    if ("host:" === url.protocol) {
                        item.localAddress = url.pathname.replaceAll("//", "")
                    } else if ("srflx:" === url.protocol) {
                        item.mappingAddress = url.pathname.replaceAll("//", "")
                        item.mappingType = url.searchParams.get("mappingType")
                    } else if ("relay:" === url.protocol) {
                        item.relayAddress = url.pathname.replaceAll("//", "")
                        item.token = url.searchParams.get("token")
                    }
                })
            });
            this.tableData = data.data
        },
        async onCommit(form, done) {
            let { status, data } = await axios.put("/api/node", form)
            if (200 != status) {
                ElMessage({
                    message: 'http error',
                    type: 'danger'
                })
                return
            }
            done()
            await this.loadList()
        },
        editItemDialog(item) {
            this.editNodeDialogData = JSON.parse(JSON.stringify(item.row))
            this.editNodeDialogVisible = true
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
            let { status, data } = await axios.delete(`/api/node/${item.row.id}`)
            if (200 != status) {
                ElMessage({
                    message: 'http error',
                    type: 'danger'
                })
                return
            }
            if (2003 == data.code) {
                ElMessage({
                    message: 'mesh节点被路由使用',
                    type: 'danger'
                })
                return
            }
            await this.loadList()
        }
    }
}
</script>