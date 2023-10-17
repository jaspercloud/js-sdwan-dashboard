<style>
.el-tabs__header {
  display: none;
}

.el-tabs__content {
  height: 100%;
}
</style>

<template>
  <el-container class="page" style="background-color: #f4f4f5;">
    <el-header style="background-color: #FFFFFF;" class="flex">
      <div style="position: relative;" class="flex flex-item">
        <div style="position: absolute;width: 100%;height: 100%;" class="flex align-center">
          <img src="/banner.png" alt="" style="height: 60px;">
        </div>
        <div style="position: absolute;width: 100%;" class="flex justify-center">
          <el-menu :default-active="menuCode" @select="handleSelect" mode="horizontal" :ellipsis="false">
            <el-menu-item index="node" style="width: 120px;">节点</el-menu-item>
            <el-menu-item index="route" style="width: 120px;">路由</el-menu-item>
          </el-menu>
        </div>
      </div>
    </el-header>
    <el-main>
      <el-tabs v-model="tabCdoe" class="flex direction-column" style="height: 100%;">
        <el-tab-pane label="node" name="node" style="height: 100%;" class="flex">
          <NodeView></NodeView>
        </el-tab-pane>
        <el-tab-pane label="route" name="route" style="height: 100%;" class="flex">
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
