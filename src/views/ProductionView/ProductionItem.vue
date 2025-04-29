<script setup>
import { reactive, computed} from 'vue'

const props = defineProps({
  orders: Object,
  chosenWorker: String
})
const emit = defineEmits(['done'])

const showDonePopup = reactive({})
const madeToday = reactive({})

const filteredItems = computed(() => {
  if (!props.chosenWorker) return props.orders.order
  return props.orders.order.filter(
      item => item.worker?.toLowerCase() === props.chosenWorker.toLowerCase()
  )
})

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

const getLeft = (item) => item.quantity - (item.done || 0)

const isValid = (item) => {
  const val = madeToday[item.title] ?? 0
  return val >= 1 && val <= getLeft(item)
}

const saveMade = (item) => {
  const doneToAdd = madeToday[item.title]
  if (!doneToAdd) return

  emit('done', {
    orderId: props.orders.id,
    itemId: item.id,
    quantity: doneToAdd
  })

  madeToday[item.title] = 0
  showDonePopup[item.title] = false
}
</script>

<template>
  <v-card
      v-for="item in filteredItems"
      :key="item.id"
      class="mb-4 pa-4"
      elevation="2"
  >
    <div class="d-flex flex-column gap-2">
      <v-card-title class="text-h6 pa-0">
        Customer: {{ orders.customer }}
      </v-card-title>

      <v-row>
        <v-col cols="12">
          <div class="text-subtitle-1 font-weight-medium">
            {{ item.title }} — <span class="text-uppercase">{{ item.status }}</span>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="4">
          <v-chip color="primary" variant="outlined" class="ma-1">
            Ordered: {{ item.quantity }}
          </v-chip>
        </v-col>
        <v-col cols="12" sm="4">
          <v-chip color="green" variant="outlined" class="ma-1">
            Done: {{ item.done || 0 }}
          </v-chip>
        </v-col>
        <v-col cols="12" sm="4">
          <v-chip color="orange" variant="outlined" class="ma-1">
            Left: {{ getLeft(item) }}
          </v-chip>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="4">
          <span class="text-caption">Order date:</span>
          <div class="font-weight-medium">{{ orders.orderDate }}</div>
        </v-col>
        <v-col cols="12" sm="4">
          <span class="text-caption">Delivery:</span>
          <div class="font-weight-medium">{{ orders.deliveryDate }}</div>
        </v-col>
        <v-col cols="12" sm="4">
          <v-chip color="red" class="font-weight-bold">
            {{ getDeliveryText(orders.deliveryDate) }}
          </v-chip>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-alert type="info" border="start" density="compact">
            Status of the entire order: <strong>{{ orders.allStatus }}</strong>
          </v-alert>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" sm="4">
          <v-btn color="success" block @click="showDonePopup[item.title] = true">
            Done
          </v-btn>
        </v-col>
      </v-row>


      <v-expand-transition>
        <div v-if="showDonePopup[item.title]" class="mt-4">
          <v-card class="pa-3" outlined>
            <h4 class="text-subtitle-1 mb-3">Items made today</h4>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                    v-model.number="madeToday[item.title]"
                    type="number"
                    label="Quantity"
                    :min="1"
                    :max="getLeft(item)"
                    :error="!isValid(item)"
                    :error-messages="!isValid(item) ? [`Enter a value between 1 and ${getLeft(item)}`] : []"
                    dense
                    variant="outlined"
                />
              </v-col>

              <v-col cols="12" sm="6" class="d-flex align-center">
                <v-btn
                    color="primary"
                    class="flex-grow-1 me-2"
                    @click="saveMade(item)"
                    :disabled="!isValid(item)"
                >
                  Save
                </v-btn>
                <v-btn
                    variant="outlined"
                    class="flex-grow-1"
                    @click="showDonePopup[item.title] = false"
                >
                  Cancel
                </v-btn>
              </v-col>
            </v-row>

          </v-card>
        </div>
      </v-expand-transition>
    </div>
  </v-card>
</template>
