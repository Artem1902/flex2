<script setup>
import {onMounted} from "vue";
import {useOrdersStore} from "../../stores/orders.js";
import OrdersList from "./OrdersList.vue";

const ordersStore = useOrdersStore()

onMounted(() => ordersStore.loadItemsList())

</script>

<template>
  <main-layout>
    <orders-list></orders-list>
  </main-layout>
</template>

<style scoped>

</style>