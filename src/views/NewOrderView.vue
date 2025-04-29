<script setup>
import { useRouter } from "vue-router";
import { computed, onMounted, ref, toRaw } from "vue";
import MainLayout from "../layouts/MainLayout.vue";
import { useCustomersStore } from "../stores/customers.js";
import { useProductsStore } from "../stores/products.js";
import { useOrdersStore } from "../stores/orders.js";
import { useInventoryStore } from "../stores/inventory.js";

const props = defineProps({ id: String });

const router = useRouter();
const customersStore = useCustomersStore();
const productsStore = useProductsStore();
const ordersStore = useOrdersStore();
const inventoryStore = useInventoryStore();

const productsList = computed(() => productsStore.getItemsList ?? []);
const customer = ref({});
const selectedProduct = ref(null);
const quantity = ref(0);
const currentOrderList = ref([]);
const missingMaterials = ref([]);
const searchQuery = ref('');

const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) {
    return productsList.value;
  }
  return productsList.value.filter(product =>
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const totalPrice = computed(() =>
    currentOrderList.value.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    )
);

const isDisabled = computed(() => quantity.value && !isNaN(quantity.value) && quantity.value > 0);

function onSelect(product) {
  selectedProduct.value = selectedProduct.value?.id === product.id ? null : product;
}

function onQuantitySubmit() {
  if (quantity.value <= 0 || isNaN(quantity.value)) return;

  const newOrderData = {
    id: selectedProduct.value.id,
    title: selectedProduct.value.name,
    price: selectedProduct.value.price,
    quantity: quantity.value,
    status: 'new',
    worker: null,
    done: 0
  };

  const existing = currentOrderList.value.find(item => item.id === newOrderData.id);
  if (existing) {
    existing.quantity = Number(existing.quantity) + Number(newOrderData.quantity);
  } else {
    currentOrderList.value.push(newOrderData);
  }

  selectedProduct.value = null;
  quantity.value = 0;
}

function changeQty(productId, delta) {
  const item = currentOrderList.value.find(i => i.id === productId);
  if (item) {
    const currentQuantity = Number(item.quantity) || 0;
    item.quantity = Math.max(1, currentQuantity + delta);
  }
}

function onDelete(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    currentOrderList.value = currentOrderList.value.filter(item => item.id !== productId);
  }
}

async function onComplete() {
  await productsStore.loadItemsList();
  await inventoryStore.loadItemsList();

  missingMaterials.value = [];

  for (const item of currentOrderList.value) {
    const product = productsStore.getItemsList.find(p => p.id === item.id);
    if (!product || !product.materials) continue;

    for (const mat of product.materials) {
      const totalNeeded = mat.quantity * item.quantity;
      const materialInStock = inventoryStore.getItemsList.find(m => m.name === mat.name);
      const available = materialInStock?.available ?? 0;
      const reserved = materialInStock?.reserved ?? 0;
      const inStock = Math.max(0, available - reserved);
      const shortage = Math.max(0, totalNeeded - inStock);

      if (shortage > 0) {
        const existing = missingMaterials.value.find(
            m => m.name === mat.name && m.productId === item.id
        );
        if (existing) {
          existing.missing += shortage;
        } else {
          missingMaterials.value.push({
            name: mat.name,
            missing: shortage,
            productId: item.id,
          });
        }
      }
    }
  }

  const completeOrderData = {
    customer: toRaw(customer.value).name,
    order: toRaw(currentOrderList.value),
    total: totalPrice.value.toFixed(2),
    deliveryDate: null,
    allStatus: 'new',
    orderDate: new Date().toISOString().split('T')[0],
    missingMaterials: toRaw(missingMaterials.value)
  };

  const cleanData = JSON.parse(JSON.stringify(completeOrderData));

  console.log('completeOrderData before save:', cleanData);

  if (missingMaterials.value.length > 0) {
    const confirmMsg =
        'There are missing materials:\n' +
        missingMaterials.value.map(m => `${m.name}: shortage of ${m.missing}`).join('\n') +
        '\n\nDo you still want to create the order?';

    if (!confirm(confirmMsg)) return;
  }

  await ordersStore.addItem(cleanData);
  await inventoryStore.calculateReservedMaterials();
  await ordersStore.recheckMissingMaterialsForAllOrders();
  currentOrderList.value = [];
  await router.push({ name: 'orders' });
}

