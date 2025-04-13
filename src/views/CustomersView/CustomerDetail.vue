<script setup>
import {onMounted, ref} from "vue";
import {useCustomersStore} from "../../stores/customers.js";
import {useRouter} from "vue-router";
import MainLayout from "../../layouts/MainLayout.vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const router = useRouter()

const customersStore = useCustomersStore()

const customerInfo = ref({})

function onEdit() {
  router.push({
    name: 'customerEdit',
    params: {id: props.id}
  })
}

function onBack() {
  router.push({name: 'customers'})
}

onMounted(async () => {
      if (props.id) {
        customerInfo.value = await customersStore.loadItemById(props.id)
      }
    }
)
</script>

<template>
  <main-layout>
    <div v-if="customerInfo.name">
      <h1>Customer Info</h1>
      <div>Name:{{ customerInfo.name }}</div>
      <div>Email:{{ customerInfo.email }}</div>
      <button @click='onBack'>Back</button>
      <button @click='onEdit'>Edit</button>
    </div>
    <div v-else>
      <p>Customer not found.</p>
      <button @click="onBack">Back</button>
    </div>
  </main-layout>
</template>

<style scoped>

</style>