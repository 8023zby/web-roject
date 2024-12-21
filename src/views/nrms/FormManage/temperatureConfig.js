import { OperationData1 } from '../FormManageData/operation_data1'
import { OperationData2 } from '../FormManageData/operation_data2'
import { OperationData3 } from '../FormManageData/operation_data3'
import { yachuangJSON } from '../FormManageData/risk'
import { operationHandoverData } from '../FormManageData/operation_handover_data'
import { operationHandoverData2 } from '../FormManageData/operation_handover_data2'
import { OperationTransferData } from '../FormManageData/operation_transfer_data'
import { TransferData } from '../FormManageData/transfer_data'
import { changeDepartmentData } from '../FormManageData/change_Department_data'
import { TransferXinjiangData } from '../FormManageData/transfer_xinjiang_data'
import { PressData } from '../FormManageData/press_data'
import { popData } from '../FormManageData/pop_data'
import { DeepData } from '../FormManageData/deep_data'
import { ObservePainData } from '../FormManageData/observe_pain_data'
import { BloodTransfusion } from '../FormManageData/blood_transfusion'
import { intoAssessData } from '../FormManageData/into_assess_data'
import { zhongxinRuyuanAssess } from '../FormManageData/zhongxin_ruyuan_assess_data'
import { tubeDrawingRisk } from '../FormManageData/tube_drawing_tisk_data'
import { zhongxinPainData } from '../FormManageData/zhongxin_Pain_Data'
import { zhongxinTunYanData } from '../FormManageData/zhongxin_tunyan_data'
import { zhongxinVTEdata } from '../FormManageData/zhongxin_VTE_data'
import { zhongxinGSCData } from '../FormManageData/zhongxin_GSC_data'
import { zhongxinRamsayData } from '../FormManageData/zhongxin_Ramsay_data'
import { zhongxinMiniaoData } from '../FormManageData/zhongxin_miniao_data'
import { zhongxinYingyangData } from '../FormManageData/zhongxin_yingyang_data'
import { EFormType, EFormTypeText, EAssType, EModuleId, EModuleIdText, EAssClass, EBloodSugarRelationStyle, EBloodSugarRelationStyleText } from '../../../assets/nrms/enum/formManage'
import { zhongxinDiedaoAssessData } from '../FormManageData/zhongxin_diedao_assess_data'
import { shijinJSON } from '../FormManageData/zhongxin_shijin_data'// 失禁性皮炎评估
import { ziliJSON } from '../FormManageData/zhongxin_zili_data'// 自理能力评估
import { wuxiJSON } from '../FormManageData/zhongxin_wuxi_data'// 误吸窒息风险评估
import { ObserveZhongxinData } from '../FormManageData/observe_zhongxin_data'// 中心医院观察记录单（失禁性皮炎和压疮）

export const temperatureStyle = [
  { id: '1', name: '通用成人体温单' },
  { id: '4', name: '发热门诊体温单' },
  { id: '2', name: '世博医院体温单' },
  { id: '6', name: '山东省立医院' },
  { id: '5', name: '山东病历规范体温单' },
  { id: '3', name: '4时刻医院体温单' }
]
// 体温单名称
export const temperatureName = {
  '1': '通用成人体温单',
  '4': '发热门诊体温单',
  '2': '世博医院体温单',
  '6': '山东省立医院',
  '5': '山东病历规范体温单',
  '3': '4时刻医院体温单'
}

export const bloodSugarRelationStyle = [
  { id: EBloodSugarRelationStyle.common, name: EBloodSugarRelationStyleText[EBloodSugarRelationStyle.common] },
  { id: EBloodSugarRelationStyle.shengli, name: EBloodSugarRelationStyleText[EBloodSugarRelationStyle.shengli] },
  { id: EBloodSugarRelationStyle.shibo, name: EBloodSugarRelationStyleText[EBloodSugarRelationStyle.shibo] },
  { id: EBloodSugarRelationStyle.zhongxin, name: EBloodSugarRelationStyleText[EBloodSugarRelationStyle.zhongxin] }
]

export const inOutRelationStyle = [
  { id: '1', name: '通用出入量单' },
  { id: '2', name: '省立出入量单' }
]

