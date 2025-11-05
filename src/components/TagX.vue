<template>
    <div>
        <el-input v-if="editable" ref="inputRef" v-model="value" class="edit-tag" @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm" />
        <el-tag v-if="!editable" class="tag" closable :disable-transitions="true" @close="handleClose(tag)"
            @dblclick="edit">
            {{ value }}
        </el-tag>
    </div>
</template>
<style>
.edit-tag {
    width: 200px;
    height: 30px;
    font-size: 13px;
}

.tag {
    font-size: 13px;
    height: 30px;
    cursor: default;
    user-select: none;
}
</style>
<script>
import { nextTick } from 'vue';
export default {
    props: ["modelValue"],
    data() {
        return {
            editable: false,
            value: ""
        }
    },
    mounted() {
        if (null != this.modelValue) {
            this.value = this.modelValue
        }
    },
    methods: {
        edit() {
            this.editable = true
            nextTick(() => {
                this.$refs.inputRef.focus()
            })
        },
        handleInputConfirm() {
            this.editable = false
            this.$emit("update:modelValue", this.value)
        },
        handleClose() {
            this.$emit("close")
        },
    }
}
</script>