<template>
  <div class="max-w-4xl mx-auto p-6">
    <NuxtLink to="/" class="text-blue-600 hover:underline mb-4 inline-block">← Back to Shop</NuxtLink>
    <h1 class="text-3xl font-semibold mb-6">Your Cart</h1>

    <div v-if="cart.items.length === 0" class="text-gray-600">
      Your cart is empty.
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="item in cart.items"
        :key="item.id"
        class="flex flex-col sm:flex-row items-center sm:items-start bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <img
          :src="getImage(item.id)"
          alt="Product image"
          class="w-16 h-16 object-cover rounded m-auto"
        />
        <div class="flex-1 p-4">
          <h2 class="text-xl font-medium">{{ item.title }}</h2>
          <p class="text-gray-500">{{ '$' + item.price.toFixed(2) }}</p>
          <div class="flex items-center space-x-2 mt-2">
            <button
              @click="decrease(item.id)"
              :disabled="item.qty <= 1"
              class="px-2 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              –
            </button>
            <span class="w-8 text-center">{{ item.qty }}</span>
            <button
              @click="increase(item.id)"
              class="px-2 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              +
            </button>
          </div>
        </div>

        <div class="p-4 text-center">
          <p class="text-lg font-semibold">{{ '$' + (item.price * item.qty).toFixed(2) }}</p>
          <button
            @click="remove(item.id)"
            class="mt-2 text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      </div>

      <!-- Summary & Checkout -->
      <div
        class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center"
      >
        <div class="text-center sm:text-left mb-4 sm:mb-0">
          <p>Total Items: <span class="font-bold">{{ totalItems }}</span></p>
          <p class="text-2xl font-bold">{{ '$' + cart.total.toFixed(2) }}</p>
        </div>
        <button
          @click="openModal"
          class="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow hover:shadow-lg transition"
        >
          Checkout
        </button>
      </div>
    </div>

    <!-- Payment Modal -->
    <div
      v-if="state.showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 class="text-2xl font-semibold mb-4">Enter Card Details</h2>
        <form @submit.prevent="confirmPayment" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Cardholder Name</label>
            <input
              v-model="state.card.name"
              type="text"
              required
              class="w-full border rounded-lg p-2 focus:outline-none focus:ring"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Card Number</label>
            <input
              v-model="state.card.number"
              type="text"
              maxlength="19"
              placeholder="xxxx xxxx xxxx xxxx"
              required
              class="w-full border rounded-lg p-2 focus:outline-none focus:ring"
            />
          </div>
          <div class="flex space-x-4">
            <div class="flex-1">
              <label class="block text-sm font-medium mb-1">Expiry Date</label>
              <input
                v-model="state.card.expiry"
                type="text"
                placeholder="MM/YY"
                maxlength="5"
                required
                class="w-full border rounded-lg p-2 focus:outline-none focus:ring"
              />
            </div>
            <div class="w-24">
              <label class="block text-sm font-medium mb-1">CVV</label>
              <input
                v-model="state.card.cvv"
                type="password"
                maxlength="4"
                required
                class="w-full border rounded-lg p-2 focus:outline-none focus:ring"
              />
            </div>
          </div>
          <div class="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Confirm Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cart'
import { useProductStore } from '~/stores/products'

const cart = useCartStore()
const products = useProductStore()
const router = useRouter()

onMounted(() => {
  if (products.items.length === 0) {
    products.fetchAll()
  }
})

const totalItems = computed(() =>
  cart.items.reduce((sum: any, i: { qty: any }) => sum + i.qty, 0)
)

// Unified reactive state for modal & card
const state = reactive({
  showModal: false,
  card: { name: '', number: '', expiry: '', cvv: '' }
})

function openModal() {
  state.showModal = true
}
function closeModal() {
  state.showModal = false
}

function getImage(id: number): string {
  const prod = products.items.find((p: { id: number }) => p.id === id)
  return prod ? prod.image : ''
}

function increase(id: number) {
  cart.add({ id, title: '', price: 0, qty: 1 })
}

function decrease(id: number) {
  cart.add({ id, title: '', price: 0, qty: -1 })
}

function remove(id: number) {
  cart.items = cart.items.filter((i: { id: number }) => i.id !== id)
}

function confirmPayment() {
  cart.checkout()
  closeModal()
  router.push('/')
}
</script>
