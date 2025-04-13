<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
  orders: Object,
  chosenWorker: String
})
const emit = defineEmits(['done'])

const showDonePopup = reactive({})
const madeToday = reactive({})

const filteredItems = computed(() => {
  if (!props.chosenWorker) return props.orders.order
  return props.orders.order.filter(
      item => item.worker?.toLowerCase() === props.chosenWorker.toLowerCase()
  )
})

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

const getLeft = (item) => item.quantity - (item.done || 0)

const isValid = (item) => {
  const val = madeToday[item.title] ?? 0
  return val >= 1 && val <= getLeft(item)
}

const saveMade = (item) => {
  const doneToAdd = madeToday[item.title]
  if (!doneToAdd) return

  emit('done', {
    orderId: props.orders.id,
    itemId: item.id,
    quantity: doneToAdd
  })

  madeToday[item.title] = 0
  showDonePopup[item.title] = false
}
</script>

<template>
  <div v-for="item in filteredItems" :key="item.title" style="margin-bottom: 1em;">
    <div>
      <div>
        Customer: {{ orders.costumer }}
      </div>
      <div>
        {{ item.title }} - qty: {{ item.quantity }} /
        done: {{ item.done || 0 }} /
        left: {{ getLeft(item) }} / ({{ item.status }})
      </div>

      <button @click="showDonePopup[item.title] = true">Done</button>

      <div v-if="showDonePopup[item.title]">
        <h4>Items made today</h4>
        <input
            type="number"
            v-model.number="madeToday[item.title]"
            :min="1"
            :max="getLeft(item)"
        />
        <button @click="saveMade(item)" :disabled="!isValid(item)">Save</button>
        <button @click="showDonePopup[item.title] = false">Cancel</button>
        <div v-if="!isValid(item)" style="color: red; font-size: 0.9em;">
          Enter a value between 1 and {{ getLeft(item) }}
        </div>
      </div>

      <div>
        Order date: {{ orders.orderDate }} /
        Delivery: {{ orders.deliveryDate }} /
        <strong>{{ getDeliveryText(orders.deliveryDate) }}</strong>
        <div>Status of the entire order: {{ orders.allStatus }}</div>
      </div>
      <hr />
    </div>
  </div>
</template>
