import { createRouter, createWebHistory } from 'vue-router'
import TenantView from '../views/TenantView.vue'
import TenantSpaceView from '../views/TenantSpaceView.vue'
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
      path: '/tenant',
      name: 'tenant',
      component: TenantView,
    },
    {
      path: '/tenantSpace',
      name: 'tenantSpace',
      component: TenantSpaceView,
      redirect: "/tenantSpace/node",
      children: [
        {
          path: '/tenantSpace/node',
          name: 'node',
          component: NodeView
        },
        {
          path: '/tenantSpace/route',
          name: 'route',
          component: RouteView
        },
        {
          path: '/tenantSpace/rule',
          name: 'rule',
          component: RouteRuleView
        },
        {
          path: '/tenantSpace/vnat',
          name: 'vnat',
          component: VnatView
        },
        {
          path: '/tenantSpace/group',
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
