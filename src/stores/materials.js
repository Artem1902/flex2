import { defineStore } from 'pinia'
import getStoreTemplate from './helpers/storeTemplate'
import { useGeneralStore } from './general'

export const useInventoryStore = defineStore('inventory', () => {
    const generalStore = useGeneralStore()
    const { generalApiOperation } = generalStore

    return getStoreTemplate('inventory', generalApiOperation)
})