export const observeNoteStyle = [
  { id: EModuleId.observeYachuang, name: EModuleIdText[EModuleId.observeYachuang] },
  { id: EModuleId.observeShengjingmai, name: EModuleIdText[EModuleId.observeShengjingmai] },
  { id: EModuleId.observeTengtong, name: EModuleIdText[EModuleId.observeTengtong] },
  { id: EModuleId.observeGuandao, name: EModuleIdText[EModuleId.observeGuandao] },
  { id: EModuleId.observeShuxue, name: EModuleIdText[EModuleId.observeShuxue] },
  { id: EModuleId.observeZhongxinYachuang, name: EModuleIdText[EModuleId.observeZhongxinYachuang] },
  { id: EModuleId.observeZhongxinPiyan, name: EModuleIdText[EModuleId.observeZhongxinPiyan] }
]
export const operateStyle = [
  { id: EModuleId.operationShuHou3, name: EModuleIdText[EModuleId.operationShuHou3] },
  { id: EModuleId.operationShuHou2, name: EModuleIdText[EModuleId.operationShuHou2] },
  { id: EModuleId.operationShuHou1, name: EModuleIdText[EModuleId.operationShuHou1] },
  { id: EModuleId.operationShuRi, name: EModuleIdText[EModuleId.operationShuRi] },
  { id: EModuleId.operationShuQian, name: EModuleIdText[EModuleId.operationShuQian] }
]
export const jiaoJieStyle = [
  { id: EModuleId.handoverOperation, name: EModuleIdText[EModuleId.handoverOperation] },
  { id: EModuleId.handoverDepartment, name: EModuleIdText[EModuleId.handoverDepartment] },
  { id: EModuleId.handoverXinjiang, name: EModuleIdText[EModuleId.handoverXinjiang] },
  { id: EModuleId.handoverZhongxin, name: EModuleIdText[EModuleId.handoverZhongxin] },
  { id: EModuleId.handoverZhongxinOperation, name: EModuleIdText[EModuleId.handoverZhongxinOperation] },
  { id: EModuleId.handoverZhongxinOperation2, name: EModuleIdText[EModuleId.handoverZhongxinOperation2] }
]
export const shiftReportStyle = [
  { id: '1', name: '基础交班报告' }
]
export const shiftRecordStyle = [
  { id: '1', name: '基础SBAR交班' }
]
export const intoAssessStyle = [
  { id: EModuleId.intoAssess, name: EModuleIdText[EModuleId.intoAssess] }
]
export const zhongxinRuyuanAssessStyle = [
  { id: EModuleId.zhongxinRuyuanAssess, name: EModuleIdText[EModuleId.zhongxinRuyuanAssess] }
]
export const riskAssessStyle = [
  { id: EModuleId.yachuangAssess, name: EModuleIdText[EModuleId.yachuangAssess] },
  { id: EModuleId.feiJiHuaBaGuan, name: EModuleIdText[EModuleId.feiJiHuaBaGuan] },
  { id: EModuleId.zhongxinDiedao, name: EModuleIdText[EModuleId.zhongxinDiedao] },
  { id: EModuleId.zhongxinPain, name: EModuleIdText[EModuleId.zhongxinPain] },
  { id: EModuleId.shijinAsses, name: EModuleIdText[EModuleId.shijinAsses] },
  { id: EModuleId.ziliAsses, name: EModuleIdText[EModuleId.ziliAsses] },
  { id: EModuleId.GCSAssess, name: EModuleIdText[EModuleId.GCSAssess] },
  { id: EModuleId.RamsayAsses, name: EModuleIdText[EModuleId.RamsayAsses] },
  { id: EModuleId.miniaoAssess, name: EModuleIdText[EModuleId.miniaoAssess] },
  { id: EModuleId.wuxiAssess, name: EModuleIdText[EModuleId.wuxiAssess] },
  { id: EModuleId.yingyangAssess, name: EModuleIdText[EModuleId.yingyangAssess] },
  { id: EModuleId.zhongxinTunYan, name: EModuleIdText[EModuleId.zhongxinTunYan] },
  { id: EModuleId.zhongxinVTE, name: EModuleIdText[EModuleId.zhongxinVTE] }
]

