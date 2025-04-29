<script setup>
const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

</script>

<template>
  <v-card class="pa-4" elevation="2">
    <div class="d-flex flex-column">

      <!-- Имя клиента -->
      <v-card-title class="text-h6 pa-0">
        Customer: {{ order.customer }}
      </v-card-title>

      <!-- Список товаров -->
      <v-row class="mt-2">
        <v-col cols="12" v-for="item in order.order" :key="item.id">
          <v-card class="pa-4" elevation="1">
            <div class="text-body-1">
              {{ item.title }}, qty: {{ item.quantity }},
              worker: {{ item.worker ? item.worker : 'not defined' }},
              status: {{ item.status }}
            </div>
          </v-card>
        </v-col>

        <!-- Total -->
        <v-col cols="12">
          <v-card class="pa-4" elevation="1">
            <div class="text-body-1">
              <strong>Total:</strong> ${{ order.total }}
            </div>
          </v-card>
        </v-col>

        <!-- Order date -->
        <v-col cols="12">
          <v-card class="pa-4" elevation="1">
            <div class="text-body-1">
              <strong>Order date:</strong> {{ order.orderDate }}
            </div>
          </v-card>
        </v-col>

        <!-- Delivery date -->
        <v-col cols="12">
          <v-card class="pa-4" elevation="1">
            <div class="text-body-1">
              <strong>Delivery date:</strong>
              {{ order.deliveryDate ? order.deliveryDate : 'Not assigned yet' }}
            </div>
          </v-card>
        </v-col>

        <!-- Current status -->
        <v-col cols="12">
          <v-card class="pa-4" elevation="1">
            <div class="text-body-1">
              <strong>Current status of the entire order:</strong> {{ order.allStatus }}
            </div>
          </v-card>
        </v-col>

      </v-row>
    </div>
  </v-card>
</template>


<style scoped>

</style>