<template>
  <div class="observe-pain">
    <div v-if="!isPreview"
      style="display: flex; justify-content: flex-end; padding: 20px 20px 0 0"
    >
      <div class="btn-group">
        <el-button class="btn" type="primary" size="small" @click="getList(pagination.prev)" :disabled="!pagination.prev"
          >上一页</el-button
        >
        <el-button class="btn" type="primary" size="small" @click="getList(pagination.next)" :disabled="!pagination.next"
          >下一页</el-button
        >
        <el-button class="btn" type="primary" size="small" @click="clickPrint"
          >打印</el-button
        >
      </div>
    </div>
    <div style="width: 1048px; margin: 0 auto" id="printHtml">
      <!-- 表头 -->
      <formHeader :autoHead="autoHead"></formHeader>
      <!-- 自动表单 -->
      <auto-form :data="data" :valueData="valueData" v-if="update"></auto-form>
      <div style="display: flex; margin-top: 20px">
        <div style="line-height: 1.5; font-size: 16px">
          <p>注：1.疼痛部位按照体表分区数字代码（见右图）</p>
          <p>2.护理措施：</p>
          <p>
            (1).心理护理 (2).卧床休息 (3).疼痛宣教 (4).冷敷 (5).热敷 (6).按摩
            (7).其他
          </p>
          <p>3.再评估时间：爆发痛处肌肉、静脉用药后30min，口服给药后60min</p>
          <p>4.评定时机：</p>
          <p>(1).入院时或转入时；</p>
          <p>(2).住院患者每天评估一次；</p>
          <p>(3).轻度疼痛（1~3分）每天15:00评估一次；</p>
          <p>(4).中、重度疼痛（≥4分）每天评估两次（07:00、15:00）；</p>
          <p>(5).手术当日，15:00和19:00进行评估；</p>
          <p>
            (6).手术后患者每天评估2次(07:00、15:00)，至术后第三天，之后按实际分值决定评估频次。
          </p>
        </div>
        <img src="/static/nams/img/pain.jpg" alt="" />
      </div>
    </div>
    <div class="typt-add-footer" v-if="!isPreview">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>
<script>
// import FormCommon from "../../../components/nrms/autoForm/FormCommon";
import AutoForm from '../../../assets/nrms/mixins/AutoForm'
import { ApiAssManage, ApiAutoForm } from '../../../api/nrms/index'

