<template>
  <listLayout>
    <div slot="left_btn" class="tool-bar">
      <el-button type="warning" size="small" @click="add" icon="el-icon-plus" v-if="saveDataFlag">添加
      </el-button>
      <el-button type="warning" size="small" @click="add" icon="el-icon-plus" v-else disabled>添加
      </el-button>
    </div>
    <div slot="query" class="query-items">
      <!--查询-->
      <el-form :inline="true" :model="formSearch"  ref="formSearch">
        <el-form-item label="时间：" prop="startTime">
          <el-col :span="11">
            <el-date-picker
                v-model="formSearch.startTime"
                type="datetime"
                :clearable="false"
                :editable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
            >
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="至" prop="endTime" style="margin-left:0px;">
          <el-col :span="11">
            <el-date-picker
                v-model="formSearch.endTime"

                type="datetime"
                :clearable="false"
                :editable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
            >
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getAssList" icon="el-icon-search">搜索</el-button>
          <el-button type="text" @click="resetForm('search_form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div slot="main" class="main-list table">
      <!-- 表格 -->
      <el-table  :data="tableData"  stripe  style="width: 100%;height:100%;overflow:auto;">
        <el-table-column
            v-for="item in tableHead"
            :label="item.label"
            :prop="item.prop"
            :min-width="item.colWidth"
            :align="item.colAlign"
        >
          <template slot-scope="scope">
            <div v-if="item.label=='评估时间'">{{getDateStr(scope.row[item.prop])}}</div>
            <div v-else v-html="scope.row[item.prop]"></div>
          </template>
        </el-table-column>
        <el-table-column prop="ass_op" label="操作" min-width="20%" align="center">
          <template slot-scope="scope">
            <el-button v-show="saveDataFlag" @click="assEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button v-show="!saveDataFlag" @click="assEdit(scope.row)" type="text" size="small">查看</el-button>
            <el-button v-show="saveDataFlag" @click="assDel(scope.row)" type="textred" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div slot="footer" class="page-bar">
      <!--组件页码显示-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page_current"
          :page-sizes="[ 10, 30, 50, 100]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page_total"
      >
      </el-pagination>
    </div>
  </listLayout>




