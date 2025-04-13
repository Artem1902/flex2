<script setup>
import {useRouter} from "vue-router";
import {useCustomersStore} from "../stores/customers.js";
import {computed, onMounted, ref} from "vue";
import MainLayout from "../layouts/MainLayout.vue";
import {useProductsStore} from "../stores/products.js";
import {useOrdersStore} from "../stores/orders.js";

const props = defineProps({
  id: String,
});

const router = useRouter();
const customersStore = useCustomersStore();
const productsStore = useProductsStore();
const ordersStore = useOrdersStore();

const productsList = computed(() => productsStore.getItemsList ?? []);
const customer = ref({});
const selectedProduct = ref({});
const quantity = ref(0);
const currentOrderList = ref([]);

const totalPrice = computed(() =>
    currentOrderList.value.reduce(
        (acc, current) => acc + current.price * current.quantity,
        0
    )
);

function onSelect(product) {
  selectedProduct.value = selectedProduct.value?.id === product.id ? null : product;
}

function onQuantitySubmit() {
  if (quantity.value <= 0 || isNaN(quantity.value)) {
    return;
  }

  const newOrderData = {
    id: selectedProduct.value.id,
    title: selectedProduct.value.name,
    price: selectedProduct.value.price,
    quantity: quantity.value,
    status: 'new',
    worker: null,
    done: 0
  };

  const isAlreadyInList = currentOrderList.value.find(item => item.id === newOrderData.id);
  if (isAlreadyInList) {
    const findIndex = currentOrderList.value.findIndex(item => item.id === newOrderData.id);
    currentOrderList.value[findIndex].quantity += newOrderData.quantity;
  } else {
    currentOrderList.value.push(newOrderData);
  }
  selectedProduct.value = null;
  quantity.value = 0;
}

function changeQty(curOrderId, qty) {
  const currentItem = currentOrderList.value.find((item) => item.id === curOrderId);
  if (currentItem) {
    if (currentItem.quantity + qty >= 1) {
      currentItem.quantity += qty;
    } else {
      currentItem.quantity = 1;
    }
  }
}

async function onComplete() {
  const completeOrderData = {
    costumer: customer.value.name,
    order: currentOrderList.value,
    total: totalPrice.value.toFixed(2),
    deliveryDate: null,
    allStatus: 'new',
    orderDate: new Date().toISOString().split("T")[0]
  };

  if (confirm('Are you sure you want to create an order?')) {
    await ordersStore.addItem(completeOrderData);
    await router.push({name: 'orders'});
  }
}

function onDelete(currentOrderId) {
  if (confirm('Are you sure you want to delete this product?')) {
    currentOrderList.value = currentOrderList.value.filter((item) => item.id !== currentOrderId);
  }
}

const isDisabled = computed(() => quantity.value && !isNaN(quantity.value) && quantity.value > 0);

onMounted(async () => {
  productsStore.loadItemsList();
  if (props.id) {
    customer.value = await customersStore.loadItemById(props.id);
  }
});
</script>

<template>
  <main-layout>
    <h1>Placing an order for {{ customer.name }}</h1>

    <div v-if="currentOrderList.length > 0">
      <h3>Current order:</h3>
      <ul>
        <li v-for="curOrder in currentOrderList"
            :key="curOrder.id">
          {{ curOrder.title }} - price: $
          {{ curOrder.price }} - quantity:
          <button @click="changeQty(curOrder.id, -1)">-
          </button>
          {{ curOrder.quantity }}
          <button @click="changeQty(curOrder.id, 1)">+
          </button>
          <button @click="onDelete(curOrder.id)">Delete
          </button>
        </li>
      </ul>
      <div>
        Total: $ {{ totalPrice.toFixed(2) }}
      </div>
      <button @click="onComplete">Сreate an order</button>
    </div>

    <h3>Products List</h3>
    <ul>
      <li v-for="product in productsList" :key="product.id">
        <span>{{ product.name }} - {{product.price }}</span>
        <button @click="onSelect(product)">Select</button>
        <div
            v-if="selectedProduct && selectedProduct.id === product.id">
          <h3>Enter quantity for {{ product.name }}</h3>
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
  </main-layout>
</template>

<style scoped></style>