// 不同的formType 对应的 assType（自动表单用）, 关联表单样式
export const FormTypeMap = new Map([
  [EFormType.temperature, {
    label: EFormTypeText[EFormType.temperature],
    styleList: temperatureStyle,
    assType: ''
  }],
  [EFormType.bloodSugar, {
    label: EFormTypeText[EFormType.bloodSugar],
    styleList: bloodSugarRelationStyle,
    assType: ''
  }],
  [EFormType.inOut, {
    label: EFormTypeText[EFormType.inOut],
    styleList: inOutRelationStyle,
    assType: ''
  }],
  [EFormType.observe, {
    label: EFormTypeText[EFormType.observe],
    styleList: observeNoteStyle,
    assType: EAssType.observe
  }],
  [EFormType.operation, {
    label: EFormTypeText[EFormType.operation],
    styleList: operateStyle,
    assType: EAssType.operation
  }],
  [EFormType.handover, {
    label: EFormTypeText[EFormType.handover],
    styleList: jiaoJieStyle,
    assType: EAssType.handover
  }],
  // 交班报告
  [EFormType.shiftReport, {
    label: EFormTypeText[EFormType.shiftReport],
    styleList: shiftReportStyle,
    assType: ''
  }],
  // 交班记录
  [EFormType.shiftRecord, {
    label: EFormTypeText[EFormType.shiftRecord],
    styleList: shiftRecordStyle,
    assType: ''
  }],
  // 转入评估单
  [EFormType.intoAssess, {
    label: EFormTypeText[EFormType.intoAssess],
    styleList: intoAssessStyle,
    assType: EAssType.intoAssess
  }],
  // 入院评估
  [EFormType.admissionAssess, {
    label: EFormTypeText[EFormType.admissionAssess],
    styleList: zhongxinRuyuanAssessStyle,
    assType: EAssType.admissionAssess
  }],
  // 风险评估
  [EFormType.riskAssessment, {
    label: EFormTypeText[EFormType.riskAssessment],
    styleList: riskAssessStyle,
    assType: EAssType.riskAssessment
  }]
])

// 体温单文字信息配置
export const message = {
  '1': { // 通用成人体温单
    date: '日期',
    hospitalDays: '住院天数',
    operationDays: '术后天数',
    hour: '时间'
  },
  '2': { // 世博医院体温单
    date: '日期',
    hospitalDays: '住院天数',
    operationDays: '术后天数',
    hour: '时间'
  },
  '3': { // 4时刻医院体温单
    date: '日期',
    hospitalDays: '住院天数',
    operationDays: '术后天数',
    hour: '时间'
  },
  '4': { // 发热门诊体温单
    date: '日期',
    hospitalDays: '留观日数',
    postpartumDays: '产后日数',
    operationDays: '术后日数',
    hour: '时间'
  },
  '5': { // 山东病历规范体温单
    date: '日期',
    hospitalDays: '住院天数',
    operationDays: '术后天数',
    hour: '时间'
  },
  '6': { // 山东省立
    date: '日期',
    hospitalDays: '住院天数',
    operationDays: '术后天数',
    hour: '时间'
  }
}

// 测量时间个数
export const temperatureTime = {
  '1': 6, // 通用成人体温单
  '2': 6, // 世博医院体温单
  '3': 4, // 4时刻医院体温单
  '4': 6, // 发热门诊体温单
  '5': 6, // 山东病历规范体温单,
  '6': 6 // 山东省立医院
}

