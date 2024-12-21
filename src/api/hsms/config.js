export default {
  baseUrl: '/',
  // 班次类型
  shiftType: '/hsms/web-hs/repository/NURSE/type',
  // 班次库
  shiftLibrary: '/hsms/web-hs/repository/NURSE',
  shiftLibraryStatus: '/hsms/web-hs/repository/NURSE/enable',
  // 班次
  shift: '/hsms/web-hs/shift/NURSE',
  shiftStatus: '/hsms/web-hs/shift/NURSE/enable',
  // 班次模式
  shiftModel: '/hsms/web-hs/dept/config/NURSE',
  // 班次导入
  shiftImport: '/hsms/web-hs/shift/NURSE/import',
  // 组合班次
  composedShit: '/hsms/web-hs/shift/compose/NURSE',
  // 存假
  querySum: 'hsms/web-hs/storage-holiday/querySum', // 查询存假统计
  queryPage: 'hsms/web-hs/storage-holiday/queryPage', // 查询存假账户信息
  storageHoliday: 'hsms/web-hs/storage-holiday', // 删除存假记录
  // 年假
  queryAnnualSum: 'hsms/web-hs/annual-leave/querySum', // 查询存假统计
  queryAnnualPage: 'hsms/web-hs/annual-leave/queryPage', // 查询存假账户信息
  annualHoliday: 'hsms/web-hs/annual-leave', // 删除存假记录

  // wj
  holidayTypeClass: 'hsms/web-hs/leave-work/class',
  holidayDataClass: 'hsms/web-hs/leave-work/page',
  holidayData: 'hsms/web-hs/leave-work',
  holidayNurse: 'hsms/web-hs/leave-work/statistics',
  exportExcel: 'hsms/web-hs/leave-work/export',

  // 医疗分组--新
  queryDoctorList: '/hsms/web-hs/mdeical-group/query-medical-list',
  medicalGroupSave: '/hsms/web-hs/mdeical-group/save',
  medicalGroupInsert: '/hsms/web-hs/mdeical-group/update',
  medicalGroupDelete: '/hsms/web-hs/mdeical-group/delete',
  queryTreeList: '/hsms/web-hs/mdeical-group/query-tree-list',
  queryEditInfo: '/hsms/web-hs/mdeical-group/query-info',
  queryAddInfo: '/hsms/web-hs/mdeical-group/exist-list',
  apiTempDoc: '/hsms/web-hs/mdeical-group/manual-add-list',
  queryNurseTreeList: '/hsms/web-hs/nurse-group/query-tree-list',
  saveNurse: '/hsms/web-hs/nurse-group/save',
  updateNurse: '/hsms/web-hs/nurse-group/update',
  deleteNurse: '/hsms/web-hs/nurse-group/delete',
  queryNurseList: '/hsms/web-hs/nurse-group/query-nurse-list',
  selectInfo: '/hsms/web-hs/nurse-group/query-info',
  selectedNurse: '/hsms/web-hs/nurse-group/query-exits-list',
  getNurseBedRoomInfo: '/hsms/web-hs/nurse-group/getNurseBedRoomInfo'
}
