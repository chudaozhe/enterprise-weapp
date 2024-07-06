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
 * @param category_id
 * @param page
 * @param max
 * @returns {Promise.<*>}
 */
export async function gets(category_id, page, max) {
  return http.get('/user/' + getUserId() + '/category/' + category_id + '/article', {
    page: page,
    max: max
  })
}

export async function get(id) {
  return http.get('/user/' + getUserId() + '/article/' + id, {})
}
