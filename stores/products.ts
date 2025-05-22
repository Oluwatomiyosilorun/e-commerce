import { defineStore } from 'pinia'
import type { Product } from './types'

export const useProductStore = defineStore('products', {
  state: () => ({
    items: [] as Product[],
    loading: false,
  }),
  actions: {
    async fetchAll() {
      this.loading = true
      const { data } = await useNuxtApp().$api.get<Product[]>('/products')
      // add 2.2% and random stock
      this.items = data.map(p => ({
        ...p,
        price: +(p.price * 1.022).toFixed(2),
        stock: Math.floor(Math.random() * 10) + 1
      }))
      this.loading = false
    },
    reduceStock(id: number, qty: number) {
      const prod = this.items.find(p => p.id === id)
      if (prod) prod.stock = Math.max(0, prod.stock - qty)
    }
  }
})
