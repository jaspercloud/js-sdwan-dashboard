<style></style>

<template>
    <el-dialog v-model="dialogVisible" title="编辑" width="30%" :before-close="handleClose" @open="onOpen">
        <el-form :model="form" label-width="120px">
            <el-form-item label="目标网段">
                <el-input v-model="form.destination" />
                <span>例: 192.168.1.0/24</span>
            </el-form-item>
            <el-form-item label="下一跳">
                <el-select v-model="form.meshId" placeholder="请选择" class="flex-item">
                    <el-option v-for="item in meshList" :key="item.id" :label="item.vip" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="form.remark" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="save">
                    提交
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
import axios from 'axios';
export default {
    props: {
        visible: Boolean,
        data: Object
    },
    data() {
        return {
            dialogVisible: false,
            form: {},
            meshList: []
        }
    },
    watch: {
        visible(val) {
            this.dialogVisible = val
        },
        data(val) {
            this.form = val
        }
    },
    mounted() {
    },
    methods: {
        async onOpen() {
            const that = this
            let { status, data } = await axios.get("/api/node/meshList")
            this.meshList = []
            data.data.forEach(e => {
                that.meshList.push(e)
            });
        },
        handleClose(done) {
            this.$emit("update:visible", false)
            this.form = {}
            done()
        },
        save() {
            this.$emit("commit", this.form)
            this.$emit("update:visible", false)
            this.form = {}
        }
    }
}
</script>
