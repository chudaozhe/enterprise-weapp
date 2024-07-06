import http from '@/utils/ajax'
import { useUserInfoStore } from '@/stores/store'
/**
 * 获取用户id
 */
const getUserId = () => {
  const { userInfo: user } = useUserInfoStore()
  return user.id ?? 0
}

/**
 * 列表
 * @param page
 * @param per_page
 * @returns {Promise.<*>}
 */
export async function gets(page, per_page) {
  return http.get('/qa/questions', {
    page,
    per_page
  })
}
