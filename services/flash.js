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
  return http.get('/user/' + getUserId() + '/flash', {
    keyword: keyword,
    page: page,
    max: max
  })
}
