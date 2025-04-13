<script setup>
const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

</script>

<template>
  <div>
    <h3>Customer: {{ order.costumer }}</h3>
    <ul>
      <li v-for="item in order.order" :key="item.id">
        {{ item.title }},  qty: {{ item.quantity }}, worker: {{item.worker ? item.worker :'not defined'}}, status: {{item.status}}
      </li>
    </ul>
    <div>
      Total: {{order.total}}
    </div>
    <div>
      Order date: {{order.orderDate}}
    </div>
    <div>
      Delivery date: {{order.deliveryDate ? order.deliveryDate : 'not assigned yet'}}
    </div>
    <div>
      Сurrent status of the entire order: {{ order.allStatus }}
    </div>
  </div>
</template>

<style scoped>

</style>