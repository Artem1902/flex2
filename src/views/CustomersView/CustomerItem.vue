<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  customer: {
    type: Object,
    required: true,
  },
})

const router = useRouter()

const onDetails = () => {
  router.push({
    name: 'customerDetail',
    params: { id: props.customer.id },
  })
}

const onOrder = () => {
  router.push({
    name: 'newOrder',
    params: { id: props.customer.id },
  })
}
</script>

<template>
  <v-card class="pa-4" elevation="2">
    <div class="d-flex align-center justify-space-between flex-wrap">
      <!-- Имя клиента -->
      <v-card-title class="text-h6 pa-0">
        {{ customer.name }}
      </v-card-title>

      <div class="d-flex align-center" style="gap: 12px;">
        <v-btn color="primary" variant="outlined" @click="onDetails">
          Details
        </v-btn>
        <v-btn color="success" variant="outlined" @click="onOrder">
          Place an Order
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
</style>
