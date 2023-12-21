import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 配置路由表
// const routes = []

const router = new VueRouter({
  routes: [
    {
      path: '/user/profile',
      name: 'user-profile',
      component: () => import('@/views/user-profile')
    },
    { path: '/login', component: () => import('@/views/login') },
    {
      path: '/user/:userId',
      name: 'user',
      component: () => import('@/views/user')
    },
    {
      path: '/',
      // name: 'layout',
      component: () => import('@/views/layout'),
      children: [
        { path: '/', name: 'home', component: () => import('@/views/home') },
        { path: '/qa', name: 'qa', component: () => import('@/views/qa') },
        { path: '/video', name: 'video', component: () => import('@/views/video') },
        { path: '/my', name: 'my', component: () => import('@/views/my') }
      ]
    },
    { path: '/search', name: 'search', component: () => import('@/views/search') },
    {
      path: '/article/:articleId',
      name: 'article',
      component: () => import('@/views/article'),
      // 开启 props 传参，说白了就是把路由参数映射到组件的 props 中
      props: true
    }
  ]
})
export default router
