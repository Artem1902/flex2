import { defineStore } from 'pinia'
import getStoreTemplate from './helpers/storeTemplate'
import { useGeneralStore } from './general'

export const useOrdersStore = defineStore('orders', () => {
    const generalStore = useGeneralStore()
    const { generalApiOperation } = generalStore

    return getStoreTemplate('orders', generalApiOperation)
})
