<script setup>
import {workersList} from "../../constants/workersList.js";
import {computed, ref} from "vue";
import {useOrdersStore} from "../../stores/orders.js";

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

const ordersStore = useOrdersStore()

const localOrder = ref(JSON.parse(JSON.stringify(props.order)))

const minDate = new Date().toISOString().split("T")[0]
const deliveryDate = ref(null)

const isSubmitDisabled = computed(() => {
  return (
      !deliveryDate.value ||
      localOrder.value.order.some(item => !item.worker)
  );
})

async function onSubmit() {
  const updatedOrder = {
    ...localOrder.value,
    deliveryDate: deliveryDate.value,
    allStatus: 'assigned',
    order: localOrder.value.order.map(product => ({
      ...product,
      status: 'in_progress'
    }))
  }
  await ordersStore.updateItem(localOrder.value.id, updatedOrder)
  await ordersStore.loadItemsList()
  deliveryDate.value = null
}

async function onCancel() {
  if (confirm('Are you sure you want to cancel this order?')) {
    await ordersStore.deleteItem(localOrder.value.id)
  }
}
</script>

<template>
  <v-card class="pa-4" elevation="2">
    <div
        class="d-flex flex-column">
      <!-- Имя клиента -->
      <v-card-title class="text-h6 pa-0">
        Customer: {{ localOrder.customer }}
      </v-card-title>

      <!-- Список товаров -->
      <v-row class="mt-2">
        <v-col v-for="(item, index) in localOrder.order"
               :key="index" cols="12">
          <v-card class="pa-4" elevation="1">
            <v-row
                class="d-flex justify-space-between align-center">
              <v-col cols="12" sm="9">
                <v-card-title>{{ item.title }} -
                  {{ item.quantity }}
                </v-card-title>
              </v-col>

              <v-col cols="12" sm="3">
                <v-select
                    v-model="item.worker"
                    :items="workersList"
                    label="Select Worker"
                    item-value="name"
                    item-text="name"
                    variant="outlined"
                    dense
                />
              </v-col>
            </v-row>
          </v-card>
        </v-col>


        <!--            <select v-model="item.worker">-->
        <!--              <option disabled value="">Select worker</option>-->
        <!--              <option v-for="worker in workersList"-->
        <!--                      :key="worker.id" :value="worker.name">-->
        <!--                {{ worker.name }}-->
        <!--              </option>-->
        <!--            </select>-->

        <!-- Дата доставки -->

        <v-col cols="12" sm="6">
          <v-text-field
              v-model="deliveryDate"
              label="Delivery Date"
              type="date"
              :min="minDate"
              variant="solo"/>
        </v-col>


        <!-- Кнопки отправки и отмены -->

        <v-col>
          <v-btn
              :disabled="isSubmitDisabled"
              @click="onSubmit()"
              color="primary"
              elevation="2"
              block
          >
            Submit Order
          </v-btn>
          <v-btn
              @click="onCancel"
              color="error"
              elevation="2"
              block
              class="mt-2"
          >
            Cancel Order
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>
<style scoped>

</style>
