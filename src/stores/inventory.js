import { defineStore } from 'pinia'
import getStoreTemplate from './helpers/storeTemplate'
import { useGeneralStore } from './general'
import { useOrdersStore } from './orders'
import { useProductsStore } from './products'

export const useInventoryStore = defineStore('inventory', () => {
    const generalStore = useGeneralStore()
    const { generalApiOperation } = generalStore

    const store = getStoreTemplate('inventory', generalApiOperation)

    async function calculateReservedMaterials() {
        const ordersStore = useOrdersStore()
        const productsStore = useProductsStore()

        await Promise.all([
            ordersStore.loadItemsList(),
            productsStore.loadItemsList(),
            store.loadItemsList()
        ])

        const reservedMap = {}

        const relevantOrders = ordersStore.getItemsList.filter(o =>
            ['new', 'assigned', 'in_progress'].includes(o.allStatus)
        )

        for (const order of relevantOrders) {
            for (const product of order.order) {
                const fullProduct = productsStore.getItemsList.find(p => p.id === product.id)
                if (!fullProduct?.materials) continue

                for (const mat of fullProduct.materials) {
                    const totalNeeded = mat.quantity * product.quantity
                    reservedMap[mat.name] = (reservedMap[mat.name] ?? 0) + totalNeeded
                }
            }
        }

        const updatedMaterials = store.itemsList.value.map(mat => {
            const reserved = reservedMap[mat.name] ?? 0
            const available = mat.quantity - reserved

            store.updateItem(mat.id, {
                reserved,
                available
            })

            return {
                ...mat,
                reserved,
                available
            }
        })

        await Promise.all(
            store.itemsList.value.map(mat => {
                const reserved = reservedMap[mat.name] ?? 0
                const available = mat.quantity - reserved
                return store.updateItem(mat.id, { reserved, available })
            })
        )

        store.itemsList.value = updatedMaterials
    }

    return {
        ...store,
        calculateReservedMaterials,
    }
})
