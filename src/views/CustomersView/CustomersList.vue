<script setup>
import {useCustomersStore} from "../../stores/customers.js";
import {computed} from "vue";
import {useRouter} from "vue-router";
import CustomerItem from "./CustomerItem.vue";

const router = useRouter()

const customersStore = useCustomersStore()
const customersList = computed(() => customersStore.getItemsList ?? [])

function onAdd() {
  router.push({name: 'customerEdit'})
}

</script>

<template>
  <div>
    <h1>Customers List</h1>
    <button @click='onAdd'>Add Customer</button>
    <div v-if="customersList.length">
      <customer-item v-for="customer in customersList"
                     :key='customer.id'
                     :customer="customer">
      </customer-item>
    </div>
    <div v-else>
      No customers added yet...
    </div>
  </div>

</template>

<style scoped>

</style>