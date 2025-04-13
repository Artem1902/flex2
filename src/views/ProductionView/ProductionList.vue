<script setup>
import {computed, ref} from 'vue'
import {useOrdersStore} from '../../stores/orders.js'
import {workersList} from '../../constants/workersList.js'
import ProductionItem from './ProductionItem.vue'

const ordersStore = useOrdersStore()
const chosenWorker = ref(null)
const sortDirection = ref('asc')

const sortedOrders = computed(() => {
  const orders = (ordersStore.getItemsList || []).filter(
      order => order.allStatus === 'assigned' || order.allStatus === 'in_progress'
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

const handleDone = async ({orderId, itemId, quantity}) => {
  const order = ordersStore.getItemsList.find(o => o.id === orderId)
  if (!order) return

  const updatedItems = order.order.map(i => {
    if (i.id === itemId) {
      const newDone = (i.done || 0) + quantity
      return {
        ...i,
        done: newDone,
        status: newDone === i.quantity ? 'completed' : 'in_progress'
      }
    }
    return i
  })

  const allCompleted = updatedItems.every(i => i.status === 'completed')

  const updatedOrder = {
    ...order,
    order: updatedItems,
    allStatus: allCompleted ? 'completed' : 'in_progress'
  }

  await ordersStore.updateItem(order.id, updatedOrder)
  await ordersStore.loadItemsList()
}
</script>

<template>
  <div>
    <h1>Production List</h1>

    <div>
      <input type="radio" id="all" :value="null"
             v-model="chosenWorker"/>
      <label for="all">All workers</label>
    </div>

    <div v-for="worker in workersList" :key="worker.id">
      <input type="radio" :id="worker.id"
             :value="worker.name" v-model="chosenWorker"/>
      <label :for="worker.id">{{ worker.name }}</label>
    </div>

    <div>
      <label>Sort by Delivery Date:</label>
      <select v-model="sortDirection">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>

    <h2>{{
        chosenWorker ? `Orders for ${chosenWorker}` : 'All orders'
      }}</h2>
    <div v-if="sortedOrders.length">
      <production-item
          v-for="orders in sortedOrders"
          :key="orders.id"
          :orders="orders"
          :chosen-worker="chosenWorker"
          @done="handleDone"
      />
    </div>
    <div v-else>
      No orders added yet...
    </div>
  </div>
</template>

