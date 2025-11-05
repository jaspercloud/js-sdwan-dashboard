<template>
    <div class="flex direction-column">
        <div>
            <tag-x v-for="(tag, index) in tags" :key="tag" :model-value="tag"
                @update:model-value="(val) => updateTag(index, val)" @close="handleClose(tag)" />
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
    width: 200px;
    height: 30px;
    font-size: 13px;
}
</style>
<script>
import { nextTick } from 'vue';
import TagX from './TagX.vue';
export default {
    components: {
        "tag-x": TagX
    },
    props: ["modelValue", "placeholder"],
    data() {
        return {
            tags: [],
            inputVisible: false,
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
        updateTag(index, val) {
            this.tags[index] = val
        },
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
                this.$refs.inputRef.focus()
            })
        }
    }
}
</script>