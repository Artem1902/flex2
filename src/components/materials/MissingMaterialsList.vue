<script setup>

import {useOrdersStore} from "../../stores/orders.js";
import {computed} from "vue";

const ordersStore = useOrdersStore()

const ordersWithMissingMaterials = computed(() => {
  const orders = ordersStore.getItemsList || []
  return orders.filter(order =>
      order.missingMaterials && order.missingMaterials.length > 0
  )
})
</script>

<template>
  <v-container class="py-6">
    <v-card class="pa-4" elevation="2">
      <v-card-title class="text-h5">
        Orders with Missing Materials
      </v-card-title>

      <v-card-text>
        <v-divider class="mb-4"></v-divider>

        <div v-for="order in ordersWithMissingMaterials" :key="order.id" class="mb-8">
          <v-card class="mb-4" outlined>
            <v-card-title class="text-subtitle-1">
              Customer: {{ order.customer }}
            </v-card-title>

            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <strong>Order Items:</strong>
                  <v-list density="compact">
                    <v-list-item
                        v-for="item in order.order"
                        :key="item.id"
                        class="pl-0"
                    >
                      <div>{{ item.title }} — {{ item.quantity }} pcs</div>
                    </v-list-item>
                  </v-list>
                </v-col>

                <v-col cols="12" md="6">
                  <strong>Missing Materials:</strong>
                  <v-list density="compact">
                    <v-list-item
                        v-for="material in order.missingMaterials"
                        :key="material.name"
                        class="pl-0"
                    >
                      <div>{{ material.name }} — missing {{ material.missing }}</div>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>

        <v-alert
            v-if="ordersWithMissingMaterials.length === 0"
            type="info"
            variant="tonal"
        >
          No orders with missing materials found.
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<style scoped>

</style>