<template>
  <div class="print_container" v-loading="loading">
    <div id="print_btn">
      <el-button v-uni="'yizhuliebiao_print'" @click="printView">打印</el-button>
      <el-button v-uni="'yizhuliebiao_back'" @click="close">返回</el-button>
    </div>
    <div class="dams_doctors_advice_temporary_container" id="dams_doctors_advice_temporary_container">
      <table id="dams_doctors_advice_temporary_container_table">
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
          <td colspan="7" class="title">临时医嘱单</td>
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
          <td>医生签名</td>
          <td>护士签名</td>
          <td>执行时间</td>
          <td>执行护士</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="advice in table_data">
          <td>{{advice.startAdviceDate}}</td>
          <td>{{advice.startAdviceTime}}</td>
          <td class="advice">
            <div>{{advice.medicalItemName || ''}}</div>
            <img src="/static/dams/advice_p1.png" v-if="advice.start">
            <img src="/static/dams/advice_p2.png" v-if="advice.center">
            <img src="/static/dams/advice_p3.png" v-if="advice.end">
          </td>
          <td>{{advice.startAdviceDoctor || ''}}</td>
          <td>{{user_data[advice.checkStartNurse] || ''}}</td>
          <td>{{advice.executeTime || ''}}</td>
          <td>{{user_data[advice.executeNurse] || ''}}</td>
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
  import { ApiDoctorsAdvice, ApiUser } from '../../../../api/dams/index'

  export default {
    name: 'temporary_advice_print',
    data () {
      return {
        loading: false,
        //查询表单
        search_form: {
          patientId: '',
          medicalAdviceType: 1, // 临时医嘱
          page: 1,
          size: 24
        },
        table_data: [],
        deptName: '',
        user_data: {}
      }
    },
    props: ['param', 'patient'],
    created () {
      let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || []
      this.deptName = deptInfo.deptName || ''
      this.search_form.patientId = this.patient.patientId

      this.getUserData()
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
        this.search_form.patientId = this.patient.patientId
        this.table_data = []
        this.loading = true
        // 单页打印
        if (typeof this.param === 'number') {
          this.search_form.page = this.param
          ApiDoctorsAdvice.selectPrintPage(this.search_form)
            .then(res => {
              let list = res.data.list
              let data = {};
              for (let x = 0; x < list.length; x++) {
                let _d = list[x]
                if(!data[_d['medicalAdviceId']]){
                  data[_d['medicalAdviceId']] = {
                    medicalAdviceId: _d['medicalAdviceId'],
                    startAdviceDate: _d['startAdviceTime'] || '',
                    startAdviceTime: _d['startAdviceTime'] || '',
                    startAdviceDoctor: _d['startAdviceDoctor'] || '',
                    checkStartNurse: _d['checkStartNurse'] || '',
                    stopAdviceDate: _d['stopAdviceTime'] || '',
                    stopAdviceTime: _d['stopAdviceTime'] || '',
                    stopAdviceDoctor: _d['stopAdviceDoctor'] || '',
                    checkStopNurse: _d['checkStopNurse'] || '',
                    medicalAdviceItemDoList: [_d],
                    executeNurse: _d['executeNurse'],
                    executeTime: _d['executeTime']
                  }
                }else{
                  delete _d['executeNurse']
                  delete _d['executeTime']
                  data[_d['medicalAdviceId']]['medicalAdviceItemDoList'].push(_d)
                }
              }
              let data2 = [];
              for (let p in data) {
                data2.push(data[p])
              }
              this.table_data = this.parseData(data2);

              this.$nextTick(function () {
                this.printView();
              })
              this.loading = false
            })
            .catch(res => {
              this.loading = false
              this.$message.error(res.message)
            })
        }
        // 选择多条
        else if (this.param instanceof Array) {
          let data = this.param
          this.table_data = this.parseData(data)

          this.$nextTick(function () {
            this.printView();
          })
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
        ApiDoctorsAdvice.select(this.search_form)
          .then(res => {
            let list = res.data.list
            this.table_data = this.parseData(list)

            this.$nextTick(function () {
              this.printView();
            })
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
          if(!item['medicalAdviceId']){
            continue;
          }

          for (let x = 0; x < list[i].medicalAdviceItemDoList.length; x++) {
            let _d = list[i].medicalAdviceItemDoList[x]
            let nItem = {}
            if (x === 0) {
              nItem = { ...item }
              nItem['startAdviceDate'] = nItem['startAdviceTime'] ? moment(nItem['startAdviceTime']).format('MM-DD') : ''
              nItem['startAdviceTime'] = nItem['startAdviceTime'] ? moment(nItem['startAdviceTime']).format('HH:mm') : ''
              nItem['stopAdviceDate'] = nItem['stopAdviceTime'] ? moment(nItem['stopAdviceTime']).format('MM-DD') : ''
              nItem['stopAdviceTime'] = nItem['stopAdviceTime'] ? moment(nItem['stopAdviceTime']).format('HH:mm') : ''
              //执行时间
              if(_d['executeTime']) {
                _d['executeTime'] = _d['executeTime'] ? moment(_d['executeTime']).format('HH:mm') : ''
              }
              nItem['medicalItemName'] = _d['medicalItemName'] + (_d['dosage'] ? ' ' + _d['dosage'] : '') + (_d['purpose'] ? ' ' + _d['purpose'] : '');
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

            nItem.executeNurse = nItem.medicalAdviceOperationType !== 8
                ? nItem.executeNurse
                : (
                    nItem.skinTestExecuteDtoList && nItem.skinTestExecuteDtoList[0]
                      ? nItem.skinTestExecuteDtoList[0].executeNurse
                      : ''
                  );

            nItem.executeTime = nItem.medicalAdviceOperationType !== 8
              ? nItem.executeTime
              : (nItem.skinTestExecuteDtoList && nItem.skinTestExecuteDtoList[0]
                  ? nItem.skinTestExecuteDtoList[0].executeTime
                  : ''
                );
            nItem['executeTime'] = nItem['executeTime'] ? moment(nItem['executeTime']).format('HH:mm') : ''

            data.push(nItem)
          }
        }

        return data
      },
      parseDataToPrintView (){
        this.getData();
      },
      printView () {
        printJS({
          printable: 'dams_doctors_advice_temporary_container_table',
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
        // this.search_form.patientId = val.patientId
        // this.getData()
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

  .dams_doctors_advice_temporary_container {
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
