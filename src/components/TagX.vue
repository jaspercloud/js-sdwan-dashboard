<template>
    <div class="flex direction-column">
        <div>
            <el-tag v-for="tag in tags" :key="tag" closable :disable-transitions="false" @close="handleClose(tag)">
                {{ tag }}
            </el-tag>
        </div>
        <div>
            <el-input v-if="inputVisible" ref="inputRef" v-model="inputValue" class="new-tag" :placeholder="place"
                @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
            <el-button v-else @click="showInput">新增</el-button>
        </div>
    </div>
</template>
<style>
.new-tag {
    width: 160px;
}
</style>
<script>
import { nextTick } from 'vue';

export default {
    props: ["modelValue", "placeholder"],
    data() {
        return {
            tags: [],
            inputVisible: false,
            inputRef: null,
            inputValue: "",
            place: ""
        }
    },
    mounted() {
        if (null != this.modelValue) {
            this.tags = this.modelValue
        }
        if (null != this.placeholder) {
            this.place = this.placeholder
        }
    },
    updated() {
        if (null != this.modelValue) {
            this.tags = this.modelValue
        }
        if (null != this.placeholder) {
            this.place = this.placeholder
        }
    },
    methods: {
        handleClose(tag) {
            this.tags.splice(this.tags.indexOf(tag), 1)
            this.$emit("update:modelValue", this.tags)
        },
        handleInputConfirm() {
            if (this.inputValue) {
                this.tags.push(this.inputValue)
            }
            this.inputVisible = false
            this.inputValue = ''
            this.$emit("update:modelValue", this.tags)
        },
        showInput() {
            this.inputVisible = true
            nextTick(() => {
                this.inputRef = this.$refs.inputRef
                this.inputRef.focus()
            })
        }
    }
}
</script>