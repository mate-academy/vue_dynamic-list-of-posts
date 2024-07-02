import type { CustomPost } from '@/types/CustomPost'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: useLocalStorage<CustomPost[]>('posts', [])
  })
})
