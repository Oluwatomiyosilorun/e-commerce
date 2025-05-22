<template>
  <div class="border rounded-2xl p-4 shadow-soft flex flex-col">
    <img :src="product.image" :alt="product.title" class="h-48 object-contain mb-4" />
    <h2 class="font-semibold">{{ product.title }}</h2>
    <p class="text-sm text-gray-500">{{ product.category }}</p>
    <p class="mt-auto font-bold">${{ product.price.toFixed(2) }}</p>
    <div class="mt-2 flex items-center">
      <input
        type="number"
        v-model.number="qty"
        :max="product.stock"
        min="1"
        class="border p-1 w-16 text-center"
      />
      <button
        :disabled="product.stock === 0 || qty === 0"
        @click="addToCart"
        class="ml-2 px-3 py-1 bg-blue-600 text-white rounded-xl disabled:opacity-50"
      >
        Add to Cart
      </button>
    </div>
    <p v-if="product.stock === 0" class="text-red-500 text-sm mt-1">Out of stock</p>
    <p v-else-if="qty > product.stock" class="text-orange-500 text-sm mt-1">
      Only {{ product.stock }} left in stock
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue' 
import { useCartStore } from '~/stores/cart'
import type { Product } from './types' // Adjust the import path as necessary
import { defineProps } from 'vue' // Import defineProps from Vue
import type { CartItem } from '~/stores/cart' // Adjust the import path as necessary

const props = defineProps<{ product: Product }>() // Assign defineProps to a variable

const qty = ref(1)
const cart = useCartStore()

// Watch for changes in qty and ensure it doesn't exceed product.stock
watch(qty, (newVal) => {
  if (newVal > props.product.stock) {
    qty.value = props.product.stock
  }
  if (newVal < 1) { // Ensure quantity doesn't go below 1
    qty.value = 1
  }
})

function addToCart() {
  // Ensure we are adding a valid quantity and the product is in stock
  if (qty.value > 0 && qty.value <= props.product.stock) {
    cart.add({
      id: props.product.id,
      title: props.product.title,
      price: props.product.price,
      qty: qty.value
    })
    qty.value = 1 // Reset quantity after adding to cart
  } else {
    // Optionally, provide user feedback if the quantity is invalid
    console.warn('Invalid quantity or product out of stock.')
  }
}
</script>