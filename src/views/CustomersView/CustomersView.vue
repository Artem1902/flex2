<script setup>
import CustomersList from "./CustomersList.vue";
import {useCustomersStore} from "../../stores/customers.js";
import {onMounted} from "vue";

const customersStore =  useCustomersStore()

onMounted(()=> customersStore.loadItemsList())

</script>

<template>
  <main-layout>
    <customers-list></customers-list>
  </main-layout>
</template>

<style scoped>

</style>