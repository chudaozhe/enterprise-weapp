import http from '@/utils/ajax'
import { useUserInfoStore } from '@/stores/store'
/**
 * 获取用户id
 */
const getUserId = () => {
  const { userInfo: user } = useUserInfoStore()
  return user.id ?? 0
}

export async function get(id) {
  return http.get('/user/' + getUserId() + '/page/' + id, {})
}
