<template>
  <layout v-loading="loading">
    <div slot="aside">
      <patient-list @initPatient="initPatient" initRowType="in" initRowIndex="0" />
    </div>
    <div slot="main">
      <el-tabs  v-if="patient!==null"  v-model="activeName" :tab-position="tabPosition" @tab-click="handleClickTab">
        <template   v-for="(item, index) in assData " >
          <el-tab-pane :label="item.assName" :name="item.assId" style="height:100%;">
            <assess_info  v-if="(item.isMenu==2 || item.isMenu==4) && item.assId==activeName"  :params="paraData" />
            <assess-list  v-else-if="item.assId==activeName"  :params="paraData" />
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>

  </layout>
<!--
  <div style="display: block;height:100%" >
    <div class="patientContainer">
      <patient-list @initPatient="initPatient" initRowType="in" initRowIndex="0" />
    </div>
    <div class="assContainer" ref="assContainer">
      <div style="display:flex;width:100%; margin: 12px;box-shadow: 0 0 3px #cccccc;">
        <el-tabs  v-if="patient!==null"  v-model="activeName" :tab-position="tabPosition" @tab-click="handleClickTab">
          <template   v-for="(item, index) in assData " >
            <el-tab-pane :label="item.assName" :name="item.assId" style="height:100%;">
              <assess_info  v-if="item.isMenu==2 && item.assId==activeName"  :params="paraData" />
              <assess-list  v-else-if="item.assId==activeName"  :params="paraData" />
            </el-tab-pane>
          </template>
        </el-tabs>
      </div>
    </div>
  </div>
-->
</template>

<script>
  import PatientList from '../../../components/nams/PatientList';
  import { AxiosApi } from '../../../api/nams/http/index';
  import showAss  from './showList.vue'
  import assess_info  from './assess_info.vue'
  import layout from '../../../components/nams/layout/aside'

  export default {
    data() {
      return {
        loading:false,
        tabPosition: 'right',
        deptId:JSON.parse(localStorage.getItem('deptInfo')).deptId || '',
        activeName:'',
        paraData:{},
        assData:[],
        patient:null,
        patientId:'',
        saveDataFlag:true
      };
    },
    created(){
    },
    mounted(){
      //this.formatPagePara();
      //console.log(params)
      //this.$refs.assContainer
    },
    methods:{
      initPatient(patient,type) {
        this.patient=patient;
        this.$set(this.patient, 'patientType', type);
        if((this.patient.patientType == 2 && this.patient.outHospitalFlag != 1) || this.patient.patientType == 1){
          this.saveDataFlag = false
        }else{
          this.saveDataFlag = true
        }

        this.patientId = patient.patientId;
        this.assData=[];
        this.getData();
      },
      getData(){
        let _this=this;
        AxiosApi('/nams/web-na/ass-dict/query?isMenus=0,2,4&deptId='+_this.deptId, {}, 'GET', {}).then(res => {
          if(res.desc=='操作成功'){
            console.log(res)
            _this.assData=res.data;
            if(_this.assData.length>0){
              let obj = _this.assData[0];
              _this.activeName=obj.assId;
              _this.formatParaData(obj);
              //console.log(_this.activeName);
            }
            //this.tableData=res.data;
          }else{
            _this.assData=[];
            //this.tableData=[];
          }
        })
      },
      formatParaData(_o){
        let obj = _o;
        this.paraData={
          assId:obj.assId,
          assName:obj.assName,
          isLoop:obj.haveRacordRate,
          assRate:obj.assRate,
          patientId:this.patientId,
          saveDataFlag:this.saveDataFlag,
          levelType:obj.levelType || '1'
        }
      },
      handleClickTab (tab){
        //this.activeName=tab.name;
        for(let tmp of this.assData){
          if(tmp.assId == tab.name) this.formatParaData(tmp)
        }
        //console.log(this.paraData)
        return;
      }
    },
    components: {
      PatientList,layout,
      'assess-list': showAss,
      'assess_info':assess_info
    }
  };
</script>
<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nams/css/self_common";
/*  .el-tabs{width:100%}
  div.assContainer div.el-tabs__header{width:280px;}
  div.el-tabs__item{
    display:inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  div.el-tabs__header{margin-top:10px;}*/
  div.patientContainer{display: inline-block;float:left;width:185px; }
  div.assContainer{display:flex; position:relative;overflow: auto;height:100%;}
  /deep/ .el-tabs__content,/deep/ el-tab-pane{height:100%;}
  /deep/ .el-tabs--right{width:100%;height:100%;}
  /deep/ .el-tabs__nav-scroll .is-right{
    display:block;
    max-width:240px;
    text-align:left;
  }
  /deep/ .el-tabs__item.is-active{
    overflow:hidden;
    text-overflow: ellipsis;
  }
  /deep/ .el-tabs--right .el-tabs__header.is-right{margin-left:0;}
  /deep/ .el-tabs--right .el-tabs__active-bar.is-right{width:4px;}

</style>
