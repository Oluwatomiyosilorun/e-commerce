import { defineStore } from 'pinia'
import { useProductStore } from './products'

export interface CartItem {
  id: number
  title: string
  price: number
  qty: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[]
  }),
  getters: {
    total: (state) => state.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  },
  actions: {
    add(item: CartItem) {
      const ex = this.items.find(i => i.id === item.id)
      if (ex) ex.qty = Math.min(ex.qty + item.qty, ex.qty + item.qty) 
      else this.items.push(item)
    },
    checkout() {
      const ps = useProductStore()
      this.items.forEach(i => ps.reduceStock(i.id, i.qty))
      this.items = []
    }
  }
})
