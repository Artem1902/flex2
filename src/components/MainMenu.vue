<script setup>
import {routes} from '../router/index.js'
import {isRouteAvailable} from "../router/helpers.js";
import {ref, onMounted} from "vue";

const visibleMenuItems = ref([])

async function checkItemsRoutes(routes, menuItemsRoutes) {
  for (const route of routes) {
    if (route.children) {
      await checkItemsRoutes(route.children, menuItemsRoutes)
    } else if (route.meta?.useInMenu) {
      const available = await isRouteAvailable(route)
      if (available) {
        menuItemsRoutes.push({ name: route.name })
      }
    }
  }
}

onMounted(async () => {
  const menuItemsRoutes = []
  await checkItemsRoutes(routes, menuItemsRoutes)
  visibleMenuItems.value = menuItemsRoutes
})
</script>


<template>
    <v-btn v-for="route in visibleMenuItems"
                 :key="route.name"
                 :to="{ name: route.name }"
                 link>
      {{ route.name }}</v-btn>
</template>


<style scoped>

</style>