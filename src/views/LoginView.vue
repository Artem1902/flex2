<script setup>
import {ref, computed} from 'vue'
import {useAuthStore} from '../stores/auth'
import {useRouter} from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const email = ref(null)
const password = ref(null)

const isDataValid = computed(() => {
  return email.value && password.value
})

const {
  signUpWithEmailAndPassword, // исправлено
  signInWithEmailAndPassword,
  loginWithGoogleAccount
} = authStore

function registerWithEmailAndPassword(email, password) {
  signUpWithEmailAndPassword(email, password).then(() => {
    router.push({name: 'home'})
  })
}

function loginWithEmailAndPassword(email, password) {
  signInWithEmailAndPassword(email, password).then(() => {
    router.push({name: 'home'})
  })
}

function loginWithGoogle() {
  loginWithGoogleAccount().then(() => {
    router.push({name: 'home'})
  })
}
</script>


<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="text-h5">Login</v-card-title>

          <v-form @submit.prevent="loginWithEmailAndPassword(email, password)" v-model="isDataValid">
            <v-text-field
                v-model="email"
                label="Email"
                type="email"
                placeholder="Email"
                :rules="[emailRules]"
                required
                variant="solo"
            ></v-text-field>

            <v-text-field
                v-model="password"
                label="Password"
                type="password"
                placeholder="Password"
                :rules="[passwordRules]"
                required
                variant="solo"
            ></v-text-field>

            <v-btn
                :disabled="!isDataValid"
                type="submit"
                color="primary"
                block
            >
              Login
            </v-btn>
          </v-form>

          <v-divider class="my-3"></v-divider>

          <v-btn
              @click="registerWithEmailAndPassword(email, password)"
              :disabled="!isDataValid"
              color="secondary"
              block
          >
            Register
          </v-btn>

          <v-divider class="my-3"></v-divider>

          <v-btn @click="loginWithGoogle" color="google" block>
            Login with Google
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
</style>
