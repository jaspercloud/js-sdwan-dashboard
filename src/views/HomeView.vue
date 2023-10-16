<style>
.el-tabs__header {
  display: none;
}
</style>

<template>
  <el-container class="page">
    <el-header style="background-color: #545c64;">
      <div class="flex justify-center">
        <el-menu :default-active="menuCode" @select="handleSelect" mode="horizontal" background-color="#545c64"
          text-color="#fff" active-text-color="#409EFF" :ellipsis="false">
          <el-menu-item index="node" style="width: 120px;">节点</el-menu-item>
          <el-menu-item index="route" style="width: 120px;">路由</el-menu-item>
        </el-menu>
      </div>
    </el-header>
    <el-main>
      <el-tabs v-model="tabCdoe" style="width: 100%; height: 100%;">
        <el-tab-pane label="node" name="node">
          <NodeView></NodeView>
        </el-tab-pane>
        <el-tab-pane label="route" name="route">
          <RouteView></RouteView>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import NodeView from './NodeView.vue'
import RouteView from './RouteView.vue'

export default {
  components: {
    NodeView, RouteView
  },
  data() {
    return {
      menuCode: "node",
      tabCdoe: "node"
    }
  },
  methods: {
    handleSelect(key) {
      this.tabCdoe = key
    }
  }
}
</script>
