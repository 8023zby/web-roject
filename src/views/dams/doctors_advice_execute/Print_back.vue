<template>
  <div class="print_container" v-loading="loading">
    <div id="print_btn">
      <el-button v-uni="'yizhuzhixing_print'" @click="printView">打印</el-button>
      <el-button v-uni="'yizhuzhixing_goback'" @click="close">返回</el-button>
    </div>
    <div class="dams_doctors_advice_long_tern_container" id="dams_doctors_advice_long_tern_container">
      <table id="dams_doctors_advice_long_tern_container_table">
        <colgroup>
          <col width="60">
          <col width="50">
          <col width="auto">
          <col width="65">
          <col width="65">
          <col width="65">
          <col width="65">
        </colgroup>
        <thead>
        <tr>
          <td colspan="7" class="hospital">xxx附属医院</td>
        </tr>
        <tr>
          <td colspan="7" class="title">医嘱执行单</td>
        </tr>
        <tr>
          <td colspan="7" class="patient">
            <div>
              <div>姓名：{{patient.patientName || ''}}</div>
              <div>性别：{{patient.sex || ''}}</div>
              <div>年龄：{{patient.patientAge || ''}}</div>
              <div>床号：{{patient.bedName || ''}}床</div>
              <div>科室：{{deptName || ''}}</div>
              <div>住院号：{{patient.inpNo || ''}}</div>
            </div>
          </td>
        </tr>
        <tr class="thead">
          <td>日期</td>
          <td>时间</td>
          <td>医嘱</td>
          <td>开始执行<br/>时间</td>
          <td>护士签名</td>
          <td>结束执行<br/>时间</td>
          <td>护士签名</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="advice in table_data">
          <td>{{advice.startAdviceDate}}</td>
          <td>{{advice.startAdviceTime}}</td>
          <td class="advice">
            <div>{{advice.medicalItemName}}</div>
            <img src="/static/dams/advice_p1.png" v-if="advice.start">
            <img src="/static/dams/advice_p2.png" v-if="advice.center">
            <img src="/static/dams/advice_p3.png" v-if="advice.end">
          </td>
          <!--<td>09-09 12:45</td>-->
          <td>{{advice.executeTime}}</td>
          <td>{{user_data[advice.executeNurse] || ''}}</td>
          <!--<td>09-09 12:45</td>-->
          <td>{{advice.endTime}}</td>
          <td>{{user_data[advice.endNurse] || ''}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import printJS from 'print-js'
  import moment from 'moment'
  import printStyle from './printStyle'
  import { ApiAdviceExecute, ApiUser } from '../../../api/dams/index'

  export default {
    name: 'doctors_advice_execute_print',
    data () {
      return {
        loading: false,
        //查询表单
        search_form: {
          patientId: '',
          executeDate: '',
          page: 1,
          size: 24
        },
        deptName: '',
        user_data: []
      }
    },
    props: ['param', 'patient', "executeDate"],
    created () {
      let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || []
      this.deptName = deptInfo.deptName || ''
      this.search_form.patientId = this.patient.patientId
      this.search_form.executeDate = this.executeDate

      this.getUserData()
      this.getData()
    },
    methods: {
      // 获取护士用户信息
      getUserData () {
        ApiUser.nurse().then(res => {
          const data = res.data || [];
          for (let i = 0; i < data.length; i++) {
            this.user_data[data[i]['empId']] = data[i]['empName']
          }
        }).catch(res => {
          this.$message.error(res.message)
        })
      },
      getData () {
        this.table_data = []
        this.loading = true
        // 选择多条
        if (this.param instanceof Array) {
          this.table_data = this.parseData(this.param)
          this.loading = false
        }
        // 全部
        else {
          this.search_form.page = ''
          this.pageData()
        }
      },
      // 全部
      pageData () {
        ApiAdviceExecute.select(this.search_form)
          .then(res => {
            let list = res.data.list
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
        //处理数据
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          let advice = []
          for (let x = 0; x < list[i].medicalAdviceItemDoList.length; x++) {
            let _d = list[i].medicalAdviceItemDoList[x]
            let nItem = {}
            if (x === 0) {
              nItem = { ...item }
              nItem['startAdviceDate'] = nItem['startAdviceTime'] ? moment(nItem['startAdviceTime']).format('MM-DD') : ''
              nItem['startAdviceTime'] = nItem['startAdviceTime'] ? moment(nItem['startAdviceTime']).format('HH:mm') : ''

              nItem['medicalItemName'] = _d['medicalItemName']
            } else {
              nItem['medicalItemName'] = _d['medicalItemName']
            }

            if (list[i].medicalAdviceItemDoList.length > 1) {
              if (x === 0) {
                nItem['start'] = true
              } else if (x === list[i].medicalAdviceItemDoList.length - 1) {
                nItem['end'] = true
              } else {
                nItem['center'] = true
              }
            }

            advice.push(nItem)
          }
          //处理执行数据
          if(list[i].medicalAdviceExecuteList.length > 0) {
            for (let y = 0; y < list[i].medicalAdviceExecuteList.length; y++) {
              let _d = list[i].medicalAdviceExecuteList[y]
              if(!_d['executeId']) continue
              delete _d['remark'] //都有remark属性，会冲突
              _d['executeTime'] = _d['executeTime'] ? moment(_d['executeTime']).format('HH:mm') : ''
              _d['endTime'] = _d['endTime'] ? moment(_d['endTime']).format('HH:mm') : ''
              if (y === 0) {
                Object.assign(advice[advice.length - 1], _d)
              } else {
                advice.push(_d)
              }
            }
          }

          data.push(...advice)
        }

        console.log(data)

        return data
      },
      printView () {
        printJS({
          printable: 'dams_doctors_advice_long_tern_container_table',
          type: 'html',
          style: printStyle,
          scanStyles: false
        })
      },
      close () {
        this.$emit('option-changed', 'list')
      }
    },
    watch: {
      patient (val) {
        this.search_form.patientId = val.patientId
        this.getData()
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .print_container {
    height: 100%;
    position: relative;
  }

  #print_btn {
    position: absolute;
    top: 15px;
    right: 10%;
  }

  .dams_doctors_advice_long_tern_container {
    height: 100%;
    overflow: auto;
  }

  /* 打印部分的样式 start */
  table {
    margin: 0 auto;
    width: 750px;
    border-collapse: collapse;
    table-layout: fixed;
    font-size: 12px;
  }

  td {
    text-align: center;
    border: 1px solid black;
  }

  tbody td, .thead {
    height: 35px;
  }

  tbody td {
    div {
      text-align: left;
      padding: 0 5px;
    }
  }

  .advice {
    padding-right: 30px;
    position: relative;

    img {
      position: absolute;
      top: 3px;
      right: 10px;
    }
  }

  .hospital, .title, .patient {
    border: none;
  }

  .hospital {
    font-size: 16px;
  }

  .title {
    font-size: 20px;
  }

  .patient {
    padding: 10px;

    > div {
      display: flex;
      justify-content: space-around;
    }
  }

  /* 打印部分的样式 end */
</style>
