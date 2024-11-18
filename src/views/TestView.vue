<template>
    <div class="flex">
        <tag-x :value="tagList"></tag-x>
        <el-button @click="test">test</el-button>
    </div>
</template>
<style></style>
<script>
import TagX from '../components/TagX.vue';

export default {
    components: {
        "tag-x": TagX
    },
    data() {
        return {
            tagList: []
        }
    },
    mounted() {
        let list = []
        for (let i = 0; i < 5; i++) {
            list.push(i)
        }
        this.tagList = list
        console.log("list: " + list)
    },
    methods: {
        test() {
            console.log(this.tagList)
        }
    }
}
</script>