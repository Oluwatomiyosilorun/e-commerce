<template>
  <div>
    <div class="flex space-x-4 mb-4">
      <input v-model="search" placeholder="Search…" class="border p-2 flex-1" />
      <div>
        <label>Min:</label>
        <input type="number" v-model.number="min" class="border p-1 w-20" />
        <label class="ml-2">Max:</label>
        <input type="number" v-model.number="max" class="border p-1 w-20" />
      </div>
      <NuxtLink to="/cart" class="px-4 py-2 bg-green-600 text-white rounded-xl">
        Cart ({{ cart.items.length }})
      </NuxtLink>
    </div>

    <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <ProductCard
        v-for="p in filtered"
        :key="p.id"
        :product="p"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '~/stores/products'
import { useCartStore } from '~/stores/cart'
import ProductCard from '~/components/ProductCard.vue'

const search = ref('')
const min = ref(0)
const max = ref(1000)

const products = useProductStore()
const cart = useCartStore()

onMounted(() => {
  products.fetchAll()
})

const filtered = computed(() =>
  products.items.filter(p => {
    const matchText = [p.title, p.category].some(f => f.toLowerCase().includes(search.value.toLowerCase()))
    const matchPrice = p.price >= min.value && p.price <= max.value
    return matchText && matchPrice
  })
)
</script>
