<script setup>
</script>

<template>
  <main-layout>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8" lg="6">
            <h1 class="text-h4 font-weight-bold mb-4">Вітаю!</h1>
            <h3 class="text-h6 mb-4">Права доступу доступні для таких користувачів:</h3>

            <v-list>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">admin</v-list-item-title>
                <v-list-item-subtitle>
                  Email: admin@admin.com - Password: adminadmin
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title class="font-weight-bold">sales</v-list-item-title>
                <v-list-item-subtitle>
                  Email: sales@sales.com - Password: salessales
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title class="font-weight-bold">worker</v-list-item-title>
                <v-list-item-subtitle>
                  Email: worker@worker.com - Password: workerworker
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
  </main-layout>
</template>

<style scoped>

</style>