<template>

  <layout v-loading="loading">
    <div slot="aside">
      <patient-list @initPatient="initPatient" initRowType="in" initRowIndex="0"/>
    </div>
    <div slot="main">
      <assess-info v-if="paraData!=null"  :params="paraData" />
    </div>

  </layout>

  <!---->
  <!---->
  <!--<div style="display: block;height: 100%;" >-->
    <!--<div class="patientContainer">-->
      <!--<patient-list @initPatient="initPatient" initRowType="in" initRowIndex="0" />-->
    <!--</div>-->
    <!--<div class="assContainer el-container">-->
      <!--<assess-info v-if="paraData!=null"  :params="paraData" />-->
    <!--</div>-->
  <!--</div>-->
</template>

<script>
  import PatientList from '../../../components/nams/PatientList';
  import layout from '../../../components/nrms/layout/aside'

  import assess_info  from './assess_info.vue'
  export default {
      data() {
        return {
          loading:false,
          tabPosition: 'right',
          //deptId:'01001',
          activeName:'',
          paraData:null,
          assData:[],
          patient:null,
          saveDataFlag:true
          //allTrue:正常状态，allFalse:不获取 HIS，不能保存不能添加，hisT_SaveF
        };
      },
      created(){
        console.log
      },
      mounted(){
        //this.formatPagePara();
        //console.log(params)

      },
      methods:{
        initPatient(patient,type) {
/*
          console.log('<<<<---------------------')
          console.log(patient);
          console.log(p_type);
          console.log('--------------------->>>>')
*/
          this.patient=patient;
          this.$set(this.patient, 'patientType', type);
          if((this.patient.patientType == 2 && this.patient.outHospitalFlag != 1) || this.patient.patientType == 1){
            this.saveDataFlag = false
          }else{
            this.saveDataFlag = true
          }
          console.log('this.saveDataFlag:'+this.saveDataFlag)



          //this.paraData={};
          this.formatParaData();

        },
        getData(){
          let _this=this;
          _this.formatParaData();

        },
        formatParaData(){
          console.log('formatParaData')
          this.paraData={
            assId:'10001',
            assName:'入院评估',
            isLoop:0,
            assRate:0,
            patientId:this.patient.patientId,
            assTimes:-1,
            saveDataFlag:this.saveDataFlag
          }
        }
      },
    computed: {
/*
      // 计算属性的 getter
      paraData: function () {
        console.log('computed')
        // `this` 指向 vm 实例
        return this.paraData;
      }
*/
    },

    components: {
        PatientList,
        'assess-info': assess_info,
        layout
      }
  }
</script>
<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nams/css/self_common";
/*
  .el-tabs{width:100%}
*/
  div.assContainer div.el-tabs__header{width:280px;}
/*
  div.el-tabs__item{
    display:inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  div.el-tabs__header{margin-top:10px;}
*/
  div.patientContainer{display: inline-block;float:left;width:185px; }
  div.assContainer{display:flex; position:relative;overflow: auto;height:100%;}
</style>
