<script setup>
import { ref, computed } from 'vue'
import { useOrdersStore } from '../../stores/orders.js'
import { workersList } from '../../constants/workersList.js'
import ProductionItem from './ProductionItem.vue'

const ordersStore = useOrdersStore()
const chosenWorker = ref(null)
const sortDirection = ref('asc')

const sortedOrders = computed(() => {
  const orders = (ordersStore.getItemsList || []).filter(order =>
      ['assigned', 'in_progress'].includes(order.allStatus)
  )

  return orders.sort((a, b) => {
    const dateA = a.deliveryDate ? new Date(a.deliveryDate) : null
    const dateB = b.deliveryDate ? new Date(b.deliveryDate) : null

    if (!dateA && !dateB) return 0
    if (!dateA) return sortDirection.value === 'asc' ? 1 : -1
    if (!dateB) return sortDirection.value === 'asc' ? -1 : 1

    return sortDirection.value === 'asc' ? dateA - dateB : dateB - dateA
  })
})

const handleDone = async ({ orderId, itemId, quantity }) => {
  const order = ordersStore.getItemsList.find(o => o.id === orderId)
  if (!order) return

  const updatedItems = order.order.map(item => {
    if (item.id === itemId) {
      const newDone = (item.done || 0) + quantity
      return {
        ...item,
        done: newDone,
        status: newDone >= item.quantity ? 'completed' : 'in_progress'
      }
    }
    return item
  })

  const allCompleted = updatedItems.every(item => item.status === 'completed')

  const updatedOrder = {
    ...order,
    order: updatedItems,
    allStatus: allCompleted ? 'completed' : 'in_progress'
  }

  await ordersStore.updateItem(order.id, updatedOrder)
  await ordersStore.loadItemsList()
  if (allCompleted) {
    await ordersStore.handleStatusChange(updatedOrder)
  }
}
</script>

<template>
  <v-container class="pa-2">
    <v-row class="mt-2">
      <v-col cols="12" sm="8" class="h-100 d-flex align-center">
        <v-radio-group v-model="chosenWorker" inline>
          <v-radio :label="'All workers'" :value="null"></v-radio>
          <v-radio
              v-for="worker in workersList"
              :key="worker.id"
              :label="worker.name"
              :value="worker.name"
          ></v-radio>
        </v-radio-group>
      </v-col>

      <v-col cols="12" sm="4"  class="h-100 d-flex align-center">
        <v-select
            v-model="sortDirection"
            :items="['asc', 'desc']"
            label="Sort by Delivery Date"
            variant="outlined"
            density="comfortable"
        />
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <h2 class="text-h5 font-weight-bold">
        {{ chosenWorker ? `Orders for ${chosenWorker}` : 'All orders' }}
      </h2>
    </v-row>

    <v-row class="mt-4">
      <v-col
          v-if="sortedOrders.length"
          cols="12"
          v-for="order in sortedOrders"
          :key="order.id"
          class="mb-2"
      >
        <ProductionItem
            :orders="order"
            :chosen-worker="chosenWorker"
            @done="handleDone"
        />
      </v-col>

      <v-col v-else cols="12">
        <v-alert type="info" class="mt-4">No orders added yet...</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>