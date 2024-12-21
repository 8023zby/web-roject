import request from '@/assets/wnms/utils/request'
import {
    ifms,
    wnms,
  tdms
} from '@/api/wnms/msgManage/commonUrl'

//获取房间列表
export function roomList(deptId) {
    return request({
        url: `${ifms}/web-org/rooms?size=1000&page=1&pageHelper=1&deptId=${deptId}`,
        method: 'GET'
    })
}

//获取房间绑定的门灯列表
export function roomLampList(deptId){
    return request({
        url:`${wnms}/web-wn/bedDoorLight?nurseUnitId=${deptId}`,
        method:"GET"
    })
}

//保存房间绑定的门灯列表
export function saveRoomLampList(data){
    return request({
        url:`${wnms}/web-wn/bedDoorLight`,
        method:"POST",
        data
    })
}

//获取护理级别对应门灯颜色
export function doorLight(deptId, orgId){
    return request({
        url:`${tdms}/web-wn/systemConfig/doorLight?nurseUnitId=${deptId}&orgId=${orgId}`,
        method:"GET"
    })
}

//保存护理级别对应门灯颜色
export function saveDoorLight(data){
    return request({
        url:`${tdms}/web-wn/systemConfig/doorLight`,
        method:"POST",
        data
    })
}
