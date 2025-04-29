<script setup>
import {onMounted, ref} from "vue";
import {useCustomersStore} from "../../stores/customers.js";
import {useRouter} from "vue-router";
import MainLayout from "../../layouts/MainLayout.vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const router = useRouter()

const customersStore = useCustomersStore()

const customerInfo = ref({})

function onEdit() {
  router.push({
    name: 'customerEdit',
    params: {id: props.id}
  })
}

function onBack() {
  router.push({name: 'customers'})
}

onMounted(async () => {
      if (props.id) {
        customerInfo.value = await customersStore.loadItemById(props.id)
      }
    }
)
</script>

<template>
  <main-layout>
    <v-container>
      <div v-if="customerInfo.name">
        <h1 class="text-h5 font-weight-bold">Customer Info</h1>
        <v-row>
          <v-col cols="12">
            <div><strong>Name:</strong> {{ customerInfo.name }}</div>
            <div><strong>Email:</strong> {{ customerInfo.email }}</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="auto">
            <v-btn color="primary" @click="onBack">Back</v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn color="secondary" @click="onEdit">Edit</v-btn>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <p>Customer not found.</p>
        <v-btn color="primary" @click="onBack">Back</v-btn>
      </div>
    </v-container>
  </main-layout>
</template>

<style scoped>

</style>