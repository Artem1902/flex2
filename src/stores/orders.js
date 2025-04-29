import { defineStore } from 'pinia'
import getStoreTemplate from './helpers/storeTemplate'
import { useGeneralStore } from './general'
import { useProductsStore } from './products'
import { useInventoryStore } from './inventory'
import { deleteField } from 'firebase/firestore'

export const useOrdersStore = defineStore('orders', () => {
    const generalStore = useGeneralStore()
    const { generalApiOperation } = generalStore

    const store = getStoreTemplate('orders', generalApiOperation)

    async function handleStatusChange(order) {
        if (order.allStatus !== 'completed') return

        const productsStore = useProductsStore()
        const inventoryStore = useInventoryStore()

        await productsStore.loadItemsList()
        await inventoryStore.loadItemsList()

        for (const product of order.order) {
            const fullProduct = productsStore.getItemsList.find(p => p.id === product.id)
            if (!fullProduct?.materials) continue

            for (const mat of fullProduct.materials) {
                const material = inventoryStore.getItemsList.find(m => m.name === mat.name)
                if (!material) continue

                const totalToSubtract = mat.quantity * product.quantity
                const updatedQty = material.quantity - totalToSubtract

                await inventoryStore.updateItem(material.id, {
                    ...material,
                    quantity: updatedQty
                })
            }
        }
    }

    async function recheckMissingMaterialsForAllOrders() {
        const productsStore = useProductsStore()
        const inventoryStore = useInventoryStore()

        await productsStore.loadItemsList()
        await inventoryStore.loadItemsList()
        await store.loadItemsList()

        const ordersToUpdate = []

        for (const order of store.getItemsList.value) {
            if (!['new', 'assigned'].includes(order.allStatus)) {
                continue
            }

            const missingMaterials = []

            for (const product of order.order) {
                const fullProduct = productsStore.getItemsList.find(p => p.id === product.id)
                if (!fullProduct?.materials) continue

                for (const mat of fullProduct.materials) {
                    const requiredQty = mat.quantity * product.quantity
                    const stockItem = inventoryStore.getItemsList.find(m => m.name === mat.name)
                    const availableQty = stockItem?.quantity ?? 0

                    if (availableQty < requiredQty) {
                        const missingQty = requiredQty - availableQty

                        const existing = missingMaterials.find(
                            m => m.name === mat.name && m.productId === product.id
                        )

                        if (existing) {
                            existing.missing += missingQty
                        } else {
                            missingMaterials.push({
                                name: mat.name,
                                missing: missingQty,
                                productId: product.id
                            })
                        }
                    }
                }
            }

            const updatedOrder = {
                ...order,
                missingMaterials: missingMaterials.length > 0 ? missingMaterials : deleteField()
            }

            ordersToUpdate.push(updatedOrder)
        }

        for (const updated of ordersToUpdate) {
            await store.updateItem(updated.id, updated)
        }

        await store.loadItemsList()
    }

    return {
        ...store,
        handleStatusChange,
        recheckMissingMaterialsForAllOrders
    }
})
