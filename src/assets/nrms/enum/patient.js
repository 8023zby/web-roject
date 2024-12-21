// 是否为出院召回
export const EOutHospitalFlag = Object.freeze({
  noReturn: 0,
  return: 1
})

// 病人类型
export const EPatientType = Object.freeze({
  in: 0, // 在当前科室
  transfer: 1, // 转科
  out: 2 // 出院
})
