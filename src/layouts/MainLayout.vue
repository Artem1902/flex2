<script setup>


import {useGeneralStore} from '../stores/general.js'
import {storeToRefs} from 'pinia'
import LoadingView from "../components/LoadingView.vue";
import ErrorView from "../components/ErrorView.vue";
import MainMenu from "../components/MainMenu.vue";
import UserSection from "../components/UserSection.vue";

const generalStore = useGeneralStore()
const {isLoading, hasError} = storeToRefs(generalStore)

</script>

<template>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>LOGO</v-toolbar-title>
      <v-spacer />
      <main-menu />
      <v-spacer />
      <UserSection />
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <LoadingView v-if="isLoading" />
        <ErrorView v-else-if="hasError" />
        <template v-else>
          <slot></slot>
        </template>
      </v-container>
    </v-main>
</template>




<style lang="scss" scoped>
</style>
