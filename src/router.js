import Vue from 'vue'
import Router from 'vue-router'
import layout from './views/layout/Layout.vue'

Vue.use(Router)

export default new Router({
  scrollBehavior: () => ({ y: 0 }), // 切换路由滚动位置
  routes: [
    { path: '/login',
      component: () => import('@/views/login/index')
    },
    { path: '/404',
      component: () => import('@/views/404')
    },
    {
      path: '/',
      name: 'layout',
      component: layout,
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('@/views/home/index')
        },
        {
          path: 'theme/:id',
          name: 'theme',
          component: () => import('@/views/theme/index')
        },
        {
          path: 'company/t_table/:id',
          name: 't_table',
          component: () => import('@/views/company/t_table')
        }, {
          path: 'company/companyInfo/:type/:query',
          name: 'companyInfo',
          component: () => import('@/views/company/companyInfo')
        }
      ]
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
