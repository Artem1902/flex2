<script setup>
import {
  useOrdersFilter
} from '../../composables/useOrdersFilter.js'

const {
  filter,
  filterTitle,
  filteredOrders,
  filterText,
  filterCustomer,
  selectedCustomer,
  customersList,
  currentComponent,
  sortDirection,
} = useOrdersFilter()

function resetFilters() {
  filterTitle.value = ''
  filter.value = 'all'
  filterCustomer.value = ''
  selectedCustomer.value = null
  sortDirection.value = 'asc'
}
</script>

<template>
  <v-container class="pa-2">
    <v-row class="mt-2">
      <v-col cols="12" sm="6" md="3">
        <v-btn
            @click="filter = 'unassigned'"
            block
            :color="filter === 'unassigned' ? 'secondary' : 'info'"
        >
          Unassigned Orders
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-btn
            @click="filter = 'assigned'"
            block
            :color="filter === 'assigned' ? 'secondary' : 'info'"
        >
          Assigned Orders
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-btn
            @click="filter = 'completed'"
            block
            :color="filter === 'completed' ? 'secondary' : 'info'"
        >
          Completed Orders
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-btn
            @click="filter = 'all'"
            block
            :color="filter === 'all' ? 'secondary' : 'info'"
        >
          All Orders
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12" sm="6" md="3"
             class="h-100 d-flex align-center">
        <v-text-field
            v-model="filterTitle"
            label="Search by Product"
            variant="outlined"
            density="comfortable"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3"
             class="h-100 d-flex align-center">
        <v-text-field
            v-model="filterCustomer"
            label="Search by Customer"
            variant="outlined"
            density="comfortable"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3"
             class="h-100 d-flex align-center">
        <v-select
            v-model="selectedCustomer"
            :items="customersList"
            label="Select Customer"
            variant="outlined"
            density="comfortable"
        />
      </v-col>

      <v-col cols="12" sm="6" md="2"
             class="h-100 d-flex align-center">
        <v-select
            v-model="sortDirection"
            :items="['asc', 'desc']"
            label="Sort by Delivery Date"
            variant="outlined"
            density="comfortable"
        />
      </v-col>

      <v-col cols="12" sm="6" md="1"
             class="h-100 d-flex align-center">
        <v-btn
            @click="resetFilters"
            color="warning"
            block
        >
          <font-awesome-icon icon="sync"/>
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mt-10">
      <h1 class="text-h5 font-weight-bold">{{
          filterText
        }}</h1>
    </v-row>

    <v-row class="mt-4">
      <v-col
          v-if="Array.isArray(filteredOrders) && filteredOrders.length"
          cols="12"
          v-for="order in filteredOrders"
          :key="order.id"
          class="mb-2"
      >
      <component
          :is="currentComponent"
          :order="order"
      />
      </v-col>
      <v-col v-else cols="12">
        <v-alert type="info" class="mt-4">No orders added
          yet...
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>

