import { createRouter, createWebHistory } from 'vue-router'
import TenantIndex from '../views/TenantIndex.vue'
import NodeView from '../views/NodeView.vue'
import RouteView from '../views/RouteView.vue'
import RouteRuleView from '../views/RouteRuleView.vue'
import VnatView from '../views/VnatView.vue'
import GroupView from '../views/GroupView.vue'
import TestView from '../views/TestView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/tenantIndex',
      name: 'tenantIndex',
      component: TenantIndex,
      redirect: "tenantIndex/node",
      children: [
        {
          path: '/tenantIndex/node',
          name: 'node',
          component: NodeView
        },
        {
          path: '/tenantIndex/route',
          name: 'route',
          component: RouteView
        },
        {
          path: '/tenantIndex/rule',
          name: 'rule',
          component: RouteRuleView
        },
        {
          path: '/tenantIndex/vnat',
          name: 'vnat',
          component: VnatView
        },
        {
          path: '/tenantIndex/group',
          name: 'group',
          component: GroupView
        }
      ]
    },
    {
      path: '/test',
      name: 'test',
      component: TestView
    }
  ]
})

export default router
