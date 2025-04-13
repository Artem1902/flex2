<script setup>
import {
  useInventoryStore,
} from "../../stores/materials.js";
import {useProductsStore} from "../../stores/products.js";
import {computed, ref} from "vue";

const inventoryStore = useInventoryStore()
const productsStore = useProductsStore()

const inventoryList = computed(() => inventoryStore.getItemsList || [])
const productsList = computed(() => productsStore.getItemsList || [])

const selectedInventory = ref({})
const quantity = ref(0);

function onSelect(inventory) {
  selectedInventory.value = selectedInventory.value?.id === inventory.id ? null : inventory;
  quantity.value = 0;
}
const isDisabled = computed(() => quantity.value && !isNaN(quantity.value) && quantity.value > 0);

async function onQuantitySubmit() {
  if (quantity.value <= 0 || isNaN(quantity.value)) {
    return;
  }

  const newInventoryData = {
    id: selectedInventory.value.id,
    name: selectedInventory.value.name,
    quantity: selectedInventory.value.quantity + quantity.value,
  };

  await inventoryStore.updateItem(newInventoryData.id, newInventoryData);
  await inventoryStore.loadItemsList()
  selectedInventory.value = null;
  quantity.value = 0;
}
</script>

<template>
  <div>
    <h1>Materials List</h1>

    <!--    <div>-->
    <!--      <input type="radio" id="all" :value="null" v-model="chosenWorker" />-->
    <!--      <label for="all">All workers</label>-->
    <!--    </div>-->

    <!--    <div v-for="worker in workersList" :key="worker.id">-->
    <!--      <input-->
    <!--          type="radio"-->
    <!--          :id="worker.id"-->
    <!--          :value="worker.name"-->
    <!--          v-model="chosenWorker"-->
    <!--      />-->
    <!--      <label :for="worker.id">{{ worker.name }}</label>-->
    <!--    </div>-->

    <!--    <div>-->
    <!--      <label>Sort by Delivery Date:</label>-->
    <!--      <select v-model="sortDirection">-->
    <!--        <option value="asc">Ascending</option>-->
    <!--        <option value="desc">Descending</option>-->
    <!--      </select>-->
    <!--    </div>-->

    <!--    <h2>{{ chosenWorker ? `Orders for ${chosenWorker}` : 'All orders' }}</h2>-->
    <ul v-if="inventoryList.length">
      <li v-for="inventory in inventoryList"
          :key="inventory.id">
        <span>{{ inventory.name }} - {{
            inventory.quantity
          }} </span>
        <button @click="onSelect(inventory)">Add</button>
        <div
            v-if="selectedInventory && selectedInventory.id === inventory.id">
          <h3>Enter quantity to add {{ inventory.name }}</h3>
          <input
              v-model="quantity"
              type="number"
              min="1"
              step="1"
              placeholder="Enter quantity"
          />
          <button :disabled="!isDisabled"
                  @click="onQuantitySubmit">Submit Quantity
          </button>
        </div>
      </li>
    </ul>
    <div v-else>
      No materials added yet...
    </div>
  </div>
</template>
