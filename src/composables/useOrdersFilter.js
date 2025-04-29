import {ref, computed} from "vue"
import {useOrdersStore} from "../stores/orders.js"
import AssignedOrder
    from "../components/orders/AssignedOrder.vue"
import UnassignedOrder
    from "../components/orders/UnassignedOrder.vue"
import CompletedOrder
    from "../components/orders/CompletedOrder.vue"
import AllOrder from "../components/orders/AllOrder.vue"

export function useOrdersFilter() {
    const ordersStore = useOrdersStore()
    const filter = ref("all")
    const filterTitle = ref("")
    const filterCostumer = ref("")
    const selectedCostumer = ref(null)
    const sortDirection = ref("asc")

    const ordersList = computed(() => ordersStore.getItemsList ?? [])

    const customersList = computed(() => {
        let filteredOrders = ordersList.value

        switch (filter.value) {
            case "assigned":
                filteredOrders = filteredOrders.filter(order => order.allStatus === "assigned")
                break
            case "completed":
                filteredOrders = filteredOrders.filter(order => order.allStatus === "completed")
                break
            case "unassigned":
                filteredOrders = filteredOrders.filter(order => order.allStatus === "new")
                break
            default:
                break
        }

        const customers = new Set()
        filteredOrders.forEach(order => {
            customers.add(order.costumer)
        })
        return [...customers]
    })

    const filteredOrders = computed(() => {
        let filtered = ordersList.value

        switch (filter.value) {
            case "assigned":
                filtered = filtered.filter(order => order.allStatus === "assigned")
                break
            case "completed":
                filtered = filtered.filter(order => order.allStatus === "completed")
                break
            case "unassigned":
                filtered = filtered.filter(order => order.allStatus === "new")
                break
        }

        if (filterTitle.value) {
            filtered = filtered.filter(order =>
                order.order.some(item =>
                    item.title.toLowerCase().includes(filterTitle.value.toLowerCase())
                )
            )
        }

        if (filterCostumer.value) {
            filtered = filtered.filter(order =>
                order.costumer.toLowerCase().includes(filterCostumer.value.toLowerCase())
            )
        }

        if (selectedCostumer.value) {
            filtered = filtered.filter(order => order.costumer === selectedCostumer.value)
        }

        filtered = [...filtered].sort((a, b) => {
            const dateA = a.deliveryDate ? new Date(a.deliveryDate) : null
            const dateB = b.deliveryDate ? new Date(b.deliveryDate) : null

            if (dateA === null && dateB === null) return 0
            if (dateA === null) return sortDirection.value === "asc" ? 1 : -1
            if (dateB === null) return sortDirection.value === "asc" ? -1 : 1

            return sortDirection.value === "asc" ? dateA - dateB : dateB - dateA
        })

        return filtered
    })

    const filterText = computed(() => {
        switch (filter.value) {
            case "assigned":
                return "Assigned Orders"
            case "completed":
                return "Completed Orders"
            case "unassigned":
                return "Unassigned Orders"
            default:
                return "All Orders"
        }
    })

    const currentComponent = computed(() => {
        switch (filter.value) {
            case "assigned":
                return AssignedOrder
            case "completed":
                return CompletedOrder
            case "unassigned":
                return UnassignedOrder
            default:
                return AllOrder
        }
    })

    return {
        filter,
        filterTitle,
        filterCostumer,
        filteredOrders,
        filterText,
        selectedCostumer,
        customersList,
        currentComponent,
        sortDirection,
    }
}
