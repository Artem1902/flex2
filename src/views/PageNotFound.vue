<script setup>

import MainLayout from "../layouts/MainLayout.vue";
</script>

<template>
  <main-layout>
    <v-container
        class="fill-height d-flex align-center justify-center">
      <div class="text-center">
        <h1 class="text-h2 mb-4">404</h1>
        <p class="text-subtitle-1 mb-6">Page Not Found</p>
        <v-btn color="primary" to="/">
          Go Home
        </v-btn>
      </div>
    </v-container>
  </main-layout>
</template>


<style scoped>

</style>