<template>
  <div class="p-4 max-w-5xl mx-auto">
    <!-- Search & Controls -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <!-- Text search -->
      <input
        v-model="search"
        placeholder="Search…"
        class="w-full sm:w-1/3 border rounded-lg p-2 focus:ring focus:outline-none"
      />

      <!-- Price range -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-2">
        <div class="flex items-center gap-2">
          <label for="min" class="whitespace-nowrap">Min:</label>
          <input
            id="min"
            type="number"
            v-model.number="min"
            class="w-full sm:w-20 border rounded-lg p-2 focus:ring focus:outline-none"
          />
        </div>
        <div class="flex items-center gap-2">
          <label for="max" class="whitespace-nowrap">Max:</label>
          <input
            id="max"
            type="number"
            v-model.number="max"
            class="w-full sm:w-20 border rounded-lg p-2 focus:ring focus:outline-none"
          />
        </div>
      </div>

      <!-- Cart button -->
      <NuxtLink
        to="/cart"
        class="block text-center sm:inline-block px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
      >
        Cart ({{ cart.items.length }})
      </NuxtLink>
    </div>

    <!-- Product grid -->
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
  if (!products.items.length) {
    products.fetchAll()
  }
})

const filtered = computed(() =>
  products.items.filter((p: { title: string; category: string; price: number }) => {
    const textMatch =
      p.title.toLowerCase().includes(search.value.toLowerCase()) ||
      p.category.toLowerCase().includes(search.value.toLowerCase())
    const priceMatch = p.price >= min.value && p.price <= max.value
    return textMatch && priceMatch
  })
)
</script>
