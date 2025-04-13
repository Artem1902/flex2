<script setup>
import {useRouter} from "vue-router";

const props = defineProps({
  customer: {
    type: Object,
    required: true
  }
})

const router = useRouter()

function onDetails(){
  router.push({
    name: 'customerDetail',
    params: {id: props['customer'].id}
  })
}

function onOrder(){
  router.push({
    name: 'newOrder',
    params: {id: props['customer'].id}
  })
}


</script>

<template>
  <div>
    <span>Title: {{ customer.name }}</span>
    <button @click='onDetails'>Details</button>
    <button @click='onOrder'>Place an order</button>
  </div>
</template>

<style scoped>

</style>