// 体温单固定的导入项
export const temperatureInitItem = {
  '1': ['tiwen', 'tiwenceliangfangshi', 'fucetiwen', 'fushitiwen', 'maibo', 'xinlv', 'tengtongdengji', 'fucetengtong', 'huxi', 'xueya', 'shousuoya', 'shuzhangya'],
  '2': ['tiwen', 'tiwenceliangfangshi', 'fucetiwen', 'fushitiwen', 'maibo', 'xinlv', 'tengtongdengji', 'fucetengtong', 'huxi'],
  '3': ['tiwen', 'tiwenceliangfangshi', 'fucetiwen', 'fushitiwen', 'maibo', 'xinlv', 'tengtongdengji', 'fucetengtong', 'huxi', 'xueya', 'shousuoya', 'shuzhangya'],
  '4': ['tiwen', 'tiwenceliangfangshi', 'fucetiwen', 'fushitiwen', 'maibo', 'xinlv', 'tengtongdengji', 'fucetengtong', 'huxi', 'xueya', 'shousuoya', 'shuzhangya'],
  '5': ['tiwen', 'tiwenceliangfangshi', 'fucetiwen', 'fushitiwen', 'maibo', 'xinlv', 'tengtongdengji', 'fucetengtong', 'huxi'],
  '6': ['tiwen', 'tiwenceliangfangshi', 'fucetiwen', 'fushitiwen', 'maibo', 'xinlv', 'tengtongdengji', 'fucetengtong', 'huxi']
}
/** **************************************自动表单配置****************************************/
// 自动表单formType 5---->观察记录单  6---->手术评估  7---->交接单 11----> 转入评估单 14----> 入院评估
export const AutoFormType = [
  EFormType.observe,
  EFormType.operation,
  EFormType.handover,
  EFormType.intoAssess,
  EFormType.admissionAssess,
  EFormType.riskAssessment
]
// 不同的moduleId对应的assClass
export const ModuleIdToAssClass = new Map([
  [EModuleId.operationShuQian, EAssClass.operation],
  [EModuleId.operationShuRi, EAssClass.operation],
  [EModuleId.handoverZhongxin, EAssClass.handover],
  [EModuleId.handoverZhongxinOperation, EAssClass.handover],
  [EModuleId.handoverZhongxinOperation2, EAssClass.handover],
  [EModuleId.zhongxinRuyuanAssess, EAssClass.admissionAssess],
  [EModuleId.handoverOperation, EAssClass.handover],
  [EModuleId.operationShuHou1, EAssClass.operation],
  [EModuleId.operationShuHou2, EAssClass.operation],
  [EModuleId.operationShuHou3, EAssClass.operation],
  [EModuleId.handoverOperation, EAssClass.handover],
  [EModuleId.handoverDepartment, EAssClass.handover],
  [EModuleId.handoverXinjiang, EAssClass.handover],
  [EModuleId.observeYachuang, EAssClass.observeYachuang],
  [EModuleId.observeShengjingmai, EAssClass.observeShengjingmai],
  [EModuleId.observeTengtong, EAssClass.observeTengtong],
  [EModuleId.observeGuandao, EAssClass.observeGuandao],
  [EModuleId.observeShuxue, EAssClass.observeShuxue],
  [EModuleId.intoAssess, EAssClass.intoAssess],
  [EModuleId.yachuangAssess, EAssClass.riskAssessment],
  [EModuleId.feiJiHuaBaGuan, EAssClass.riskAssessment],
  [EModuleId.zhongxinDiedao, EAssClass.riskAssessment],
  [EModuleId.zhongxinPain, EAssClass.riskAssessment],
  [EModuleId.shijinAsses, EAssClass.riskAssessment],
  [EModuleId.zhongxinTunYan, EAssClass.riskAssessment],
  [EModuleId.zhongxinVTE, EAssClass.riskAssessment],
  [EModuleId.ziliAsses, EAssClass.riskAssessment],
  [EModuleId.GCSAssess, EAssClass.riskAssessment],
  [EModuleId.RamsayAsses, EAssClass.riskAssessment],
  [EModuleId.miniaoAssess, EAssClass.riskAssessment],
  [EModuleId.wuxiAssess, EAssClass.riskAssessment],
  [EModuleId.yingyangAssess, EAssClass.riskAssessment],
  [EModuleId.observeZhongxinYachuang, EAssClass.observeZhongxin],
  [EModuleId.observeZhongxinPiyan, EAssClass.observeZhongxin]
])
export const ModuleIdToModuleJson = new Map([
  [EModuleId.operationShuQian, OperationData1],
  [EModuleId.operationShuRi, OperationData2],
  [EModuleId.operationShuHou1, OperationData3],
  [EModuleId.handoverZhongxin, changeDepartmentData],
  [EModuleId.handoverZhongxinOperation, operationHandoverData],
  [EModuleId.handoverZhongxinOperation2, operationHandoverData2],
  [EModuleId.zhongxinRuyuanAssess, zhongxinRuyuanAssess],
  [EModuleId.handoverOperation, OperationTransferData],
  [EModuleId.handoverDepartment, TransferData],
  [EModuleId.observeShengjingmai, DeepData],
  [EModuleId.observeYachuang, PressData],
  [EModuleId.handoverXinjiang, TransferXinjiangData],
  [EModuleId.operationShuHou2, OperationData3],
  [EModuleId.operationShuHou3, OperationData3],
  [EModuleId.observeTengtong, ObservePainData],
  [EModuleId.observeGuandao, popData],
  [EModuleId.observeShuxue, BloodTransfusion],
  [EModuleId.intoAssess, intoAssessData],
  [EModuleId.yachuangAssess, yachuangJSON],
  [EModuleId.feiJiHuaBaGuan, tubeDrawingRisk],
  [EModuleId.zhongxinDiedao, zhongxinDiedaoAssessData],
  [EModuleId.zhongxinPain, zhongxinPainData],
  [EModuleId.shijinAsses, shijinJSON],
  [EModuleId.zhongxinTunYan, zhongxinTunYanData],
  [EModuleId.zhongxinVTE, zhongxinVTEdata],
  [EModuleId.ziliAsses, ziliJSON],
  [EModuleId.observeZhongxinYachuang, ObserveZhongxinData],
  [EModuleId.observeZhongxinPiyan, ObserveZhongxinData],
  [EModuleId.wuxiAssess, wuxiJSON],
  [EModuleId.GCSAssess, zhongxinGSCData],
  [EModuleId.RamsayAsses, zhongxinRamsayData],
  [EModuleId.miniaoAssess, zhongxinMiniaoData],
  [EModuleId.yingyangAssess, zhongxinYingyangData]

])

