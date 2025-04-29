<script setup>
import {onMounted} from "vue";
import {useOrdersStore} from "../../stores/orders.js";
import ProductionList from "./ProductionList.vue";

const ordersStore = useOrdersStore()

onMounted(async () => {
      await ordersStore.loadItemsList()
      console.log('ProductionView mounted')

    }
)

</script>

<template>
  <main-layout>
    <production-list></production-list>
  </main-layout>
</template>


<style scoped>

</style>