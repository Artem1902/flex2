<script setup>
import {onMounted} from "vue";
import {
  useInventoryStore,
} from "../../stores/materials.js";
import {useProductsStore} from "../../stores/products.js";
import MaterialsList from "./MaterialsList.vue";

const inventoryStore = useInventoryStore()
const productsStore = useProductsStore()

onMounted(async () => {
  await inventoryStore.loadItemsList()
  await productsStore.loadItemsList()
})

</script>

<template>
  <main-layout>
    <materials-list></materials-list>
  </main-layout>
</template>

<style scoped>

</style>