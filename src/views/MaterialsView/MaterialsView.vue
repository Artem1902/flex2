<script setup>
import { onMounted } from 'vue'
import { useInventoryStore } from '../../stores/inventory'
import { useProductsStore } from '../../stores/products'
import { useOrdersStore } from '../../stores/orders'
import MaterialsList from './MaterialsList.vue'

const inventoryStore = useInventoryStore()
const productsStore = useProductsStore()
const ordersStore = useOrdersStore()

onMounted(async () => {
  await inventoryStore.loadItemsList()
  await productsStore.loadItemsList()
  await ordersStore.loadItemsList()
  await ordersStore.recheckMissingMaterialsForAllOrders()
  await inventoryStore.calculateReservedMaterials()
})
</script>

<template>
  <main-layout>
    <materials-list />
  </main-layout>
</template>
