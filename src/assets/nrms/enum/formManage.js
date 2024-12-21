// 表单管理Type
export const EFormType = Object.freeze({
  nurseNote: '1', // 护理记录单
  temperature: '2', // 体温单
  bloodSugar: '3', // 血糖单
  inOut: '4', // 出入量单
  observe: '5', // 观察记录单
  operation: '6', // 手术评估单
  handover: '7', // 交接单
  bodyCondition: '9', // 体围
  inspectNotice: '10', // 检查通知单
  intoAssess: '11', // 转入评估单
  shiftReport: '12', // 交班报告管理
  shiftRecord: '13', // 交班记录管理
  admissionAssess: '14', // 入院评估
  riskAssessment: '15' // 风险评估
})

// 表单管理type对应文字
export const EFormTypeText = Object.freeze({
  [EFormType.nurseNote]: '护理记录单',
  [EFormType.temperature]: '体温单',
  [EFormType.bloodSugar]: '血糖单',
  [EFormType.inOut]: '出入量单',
  [EFormType.observe]: '观察记录单',
  [EFormType.operation]: '手术评估单',
  [EFormType.handover]: '交接记录单',
  [EFormType.bodyCondition]: '体围单',
  [EFormType.inspectNotice]: '检查通知单',
  [EFormType.intoAssess]: '转入评估单',
  [EFormType.shiftReport]: '交班报告',
  [EFormType.shiftRecord]: '交班记录',
  [EFormType.admissionAssess]: '入院评估',
  [EFormType.riskAssessment]: '风险评估'
})

// 自动表单对应的类型
export const EAssType = Object.freeze({
  operation: '1001', // 手术评估
  handover: '1002', // 交接单
  observe: '1003', // 观察
  intoAssess: '1006', // 转入评估
  admissionAssess: '1007', // 入院评估
  riskAssessment: '1008' // 风险评估
})

// 自动表单模板Id
export const EModuleId = Object.freeze({
  operationShuQian: '10011',
  operationShuRi: '10012',
  operationShuHou1: '10013',
  operationShuHou2: '10019',
  operationShuHou3: '10020',
  handoverOperation: '10014',
  handoverDepartment: '10015',
  handoverXinjiang: '10018',
  observeYachuang: '10016',
  observeShengjingmai: '10017',
  observeTengtong: '10021',
  observeGuandao: '10022',
  observeShuxue: '10023',
  intoAssess: '10024',
  handoverZhongxin: '10025',
  handoverZhongxinOperation: '10026',
  zhongxinRuyuanAssess: '10027',
  yachuangAssess: '10028',
  feiJiHuaBaGuan: '10029',
  zhongxinDiedao: '10030',
  zhongxinPain: '10031',
  zhongxinTunYan: '10032',
  shijinAsses: '10033',
  zhongxinVTE: '10034',
  observeZhongxinYachuang: '10035',
  observeZhongxinPiyan: '10036',
  ziliAsses: '10037',
  GCSAssess: '10038',
  RamsayAsses: '10039',
  miniaoAssess: '10040',
  wuxiAssess: '10041',
  yingyangAssess: '10042',
  handoverZhongxinOperation2: '10043' // 中心医院修改后的手术交接单
})

// 自动表单模板Id对应的名称
export const EModuleIdText = Object.freeze({
  [EModuleId.operationShuQian]: '术前患者护理评估记录单',
  [EModuleId.operationShuRi]: '术后患者护理评估记录单(术日)',
  [EModuleId.operationShuHou1]: '术后患者护理评估记录单(术后1日)',
  [EModuleId.operationShuHou2]: '术后患者护理评估记录单(术后2日)',
  [EModuleId.operationShuHou3]: '术后患者护理评估记录单(术后3日)',
  [EModuleId.handoverOperation]: '手术交接单',
  [EModuleId.handoverDepartment]: '转科交接单',
  [EModuleId.handoverXinjiang]: '新疆医院转入/转出交接单',
  [EModuleId.observeYachuang]: '压疮观察记录单',
  [EModuleId.observeShengjingmai]: '深静脉观察记录单',
  [EModuleId.observeTengtong]: '疼痛观察单',
  [EModuleId.observeGuandao]: '管道记录单',
  [EModuleId.observeShuxue]: '输血护理记录单',
  [EModuleId.intoAssess]: '转入评估单',
  [EModuleId.handoverZhongxin]: '中心医院转科交接单',
  [EModuleId.handoverZhongxinOperation]: '中心医院手术交接单',
  [EModuleId.zhongxinRuyuanAssess]: '中心医院入院评估',
  [EModuleId.yachuangAssess]: '压疮风险评估',
  [EModuleId.feiJiHuaBaGuan]: '非计划拔管风险评估',
  [EModuleId.zhongxinDiedao]: '跌倒坠床风险评估',
  [EModuleId.zhongxinPain]: '患者疼痛评估单',
  [EModuleId.shijinAsses]: '失禁性皮炎评估',
  [EModuleId.zhongxinTunYan]: '吞咽障碍评估单',
  [EModuleId.zhongxinVTE]: 'VTE风险评估',
  [EModuleId.ziliAsses]: '自理能力评估',
  [EModuleId.GCSAssess]: 'GCS评估记录单',
  [EModuleId.RamsayAsses]: 'Ramsay镇静评估',
  [EModuleId.miniaoAssess]: '泌尿系感染风险评估',
  [EModuleId.wuxiAssess]: '误吸窒息风险评估',
  [EModuleId.yingyangAssess]: '营养风险评估',
  [EModuleId.observeZhongxinYachuang]: '中心医院压疮风险患者观察记录单',
  [EModuleId.observeZhongxinPiyan]: '中心医院失禁性皮炎评估观察记录单',
  [EModuleId.handoverZhongxinOperation2]: '中心医院手术交接单2'
})

// 自动表单对应的assclass 自动表单分类
export const EAssClass = Object.freeze({
  operation: 1, // 手术评估
  handover: 2, // 交接单
  observeYachuang: 3, // 压疮观察
  observeShengjingmai: 4, // 深静脉观察
  observeTengtong: 5, // 疼痛观察
  observeGuandao: 6, // 管道观察
  observeShuxue: 7, // 输血观察
  intoAssess: 8, // 转入评估
  admissionAssess: 9, // 入院评估
  riskAssessment: 10, // 风险评估
  observeZhongxin: 11 // 中心医院观察记录
})

// 血糖单样式
export const EBloodSugarRelationStyle = Object.freeze({
  common: '1',
  shengli: '2',
  shibo: '3',
  zhongxin: '4'
})

// 血糖单文字
export const EBloodSugarRelationStyleText = Object.freeze({
  [EBloodSugarRelationStyle.common]: '通用血糖单',
  [EBloodSugarRelationStyle.shengli]: '省立医院血糖单',
  [EBloodSugarRelationStyle.shibo]: '世博血糖记录单',
  [EBloodSugarRelationStyle.zhongxin]: '中心医院血糖记录单'
})
// 表单应用 一个表单可以应用多个科室
export const FormApplyOneToMore = [EFormType.nurseNote, EFormType.bloodSugar, EFormType.observe, EFormType.operation, EFormType.handover, EFormType.riskAssessment]
