<script setup>
import {useRouter} from "vue-router";
import {workersList} from "../../constants/workersList.js";
import {computed, ref} from "vue";
import {useOrdersStore} from "../../stores/orders.js";

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

const ordersStore = useOrdersStore()

const localOrder = ref(JSON.parse(JSON.stringify(props.order)))

const minDate = new Date().toISOString().split("T")[0]
const deliveryDate = ref(null)

const isSubmitDisabled = computed(() => {
  return (
      !deliveryDate.value ||
      localOrder.value.order.some(item => !item.worker)
  );
})

async function onSubmit() {
  const updatedOrder = {
    ...localOrder.value,
    deliveryDate: deliveryDate.value,
    allStatus: 'assigned',
    order: localOrder.value.order.map(product => ({
      ...product,
      status: 'in_progress'
    }))
  }
  await ordersStore.updateItem(localOrder.value.id, updatedOrder)
  await ordersStore.loadItemsList()
  deliveryDate.value = null
}

async function onCancel() {
  if (confirm('Are you sure you want to cancel this order?')) {
    await ordersStore.deleteItem(localOrder.value.id)
  }
}
</script>

<template>
  <div>
    <h3>{{ localOrder.costumer }}</h3>
    <ul>
      <li v-for="item in localOrder.order" :key="item.id">
        {{ item.title }} - {{ item.quantity }}
        <select v-model="item.worker">
          <option disabled value="">Select worker</option>
          <option v-for="worker in workersList"
                  :key="worker.id" :value="worker.name">
            {{ worker.name }}
          </option>
        </select>
      </li>
    </ul>

    <label for="date">Delivery date:</label>
    <input type="date" id="date" v-model="deliveryDate" :min="minDate"/>

    <button :disabled="isSubmitDisabled"
            @click="onSubmit()">Submit
    </button>
    <button @click='onCancel'>Cancel order</button>
  </div>
</template>

<style scoped>

</style>