// haveRecordRate为1的表单（循环表单）
export const AssHaveRateList = [
  EModuleId.observeTengtong,
  EModuleId.yachuangAssess,
  EModuleId.feiJiHuaBaGuan,
  EModuleId.zhongxinDiedao,
  EModuleId.zhongxinPain,
  EModuleId.shijinAsses,
  EModuleId.zhongxinTunYan,
  EModuleId.zhongxinVTE,
  EModuleId.ziliAsses,
  EModuleId.GCSAssess,
  EModuleId.RamsayAsses,
  EModuleId.miniaoAssess,
  EModuleId.yingyangAssess,
  EModuleId.wuxiAssess
]
// assRate的值(列数)
export const AssRateMap = new Map([
  [EModuleId.observeTengtong, 6],
  [EModuleId.feiJiHuaBaGuan, 5],
  [EModuleId.zhongxinDiedao, 5],
  [EModuleId.zhongxinPain, 5],
  [EModuleId.yachuangAssess, 5],
  [EModuleId.shijinAsses, 5],
  [EModuleId.zhongxinTunYan, 5],
  [EModuleId.zhongxinVTE, 5],
  [EModuleId.ziliAsses, 5],
  [EModuleId.GCSAssess, 5],
  [EModuleId.RamsayAsses, 5],
  [EModuleId.miniaoAssess, 5],
  [EModuleId.yingyangAssess, 5],
  [EModuleId.wuxiAssess, 5]
])
// 列明设置对应的class
const AssColumnClassMap = new Map([
  [EAssClass.observeTengtong, [
    'time',
    'tengtongdengji',
    'fucetengtong',
    'buwei',
    'xingzhi',
    'chengdu',
    'chixushijian',
    'zhengzhuang',
    'jiazhongyinsu',
    'huanjieyinsu',
    'shuimian',
    'xinli',
    'zhiliaoyicongxing',
    'hulicuoshi',
    'zhiliaocuoshi',
    'yaoming',
    'jiliang',
    'tujing',
    'zaipinggu',
    'qianming'
  ]],
  [EAssClass.observeGuandao, [
    'time',
    'hour',
    'popType',
    'popPosition',
    'popMethod',
    'color',
    'setEffect',
    'quality',
    'amount',
    'popLen',
    'thing',
    'nurseName',
    'autograph',
    'formCode'
  ]],
  [EAssClass.observeShuxue, [
    'date',
    'time1',
    'tiwen1',
    'maibo1',
    'huxi1',
    'xueya1',
    'gangzhen',
    'zhiliuzhen',
    'daoguan',
    'qitatujing',
    'hongxibao',
    'xuexiaoban',
    'xuejiang',
    'qitazhonglei',
    'zhixingzhe',
    'heduizhe',
    'shuxueshijian1',
    'time2',
    'tiwen2',
    'maibo2',
    'huxi2',
    'xueya2',
    'shuxueshijian2',
    'time3',
    'tiwen3',
    'maibo3',
    'huxi3',
    'xueya3',
    'wu',
    'fashengshijian',
    'guominfanying',
    'farefanying',
    'rongxuefanying',
    'qitafanying',
    'signature',
    'formCode'
  ]],
  [EAssClass.intoAssess, [
    'assessName',
    'createdUser',
    'createdTime',
    'updatedUser',
    'updatedTime',
    'formCode'
  ]],
  [EAssClass.admissionAssess, [
    'formCode'
  ]],
  [EAssClass.riskAssessment, [
    'assessmentTime',
    'grade',
    'riskLevel',
    'assessPerson',
    'levelColor'
  ]],
  [EAssClass.observeZhongxin, [
    'time',
    'options',
    'sign',
    'formCode'
  ]]
])
// column列名设置
export const AssColumnMap = new Map([
  [EModuleId.observeTengtong, AssColumnClassMap.get(EAssClass.observeTengtong)],
  [EModuleId.observeGuandao, AssColumnClassMap.get(EAssClass.observeGuandao)],
  [EModuleId.observeShuxue, AssColumnClassMap.get(EAssClass.observeShuxue)],
  [EModuleId.intoAssess, AssColumnClassMap.get(EAssClass.intoAssess)],
  [EModuleId.zhongxinRuyuanAssess, AssColumnClassMap.get(EAssClass.admissionAssess)],
  [EModuleId.feiJiHuaBaGuan, AssColumnClassMap.get(EAssClass.riskAssessment)],
  [EModuleId.yachuangAssess, AssColumnClassMap.get(EAssClass.riskAssessment)],
  [EModuleId.zhongxinPain, AssColumnClassMap.get(EAssClass.riskAssessment)],
  [EModuleId.zhongxinDiedao, AssColumnClassMap.get(EAssClass.riskAssessment)],
  [EModuleId.shijinAsses, AssColumnClassMap.get(EAssClass.riskAssessment)],
  [EModuleId.zhongxinTunYan, AssColumnClassMap.get(EAssClass.riskAssessment)],
  [EModuleId.zhongxinVTE, AssColumnClassMap.get(EAssClass.riskAssessment)],
  [EModuleId.ziliAsses, AssColumnClassMap.get(EAssClass.riskAssessment)],
  [EModuleId.observeZhongxinYachuang, AssColumnClassMap.get(EAssClass.observeZhongxin)],
  [EModuleId.observeZhongxinPiyan, AssColumnClassMap.get(EAssClass.observeZhongxin)],
  [EModuleId.GCSAssess, AssColumnClassMap.get(EAssClass.riskAssessment)],
  [EModuleId.RamsayAsses, AssColumnClassMap.get(EAssClass.riskAssessment)],
  [EModuleId.miniaoAssess, AssColumnClassMap.get(EAssClass.riskAssessment)],
  [EModuleId.yingyangAssess, AssColumnClassMap.get(EAssClass.riskAssessment)],
  [EModuleId.wuxiAssess, AssColumnClassMap.get(EAssClass.riskAssessment)]
])

/**
* ------------------------------------------------------------------
* 表单管理tab类型
* ------------------------------------------------------------------
*/

// 存在于EFormType却不在左侧表单分类显示
export const ExcludeEFormType = [ EFormType.shiftRecord ]

// 修改左侧表单分类的名称
export const ExchangeEFormTypeName = new Map([
  [EFormType.shiftReport, '交班管理']
])

// 表单tab类型
export const TabFormType = new Map([
  [EFormType.shiftReport, [EFormType.shiftReport, EFormType.shiftRecord]]
  // [EFormType.shiftReport, [EFormType.shiftReport]]
])
