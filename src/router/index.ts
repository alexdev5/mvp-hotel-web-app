import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useHead } from '@vueuse/head'

export enum RouteName {
    Home = 'home',
    Work_1 = 'work-1',
    Work_2 = 'work-2',
    Work_3 = 'work-3',
    Work_4 = 'work-4',
    Work_5 = 'work-5',
    PageNotFound = 'page-not-found',
}

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: RouteName.Home,
        meta: { title: 'Home' },
        component: () => import('@/views/home/home.view.vue'),
    },
    {
        path: '/work-3',
        name: RouteName.Work_3,
        meta: { title: 'Практикум 3' },
        component: () => import('@/views/work-3/work-3.view.vue'),
    },
]

const serviceRoutes: Array<RouteRecordRaw> = [
    {
        path: '/:pathMatch(.*)*',
        name: RouteName.PageNotFound,
        meta: { title: '404 not found' },
        component: () => import('@/views/system/not-found.view.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [...routes, ...serviceRoutes],
})

router.beforeEach((to, from, next) => {
    const title = to.meta.title || 'Default Title'
    useHead({
        title,
    })
    next()
})

export default router
