import axios from 'axios';
import request from '@/assets/wnms/utils/request';
import {
  wnms,
  bnms,
  hpms,
  nsms,
  tdms
} from '@/api/wnms/msgManage/commonUrl';

const BASE_URL = `${tdms}/web-wn`;
const SYSTEMCONFIG_URL = BASE_URL + `/systemConfig`;

export function getPatinetLable (params) {
  return request({
    url: `${bnms}//app-bn/patient-in-view-list/pad-patient-label`,
    method: 'get',
    params
  });
}
// 获取医护信息
export function getcurrentDept (params) {
  return request({
    url: '/ifms/web-org/emp/currentDeptByMode',
    method: 'get',
    params
  });
}

// 获取配置列表
export function fetchSystemConfig (params) {
  return request({
    url: SYSTEMCONFIG_URL,
    method: 'GET',
    params
  });
}

// 获取配置详情
export function fetchSystemConfigDetails (deviceType, params = {
  orgId: '', // 机构ID
  nurseUnitId: '', // 护理单元ID
  deviceTypeId: '' //  设备ID
}) {
  return request({
    url: `${SYSTEMCONFIG_URL}/${deviceType}`,
    method: 'GET',
    params
  });
}

// 保存配置
// /web-wn/systemConfig/accessControl 门禁
// /web-wn/systemConfig/bedHead 床头
// /web-wn/systemConfig/bedSide 床旁
// /web-wn/systemConfig/doorway 门口机
// /web-wn/systemConfig/host 主机
// /web-wn/systemConfig/dutyRoom 值班室
// /web-wn/systemConfig/other 其他配置
// /web-wn/systemConfig/visit 探视分机
export function addSystemConfig (data, device) {
  return request({
    url: `${SYSTEMCONFIG_URL}/${device}`,
    method: 'POST',
    data
  });
}

// 重启分机
export function reboot (data) {
  return request({
    url: SYSTEMCONFIG_URL + `/broad`,
    method: 'POST',
    data
  });
}

/**
* ------------------------------------------------------------------
* i系列分机配置
* ------------------------------------------------------------------
*/

// 获取配置列表
export const fetchDeviceConfig = async (deviceType, params) => {
  return request({
    url: `${tdms}/app-wn/deviceConfig/${deviceType}`,
    method: 'GET',
    params
  });
};
// 保存配置
export function addDeviceConfig (data, deviceType) {
  return request({
    url: `/iems/app-iems/config/${deviceType}`,
    method: 'POST',
    data
  });
}

/**
 * 下发模板
 *
 * @export
 * @param {*} params {
 *  deptId
 *  deviceIds: 设备Id
 *  deviceModel: 设备型号
 *  deviceType: 设备类型
 *  templateId: 模板id
 * }
 * @param {*} deviceType iBedHeadExtension 床头 iDoorWayExtension 门口机
 * @return {*}
 */
export function setTemplate (params) {
  return request({
    url: `/iems/app-iems/template/setTemplate/template`,
    method: 'GET',
    params,
    timeout: 3000,
    customTimeout: true
  });
}

export function getTemplate (deviceType) {
  return request({
    url: `${wnms}/web-wn/deviceConfig/getTemplateSession/${deviceType}`,
    method: 'GET'
  });
}

/**
 * @description 根据deptId获取模板详情
 * @export
 * @param {*} params {
 *  deptId
 *  deviceType
 * }
 * @return {*} 
 */
export function getTemplateByDeptId (params) {
  return request({
    url: `/iems/app-iems/template/getTemplateByDeptId`,
    method: 'GET',
    params
  })
}

export function getTemplateByDeviceId (params) {
  return request({
    url: `/iems/app-iems/template/getTemplateDeviceId`,
    method: 'GET',
    params
  })
}


export function uploadTemplate (data) {
  return request({
    url: `/iems/app-iems/template/upload`,
    method: 'POST',
    data,
    timeout: 0
  });
}

export function getTemplateList (params) {
  return request({
    url: `/iems/app-iems/template/listTemplate`,
    method: 'GET',
    params
  });
}

export function removeTemplate (templateId) {
  return request({
    url: `/iems/app-iems/template/removeTemplate`,
    method: 'DELETE',
    params: { templateId }
  });
}

export function setMaterialDept (params) {
  return request({
    url: `/iems/app-iems/material/setMaterialDept`,
    method: 'GET',
    params,
    timeout: 3000,
    customTimeout: true
  });
}
/**
* ------------------------------------------------------------------
* i系列分机配置结束
* ------------------------------------------------------------------
*/

// 获取护理级别
export function nursingLevel (params) {
  return request({
    url: `${bnms}/web-bn/settingNurseLevel/select`,
    method: 'GET',
    params
  });
}

// 床头卡模板列表
export function fetchCardTemplateList (params) {
  return request({
    url: `${wnms}/web-wn/bedHeadConfig`,
    method: 'GET',
    params
  });
}

