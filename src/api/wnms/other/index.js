import request from '@/assets/wnms/utils/request'
import {
  ifms
} from '@/api/wnms//msgManage/commonUrl'

// 获取全部部门列表
export function getDeptList() {
  return request({
    url: `${ifms}/web-org/depts`,
    method: 'get',
  })
}

export function getHealthCareList(deptId) {
  return request({
    url: `${ifms}/app-org/emps/${deptId}`,
    method: 'get',
  })
}
