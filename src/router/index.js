import {createWebHistory, createRouter} from 'vue-router'
import HomeView from "../views/HomeView.vue"
import LoginView from "../views/LoginView.vue"
import {
    isAuthenticated,
    isRouteAvailable
} from "./helpers.js";

export const routes = [
    {
        path: '/',
        name: 'home',
        meta: {
            requireAuth: false,
            useInMenu: true
        },
        component: HomeView
    },
    {
        path: '/customers',
        children: [
            {
                path: '',
                name: 'customers',
                meta: {
                    requireAuth: true,
                    allowedRoles: ['sales', 'admin'],
                    useInMenu: true
                },
                component: () => import('../views/CustomersView/CustomersView.vue'),
            },
            {
                path: '/edit/:id?',
                name: 'customerEdit',
                meta: {
                    requireAuth: true,
                    allowedRoles: ['sales', 'admin'],
                    useInMenu: false
                },
                component: () => import('../views/CustomersView/CustomersEditor.vue'),
                props: true,
            },
            {
                path: ':id(\\w+)',
                name: 'customerDetail',
                meta: {
                    requireAuth: true,
                    allowedRoles: ['sales', 'admin'],
                    useInMenu: false
                },
                component: () => import('../views/CustomersView/CustomerDetail.vue'),
                props: true,
            },
            {
                path: '/new-order/:id',
                name: 'newOrder',
                meta: {
                    requireAuth: true,
                    allowedRoles: ['sales', 'admin'],
                    useInMenu: false
                },
                component: () => import('../views/NewOrderView.vue'),
                props: true,
            },
        ]
    },
    {
        path: '/orders',
        name: 'orders',
        meta: {
            requireAuth: true,
            allowedRoles: ['sales', 'manager', 'admin'],
            useInMenu: true
        },
        component: () => import('../views/OrdersView/OrdersView.vue'),
    },
    {
        path: '/production',
        name: 'production',
        meta: {
            requireAuth: true,
            allowedRoles: ['manager', 'worker', 'admin'],
            useInMenu: true
        },
        component: () => import('../views/ProductionView/ProductionView.vue'),
    },
    {
        path: '/materials',
        name: 'materials',
        meta: {
            requireAuth: true,
            allowedRoles: ['sales', 'manager', 'admin'],
            useInMenu: true
        },
        component: () => import('../views/MaterialsView/MaterialsView.vue'),
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            requireAuth: false,
            useInMenu: false
        },
        component: LoginView
    },
    {
        path: '/:path(.*)*',
        name: 'page-not-found',
        meta: {requireAuth: false, useInMenu: false},
        component: () => import('../views/PageNotFound.vue')
    }
]

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach(async (to) => {
    if (!to.meta?.requireAuth) {
        return true
    }

    if (!isAuthenticated()) {
        return {name: 'login'}
    }

    const routeAvailable = await isRouteAvailable(to)
    if (!routeAvailable) {
        return {name: 'page-not-found'}
    }

    return true
})

export default router
