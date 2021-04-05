import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import detail from '../views/edu/detail'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  // 讲师标签路由
  {
    path: '/teacher',
    component: Layout,
    redirect: '/teacher/list',
    name: '讲师管理',
    meta: { title: '讲师管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: '讲师列表',
        component: () => import('@/views/edu/teacher/list'),
        meta: { title: '讲师列表', icon: 'table' }
      },
      {
        path: 'save',
        name: '讲师添加',
        component: () => import('@/views/edu/teacher/save'),
        meta: { title: '讲师添加', icon: 'tree' }
      },
      // 用户详细信息组件
      {
        hidden: true,
        path: '/detail',
        component: detail
      }
    ]
  },
  // 学生路由
  {
    path: '/student',
    component: Layout,
    redirect: '/student/list',
    name: '学生管理',
    meta: { title: '学生管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: '学生名单',
        component: () => import('@/views/edu/student/list'),
        meta: { title: '学生名单', icon: 'table' }
      },
      {
        path: 'save',
        name: '学生添加',
        component: () => import('@/views/edu/student/save'),
        meta: { title: '学生添加', icon: 'tree' }
      },
      // 用户详细信息组件
      {
        hidden: true,
        path: '/detail',
        component: detail
      }
    ]
  },

  {
    path: '/class',
    component: Layout,
    redirect: '/class/list',
    name: '课程管理',
    meta: { title: '课程管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: '课程列表',
        component: () => import('@/views/edu/class/list'),
        meta: { title: '课程列表', icon: 'table' }
      },
      {
        path: 'save',
        name: '课程添加',
        component: () => import('@/views/edu/class/save'),
        meta: { title: '课程添加', icon: 'tree' }
      },
      {
        path: '/classInfo',
        hidden: true,
        component: () => import('@/views/edu/class/classInfo')
      }
    ]
  },

  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    name: '订单管理',
    meta: {
      title: '订单管理',
      icon: 'nested'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/edu/order/list'), // Parent router-view
        name: '订单列表',
        meta: { title: '订单列表', icon: 'tree' }
      },
      {
        path: 'ensureOrder',
        hidden: true,
        component: () => import('@/views/edu/order/ensureOrder')
      },
      {
        path: 'test',
        hidden: true,
        component: () => import('@/views/edu/order/test')
      },
      {
        path: '/orderDetail',
        hidden: true,
        component: () => import('@/views/edu/order/orderDetail')
      }
    ]
  },
  {
    path: '/cart',
    component: Layout,
    redirect: '/cart/list',
    name: '购物车管理',
    meta: {
      title: '购物车管理',
      icon: 'nested'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/edu/cart/list'), // Parent router-view
        name: '购物车列表',
        meta: { title: '购物车列表', icon: 'tree' }
      }
    ]
  },
  {
    path: '/test',
    component: Layout,
    redirect: '/test/upload',
    name: '测试组件',
    meta: {
      title: '测试组件',
      icon: 'nested'
    },
    children: [
      {
        path: 'upload',
        component: () => import('@/views/edu/test/testUpload'), // Parent router-view
        name: '头像上传',
        meta: { title: '头像上传', icon: 'tree' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true },
  // 用户详细信息组件
  {
    path: '/detail',
    component: detail
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
