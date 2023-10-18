<style></style>

<template>
    <el-dialog v-model="dialogVisible" title="编辑" width="30%" :before-close="handleClose" @open="onOpen">
        <el-form :model="form" label-width="120px">
            <el-form-item label="虚拟IP">
                <el-input v-model="form.vip" />
            </el-form-item>
            <el-form-item label="节点类型">
                <el-input v-model="form.nodeType" disabled />
            </el-form-item>
            <el-form-item label="网卡地址">
                <el-input v-model="form.macAddress" disabled />
            </el-form-item>
            <el-form-item label="映射">
                <el-input v-model="form.mapping" disabled />
            </el-form-item>
            <el-form-item label="过滤">
                <el-input v-model="form.filtering" disabled />
            </el-form-item>
            <el-form-item label="公网地址">
                <el-input v-model="form.mappingAddress" disabled />
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
        },
        handleClose(done) {
            this.$emit("update:visible", false)
            this.form = {}
            done()
        },
        save() {
            const that = this
            this.$emit("commit", this.form, () => {
                that.form = {}
                that.$emit("update:visible", false)
            })
        }
    }
}
</script>
