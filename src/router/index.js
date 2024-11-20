import { createRouter, createWebHashHistory } from 'vue-router'
import IndexView from '../views/IndexView.vue'
import AccountView from '../views/AccountView.vue'
import RootSpaceView from '../views/RootSpaceView.vue'
import TenantView from '../views/TenantView.vue'
import AppVersionView from '../views/AppVersionView.vue'
import TenantSpaceView from '../views/TenantSpaceView.vue'
import NodeView from '../views/NodeView.vue'
import RouteView from '../views/RouteView.vue'
import RouteRuleView from '../views/RouteRuleView.vue'
import VnatView from '../views/VnatView.vue'
import GroupView from '../views/GroupView.vue'
import TestView from '../views/TestView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView,
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
    },
    {
      path: '/rootSpace',
      name: 'rootSpace',
      component: RootSpaceView,
      redirect: "/rootSpace/tenant",
      children: [
        {
          path: '/rootSpace/tenant',
          name: 'tenant',
          component: TenantView,
        },
        {
          path: '/rootSpace/appVersion',
          name: 'appVersion',
          component: AppVersionView,
        }
      ]
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
