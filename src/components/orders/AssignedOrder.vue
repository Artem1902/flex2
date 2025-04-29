<script setup>
import {useOrdersStore} from "../../stores/orders.js";
import {ref} from "vue";

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

const ordersStore = useOrdersStore()
const localOrder = ref(JSON.parse(JSON.stringify(props.order)))

const showDeliveryPopup = ref(false)
const newDeliveryDate = ref(localOrder.value.deliveryDate)

const minDate = new Date().toISOString().split("T")[0]

async function onCancel() {
  if (confirm('Are you sure you want to cancel this order?')) {
    await ordersStore.deleteItem(props.order.id)
    // <!-- удалять с зарезервированных материалов -->
  }
}

async function onComplete() {
  const updatedOrder = {
    ...localOrder.value,
    allStatus: 'completed',
    order: localOrder.value.order.map(product => ({
      ...product,
      status: 'completed'
    }))
  }
  await ordersStore.updateItem(localOrder.value.id, updatedOrder)
  await ordersStore.handleStatusChange(updatedOrder)
  await ordersStore.loadItemsList()
}

async function onSaveDeliveryDate() {
  const updatedOrder = {
    ...localOrder.value,
    deliveryDate: newDeliveryDate.value
  }
  await ordersStore.updateItem(localOrder.value.id, updatedOrder)
  await ordersStore.loadItemsList()
  showDeliveryPopup.value = false
}

const getDaysDiff = (deliveryDateString) => {
  const deliveryDate = new Date(deliveryDateString)
  const today = new Date()
  deliveryDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  return Math.ceil((deliveryDate - today) / (1000 * 60 * 60 * 24))
}

const getDeliveryText = (deliveryDate) => {
  const days = getDaysDiff(deliveryDate)
  if (days === 0) return 'Delivery today'
  if (days > 0) return `Delivery in ${days} day${days > 1 ? 's' : ''}`
  return `Delivered ${Math.abs(days)} day${Math.abs(days) > 1 ? 's' : ''} ago`
}

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
        <v-col cols="12" v-for="item in order.order"
               :key="item.id">
          <v-card class="pa-4" elevation="1">
            <v-row
                class="d-flex justify-space-between align-center">
              <v-col cols="12" sm="8">
                <v-card-title class="pa-0">
                  {{ item.title }}, qty: {{ item.quantity }}
                </v-card-title>
              </v-col>
              <v-col cols="12" sm="4">
                <div class="text-body-1">
                  Worker: {{ item.worker || 'Not defined' }}<br/>
                  Status: {{ item.status }}
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <!-- Итого по заказу -->
        <v-col cols="12">
          <v-card class="pa-4" elevation="1">
            <div class="text-body-1">
              <strong>Total:</strong> ${{ order.total }}
            </div>
          </v-card>
        </v-col>

        <!-- Дата заказа и дата доставки -->
        <v-col cols="12">
          <v-card class="pa-4" elevation="1">
            <div class="text-body-1">
              Order date: {{ order.orderDate }}<br/>
              Delivery: {{ order.deliveryDate }}<br/>
              <strong>{{
                  getDeliveryText(order.deliveryDate)
                }}</strong><br/>
              Status of the entire order: {{
                order.allStatus
              }}
            </div>
          </v-card>
        </v-col>

        <!-- Кнопки действий -->
        <v-col cols="12">
          <v-row class="d-flex align-center">
            <v-col cols="12" sm="4">
              <v-btn @click="onCancel" color="error" block>
                Cancel order
              </v-btn>
            </v-col>
            <v-col cols="12" sm="4">
              <v-btn @click="showDeliveryPopup = true"
                     color="warning" block>
                Change delivery date
              </v-btn>
            </v-col>
            <v-col cols="12" sm="4">
              <v-btn @click="onComplete" color="success"
                     block>
                Complete order
              </v-btn>
            </v-col>
          </v-row>
        </v-col>


        <!-- Popup изменения даты доставки -->
        <v-col v-if="showDeliveryPopup" cols="12">
          <v-card class="pa-4" elevation="1">
            <v-card-title class="text-h6 pa-0">
              Change Delivery Date
            </v-card-title>

            <v-text-field
                v-model="newDeliveryDate"
                label="New Delivery Date"
                type="date"
                :min="minDate"
                variant="outlined"
                dense
                class="mt-2"
            />

            <div
                class="d-flex flex-row mt-4 justify-center" style="gap: 16px;">
              <v-btn @click="onSaveDeliveryDate"
                     :disabled="!newDeliveryDate"
                     color="primary">
                Save
              </v-btn>

              <v-btn @click="showDeliveryPopup = false"
                     color="secondary">
                Cancel
              </v-btn>
            </div>

          </v-card>
        </v-col>

      </v-row>
    </div>
  </v-card>
</template>

<style scoped>

</style>