</template>
<script>
  import { AxiosApi, AxiosJsonApi, GetUnit } from '../../../api/nams/http/index';
  import moment from 'moment';
  import layout from '../../../components/nams/layout/aside'
  import listLayout from '../../../components/nams/layout/list'

  export default {
    props:{
      params:{
        type:Object,
        default:()=>{}
      }
    },
    data() {
      return {
        loading: false,
        page_current: 1,
        page_total: 0,

        tableHeight:window.innerHeight -500,
        assId:'',
        layer:'',
        tflag:0,
        patientId:'',
        tableHead:[
          {
            label:'评估时间',
            prop:'assLoopTime',
            colWidth:'20%',
            colAlign:'center'
          },{
            label:'分数',
            prop:'totalScore',
            colWidth:'10%',
            colAlign:'center'
          },{
            label:'风险级别',
            prop:'level',
            colWidth:'25%',
            colAlign:'center'
          },{
            label:'评估人',
            prop:'assessor',
            colWidth:'10%',
            colAlign:'center'
          }
        ],
        tableData:[],
/*
        startTime:'',
        endTime:'',
*/
        formSearch:{
          assId:'',
          patientId:'',
          // startTime: moment().subtract(0, 'days').format('YYYY-MM-DD 00:00:00'),
          // endTime: moment().subtract(0, 'days').format('YYYY-MM-DD 23:59:59'),
          startTime: '',
          endTime: '',
          size: '10',
          page: '1'
        },
        userData:{
        },
        baseUrl:'',
        saveDataFlag:true,
        addFlag:true,
        levelType:'auto',
        //原前端判断 改为后台匹配
/*
        levelData:[]
*/
      };
    },created(){
/*
      window.closeLayer()=>{
        alert('window.closeLayer')
        this.layer.closeAll();
      }
*/

    },mounted(){
      this.assId=this.params.assId;
      this.formSearch.assId = this.assId;
      this.patientId=this.params.patientId;
      this.formSearch.patientId = this.patientId;
      this.saveDataFlag=this.params.saveDataFlag;
      this.levelType=this.params.levelType;
      //this.addFlag=(this.saveDataFlag=='auto' || this.saveDataFlag=='1')?true:false;
      // if(this.assId==='10004') this.changeTableHead('10004');
      //if(this.assId==='10005') this.changeTableHead('_5_6');
      if(this.assId==='10008' ) this.changeTableHead('_8');
      if(this.assId==='10009' || this.assId==='10006') this.changeTableHead('_6_9');

      this.getLayui();
      //原前端判断 改为后台匹配

      //this.getLevelInfo();
    },methods:{
      getLayui(){
        let  _this  =this;
        layui.use(['layer'], function(){
          _this.layer = layui.layer;
          _this.getAssList();
        });
      },
      changeTableHead(_class){
        // // 表头2
        // let tableHead10004=[
        //   {
        //     label:'评估时间',
        //     prop:'assLoopTime',
        //     colWidth:'20%',
        //     colAlign:'center'
        //   },{
        //     label:'分数',
        //     prop:'totalScore',
        //     colWidth:'10%',
        //     colAlign:'center'
        //
        //   },{
        //     label:'风险级别',
        //     prop:'level',
        //     colWidth:'25%',
        //     colAlign:'center'
        //   },{
        //     label:'评估人',
        //     prop:'assessor',
        //     colWidth:'10%',
        //     colAlign:'center'
        //   }
        //
        // ];

        let tableHead_8=[
          {
            label:'评估时间',
            prop:'updateTime',
            colWidth:'40%',
            colAlign:'center'
          },{
            label:'评估人',
            prop:'assessor',
            colWidth:'40%',
            colAlign:'center'
          }
        ];
        // let tableHead_5_6=[
        //   {
        //     label:'评估时间',
        //     prop:'assLoopTime',
        //     colWidth:'25%',
        //     colAlign:'center'
        //   },{
        //     label:'分数',
        //     prop:'totalScore',
        //     colWidth:'10%',
        //     colAlign:'center'
        //
        //   },{
        //     label:'风险级别',
        //     prop:'level',
        //     colWidth:'20%',
        //     colAlign:'center'
        //   },{
        //     label:'评估人',
        //     prop:'assessor',
        //     colWidth:'10%',
        //     colAlign:'center'
        //   }
        // ];

        let tableHead_6_9=[
          {
            label:'评估时间',
            prop:'updateTime',
            colWidth:'30%',
            colAlign:'center'
          },{
            label:'分数',
            prop:'totalScore',
            colWidth:'20%',
            colAlign:'center'
          },{
            label:'评估人',
            prop:'assessor',
            colWidth:'20%',
            colAlign:'center'
          }
        ];

        this.tableHead=eval('tableHead'+_class);

      },
      getAssList(){
        let _this=this;
        let para = {
          assId:this.assId,
          patientId:this.patientId,
          startTime:this.formSearch.startTime,
          endTime:this.formSearch.endTime,
          size:this.formSearch.size,
          page:this.formSearch.page
        }
        AxiosApi('/nams/web-na/ass-info/get-infoList', {}, 'GET', para).then(res => {
          if(res.desc=='操作成功'){
            let dataList = [...res.data.list];
            for(let dt of dataList){
              dt.level=_this.getLevelStr(dt);
            }
            _this.tableData=dataList;
            _this.page_total = res.data.total
          }else{
            $('.showres').text('数据出错');
            _this.tableData=[];
          }
        })
      },
      //原前端判断 改为后台匹配
      /*
            getLevelInfo(){
              let _this=this;
              console.log('this.levelType_getLevelInfo');
              console.log(_this.levelType != '1')
              if(this.levelType!='1') {
                this.getLayui();
                alert('return;')
                return ;
              }
              alert('1');
              let url='/nams/web-na/ass-setting/query?assId='+_this.assId;
              AxiosApi(url, {}, 'GET', {}).then(res => {
                if(res.desc=='操作成功'){
                  console.log('评估级别：')
                  console.log(res.data)
                  if(res.data.length>0){
                    for(let o of res.data){
                      this.levelData.push({"opt_text":o.level,"opt_val":o.level,"level_color":o.levelColor,"auto_selection":"0","min":o.minRecord,"max":o.maxRecord});
                    }
                  }
                  console.log(this.levelData)
                  this.getLayui();
                }else{
                  this.getLayui();
                  _this.$message({
                    message: '获取“评估设置”中级别信息出错',
                    type: 'error'
                  });

                }
              })
            },
      */
      getLevelStr(_dt){
        let backVal = ''
        if(this.levelType+'' =='1') {
          backVal=_dt.level;
          if(_dt.levelColor!='') backVal+= '<span style="height:16px;line-height:16px;min-width:16px;display:inline-block;margin-left:12px;border-radius:2px;background:'+_dt.levelColor+'">&nbsp;</span>';
        }
        return backVal;
      },

      assEdit(_data){
        let _this = this;

        let ass = layer.open({
          type: 2,
          title: _this.params.assName,
          shadeClose: false,
          //shade: false,
          //maxmin: true, //开启最大化最小化按钮
          area: ['1100px', '100%'],
          content:  '#/assess_info_repeat/'+_this.params.assId+'/'+_this.patientId+'/'+_this.params.isLoop+'/'+_this.params.assRate+'/'+_data.assTimes+'/'+_this.saveDataFlag+'/'+_this.levelType, //iframe的url，no代表不显示滚动条
          end: function(){ //此处用于演示
            _this.getAssList();
          },
          cancel: function(index, layero){

            _this.layer.confirm("确认要退出吗?<br />点击\"确认\"将不保存数据直接关闭评估窗口；<br />点击\"取消\"继续填写评估内容。", {
              closeBtn:0,
              btn: ['确认', '取消']
            }, function(){
              _this.layer.closeAll()
              //_this.layer.close(index)
            }, function(index){

            });
            return false;
          }

        });
        //layer.full(ass)
      },
      assDel(_data){
        let _this = this;
        let delObj = {
          assId: this.assId,
          isLoop:_data.isLoop,
          assInfoId:_data.assInfoId
        }
        let tit = _data.updateTime+'的评估数据'
        this.$confirm('确认要进行删除吗?', '删除', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          showClose:false,
          type: 'warning'
        }).then(() => {
          AxiosApi('/nams/web-na/ass-info/delete', delObj, 'DELETE', {}).then(res => {
            if(res.desc=='操作成功'){
              this.$message({
                message:'删除成功',
                type: 'success'
              });
              _this.getAssList();
              //this.tableData=res.data;
            }else{
              this.$message({
                message: '删除失败',
                type: 'warning'
              });
            }
          })
        }).catch(() => {
        });
      },
      add(){
        let _this=this;
        let ass = layer.open({
          type: 2,
          title: _this.params.assName,
          shadeClose: false,
          //shade: false,
          //maxmin: true, //开启最大化最小化按钮
          area: ['1100px', '100%'],
          content:  '#/assess_info_repeat/'+this.params.assId+'/'+this.patientId+'/'+this.params.isLoop+'/'+this.params.assRate+'/-1/'+_this.saveDataFlag+'/'+_this.levelType, //iframe的url，no代表不显示滚动条
          end: function(){ //此处用于演示
            _this.getAssList();
          },
          cancel: function(index, layero){
            _this.layer.confirm("确认要退出吗?<br />点击\"确认\"将不保存数据直接关闭评估窗口；<br />点击\"取消\"继续填写评估内容。", {
              closeBtn:0,
              btn: ['确认', '取消']
            }, function(){
              _this.layer.closeAll()
              //_this.layer.close(index)
            }, function(index){

            });
            return false;
          }
        });
        //layer.full(ass)
      },
      uidToName(row,column){
        return this.userData[row.SESSION_USER];
      },
      getDateStr(_dateStr,_type=''){



        let date = new Date(_dateStr);
        if(date instanceof Date && !isNaN(date.getTime())){

          let seperator1 = "-";
          let seperator2 = ":";

          let returnStr='';

          if(_type=='date'){
            let month = ('0'+ (date.getMonth() + 1)).slice(-2);
            let strDate = ('0'+date.getDate()).slice(-2);// ('0'+ date.getDate()).slice(-2);
            returnStr =
              date.getFullYear() +
              seperator1 +
              month +
              seperator1 +
              strDate;

          }else if(_type=='time'){
            let hours =('0'+ date.getHours()).slice(-2);
            let minutes =('0'+  date.getMinutes()).slice(-2);

            returnStr =
              hours +
              seperator2 +
              minutes ;
          }else{
            let month = ('0'+ (date.getMonth() + 1)).slice(-2);
            let strDate = ('0'+date.getDate()).slice(-2);// ('0'+ date.getDate()).slice(-2);
            let hours =('0'+ date.getHours()).slice(-2);
            let minutes =('0'+  date.getMinutes()).slice(-2);

            returnStr =
              date.getFullYear() +
              seperator1 +
              month +
              seperator1 +
              strDate +
              " " +
              hours +
              seperator2 +
              minutes ;
          }
          return returnStr;
        }else{
          return '-';
        }
      },
      resetForm() {
        this.$refs.formSearch.resetFields();
        this.getAssList(1);
      },

      handleSizeChange (val) {
        this.formSearch.size = val
        this.getAssList()
      },
      handleCurrentChange (val) {
        this.formSearch.page = val
        this.getAssList()
      },

    },
    components: {
      layout, listLayout
    }

  };
</script>
<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";

  body{height: 100%;}
  .typt-list-container .el-form-item{margin-right:12px;margin-left:12px}
  .el-form-item__label{padding-right:8px;}
  .levelColorSpan{width:48px; display:inline-block;margin-left:10px;border:1px solid #e0e0e0;}
  .el-table__empty-block {
    min-height: 60px;
    text-align: center;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /deep/ .typt-list-container .el-button--small, .typt-list-container .el-button--small.is-round{
    padding-left:15px;
    padding-right:15px;
  }
  .typt-list-container .el-form{margin-left:0;}
</style>
