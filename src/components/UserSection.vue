<script setup>
import {useAuthStore} from "../stores/auth.js";
import {computed} from "vue";

const authStore = useAuthStore()
const user = computed(() => authStore.getUser)

import {useRouter} from 'vue-router'

const router = useRouter()

function onLogin() {
  router.push({
    name: 'login'
  })
}

function onLogout() {
  authStore.logOut()
  router.push({
    name: 'login'
  })
}
</script>

<template>
  <template v-if="user">
    <span>{{ user.displayName ?? user.email }}</span>
    <v-btn @click="onLogout" icon>
      <font-awesome-icon
          :icon="['fas', 'right-from-bracket']"/>
    </v-btn>
  </template>
  <v-btn v-else @click="onLogin">
    <font-awesome-icon :icon="['fas', 'right-to-bracket']"/>
  </v-btn>
</template>


<style scoped>

</style>