<template>
    <div class="flex">
        <tag-group :value="tagList"></tag-group>
        <el-button @click="test">test</el-button>
    </div>
</template>
<style></style>
<script>
import TagGroup from '../components/TagGroup.vue';

export default {
    components: {
        "tag-group": TagGroup
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