// 获取宣教列表
export function getEdu (params) {
  return request({
    url: `${hpms}/app-hp/edArticle/listForPDA`,
    method: 'GET',
    params
  });
}

export function getDeviceList (deviceType) {
  return request({
    url: `/passport/web-org/device/dept/all?deviceType=${deviceType}`,
    method: 'GET'
  });
}

// 获取医嘱
export function getMedicalType () {
  return request({
    url: `${nsms}/web-da/advice/medicalType`,
    method: 'GET'
  });
}

// 获取功能入口
export function getParentMeun (params) {
  return request({
    url: `${tdms}/web-wn/menu`,
    method: 'GET',
    params
  });
}

//按照科室获取医护主机列表
export function getMedicalListByDeptId (deptId) {
  return request({
    url: `/tdms/web-td/device/list?size=1000&page=1&deviceType=wnMedicalMainframe&deptId=${deptId}&contain=1`,
    method: 'GET'
  });
}

export function getMedicalCareList (deptId) {
  return request({
    url: `/ifms/app-org/emps/${deptId}`,
    method: 'get'
  });
}

// 获取床位列表
export function getBedsList (params) {
  return request({
    // url: `/ifms/web-org/beds?size=${size}&page=${page}&pageHelper=1&display=3`,
    url: `/ifms/web-org/beds`,
    method: 'GET',
    params
  });
}

//获取二维码图片列表
export function getQrcodeList (params) {
  return request({
    url: `/wnms/web-wn/bedQrcode`,
    method: 'GET',
    params
  });
}

//非全院获取二维码图片列表
export function getQrcodeNumber (params) {
  return request({
    url: `/wnms/app-wn/bedQrcode`,
    method: 'GET',
    params
  });
}
//保存二维码图片
export function addQrcode (bedId, config) {
  return request({
    url: `/wnms/web-wn/bedQrcode`,
    method: 'POST',
    data: {
      bedId: bedId,
      config: config
    }
  });
}

//保存二维码图片
export function addQrcode2 (data) {
  return request({
    url: `/wnms/web-wn/bedQrcode`,
    method: 'POST',
    data
  });
}

//全院获取二维码图片列表
export function getWnBedQrcodeById (params) {
  return request({
    url: `/wnms/web-wn/bedQrcode/getWnBedQrcodeById`,
    method: 'GET',
    params
  });
}

//全院获取二维码图片列表
export function getEditWnBedQrcode (params) {
  return request({
    url: `/wnms/web-wn/bedQrcode/getEditWnBedQrcode`,
    method: 'GET',
    params
  });
}
// 全院获取二维码图片列表全院
export function getQycount (params) {
  return request({
    url: `/wnms/web-wn/bedQrcode/getQycount`,
    method: "get",
    params
  });
}

// 获取护理单元树
export function getdepts (params) {
  return request({
    //headers:[{""}],
    url: '/ifms/web-org/depts',
    method: 'get'
  });
}

// 验证医护是否还活着
export function getListEmp (params) {
  return request({
    url: 'wnas/nurse-info-app/listEmp',
    method: 'get',
    params
  });
}

// 验证宣教是否还活着
export function getGetDeptDescMany (params) {
  return request({
    url: '/hpms/app-hp/edArticle/GetDeptDescMany',
    method: 'get',
    params
  });
}

//保存门灯护具
export function SaveDoorLamp (data) {
  return request({
    url: `${tdms}/web-wn/systemConfig/doorLamp`,
    method: 'post',
    data
  });
}
//获取门灯
export function getDoorLampList (params) {
  return request({
    url: `${tdms}/web-wn/systemConfig/doorLamp`,
    method: 'get',
    params
  });
}

// 获取素材列表
export function getMaterialManage(params) {
  return request({
    url: `/iems/web-iems/material-manage`,
    method: 'GET',
    params
  })
}

// 删除素材列表
export function delMaterialManage(materialId) {
  return request({
    url: `/iems/web-iems/material-manage`,
    method: 'DELETE',
    params: {materialId}
  })
}

// 添加素材
export function addMaterialManage(data) {
  return request({
    url: `/iems/web-iems/material-manage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/form-data'
    },
    data
  })
}

// 素材编辑
export function updateMaterialMange(data) {
  return request({
    url: `/iems/web-iems/material-manage`,
    method: 'PUT',
    data
  })
}

// 获取素材磁盘空间
export function getMaterialManageDiskSpace() {
  return request({
    url: `/iems/web-iems/material-manage/getDiskSpace`,
    method: 'GET',
  })
}

// 获取所有的护理单元
export function getDeptList(orgid) {
  return request({
    url: `/ifms/web-org/depts/${orgid}/list`,
    method: "get"
  });
}
export function getClassifys() {
  return request({
    url: `nrms/web-nr/simple-advice/getClassifys`,
    method: 'get'
  })
}