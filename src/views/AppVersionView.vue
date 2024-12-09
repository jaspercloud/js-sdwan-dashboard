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
            <el-table-column prop="zipPath" label="文件名" show-overflow-tooltip />
            <el-table-column prop="zipMd5" label="校验码" show-overflow-tooltip />
            <el-table-column prop="jarPath" label="jar文件名" show-overflow-tooltip />
            <el-table-column prop="jarMd5" label="jar校验码" show-overflow-tooltip />
            <el-table-column prop="platform" label="平台">
                <template #default="scope">
                    <span v-if="scope.row.platform === 'windows'">Windows</span>
                    <span v-if="scope.row.platform === 'macos'">MacOS</span>
                </template>
            </el-table-column>
            <el-table-column label="创建时间">
                <template #default="scope">
                    {{ formatDate(scope.row.createTime) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="150">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click="download(scope.row)">下载</el-button>
                    <el-button link type="danger" size="small" @click="del(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog v-model="dialog.visible" :title="showTitle" width="500" :before-close="dialogHandleClose"
            :close-on-click-modal="false">
            <el-form :model="dialog.form" label-position="right" label-width="auto">
                <el-form-item label="上传文件">
                    <el-upload ref="uploadRef" action="/api/file/upload" :auto-upload="false" :limit="1"
                        style="width: 100%;" :on-exceed="handleExceed" :on-success="handleUploadSuccess">
                        <template #trigger>
                            <el-button type="primary">请选择文件</el-button>
                        </template>
                    </el-upload>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="dialog.form.name" />
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="dialog.form.description" />
                </el-form-item>
                <el-form-item label="操作系统">
                    <el-radio-group v-model="dialog.form.platform">
                        <el-radio label="Windows" value="windows" />
                        <el-radio label="MacOS" value="macos" />
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="footer flex direction-column">
                    <el-button type="primary" @click="submitUpload">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<style>
.header {
    width: 100%;
}
</style>
<script>
import { ElMessageBox, genFileId } from 'element-plus';
import http from '../api';
import TagX from '../components/TagX.vue';
import dayjs from 'dayjs'
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
            let upload = this.$refs.uploadRef
            upload.clearFiles()
            done()
        },
        openAddDialog() {
            this.dialog = {
                visible: true,
                type: "add",
                form: {
                    name: "",
                    description: "",
                    path: "",
                    platform: []
                }
            }
        },
        async list() {
            let { status, data } = await http.get(`/api/appVersion/list`)
            this.tableData = data
        },
        async save() {
            let { status, data } = await http.post(`/api/appVersion/add`, this.dialog.form)
            let upload = this.$refs.uploadRef
            upload.clearFiles()
            this.dialog.visible = false
            this.list()
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
                let { status, data } = await http.post(`/api/appVersion/del`, {
                    id: row.id
                })
                this.dialog.visible = false
                await this.list()
            })
        },
        download(row) {
            let url = "/api/storage/" + row.path
            window.open(url, '_blank');
        },
        handleExceed(files) {
            let upload = this.$refs.uploadRef
            upload.clearFiles()
            let file = files[0]
            file.uid = genFileId()
            upload.handleStart(file)
        },
        submitUpload() {
            let upload = this.$refs.uploadRef
            upload.submit()
        },
        handleUploadSuccess(uploadFile) {
            this.dialog.form.path = uploadFile
            this.save()
        },
        formatDate(date) {
            return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
        }
    }
}
</script>