<script setup>
import {useForm} from 'vee-validate'
import * as yup from 'yup'
import {computed, onMounted, ref} from 'vue'
import {useCustomersStore} from '../../stores/customers.js'
import {useRouter} from "vue-router";

const props = defineProps({
  id: String,
})

const router = useRouter()

const customersStore = useCustomersStore()

const {
  errors,
  handleSubmit,
  defineField,
  resetForm,
} = useForm({
  validationSchema: yup.object({
    email: yup.string().email('Invalid email').required('Email required'),
    name: yup.string().min(2, 'Minimum 2 characters').required('Name required'),
  }),
})

const [email, emailAttrs] = defineField('email')
const [name, nameAttrs] = defineField('name')

const headerTitle = computed(() => (props.id ? 'Update customer details' : 'Add a new customer'))
const btnTitle = computed(() => (props.id ? 'Update Customer' : 'Add Customer'))

async function onSubmit(values) {
  if (props.id) {
    await customersStore.updateItem(props.id, values)
  } else {
    await customersStore.addItem(values)
  }
  await router.push({name: 'customers'})
}

const handleFormSubmit = handleSubmit(onSubmit)

async function onDelete() {
  if (confirm(`Are you sure you want to delete ${name.value || 'this customer'}?`)) {
    await customersStore.deleteItem(props.id)
    await router.push({name: 'customers'})
  }
}

const onReset = () => {
  resetForm({
    values: {
      name: '',
      email: '',
    },
    errors: {},
  })
}

const nameRef = ref(null);

onMounted(async () => {
  if (props.id) {
    const loaded = await customersStore.loadItemById(props.id)
    resetForm({
      values: {
        name: loaded.name,
        email: loaded.email,
      },
      errors: {},
    })
  } else {
    nameRef.value?.focus();
  }
})
</script>

<template>
  <main-layout>
    <v-container>
      <h1 class="text-h5 font-weight-bold mt-4">{{ headerTitle }}</h1>

      <v-form @submit.prevent="handleFormSubmit" class="mt-4">
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
                v-model="name"
                label="Name"
                :error-messages="errors.name"
                v-bind="nameAttrs"
                id="name"
                ref="nameRef"
                variant="outlined"
            />
          </v-col>
          <v-col cols="12" sm = '4'>
            <v-text-field
                v-model="email"
                label="Email"
                type="email"
                :error-messages="errors.email"
                v-bind="emailAttrs"
                id="email"
                variant="outlined"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="auto">
            <v-btn type="submit" color="primary">{{ btnTitle }}</v-btn>
          </v-col>

          <v-col cols="auto">
            <v-btn type="button" @click="onReset" color="secondary">
              Reset Form
            </v-btn>
          </v-col>

          <v-col cols="auto" v-if="props.id">
            <v-btn
                type="button"
                @click="onDelete"
                color="error"
                class="ml-2"
            >
              Delete Customer
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </main-layout>
</template>
