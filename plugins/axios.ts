import axios from 'axios'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  const api = axios.create({
    baseURL: 'https://fakestoreapi.com',
    // you could also add interceptors here for auth, error handling, etc.
  })
  return {
    provide: {
      api
    }
  }
})
