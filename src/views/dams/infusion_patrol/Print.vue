<template>
  <div class="print_container" v-loading="loading">
    <div id="print_btn">
      <el-button v-uni="'shuyexunshi_print'" @click="printView">打印</el-button>
      <el-button v-uni="'shuyexunshi_goback'" @click="close">返回</el-button>
    </div>
    <div class="dams_doctors_advice_long_tern_container" id="dams_doctors_advice_long_tern_container">
      <table id="dams_doctors_advice_long_tern_container_table">
        <colgroup>
          <col width="60">
          <col width="50">
          <col width="auto">
          <col width="65">
          <col width="65">
          <col width="40">
          <col width="65">
          <col width="65">
          <col width="80">
        </colgroup>
        <thead>
        <tr>
          <td colspan="9" class="hospital">xxx附属医院</td>
        </tr>
        <tr>
          <td colspan="9" class="title">输液巡视单</td>
        </tr>
        <tr>
          <td colspan="9" class="patient">
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
          <td>执行<br/>时间点</td>
          <td>流程类型</td>
          <td>滴速</td>
          <td>执行人</td>
          <td>记录时间</td>
          <td>备注</td>
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
          <td>{{advice.frequencyExecuteTime || ''}}</td>
          <td>{{advice.patrolTypeDesc}}</td>
          <td>{{advice.patrolSpeed || ''}}</td>
          <td>{{user_data[advice.patrolNurse] || ''}}</td>
          <!--<td>09-09 12:45</td>-->
          <td>{{advice.patrolTime2}}</td>
          <td>
            <div>{{advice.remark.remarkOperate || ''}}{{advice.remark.remarkContent || ''}}</div>
          </td>
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
  import { ApiInfusionPatrol, ApiUser } from '../../../api/dams/index'

  export default {
    name: 'doctors_advice_infusion_patrol_print',
    data () {
      return {
        loading: false,
        //查询表单
        search_form: {
          empId: 22,
          patientId: '',
          targetDate: ''
        },
        deptName: '',
        user_data: [],
        table_data: []
      }
    },
    props: ['param', 'patient', "executeDate"],
    created () {
      let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || []
      this.deptName = deptInfo.deptName || ''
      this.search_form.patientId = this.patient.patientId
      this.search_form.targetDate = this.executeDate

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
        // 选择多条
        if (this.param instanceof Array) {
          this.table_data = this.parseData(this.param);
          this.$nextTick(function () {
            this.printView();
          });
          this.loading = false
        }
        // 全部
        else {
          this.pageData()
        }
      },
      // 全部
      pageData () {
        ApiInfusionPatrol.select(this.search_form)
          .then(res => {
            let list = res.data
            this.table_data = this.parseData(list);
            this.$nextTick(function () {
              this.printView();
            });
            this.loading = false
          })
          .catch(res => {
            this.loading = false
            this.$message.error(res.message)
          })
      },
      parseData (list) {
        list = list || []
        let data = [];

        //处理数据
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
          // 12:00:00
          // item['frequencyExecuteTime'] = item['frequencyExecuteTime'] ? moment(item['frequencyExecuteTime']).format('HH:mm') : '';
          // 医嘱项目
          for (let x = 0; x < item.itemList.length; x++) {
            let _d = item.itemList[x];
            _d['medicalAdviceItemId'] = _d['medicalAdviceItemId'] + '-' + item['executeId'];
            _d['remark'] = { disu: '', remarkOperate: '', remarkContent: '' };

            if (item.itemList.length > 1) {
              if (x === 0) {
                _d['start'] = true
              } else if (x === item.itemList.length - 1) {
                _d['end'] = true
              } else {
                _d['center'] = true
              }
            }

            if (x === 0) {
              item = Object.assign({}, item, _d);
              item['startAdviceDate'] = item['startAdviceTime'] ? moment(item['startAdviceTime']).format('MM-DD') : '';
              item['startAdviceTime'] = item['startAdviceTime'] ? moment(item['startAdviceTime']).format('HH:mm') : '';
              data.push(item);
            } else {
              data.push(_d);
            }
          }
          // 巡视项目
          for (let y = 0; y < item.patrolList.length; y++) {
            let _d = item.patrolList[y];
            // 用个2的 防止list显示错误
            _d['patrolTime2'] = _d['patrolTime'] ? moment(_d['patrolTime']).format('HH:mm') : '';
            delete _d['frequencyExecuteTime'];
            if(!_d['remark']){
              _d['remark'] = { disu: '', remarkOperate: '', remarkContent: '' };
            } else if (_d['remark'] instanceof String){
              _d['remark'] = JSON.parse(_d['remark']);
            }

            console.log(_d['remark'])

            if (y === 0) {
              data[data.length - 1] = Object.assign({}, data[data.length - 1], _d);
            } else {
              data.push(_d);
            }
          }
        }

        /*
        //处理数据
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
          item['startAdviceDate'] = item['startAdviceTime'] ? moment(item['startAdviceTime']).format('MM-DD') : '';
          item['startAdviceTime'] = item['startAdviceTime'] ? moment(item['startAdviceTime']).format('HH:mm') : '';

          for (let x = 0; x < item.itemList.length; x++) {
            let _d = item.itemList[x];
            _d['medicalAdviceItemId'] = _d['medicalAdviceItemId'] + '-' + item['extendId'];
          }

          let first_item = item.itemList.slice(0, 1);
          let surplus  = item.itemList.slice(1);


          item = Object.assign({}, item, first_item[0]);
          item.patrolList[0]['remark'] = item.patrolList[0]['remark'] ? JSON.parse(item.patrolList[0]['remark']) : { disu: '', remarkOperate: '', remarkContent: '' };
          item.patrolList[0]['patrolTime'] = item.patrolList[0]['patrolTime'] ? moment(item.patrolList[0]['patrolTime']).format('HH:mm') : '';
          if(surplus.length > 0) {
            if(!item.children_data) item.children_data = [];
            for (let h = 0; h < surplus.length; h++) {
              item.children_data.push({
                medicalItemName: surplus[h].medicalItemName,
                dosage: surplus[h].dosage
              });
            }

            item.children_data[item.children_data.length - 1] = Object.assign({}, item.children_data[item.children_data.length - 1], item.patrolList[0]);
          } else {
            item = Object.assign({}, item, item.patrolList[0]);
          }

          // 剩余放入子项
          if(!item.children_data) item.children_data = [];
          for (let y = 1; y < item.patrolList.length; y++) {
            let _d = item.patrolList[y];
            delete _d['frequencyExecuteTime'];
            _d['patrolTime'] = _d['patrolTime'] ? moment(_d['patrolTime']).format('HH:mm') : '';
            _d['remark'] = _d['remark'] ? JSON.parse(_d['remark']) : { disu: '', remarkOperate: '', remarkContent: '' };

            item.children_data.push(_d);
          }

          console.log(item);
          data.push(item);
        }
        */
        console.log(data)
        return data
      },
      printPreview (){
        this.getData();
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
