import { defineStore } from 'pinia'
import getStoreTemplate from './helpers/storeTemplate'
import { useGeneralStore } from './general'

export const useProductsStore = defineStore('products', () => {
    const generalStore = useGeneralStore()
    const { generalApiOperation } = generalStore

    return getStoreTemplate('products', generalApiOperation)
})
