import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path:'/',
        component:()=>import('../views/main.vue')
    },
    {
        path:'/login',
        component:()=>import('../views/login/index.vue')
    }
]

const router = createRouter({
    //路由匹配模式
    history:createWebHashHistory(),
    //路由数据
    routes
})

export default router