const moment = require('moment')
export default {
  props: ['patient', 'patientType', 'printSet', 'formStyle', 'formName', 'formCode', 'params', 'isPreview'],
  mixins: [AutoForm],
  components: {
    formHeader: () => import('../../../components/nrms/autoForm/header'),
    AutoForm: () => import('../../../components/nrms/autoForm/autoForm')
  },
  data () {
    return {
      /**
      * ------------------------------------------------------------------
      * 初始化
      * ------------------------------------------------------------------
      */
      row: {},
      temp: {},
      data: [], // 表单模板
      valueData: [],
      initValueData: [],
      update: true,
      autoHead: {
        tplId: '',
        formName: '',
        tplHtml: '<div>loading</div>',
        tplData: {}
      },
      pagination: {
        prev: '',
        next: ''
      },
      editNumber: 0, // 编辑时有几条是之前就存在的
      assenssmentRecordsId: [],
      temperatureList: []
    }
  },
  created () {
    this.init()
  },
  watch: {
    patient: {
      async handler (newValue, oldValue) {
        this.$emit('option-changed', 'list')
      }
    }
  },
  mounted () {
    this.getHeader()
  },
  methods: {
    /**
    * ------------------------------------------------------------------
    * 初始化
    * ------------------------------------------------------------------
    */
    /**
     * @description: 初始化
     * @param {*}
     * @return {*}
     */
    async init () {
      this.temp = this.params.temp
      if (!this.isPreview) {
        this.temp = this.params.temp
      } else {
        this.temp = this.params
      }
      this.row = this.params.row
      this.data = JSON.parse(JSON.stringify(this.temp.moduleJson))
      if (!this.row) {
        this.getColumnsTableValueData()
        // 添加
      } else {
        // 编辑
        await this.getList()
      }
      await this.getTemperature()
    },

    /**
     * @description: 获取列表
     * @param {*}
     * @return {*}
     */
    async getList (pagination) {
      this.getColumnsTableValueData()
      try {
        let res = await ApiAssManage.getQueryLoop({
          assId: this.temp.assId,
          patientId: this.patient.patientId,
          assTimes: this.row.ass_times,
          pagination
        })
        this.editNumber = res.data.assenssmentRecords.length
        this.pagination = {
          prev: res.data.pageUp,
          next: res.data.pageDown
        }
        this.valueData.splice(0, this.editNumber)
        let array = []
        this.assenssmentRecordsId = res.data.assenssmentRecords.map(item => {
          array.push(item.moduleValue)
          return item.assRecordId
        })
        this.valueData = array.concat(this.valueData)
        this.update = false
        this.$nextTick(() => {
          this.update = true
        })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * @description: 获取表单头部
     * @param {*}
     * @return {*}
     */
    getHeader () {
      this.autoHead.tplHtml = this.formStyle
      this.autoHead.formName = this.formName
      if (this.patient && this.patient.id) {
        this.autoHead.tplData = this.patient
      }
    },

    /**
     * @description: 获取体温单时间段
     * @param {*}
     * @return {*}
     */
    async getTemperature () {
      try {
        let res = await ApiAutoForm.getFormDictByType({ formType: 2 })
        if (res && res.data) {
          this.temperatureList = res.data.temperatureTimeDos || []
        }
      } catch (error) {

      }
    },
    /**
    * ------------------------------------------------------------------
    * 操作
    * ------------------------------------------------------------------
    */
    cancel () {
      this.$emit('option-changed', 'list')
    },
    async save () {
      let assenssmentRecords = []
      let getSelectColumn = (v, columnValue, key, fn) => {
        if (v.value) {
          this.operatorFormData((elementItem) => {
            if (elementItem.key == v.key) {
              elementItem.options.map(optionItem => {
                if (optionItem.id == v.value) {
                  columnValue.push({
                    key,
                    value: optionItem.label
                  })
                  if (fn) {
                    fn(optionItem.label)
                  }
                }
              })
            }
          })
        }
      }
      let recordList = []
      await Promise.all(this.valueData.map(async (item, index) => {
        // 如果没有修改就跳过
        if (JSON.stringify(this.initValueData) == JSON.stringify(item)) {
          return
        }
        let params = {
          assId: this.temp.assId, // 评估单ID
          moduleId: this.temp.moduleId, // 模板ID
          moduleValue: item, // 评估值
          haveRecordRate: 1, // 是否多次记录
          patientId: this.patient.patientId, // 患者ID
          assRecordId: this.assenssmentRecordsId[index]
        }
        let temperature = {
          itemCode: 'tengtongdengji', // 体征项对应的字段值
          itemValueType: null, // 体征值对应的类型，例如腋温等
          itemType: null, // 区分体征项类别 全天 上午 下午
          index,
          syncTemperature: true
        }
        const columnValue = []
        let time = ''
        item.map(v => {
          switch (v.key) {
            case '1608003999000_12725':
              // 日期
              if (!v.value) {
                v.value = moment().format('YYYY-MM-DD')
              }
              time += v.value
              temperature.recordDate = v.value
              break
            case '1608003999000_7356':
              // 时间
              if (!v.value) {
                v.value = moment().format('HH:mm:ss')
              }
              if (time && v.value) {
                time += ' ' + v.value
              }
              if (!v.value) {
                temperature.syncTemperature = false
              }
              break
            case '1608003999000_44105':
              // 疼痛评分
              getSelectColumn(v, columnValue, 'tengtongdengji', (value) => {
                temperature.signValue = value
              })
              getSelectColumn(v, columnValue, 'fucetengtong', (value) => {
                temperature.phValue = value
              })
              break
            case '1608003999000_23252':
              if (v.value) {
                columnValue.push({
                  key: 'buwei',
                  value: v.value
                })
              }
              break
            case '1608003999000_12190':
              getSelectColumn(v, columnValue, 'xingzhi')
              break
            case '1608003999000_15794':
              getSelectColumn(v, columnValue, 'chengdu')
              break
            case '1608003999000_1681':
              getSelectColumn(v, columnValue, 'chixushijian')
              break
            case '1608003999000_52511':
              getSelectColumn(v, columnValue, 'zhengzhuang')
              break
            case '1608003999000_7505':
              getSelectColumn(v, columnValue, 'jiazhongyinsu')
              break
            case '1608003999000_11335':
              getSelectColumn(v, columnValue, 'huanjieyinsu')
              break
            case '1608003999000_38431':
              getSelectColumn(v, columnValue, 'shuimian')
              break
            case '1608003999000_93924':
              getSelectColumn(v, columnValue, 'xinli')
              break
            case '1608003999000_49267':
              getSelectColumn(v, columnValue, 'zhiliaoyicongxing')
              break
            case '1608003999000_55944':
              if (v.value) {
                columnValue.push({
                  key: 'hulicuoshi',
                  value: v.value
                })
              }
              break
            case '1608003999000_75447':
              getSelectColumn(v, columnValue, 'zhiliaocuoshi')
              break
            case '1608003999000_42104':
              getSelectColumn(v, columnValue, 'yaoming')
              break
            case '1608003999000_43712':
              if (v.value) {
                columnValue.push({
                  key: 'jiliang',
                  value: v.value
                })
              }
              break
            case '1608003999000_48794':
              getSelectColumn(v, columnValue, 'tujing')
              break
            case '1608003999000_65738':
              getSelectColumn(v, columnValue, 'zaipinggu')
              if (!v.value) {
                temperature.phValue = null
              }
              break
            case '1608003999000_31901':
              if (v.value) {
                columnValue.push({
                  key: 'qianming',
                  value: v.value
                })
              }
              break
            default:
              break
          }
        })
        if (!time) {
          time = moment().format('YYYY-MM-DD HH:mm:ss')
        }
        if (time) {
          columnValue.push({
            key: 'time',
            value: time
          })
          temperature.time = time
          params.assDate = time
        }
        params.columnValue = columnValue
        assenssmentRecords.push(params)
        recordList.push(temperature)
      }))
      // 将时刻点赋值进去
      recordList.map(item => {
        this.temperatureList.map(v => {
          if (item.time && item.syncTemperature) {
            let diff = Math.abs(moment(item.time).diff(moment((`${moment(item.recordDate).format('YYYY-MM-DD')} ${v.measuringTime}:00:00`))))
            if (!item.itemHour) {
              item.itemHour = v.measuringTime
              item.diff = diff
              return
            }
            if (diff < item.diff) {
              item.itemHour = v.measuringTime
              item.diff = diff
            }
          }
        })
      })
      // 筛选点时刻相同的数据，只选取最近的
      let recordSyncList = []
      recordList.map(item => {
        if (item.phValue) {
          item.signValue = null
          recordSyncList.push(item)
          return
        }
        let flag = true
        let index
        recordSyncList.map((v, i) => {
          if (v.itemHour == item.itemHour && v.recordDate == item.recordDate) {
            if (item.diff < v.diff) {
              index = i
            } else {
              flag = false
            }
          }
        })
        if (flag) {
          if (index || index == 0) {
            recordSyncList.splice(index, 1, item)
          } else {
            recordSyncList.push(item)
          }
        }
      })
      // 过滤不符合的再评估
      let filterPhValue = []
      recordSyncList.sort((a, b) => { return a.index - b.index })
      recordSyncList.map((item, index) => {
        let prev = recordSyncList[index - 1]
        if (item.phValue) {
          if (!prev || prev.index != item.index - 1 || prev.phValue) {
            filterPhValue.push(item.index)
          } else {
            item.itemHour = prev.itemHour
            item.recordDate = prev.recordDate
          }
        } else {
        }
      })
      recordSyncList = recordSyncList.filter((item) => {
        return filterPhValue.indexOf(item.index) < 0
      })
      // 再比对全部数据同步体温单
      let recordDate = ''
      recordSyncList.map(item => {
        if (!item.phValue) {
          recordDate += recordDate ? `,${item.recordDate}` : item.recordDate
        }
      })
      console.log(recordDate)
      try {
        let res = await ApiAssManage.getRecordDate({
          assId: this.temp.assId,
          patientId: this.patient.patientId,
          recordDate
        })
        let recordDateList = res.data
        let filterList = []
        recordSyncList.map(item => {
          if (item.phValue) {
            return
          }
          recordDateList.map(v => {
            if (v.hours && v.hours[item.itemHour]) {
              let diff = Math.abs(moment(v.hours[item.itemHour]).diff(moment((`${moment(item.recordDate).format('YYYY-MM-DD')} ${item.itemHour}:00:00`))))
              if (diff < item.diff) {
                filterList.push(item.index)
              }
            }
          })
        })
        recordSyncList = recordSyncList.filter(item => {
          return filterList.indexOf(item.index) < 0
        })
        // 再过滤不符合的再评估
        let filterPhValue = []
        recordSyncList.sort((a, b) => { return a.index - b.index })
        recordSyncList.map((item, index) => {
          let prev = recordSyncList[index - 1]
          if (item.phValue) {
            if (!prev || prev.index != item.index - 1 || prev.phValue) {
              filterPhValue.push(item.index)
            } else {
              item.itemHour = prev.itemHour
              item.recordDate = prev.recordDate
            }
          } else {
          }
        })
        recordSyncList = recordSyncList.filter((item) => {
          return filterPhValue.indexOf(item.index) < 0
        })
      } catch (error) {
        console.log(error)
      }
      try {
        let res = await ApiAssManage.addLoop(assenssmentRecords)
        let res2 = await ApiAssManage.syncTemperature({
          patientId: this.patient.patientId,
          recordList: recordSyncList
        })
        this.$emit('main-reload')
        this.$emit('option-changed', 'list')
      } catch (error) {
        this.$message.error(error.message)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.observe-pain {
  overflow: auto;
  height: 100%;
  position: relative;
  .btn-group {
    display: flex;
    .btn {
      width: 80px;
      height: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .typt-add-footer {
    padding: 8px 0 7px;
    box-shadow: 0px 0px 6px 1px rgba(114, 114, 114, 0.3);
    position: sticky;
    width: 100%;
    background: #fff;
    bottom: 0;
  }
}
</style>
