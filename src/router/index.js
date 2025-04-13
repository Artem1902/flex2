import {createWebHistory, createRouter} from 'vue-router'
import HomeView from "../views/HomeView.vue";
import CustomersView
    from "../views/CustomersView/CustomersView.vue";
import CustomersEditor
    from "../views/CustomersView/CustomersEditor.vue";
import CustomerDetail
    from "../views/CustomersView/CustomerDetail.vue";
import NewOrderView from "../views/NewOrderView.vue";
import OrdersView
    from "../views/OrdersView/OrdersView.vue";
import ProductionView
    from "../views/ProductionView/ProductionView.vue";
import MaterialsView
    from "../views/MaterialsView/MaterialsView.vue";


const routes = [
    {path: '/', name: 'home', component: HomeView},
    {
        path: '/customers',
        name: 'customers',
        component: CustomersView,
    },
    {
        path: '/customers/edit/:id?',
        name: 'customerEdit',
        component: CustomersEditor,
        props: true,
    },
    {
        path: '/customers/:id',
        name: 'customerDetail',
        component: CustomerDetail,
        props: true,
    },
    {
        path: '/new-order/:id',
        name: 'newOrder',
        component: NewOrderView,
        props: true,
    },
    {
        path: '/orders',
        name: 'orders',
        component: OrdersView,
    },
    {
        path: '/production',
        name: 'production',
        component: ProductionView,
    },
    {
        path: '/materials',
        name: 'materials',
        component: MaterialsView,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router