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
    <h1>{{ headerTitle}}</h1>
    <form @submit="handleFormSubmit">
      <div>
        <label for="name">Name:</label>
        <input type="text" v-model="name"
               v-bind="nameAttrs"
               id="name"
               ref="nameRef"/>
        <div v-if="errors.name">{{ errors.name }}</div>
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email"
               v-bind="emailAttrs" id='email'/>
        <div v-if="errors.email">{{ errors.email }}</div>
      </div>
      <button type="submit">{{ btnTitle }}</button>
      <button type="button" @click="onReset">Reset Form
      </button>
      <button v-if="props.id" type="button"
              @click='onDelete'>Delete
        Customer
      </button>
    </form>
  </main-layout>
</template>
