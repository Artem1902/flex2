<script setup>
import {ref, computed, watch} from "vue";
import {useInventoryStore} from "../../stores/materials.js";
import {useProductsStore} from "../../stores/products.js";

// Stores
const inventoryStore = useInventoryStore();
const productsStore = useProductsStore();

// Data
const selectedInventory = ref(null);
const quantity = ref(0);
const selectedProductId = ref(null);
const searchedInventory = ref("");
const enteredUnits = ref(null);

// Computed
const inventoryList = computed(() => inventoryStore.getItemsList || []);
const productsList = computed(() => productsStore.getItemsList || []);

const isDisabled = computed(() => quantity.value > 0 && !isNaN(quantity.value));

const foundProduct = computed(() => {
  if (!selectedProductId.value) return null;
  return productsList.value.find(product => product.id === selectedProductId.value);
});


const filteredInventoryList = computed(() => {
  if (!searchedInventory.value) return inventoryList.value;

  return inventoryList.value.filter((inv) =>
      inv.name.toLowerCase().includes(searchedInventory.value.toLowerCase())
  );
});

// Methods
function onSelect(inventory) {
  selectedInventory.value =
      selectedInventory.value?.id === inventory.id ? null : inventory;
  quantity.value = 0;
}

async function onQuantitySubmit() {
  if (!isDisabled.value || !selectedInventory.value) return;

  const updatedItem = {
    ...selectedInventory.value,
    quantity: selectedInventory.value.quantity + quantity.value,
  };

  await inventoryStore.updateItem(updatedItem.id, updatedItem);
  await inventoryStore.loadItemsList();

  selectedInventory.value = null;
  quantity.value = 0;
}

function getItemsText(numberItems = 1) {
  const units = enteredUnits.value || 1;
  const qty = numberItems * units;
  if (qty === 1) return `${qty} item`;
  return `${qty} items`;
}

// Watch
watch(selectedProductId, () => {
  enteredUnits.value = null;
});
</script>

<template>
  <div>
    <h2>
      Calculation of material per quantity of product</h2>
    <label for="product">Select Product: </label>
    <select id="product" v-model="selectedProductId">
      <option value="">Select Product</option>
      <option v-for="product in productsList"
              :key="product.id" :value="product.id">
        {{ product.name }}
      </option>
    </select>

    <div v-if="foundProduct">
      <div>
        Required amount of materials for:
        <p>
          {{ foundProduct.name }}
          {{
            enteredUnits ? ` - ${enteredUnits} items` : ''
          }}
        </p>
        <ul>
          <li v-for="mat in foundProduct.materials"
              :key='mat.name'>
            {{ mat.name }} -
            {{
              getItemsText(mat.quantity)
            }}
          </li>
        </ul>
      </div>
      <label for="units">Number of units: </label>
      <input type="number"
             placeholder="Enter number of units" id='units'
             v-model="enteredUnits"
             min="2">
    </div>
  </div>

  <hr/>

  <div class="materials-list">
    <h2>Materials List</h2>
    <label for="search">Search by Inventory: </label>
    <input
        id="search"
        v-model="searchedInventory"
        type="text"
        placeholder="Enter inventory title"
    />

    <ul v-if="filteredInventoryList.length">
      <li v-for="inventory in filteredInventoryList"
          :key="inventory.id">
        <span>{{ inventory.name }} — {{
            inventory.quantity
          }}</span>
        <button @click="onSelect(inventory)">Add</button>

        <div v-if="selectedInventory?.id === inventory.id">
          <p>Add quantity for {{ inventory.name }}:</p>
          <input
              type="number"
              v-model.number="quantity"
              min="1"
              step="1"
              placeholder="Enter quantity"
          />
          <button :disabled="!isDisabled"
                  @click="onQuantitySubmit">
            Submit Quantity
          </button>
        </div>
      </li>
    </ul>

    <p v-else>No materials found...</p>
  </div>
</template>
