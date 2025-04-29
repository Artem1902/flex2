<script setup>
import { ref, computed, watch } from 'vue'
import { useInventoryStore } from '../../stores/inventory'
import { useProductsStore } from '../../stores/products'
import { useOrdersStore } from '../../stores/orders'
import MissingMaterialsList from '../../components/materials/MissingMaterialsList.vue'

const inventoryStore = useInventoryStore()
const productsStore = useProductsStore()
const ordersStore = useOrdersStore()

const selectedInventory = ref(null)
const quantity = ref(0)
const selectedProductId = ref(null)
const searchedInventory = ref('')
const enteredUnits = ref(null)

const inventoryList = computed(() => inventoryStore.getItemsList || [])
const productsList = computed(() => productsStore.getItemsList || [])

const filteredInventoryList = computed(() => {
  const search = searchedInventory.value.trim().toLowerCase()
  if (!search) return inventoryList.value
  return inventoryList.value.filter(inv =>
      inv.name?.toLowerCase().includes(search)
  )
})

const isDisabled = computed(() => quantity.value > 0 && !isNaN(quantity.value))

const foundProduct = computed(() => {
  if (!selectedProductId.value) return null
  return productsList.value.find(p => p.id === selectedProductId.value)
})

function onSelect(inventory) {
  selectedInventory.value =
      selectedInventory.value?.id === inventory.id ? null : inventory
  quantity.value = 0
}

async function onQuantitySubmit() {
  if (!isDisabled.value || !selectedInventory.value) return

  const updatedItem = {
    ...selectedInventory.value,
    quantity: selectedInventory.value.quantity + quantity.value
  }

  await inventoryStore.updateItem(updatedItem.id, updatedItem)
  await inventoryStore.loadItemsList()
  await ordersStore.loadItemsList()
  await ordersStore.recheckMissingMaterialsForAllOrders()
  await inventoryStore.calculateReservedMaterials()

  selectedInventory.value = null
  quantity.value = 0
}

function getItemsText(quantityPerUnit = 1) {
  const units = enteredUnits.value || 1
  const total = quantityPerUnit * units
  return `${total} ${total === 1 ? 'item' : 'items'}`
}

watch(selectedProductId, () => {
  enteredUnits.value = null
})
</script>

<template>
  <v-container class="py-6">
    <v-card class="pa-4 mb-6" elevation="2">
      <v-card-title class="text-h5">Calculation of Material per Quantity of Product</v-card-title>

      <v-card-text>
        <v-select
            v-model="selectedProductId"
            :items="productsList"
            item-title="name"
            item-value="id"
            label="Select Product"
            placeholder="Select Product"
            clearable
            density="comfortable"
            variant="outlined"
            class="mb-4"
        />


        <div v-if="foundProduct">
          <div class="mb-4">
            <p class="text-subtitle-1">
              Required materials for {{ foundProduct.name }}
              <span v-if="enteredUnits">— {{ enteredUnits }} units</span>
            </p>

            <v-list density="compact" class="mb-4">
              <v-list-item
                  v-for="mat in foundProduct.materials"
                  :key="mat.name"
              >
                <div>{{ mat.name }} — {{ getItemsText(mat.quantity) }}</div>
              </v-list-item>
            </v-list>

            <v-text-field
                v-model.number="enteredUnits"
                type="number"
                min="1"
                label="Number of Units"
                placeholder="Enter number of units"
                density="comfortable"
                variant="outlined"
            />
          </div>
        </div>
      </v-card-text>
    </v-card>

    <v-divider></v-divider>

    <v-card class="pa-4 mt-6" elevation="2">
      <v-card-title class="text-h5">Materials List</v-card-title>

      <v-card-text>
        <v-text-field
            v-model="searchedInventory"
            label="Search by Inventory"
            placeholder="Enter inventory title"
            density="comfortable"
            variant="outlined"
            class="mb-4"
        />

        <v-list v-if="filteredInventoryList.length > 0" density="compact">
          <v-list-item
              v-for="inventory in filteredInventoryList"
              :key="inventory.id"
              class="flex-column align-start"
          >
            <div class="d-flex justify-space-between align-center w-100">
              <div>
                {{ inventory.name }} — Total: {{ inventory.quantity }},
                Reserved: {{ inventory.reserved ?? 0 }},
                Available: {{ inventory.available ?? inventory.quantity }}
              </div>
              <v-btn
                  size="small"
                  color="primary"
                  variant="outlined"
                  @click="onSelect(inventory)"
              >
                Add
              </v-btn>
            </div>

            <v-expand-transition>
              <div v-if="selectedInventory?.id === inventory.id" class="w-100 mt-2">
                <v-text-field
                    v-model.number="quantity"
                    type="number"
                    min="1"
                    label="Enter quantity"
                    placeholder="Enter quantity"
                    density="comfortable"
                    variant="outlined"
                    class="mb-2"
                />
                <v-btn
                    color="success"
                    block
                    :disabled="!isDisabled"
                    @click="onQuantitySubmit"
                >
                  Submit Quantity
                </v-btn>
              </div>
            </v-expand-transition>
          </v-list-item>
        </v-list>

        <v-alert v-else type="info" variant="tonal" class="mt-4">
          No materials found...
        </v-alert>

        <MissingMaterialsList />
      </v-card-text>
    </v-card>
  </v-container>
</template>
