<script setup>
import {
  useOrdersFilter
} from '../../composables/useOrdersFilter.js'

const {
  filter,
  filterTitle,
  filteredOrders,
  filterText,
  filterCostumer,
  selectedCostumer,
  customersList,
  currentComponent,
  sortDirection,
} = useOrdersFilter()

function resetFilters() {
  filter.value = 'all'
  filterTitle.value = ''
  filterCostumer.value = ''
  selectedCostumer.value = null
  sortDirection.value = 'asc' // по умолчанию
}
</script>

<template>
  <div>
    <h1>Orders List</h1>

    <!-- Фильтры по статусу -->
    <div>
      <button @click="filter = 'unassigned'">Unassigned
        orders
      </button>
      <button @click="filter = 'assigned'">Assigned orders
      </button>
      <button @click="filter = 'completed'">Completed
        orders
      </button>
      <button @click="filter = 'all'">All orders</button>
    </div>

    <!-- Поиск по названию товара -->
    <div>
      <label for="title">Search by Product:</label>
      <input
          id="title"
          v-model="filterTitle"
          placeholder="Enter product title"
          type="text"
      />
    </div>

    <!-- Поиск по имени покупателя -->
    <div>
      <label for="costumer">Search by Customer:</label>
      <input
          id="costumer"
          v-model="filterCostumer"
          placeholder="Enter customer"
          type="text"
      />
    </div>

    <!-- Выбор покупателя из списка -->
    <div>
      <label for="selectedCostumer">Select Customer:</label>
      <select v-model="selectedCostumer"
              id="selectedCostumer">
        <option disabled >Select costumer</option>
        <option value="">All customers</option>
        <option
            v-for="customer in customersList"
            :key="customer"
            :value="customer"
        >
          {{ customer }}
        </option>
      </select>
    </div>

    <!-- Сортировка по дате доставки -->
    <div>
      <label for="sortOption">Sort by Delivery Date:</label>
      <select v-model="sortDirection">
        <option value="asc">Sort by Delivery Date (Ascending)</option>
        <option value="desc">Sort by Delivery Date (Descending)</option>
      </select>
    </div>

    <!-- Сброс -->
    <div>
      <button @click="resetFilters">Reset Filters</button>
    </div>

    <!-- Список заказов -->
    <h2>{{ filterText }}</h2>
    <div
        v-if="Array.isArray(filteredOrders) && filteredOrders.length">
      <component
          v-for="order in filteredOrders"
          :key="order.id"
          :is="currentComponent"
          :order="order"
      />
    </div>
    <div v-else>
      No orders added yet...
    </div>
  </div>
</template>
