<script setup>
import { useCustomersStore } from "../../stores/customers.js";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import CustomerItem from "./CustomerItem.vue";

const router = useRouter();

const customersStore = useCustomersStore();
const customersList = computed(() => customersStore.getItemsList ?? []);

const filterText = ref("");

const filteredCustomers = computed(() => {
  if (!filterText.value) return customersList.value;
  return customersList.value.filter(customer =>
      customer.name.toLowerCase().includes(filterText.value.toLowerCase())
  );
});

function onAdd() {
  router.push({ name: "customerEdit" });
}
</script>

<template>
  <v-container>
    <v-row class="mb-4" align="center" justify="space-between">
      <v-col cols="auto">
        <h1 class="text-h5 font-weight-bold">Customers List</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="onAdd" elevation="2">
          Add Customer
        </v-btn>
      </v-col>
    </v-row>

    <v-container>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
              v-model="filterText"
              label="Search by name"
              append-icon="mdi-magnify"
              clearable
              variant="outlined"
          />
        </v-col>
      </v-row>
    </v-container>

    <v-container class="pa-0">
      <div class="d-flex flex-column gap-4">
        <template v-if="filteredCustomers.length">
          <customer-item
              v-for="customer in filteredCustomers"
              :key="customer.id"
              :customer="customer"
          />
        </template>

        <v-alert v-else type="info" text>
          No customers found...
        </v-alert>
      </div>
    </v-container>
  </v-container>
</template>

<style scoped>
.d-flex {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
