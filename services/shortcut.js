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
 * @param max
 * @returns {Promise.<*>}
 */
export async function gets(page, max) {
  return http.get('/user/' + getUserId() + '/shortcut', {
    page: page,
    max: max
  })
}
