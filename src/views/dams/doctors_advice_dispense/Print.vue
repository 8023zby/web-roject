<template>
  <div class="print_container" v-loading="loading">
    <div id="print_btn">
      <el-button v-uni="'peiyeguanli_print'" @click="printView">打印</el-button>
      <el-button v-uni="'peiyeguanli_goback'" @click="close">返回</el-button>
    </div>
    <div id="label_container">
      <div class="label"
           v-for="item in table_data"
           :key="item.index">
        <div class="top">
          <div class="bedNo">{{item.bedName}}</div>
          <div class="patientName">{{item.patientName}}</div>
          <div class="id">{{item.patientId}}</div>
        </div>
        <div class="middle">
          <div class="middle_top">
            <div class="item"
                 v-for="nitem in item.itemList"
                 :key="nitem.index">{{nitem.medicalItemName || ''}} &nbsp;&nbsp;   {{nitem.dosage || ''}}</div>
          </div>
          <div class="middle_bottom">
            <div class="left">
              <div>
                <span class="item">配液：{{item.dispenseNurse ? user_data[item.dispenseNurse]: ''}}</span>
                <span class="item">时间：{{item.dispenseTime || ''}}</span>
              </div>
              <div>
                <span class="item">核对：
                {{item.dispenseCheckNurse ? user_data[item.dispenseCheckNurse]: ''}}
              </span>
                <span class="item">时间：{{item.dispenseCheckTime || ''}}</span>
              </div>
              <div>
                <span class="item">滴速：{{item.itemList[0].disu || ''}}</span>
              </div>
            </div>
            <div class="right">
              <div class="qrImg">
                <img :src="item.qrImg">
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="frequencyCode">{{item.frequencyCode}}</div>
          <div class="frequencyExecuteTime">{{item.frequencyExecuteTime}}</div>
          <div class="printDate">{{search_form.targetDate}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import printJS from 'print-js'
import moment from 'moment'
import printStyle from './printStyle'
import { ApiDoctorsAdviceDispense,ApiUser } from '../../../api/dams/index'

export default {
  name: 'advice_dispense_print',
  data () {
    return {
      loading: false,
      // 查询表单
      user_data: [], // 用户信息
      search_form: {
        patientId: '',
        adviceType: '',
        printCode: '',
        targetDate: moment().format('YYYY-MM-DD'),
        dispenseStatus: '',
        page: 1,
        size: 10
      },
      table_data: [],
      // 二维码查询
      qrStr: '',
      dataArr: []
    }
  },
  props: ['params', 'patient'],
  created () {
    console.log('params',this.params)
    this.search_form.patientId = this.patient.patientId
    this.getData() // 获取用户信息  用于根据id显示姓名的对比
  },
  methods: {
    getData () {
      ApiUser.nurse().then(res => {
        const data = res.data || []
        for (let i = 0; i < data.length; i++) {
          this.user_data[data[i]['empId']] = data[i]['empName']
        }
        this.getTableData()
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    getTableData () {
      this.table_data = []
      this.loading = true
      // 选择多条
      if (this.params instanceof Array) {
        let data = this.params
        this.dataArr = []
        for (let i = 0; i < data.length; i++) {
          let dataItem = data[i]
          this.getQrData(dataItem)
        }
        this.table_data = this.dataArr
        this.loading = false
      } else {
        // 全部打印
        this.search_form.page = ''
        this.pageData()
      }
    },
    // 全部打印
    pageData () {
      ApiDoctorsAdviceDispense.select(this.search_form)
        .then(res => {
          let list = res.data
          this.table_data = this.parseData(list)
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    parseData (list) {
      list = list || []
      let data = []
      // 组装数据 一项大医嘱根据执行时间点的数量来显示条数
      for (let i = 0; i < list.length; i++) { // 循环最外层
        let item = list[i]
        for (let k = 0; k < list[i].dispenseList.length; k++) { // 循环配液时间点
          let dispenseListItem = list[i].dispenseList[k]
          let kItem = {}
          let dispenseListItemArr = []
          kItem = { ...item }
          dispenseListItemArr.push(dispenseListItem)
          kItem['dispenseList'] = dispenseListItemArr
          for (let j = 0; j < list[i].itemList.length; j++) { // 循环医嘱项
            let nItem = {}
            let _k = list[i].itemList[j]
            if (j === 0) {
              nItem = { ...kItem }
              nItem['main'] = true // 医嘱第一条复选框可勾选
              nItem['medicalItemName'] = _k['medicalItemName']
              nItem['dosage'] = _k['dosage']
              nItem['number'] = _k['number']
              nItem['purpose'] = _k['purpose']
              nItem['printCount'] = dispenseListItem['printCount']
              nItem['frequencyExecuteTime'] = dispenseListItem['frequencyExecuteTime']
              nItem['dispenseTime'] = dispenseListItem['dispenseTime']
              nItem['dispenseNurse'] = dispenseListItem['dispenseNurse']
              nItem['dispenseCheckTime'] = dispenseListItem['dispenseCheckTime']
              nItem['dispenseCheckNurse'] = dispenseListItem['dispenseCheckNurse']
              nItem['dispenseStatus'] = dispenseListItem['dispenseStatus']
              nItem['dispenseCheckStatus'] = dispenseListItem['dispenseCheckStatus']
              data.push(nItem)
            }
          }
        }
      }
      for (let m = 0; m < data.length; m++) {
        let dataItem = data[m]
        this.getQrData(dataItem)
      }
      return this.dataArr
    },
    // 获取二维码图片
    getQrData (data) {
      this.loading = true
      let dataItem = JSON.parse(JSON.stringify(data))
      //二维码中包含的患者id和deptid 后台自动获取 显示在二维码中 不需前端传
      ApiDoctorsAdviceDispense.selectQr({ adviceId: dataItem.medicalAdviceId, extendId: dataItem.dispenseList[0].extendId, targetDate: moment().format('YYYY-MM-DD'), width: 100, height: 100 })
        .then(res => {
          this.loading = false
          if (res.data != null) {
            this.qrStr = 'data:image/png;base64,' + res.data
            data['qrImg'] = this.qrStr
            this.dataArr.push(data)
          }
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    printView () {
      printJS({
        printable: 'label_container',
        type: 'html',
        style: printStyle,
        scanStyles: false
      })
    },
    close () {
      this.$emit('option-changed', 'list')
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  .print_container {
    position: relative;
  }

  #print_btn {
    position: absolute;
    top: 15px;
    right: 10%;
  }

  #label_container {
    height: 100%;
    overflow: auto;
    margin: 40px auto;
    width: 500px;
  }
  /* 打印样式开始*/
  .label{
    width: 500px;
    font-size: 14px;
    color: #333;
    margin-bottom: 10px;
  }
  .top,.bottom{
    height:45px ;
    line-height: 45px;
    display: flex;
    flex-direction: row;
    align-content: space-between;
    border: 1px solid #333333;
  }
  .bedNo,.patientName,.id,.frequencyCode,.frequencyExecuteTime,.printDate{
    flex: 1;
    flex-basis: 0%;
    overflow: hidden;
    padding-left: 10px;
    padding-right: 10px;
  }
  .id{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; // 指定行数
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    line-height: 22px;
  }
  .middle{
    height:260px ;
    border-left: 1px solid #333333;
    border-right:1px solid #333333;
    padding: 10px;
    .middle_top{
      height: 130px;
      .item{
        height: 40px;
        line-height: 40px;
      }
    }
    .middle_bottom{
      height: 130px;
      .left{
        width: 350px;
        float: left;
        div{
          height: 40px;
          line-height: 40px;
          .item:nth-child(1){
            display: inline-block;
            padding-right: 15px;
            white-space: nowrap;
            width: 45%;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .item:nth-child(2){
            display: inline-block;
            padding-right: 15px;
            white-space: nowrap;
            width: 45%;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

      }
      .right{
        float: left;
        .qrImg{
          width: 100px;
          height: 100px;
        }
      }
    }
  }
  /* 打印样式结束*/
</style>
