import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useHead } from '@vueuse/head'

export enum RouteName {
    Home = 'home',
    Rooms = 'rooms',
    Guests = 'guests',
    Bookings = 'bookings',
    Services = 'services',
    Calculation = 'calculation',
    DataView = 'data-view',
    PageNotFound = 'page-not-found',
}

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: RouteName.Home,
        meta: { title: 'Готель — Головна' },
        component: () => import('@/views/home/home.view.vue'),
    },
    {
        path: '/rooms',
        name: RouteName.Rooms,
        meta: { title: 'Управління номерами' },
        component: () => import('@/views/rooms/rooms.view.vue'),
    },
    {
        path: '/guests',
        name: RouteName.Guests,
        meta: { title: 'Реєстрація відвідувачів' },
        component: () => import('@/views/guests/guests.view.vue'),
    },
    {
        path: '/bookings',
        name: RouteName.Bookings,
        meta: { title: 'Бронювання номерів' },
        component: () => import('@/views/bookings/bookings.view.vue'),
    },
    {
        path: '/services',
        name: RouteName.Services,
        meta: { title: 'Додаткові послуги' },
        component: () => import('@/views/services/services.view.vue'),
    },
    {
        path: '/calculation',
        name: RouteName.Calculation,
        meta: { title: 'Розрахунок вартості' },
        component: () => import('@/views/calculation/calculation.view.vue'),
    },
    {
        path: '/data-view',
        name: RouteName.DataView,
        meta: { title: 'Перегляд даних' },
        component: () => import('@/views/data-view/data-view.view.vue'),
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
