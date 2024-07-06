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
 * @param keyword
 * @param page
 * @param max
 * @returns {Promise.<*>}
 */
export async function gets(category_id, keyword, page, max) {
  return http.get('/user/' + getUserId() + '/category/' + category_id + '/cases', {
    keyword: keyword,
    page: page,
    max: max
  })
}

export async function get(id) {
  return http.get('/user/' + getUserId() + '/cases/' + id, {})
}
