<script setup>
import { useOrdersStore } from "../../stores/orders.js";
import { ref } from "vue";

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

const ordersStore = useOrdersStore()
const localOrder = ref(JSON.parse(JSON.stringify(props.order)))

const showDeliveryPopup = ref(false)
const newDeliveryDate = ref(localOrder.value.deliveryDate)

const minDate = new Date().toISOString().split("T")[0]

async function onCancel() {
  if (confirm('Are you sure you want to cancel this order?')) {
    await ordersStore.deleteItem(props.order.id)
  }
}

async function onComplete() {
  const updatedOrder = {
    ...localOrder.value,
    allStatus: 'completed',
    order: localOrder.value.order.map(product => ({
      ...product,
      status: 'completed'
    }))
  }
  await ordersStore.updateItem(localOrder.value.id, updatedOrder)
  await ordersStore.loadItemsList()
}

async function onSaveDeliveryDate() {
  const updatedOrder = {
    ...localOrder.value,
    deliveryDate: newDeliveryDate.value
  }
  await ordersStore.updateItem(localOrder.value.id, updatedOrder)
  await ordersStore.loadItemsList()
  showDeliveryPopup.value = false
}
const getDaysDiff = (deliveryDateString) => {
  const deliveryDate = new Date(deliveryDateString)
  const today = new Date()
  deliveryDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  return Math.ceil((deliveryDate - today) / (1000 * 60 * 60 * 24))
}

const getDeliveryText = (deliveryDate) => {
  const days = getDaysDiff(deliveryDate)
  if (days === 0) return 'Delivery today'
  if (days > 0) return `Delivery in ${days} day${days > 1 ? 's' : ''}`
  return `Delivered ${Math.abs(days)} day${Math.abs(days) > 1 ? 's' : ''} ago`
}

</script>

<template>
  <div>
    <h3>Customer: {{ order.costumer }}</h3>
    <ul>
      <li v-for="item in order.order" :key="item.id">
        {{ item.title }}, qty: {{ item.quantity }},
        worker: {{ item.worker || 'not defined' }},
        status: {{ item.status }}
      </li>
    </ul>

    <div>Total: {{ order.total }}</div>
    <div>
      Order date: {{ order.orderDate }} /
      Delivery: {{ order.deliveryDate }} /
      <strong>{{ getDeliveryText(order.deliveryDate) }}</strong>
      <div>Status of the entire order: {{ order.allStatus }}</div>
    </div>

    <button @click="onCancel">Cancel order</button>
    <button @click="showDeliveryPopup = true">Change delivery date</button>
    <button @click="onComplete">Complete order</button>

    <div v-if="showDeliveryPopup" >
      <h4>Change Delivery Date</h4>
      <input type="date" v-model="newDeliveryDate" :min="minDate" />
      <button @click="onSaveDeliveryDate" :disabled="!newDeliveryDate">Save</button>
      <button @click="showDeliveryPopup = false">Cancel</button>
    </div>
  </div>
</template>

<style scoped>

</style>
