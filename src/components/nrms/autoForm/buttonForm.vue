<template>
  <div style="display: inline-block">
    <el-button
      v-if="element.config.btnType != 'importLast' || element.config.firstButton && (firstLineAssTime != 0 || ColIndex != 0 )"
      class="btn buttonForm"
      :type="element.value? 'null' : 'primary'"
      @click="operator"
      :class="{'print-hidden': element.config.printHidden}"
      :style="{width: element.config.width}"
      :size="element.config.size"
      :disabled="element.config.disabled"
      :plain="element.config.plain"
    >{{ ( element.config.btnType != 'admissionImport' || !element.value ) ? element.config.label: element.config.labelAfter}}</el-button>
    <el-dialog :title="element.config.importTitle" :visible.sync="importVisible" width="1200px" v-if="importVisible">
      <component
        :is="'importAddComponent'"
        :params="params"
        :hiddenFooter="true"
        ref="addRiskment"
        @reloadUrl="reloadUrl"
      />
      <div class="typt-add-footer" slot="footer">
        <el-button @click="reloadUrl">取消</el-button>
        <el-button type="primary" @click="saveData">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import AutoForm from '../../../assets/nrms/mixins/AutoForm'
import { AxiosApi } from '../../../api/nams/http/index'
import { ApiTemperatureSheet, ApiAssManage } from '../../../api/nrms/index'
import assess from '../../../api/nams/http/assess'
import importAddComponent from '../../../views/nrms/RiskAssessment/Add.vue'
import { EOutHospitalFlag, EPatientType } from '../../../assets/nrms/enum/patient'
const moment = require('moment')
const button = {
  type: 'button',
  value: '',
  key: '1600149598000_36333',
  config: {
    label: '开始评估',
    importTitle: '跌倒/坠床危险性评估',
    btnType: 'import',
    importTime: 'last',
    printHidden: true,
    size: 'mini',
    width: '80px',
    scoreKey: '1599802471000_5976',
    levelKey: '1600151743000_70185',
    assId: '10002'
  }
}
export default {
  name: 'buttonForm',
  props: ['element', 'valueData', 'data', 'isEdit', 'ColIndex', 'firstLineAssTime', 'patient', 'tempList'],
  mixins: [AutoForm, assess],
  components: { importAddComponent },
  data () {
    return {
      importVisible: false,
      params: {
        patient: this.patient,
        temp: {}
      },
      tableLoading: true,
      EPatientType: EPatientType,
      EOutHospitalFlag: EOutHospitalFlag
    }
  },
  created () {
    if (this.element.config.btnType == 'import') {
      this.getLayui()
    }
    if (this.patient) {
      if (this.patient.patientType == this.EPatientType.out && this.patient.outHospitalFlag != this.EOutHospitalFlag.return && this.element.config.btnType == 'importLast') {
        this.element.config.disabled = true
      }
    }
  },
  mounted () {
    switch (this.element.config.btnType) {
      case 'import':
        this.onImport(null, true)
        break
      case 'admissionImport':
        this.admissionImport(true)
        break
      default:
        break
    }
  },
  methods: {
    onChange (e) {
      this.$emit('changeValue', {
        key: this.element.key,
        value: this.element.value,
        score: 0
      })
    },
    operator () {
      // 按钮类型
      switch (this.element.config.btnType) {
        case 'signature':
          // 签名按钮
          this.onSignature()
          break
        case 'import':
          // 引用按钮
          this.onImport(true)
          break
        case 'output':
          // 导出按钮
          this.outPut()
          break
        case 'importLast':
          // 导入上次评测按钮
          this.importLast()
          break
        case 'admissionImport':
          this.admissionImport(false)
          break
        default:
          break
      }
    },
    onSignature () {
      let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
      let empName = empInfo.empName
      this.operatorFormData((item) => {
        if (item.key == this.element.config.signKey) {
          item.value = empName
          this.$emit('changeValue', {
            key: item.key,
            value: item.value,
            score: 0
          })
        }
        if (item.key == this.element.config.signTimeKey) {
          item.value = moment().format('YYYY-MM-DD HH:mm:ss')
          this.$emit('changeValue', {
            key: item.key,
            value: item.value,
            score: 0
          })
        }
      })
    },
    /**
     * 获取今天 && 当前评估单id
     */
    getTodayMangeList () {
      let patientId = localStorage.getItem('formPatientId')
      let todayTime = ''
      this.valueData.map(item => {
        if (item.key === this.element.key) {
          todayTime = this.element.value
        }
      })
      let startTime = moment().startOf('days').format('YYYY-MM-DD HH:mm:ss')
      let endTime = moment().endOf('days').format('YYYY-MM-DD HH:mm:ss')
      if (todayTime) {
        startTime = moment(todayTime).startOf('days').format('YYYY-MM-DD HH:mm:ss')
        endTime = moment(todayTime).endOf('days').format('YYYY-MM-DD HH:mm:ss')
      }
      ApiAssManage.getList({
        patientId,
        assClass: '10',
        moduleId: this.element.config.moduleId,
        startTime: startTime,
        endTime: endTime,
        sort: {
          ass_date: 1
        }
      }).then(res => {
        let assItem = res.data[0]
        if (!assItem) {
          return
        }
        this.element.value = startTime
        this.$emit('changeValue', {
          key: this.element.key,
          value: this.element.value,
          score: 0
        })
        this.operatorFormData((item) => {
          if (item.key == this.element.config.scoreKey) {
            item.value = assItem.grade || '0'
            this.element.config.changeText = true
            this.element.config.styleType = 'null'
            this.$emit('changeValue', {
              key: item.key,
              value: item.value,
              score: item.value
            })
          }
        })
      })
    },
    /**
     * @description: 入院评估引用评估
     * @param {*} isDefaultImport 是否是添加时默认引入的
     * @return {*}
     */
    async admissionImport (isDefaultImport = false) {
      let patientId = localStorage.getItem('formPatientId')
      if (!isDefaultImport) {
        if (!this.tempList || !this.tempList.length) {
          this.$message.error('该评估单暂未配置')
          return false
        }
        let flag = this.tempList.every(item => { return item.moduleId != this.element.config.moduleId })
        if (flag) {
          this.$message.error('该评估单暂未配置')
          return false
        }
        this.tempList.forEach(el => {
          if (el.moduleId === this.element.config.moduleId) this.params.temp = el
        })
        try {
          let todayTime = ''
          this.valueData.map(item => {
            if (item.key === this.element.key) {
              console.log(item)
              todayTime = item.value
            }
          })
          let startTime = moment().startOf('days').format('YYYY-MM-DD HH:mm:ss')
          let endTime = moment().endOf('days').format('YYYY-MM-DD HH:mm:ss')
          if (todayTime) {
            startTime = moment(todayTime).startOf('days').format('YYYY-MM-DD HH:mm:ss')
            endTime = moment(todayTime).endOf('days').format('YYYY-MM-DD HH:mm:ss')
          }
          let res = await ApiAssManage.getList({
            patientId,
            assClass: '10',
            moduleId: this.element.config.moduleId,
            startTime: startTime,
            endTime: endTime,
            sort: {
              ass_date: 1
            }
          })
          if (res.data[0]) {
            this.params.row = res.data[0]
          } else {
            this.params.row = null
          }
        } catch (error) {

        }
        this.importVisible = true
        this.params = JSON.parse(JSON.stringify(this.params))
      }
      if (isDefaultImport && !this.isEdit) {
        this.getTodayMangeList()
        // return
      }
    },
    interfaceTmp () {
      let _this = this
      // 测试获取指定评估表字段
      AxiosApi(
        '/nams/web-na/ass-dict/get-html?assId=' + this.element.config.assId,
        {},
        'GET',
        {}
      ).then((res) => {
        if ((res.dexc = '操作成功')) {
          let tmp =
            '<div class="printClass"><button type="button" class="layui-btn layui-btn-normal printButton">打印</button></div>'
          $('.mobanHtml').html(tmp + res.data)
          $('#mobanHtml')
            .find('table:last')
            .after(
              '<div class="bottomPrint">以上记录属实。&nbsp;&nbsp;（打印后）家属/患者签字<span>&nbsp;</span>签字日期<span>&nbsp;</span></div>'
            )

          _this.getAssInfo()
          if (_this.saveDataFlag + '' == 'true') {
            $('.res_checkout').click(function () {
              _this.res_checkout()
            })
          } else {
            $('.res_checkout')
              .addClass('layui-btn-disabled')
              .click(function () {

              })
          }
          $('.printButton').click(function () {
            _this.clickPrint()
          })
          $('.printButton').click(function () {
            _this.clickPrint()
          })

          // _this.getAssInfoTmp();
        } else {
          _this.layer.alert('获取模板出错。')
        }
      })
    },
    async onImport (openLayer, isDefault) {
      let levelDesc = ''
      let assTimes = '-1'
      let assTime = moment().valueOf()
      if (this.element.value) {
        let valArr = this.element.value.split(',')
        assTime = valArr[0]
        assTimes = valArr[1]
      }
      let patientId = localStorage.getItem('formPatientId')
      let saveDataFlag = localStorage.getItem('formSaveDataFlag')
      let assId = this.element.config.assId
      if (!patientId) {
        return
      }
      if (!assId) {
        return
      }
      try {
        let assInfoId = ''
        if (this.element.config.importTime == 'last') {
          let infoListRes = await AxiosApi(
            '/nams/web-na/ass-info/get-infoList',
            {},
            'GET',
            {
              assId: assId,
              patientId: patientId,
              startTime: moment(Number(assTime)).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
              endTime: moment(Number(assTime)).endOf('day').format('YYYY-MM-DD HH:mm:ss')
            }
          ).then(infoListRes => {
            if (infoListRes.data && infoListRes.data.length) {
              // 如果之前有评估，则我要找到之前评估的那个id
              if (assTimes != '-1' && this.isEdit) {
                infoListRes.data.map(item => {
                  if (item.assTimes == assTimes) {
                    assInfoId = item.assInfoId
                  }
                })
              } else {
                let arr = infoListRes.data.sort((a, b) => {
                  return b.assTimes - a.assTimes
                })
                assInfoId = arr[0].assInfoId
                assTimes = arr[0].assTimes
              }
            }
            if (!assInfoId && !openLayer) {
              return
            }
            AxiosApi(
              `/nams/web-na/ass-info/get-ass-res?patientId=${patientId}&assIds=${assId}&assInfoId=${assInfoId}`,
              {},
              'GET',
              {}
            ).then(res => {
              let rs = res.data[0]
              let ass_res = rs.ass_res
              if (rs) {
                if (rs.ass_res && rs.ass_res.level !== '') {
                  let ruleInfo = '总分'
                  if (rs.ass_res.minRecord !== '') {
                    ruleInfo = rs.ass_res.minRecord + '≤' + ruleInfo
                  }
                  if (rs.ass_res.maxRecord !== '') {
                    ruleInfo = ruleInfo + '≤' + rs.ass_res.maxRecord
                  }
                  levelDesc = ruleInfo === '总分' ? '' : '(' + ruleInfo + ')'
                }
              }
              if (openLayer) {
                let isCancel = false
                let ass = layer.open({
                  type: 2,
                  title: this.element.config.importTitle,
                  shadeClose: false,
                  // shade: false,
                  area: ['1100px', '100%'],
                  content:
                '#/assess_info_repeat/' +
              rs.ass_id +
              '/' +
              patientId +
              '/' +
              rs.isLoop +
              '/' +
              rs.loopTimes +
              '/' +
              assTimes +
              '/' +
              saveDataFlag +
              '/' +
              (rs.levelType || '1'),
                  end: () => {
                    if (isCancel) {
                      return
                    }
                    this.onImport()
                  },
                  cancel: function (index, layero) {
                    if (
                      confirm(
                        '确认要关闭吗?\r\n点击"确认"将不保存数据直接关闭评估窗口；\r\n点击"取消"继续填写评估内容。'
                      )
                    ) {
                      isCancel = true
                      // 只有当点击confirm框的确认时，该层才会关闭
                      layer.close(index)
                    }
                    return false
                  }
                })
                return
              }
              this.element.value = `${assTime},${assTimes}`
              this.$emit('changeValue', {
                key: this.element.key,
                value: this.element.value,
                score: 0
              })
              this.operatorFormData((item) => {
                if (item.key == this.element.config.scoreKey) {
                  // 如果原本没有值并且不是编辑就填入，或者原本有值但是不是添加时默认引入的，就填入
                  if (!item.value && !this.isEdit || !isDefault) {
                    item.value = ass_res.totalScore
                    this.$emit('changeValue', {
                      key: item.key,
                      value: item.value,
                      score: 0
                    })
                  }
                }
                // 如果原本没有值并且不是编辑就填入，或者原本有值但是不是添加时默认引入的，就填入
                if (item.key == this.element.config.levelKey) {
                  if (!item.value && !this.isEdit || !isDefault) {
                    item.value = ass_res.level
                    if (this.element.config.levelDesc) {
                      item.value += levelDesc
                    }
                    this.$emit('changeValue', {
                      key: item.key,
                      value: item.value,
                      score: 0
                    })
                  }
                }
              })
            })
          })
        }
      } catch (error) {}
    },
    async outPut () {
      let outputList = []
      this.valueData.map(item => {
        this.element.config.outputList.map(v => {
          if (v.key == item.key) {
            outputList.push({
              signCode: v.signCode,
              signValue: item.value
            })
          }
        })
      })
      let empInfo = JSON.parse(localStorage.getItem('empInfo'))
      let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo'))
      let patientId = localStorage.getItem('formPatientId')
      ApiTemperatureSheet.outputSign({
        dataList: outputList,
        deptId: deptInfo.deptId,
        measureNurse: empInfo.empId,
        patientId: patientId,
        targetDate: moment().format('YYYY-MM-DD HH:mm:ss')
      }).then(res => {
        this.$message.success(res.desc)
      }).catch(e => {
        this.$message.error(e.message)
      })
    },
    /**
     * 压疮评测单-导入上次评测结果
     */
    importLast () {
      this.$emit('changeValueLoop', {
        index: this.ColIndex
      })
    },
    reloadUrl (flag) {
      if (flag) this.getTodayMangeList()
      this.importVisible = false
    },
    saveData () {
      this.$refs.addRiskment.saveData()
    }
  }
}
</script>
<style lang="scss" scoped>
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
}
.typt-add-footer {
  padding: 8px 0 7px;
  box-shadow: 0px 0px 6px 1px rgba(114, 114, 114, 0.3);
}
/deep/ .el-dialog__wrapper .el-dialog__footer {
  padding: 0;
}
</style>
