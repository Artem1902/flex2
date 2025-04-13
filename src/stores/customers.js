import { defineStore } from 'pinia'
import getStoreTemplate from './helpers/storeTemplate'
import { useGeneralStore } from './general'

export const useCustomersStore = defineStore('customers', () => {
    const generalStore = useGeneralStore()
    const { generalApiOperation } = generalStore

    return getStoreTemplate('customers', generalApiOperation)
})
