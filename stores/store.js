import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserInfoStore = defineStore(
  'userInfo',
  () => {
    const userInfo = ref({})

    const setUserInfo = (info) => {
      userInfo.value = info
    }

    const removeUserInfo = () => {
      userInfo.value = {}
    }

    const isEmpty = () => {
      return Object.keys(userInfo.value).length === 0
    }

    return {
      userInfo,
      setUserInfo,
      removeUserInfo,
      isEmpty
    }
  },
  {
    unistorage: true //持久化存储
  }
)