onMounted(async () => {
  productsStore.loadItemsList();
  if (props.id) {
    customer.value = await customersStore.loadItemById(props.id);
  }
});
</script>

<template>
  <main-layout>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="text-h5 font-weight-bold mb-2">
            Placing an order for {{ customer.name }}
          </h1>
        </v-col>
      </v-row>

      <v-row v-if="currentOrderList.length > 0" class="mb-8" style="border-bottom: 2px solid black;">
        <v-col>
          <h3 class="text-h6 mb-4">Current Order:</h3>

          <v-list class="pa-0">
            <v-list-item
                v-for="curOrder in currentOrderList"
                :key="curOrder.id"
                class="flex-column align-start pa-4 mb-4 rounded-lg elevation-1"
                style="border: 1px solid #e0e0e0;"
            >
              <div class="text-body-1 font-weight-medium mb-2 d-flex align-center justify-space-between w-100">
                <span>{{ curOrder.title }} — ${{ curOrder.price }}</span>
                <v-btn color="error" icon variant="outlined" @click="onDelete(curOrder.id)">
                  <v-icon>
                    <font-awesome-icon :icon="['fas', 'trash-can']" />
                  </v-icon>
                </v-btn>
              </div>

              <div class="d-flex align-center pa-1">
                <v-btn icon class="mx-1" @click="changeQty(curOrder.id, -1)">
                  <v-icon>
                    <font-awesome-icon :icon="['fas', 'minus']" />
                  </v-icon>
                </v-btn>

                <div class="mx-4">{{ curOrder.quantity }}</div>

                <v-btn icon class="mx-1" @click="changeQty(curOrder.id, 1)">
                  <v-icon>
                    <font-awesome-icon :icon="['fas', 'plus']" />
                  </v-icon>
                </v-btn>
              </div>
            </v-list-item>
          </v-list>

          <div class="text-h6 mt-4">Total: ${{ totalPrice.toFixed(2) }}</div>

          <v-btn class="mt-4" color="primary" @click="onComplete">
            Create an Order
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <h3 class="text-h6 mb-4">Products List</h3>

          <v-text-field
              v-model="searchQuery"
              label="Search products"
              variant="outlined"
              prepend-inner-icon="mdi-magnify"
              class="mb-4"
          />

          <v-list class="pa-0">
            <template v-if="filteredProducts.length > 0">
              <v-list-item
                  v-for="product in filteredProducts"
                  :key="product.id"
                  class="flex-column align-start pa-4 mb-4 rounded-lg elevation-1"
                  style="border: 1px solid #e0e0e0;"
              >
                <div class="d-flex justify-space-between align-center w-100 mb-2">
                  <div class="text-body-1 font-weight-medium">
                    {{ product.name }} — ${{ product.price }}
                  </div>

                  <v-btn color="success" variant="outlined" @click="onSelect(product)">
                    Select
                  </v-btn>
                </div>

                <v-expand-transition>
                  <div v-if="selectedProduct && selectedProduct.id === product.id" class="w-100 mt-4">
                    <h4 class="text-subtitle-1 mb-2">
                      Enter quantity for {{ product.name }}
                    </h4>

                    <v-row>
                      <v-col cols="12" md="2">
                        <v-text-field
                            v-model="quantity"
                            label="Quantity"
                            type="number"
                            min="1"
                            step="1"
                            variant="outlined"
                        />
                      </v-col>
                      <v-col cols="12" md="4" class="d-flex align-center">
                        <v-btn :disabled="!isDisabled" color="primary" @click="onQuantitySubmit">
                          Submit Quantity
                        </v-btn>
                      </v-col>
                    </v-row>
                  </div>
                </v-expand-transition>
              </v-list-item>
            </template>

            <template v-else>
              <div class="text-center text-grey">
                No products found
              </div>
            </template>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </main-layout>
</template>

<style scoped></style>
