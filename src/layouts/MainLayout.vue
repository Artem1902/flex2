<template>
  <div class="container">
    <div class="header">
      <router-link :to="{name:'home'}">Home</router-link> |
      <router-link :to="{name:'customers'}">Customers</router-link> |
      <router-link :to="{name:'orders'}">Orders</router-link> |
      <router-link :to="{name:'production'}">Production</router-link> |
      <router-link :to="{name:'materials'}">Materials</router-link>
    </div>
    <div class="main">
      <loading-view v-if="isLoading"/>
      <error-view v-else-if="hasError"/>
      <template v-else>
        <slot></slot>
      </template>
    </div>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>


import {useGeneralStore} from '../stores/general.js'
import {storeToRefs} from 'pinia'
import LoadingView from "../components/LoadingView.vue";
import ErrorView from "../components/ErrorView.vue";

const generalStore = useGeneralStore()
const {isLoading, hasError} = storeToRefs(generalStore)

</script>

<style lang="scss" scoped>
</style>
