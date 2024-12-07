<template>
    <el-dialog v-model="updatePwdDialog.visible" title="修改密码" width="500" :close-on-click-modal="false"
        :before-close="onClosed">
        <el-form :model="updatePwdDialog.form" label-position="right" label-width="auto">
            <el-form-item label="当前密码">
                <el-input v-model="updatePwdDialog.form.password" type="password" :show-password="true"
                    autocomplete="new-password" />
            </el-form-item>
            <el-form-item label="新密码">
                <el-input v-model="updatePwdDialog.form.newPassword" type="password" :show-password="true"
                    autocomplete="new-password" />
            </el-form-item>
            <el-form-item label="确认密码">
                <el-input v-model="updatePwdDialog.form.conformPassword" type="password" :show-password="true"
                    autocomplete="new-password" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="updatePassword">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<style></style>
<script>
import { ElMessage } from 'element-plus';
import http from '../api';
export default {
    props: ["modelValue"],
    data() {
        return {
            updatePwdDialog: {
                visible: false,
                form: {
                    password: "",
                    conformPassword: "",
                    newPassword: ""
                }
            }
        };
    },
    watch: {
        modelValue(newValue, oldValue) {
            this.updatePwdDialog.form = {
                password: "",
                conformPassword: "",
                newPassword: ""
            }
        }
    },
    mounted() {
        if (null != this.modelValue) {
            this.updatePwdDialog.visible = this.modelValue
        }
    },
    updated() {
        if (null != this.modelValue) {
            this.updatePwdDialog.visible = this.modelValue
        }
    },
    methods: {
        onClosed(done) {
            this.$emit("update:modelValue", false)
            done()
        },
        async updatePassword() {
            let v1 = this.updatePwdDialog.form.newPassword
            let v2 = this.updatePwdDialog.form.conformPassword
            if (v1 != v2) {
                ElMessage.error("两次密码不一致")
                return
            }
            let { status, data } = await http.post(`/api/account/updatePassword`, this.updatePwdDialog.form)
            if (200 != status) {
                ElMessage.error(data)
                return
            }
            ElMessage.success("修改密码成功")
            this.$emit("update:modelValue", false)
        }
    }
};
</script>