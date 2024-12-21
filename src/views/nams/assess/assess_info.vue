<template>
  <div id="printDiv">
    <div class="assTop assInfoContainer" :style="saveDataFlag || 'bottom:0'">
      <div class="printButtonDiv topButtonDiv">
        <button type="button" v-show="printFlag" class="layui-btn  printButton layui-btn-green" style="margin-left: 10px">打印</button>

      </div>
      <div class="logo" v-if="logoFlag"><img :src="logoSrc" /></div>
      <div class="logo" v-else>{{orgName}}</div>
      <div class="assessTitle ">
        {{assId2Name['n_'+assId]}}
      </div>
      <div class="mobanHtml " id="mobanHtml">
      </div>
    </div>
    <div class="assBottom assInfoContainer" v-if="saveDataFlag">
      <span class="layui-btn_foke" style="width: 70px;height: 40px;line-height: 40px" @click="res_checkout">保存</span>
    </div>
  </div>
</template>

<script>
  import { AxiosApi, AxiosJsonApi, GetUnit } from '../../../api/nams/http/index';
  import assess from '../../../api/nams/http/assess';
  import $ from 'jquery';
  import printJS from 'print-js'

  const autoPrint=false;
  export default {
    props:{
      params:{
        type:Object,
        default:()=>{}
      }
    },
    components:{
      assess
    },
    mixins:[assess],
    data() {
      return {
        logoSrc:'../../../../static/nams/unit_logo/logo.png',
        orgName:'1',
        logoFlag:false,
        quickPageChange:false,
        printFlag:true,
        layTab:'',
        layForm:'',
        laydate:'',
        layer:'',
        deptObj:[],   //载入部门ID与名称对应
        //assList:[],   //评估表列表
        assLoopList:[],
        assResLoopList:[],
        assResList:[],
        totalScoreFlag:false,

        resStatus:'', //判断提交状态为PUT/POST即：增加还是修改
        ass_info_id:'',
        //每页多次采集数据类评估表专用
        isLoop:'0',
        assLoopNum:0,
        assId:'10001',
        patientId:'', //100000001
        assTimes:'1',
        SESSION_OBJ:{},
        saveDataFlag:true,
        assId2Name:{
          //临时处理后期自动获取或传入
          n_10001:'新入(转入)患者护理评估单',
          n_10002:'成人跌倒风险评估 ',
          n_10003:'非计划拔管风险评估',
          n_10004:'压疮风险评估',
          n_10005:'深静脉血栓风险评估',
          n_10006:'NRS营养评估',
          n_10007:'自理能力评定量表',
          n_10008:'静脉血栓栓塞症的预防措施及观察记录表',
          n_10009:'患者疼痛评估表',
          n_10011:'住院病人须知',
          n_10012:'护理风险高危告知书',
          n_10013:'出院患者护理记录单'
        }
      };
      //:aid/:pid/:loopflag/:sum/:times
    },

    watch:{
      params(val){
        this.formatPagePara();
      }

    },
    mounted(){
      //this.getLayui();
      this.formatLogo();
      this.formatPagePara();
      // console.log('&&&&&&&&&&&&&&&&&&&&&&&&',this.patientId)
      // console.log('this.addId2Name',this.addId2Name['n_10009'])
    },
    created(){
/*
      this.$nextTick(() => {
        let topTmpH = $('.printButtonDiv').height();
        alert(topTmpH)
      })
*/

    },
    methods: {
      formatLogo(){
        let _this = this;
        let img = new Image();
        img.src = _this.logoSrc;
        console.log('src:',img.src);
        img.addEventListener("load",function (e) {
          _this.logoFlag = true;

        })
        img.addEventListener("error",function (e) {
          _this.logoFlag = false;
          _this.orgName = JSON.parse(localStorage.getItem('orgInfo')).orgName || ''

        })
      },
      clickPrint(){
        let _this=this;
        const style =
          `
          @charset "UTF-8";
          @page {size: portrait; margin:0 auto;}
            span div{display:inline-block}
            .layui-input, .layui-select, .layui-textarea{
              height: 28px;
            }
            .layui-input_tc{text-align:center}
            .layui-form-label{
              padding: 4px 5px 4px 14px;
              width:auto;
              line-height:22px;
            }
            .ass-remark-div{
              margin-bottom:-10px;
              margin-right:0;
              display:inline-block;
              position:relative;
            }
            .layui-form-item .layui-form-checkbox[lay-skin=primary]{margin-top:0}
            .layui-form-radio{margin-top:0px}
            .labelDiv{float:left;width:auto;display:block;}
            .disLabel{color:#999}
            .layui-form div.lh35{line-height:28px;}
            .layui-form div.optDiv :after {
            }
            .bind-ass-tit{margin-left:20px;text-align:right;}
            .bind-ass-tit145{min-width:145px;}
            .ass_score{width:80px;}
            .ass_res{width:220px;}
            .mobalElement{margin:2px auto}
            /*.ass_act_but{width:80px}*/
            .layui-form-label-r {
              float: right;
              display: block;
              padding: 4px 5px;
              width: auto;
              font-weight: 400;
              line-height: 20px;
              text-align: left;
            }
            .layui-form-item .layui-input-inline{width:auto;}
            .layui-input-block{min-height:auto}
            .but_area{min-width:100px}
            .layui-form-item .layui-inline{margin-bottom:0px}

            ul{margin:0;padding:0;width:149px;display:inline-block;border-right:1px solid #c0c0c0;}
            ul.ul_w_125{width:118px;}
            ul.ul_w_155{width:154px;}
            ul.ul_w_165{width:164px;}
            ul.ul_w_165{width:164px;}
            ul.ul_w_75{width:77px;float:left}
            ul.ul_no_r_border{border-right:none}
            ul li{list-style:none; height:35px;border-bottom:1px solid #c9c9c9;display:block;width:100%; vertical-align:middle;line-height:30px;}
            ul li.t_c{text-align:center}
            ul.put_is_modi{box-shadow:#FF3300 0px 0px 10px inset;}
            ul.post_is_modi{box-shadow:#0066FF 0px 0px 10px inset;}
            ul.put_is_modi li{ background-color: #FFF1E3}
            ul.post_is_modi li{ background-color: #EBFFD9}
            /*ul.isModi li{ background-color: #F0F7FF}*/
            .label-score {
              text-align: center;
              background-color: #1E9FFF;
              color:#EAF7FF;
              overflow: hidden;
              box-sizing: border-box;
              float:right;
              padding-left:5px;
              height:28px;
              cursor:pointer;
            }
            .label-score:hover {
              color:#fff;
              background-color: #48B1FF;
            }
            .layui-form-checkbox[lay-skin=primary] i{text-indent:0;display:none;}
            /*防跌倒增加*/
            table{border:1px solid #c9c9c9; background-color: rgb(255, 255, 255); text-align: left; border-collapse: collapse;margin:0 auto;}
            table.td_p_l_10 tr td{padding-left:10px;}
            table  tr td.pl_none{padding-left:0px;}
            td{line-height:35px;font-size:14px;}
            table.ass_10002 tr td,table.ass_10003 tr td{padding:0 0 0 5px;line-height:150%;height:35px;}
            table.ass_take_care_by_self tr td{line-height:150%;height:35px;padding:0}
            table.w960,div.w960{width:950px;}
            table.ass_pain{border:none; border-style:none;margin-top:30px}
            table.ass_pain tr td{ line-height:50px;}

            table.ass_vte tr td{padding:0 0 0 10px;line-height:150%;height:35px;}
            table.ass_vte  tr td.pl_none{padding-left:0px;}
            td.td_textM{text-align:center}
            td#loop_container{
              padding:0;
              vertical-align: top;
            }
            td.fontW600,.fontW600{font-weight:600}
            table.ass_10003 tr td.titleV{line-height:120%;}
            div.w900{width:900px;margin:20px auto;}
            div.w1000{width:1000px;margin:20px auto;}
            div.fl{float:left}
            div.fr{float:right}
            div.clear{clear:both}
            div.list{margin:10px 0 10px 0;}
            div.list div.mobalElement{margin-left:10px;margin-right:10px;}
            div.ass_title{font-weight: 600;margin-top:30px;}
            div.interval{width:100%;border-bottom:1px dashed #c9c9c9;margin-bottom:20px;margin-top:10px;}
            /*专供VTE-大出血并发症相关*/
            .radioTmp .layui-form-radio {padding-right:0;width:100%}
            .radioTmp .layui-form-radio i{float:left}
            .radioTmp .layui-form-radio div{float:left;width: 100%;width:-moz-calc(100% - 35px); width:calc(100% - 35px);}

            .checkTmp .layui-form-checkbox {padding-right:0;width:100%}
            .checkTmp .layui-form-checkbox i{float:left;}
            .checkTmp .layui-form-checkbox span{padding-right:0;float:left;display:inline-block;white-space:normal}
            .checkTmp .layui-form-label{padding-top:0;}
            .layui-icon-close,layui-icon-tips{color:#FF6666}
            table.lh28 tr td{ line-height:28px;}
            .logo{font-size:18px;text-align:center;color:#333;width:100%;text-align:center;}
            .logo img{max-width:398px;margin:10px auto;}
            .bottomPrint{width:100%;margin:10px auto;text-align:right;display:block;}
            .bottomPrint span{display: inline-block;width:100px;border-bottom:1px solid #666;margin:0 10px;}
            .assessTitle{width:750px;margin:5px auto; text-align:center;font-size:23px;}
            div.w750{width:750px;margin:auto;background:#369;}
            span.text_out{
              display:block;
              min-height:22px;
              line-height:22px;
              min-width:14px;
              margin-top:4px;
              margin-bottom:4px;
              border-bottom:1px solid #333;
            }
          .mobanHtml .layui-form-checked[lay-skin=primary] i,.mobanHtml .layui-form-radioed i{display:none;}
          `;
      // .layui-form-checked[lay-skin=primary] i,.layui-form-radioed>i{background:#fff url("/static/nams/print_radio.jpg") no-repeat center center;display: inline-block;}
      //.mobanHtml .layui-form-checked[lay-skin=primary] span{padding-left:24px;background:#fff url("/static/nams/print_radio.jpg") no-repeat center left;}

        $('.layui-btn').hide();
        $('div.but_area').hide();

        $('.printButtonDiv').hide();

        $('.layui-form-radio').parent().parent().hide();
        $('.ass-remark-div').hide()
        $('.layui-form-checkbox').hide();
        $('.bottomPrint').show();

        $('.assBottom').hide()
        if($('.layui-form-radioed').parent().next().attr('class')=='ass-remark-div') $('.layui-form-radioed').parent().next().show();
        $('.layui-form-radioed').parent().parent().show();
        if($('.layui-form-checkbox.layui-form-checked').parent().next().attr('class')=='ass-remark-div') $('.layui-form-checkbox.layui-form-checked').parent().next().show();
        $('.layui-form-checkbox.layui-form-checked').show();
        // $('input').attr('placeholderHide',$('input').attr('placeholder'));
        // $('input').attr('placeholder','');
        // $('textarea').attr('placeholderHide', $('textarea').attr('placeholder'));
        // $('textarea').attr('placeholder','');
        //$('.but_area').hide();
        printJS({
          printable: 'printDiv',
          type: 'html',
          css:'/static/nams/layui/css/layui.css',
          style: style,
          scanStyles: false,
          printContainer:false,//纵向
          /*
                    onPrintDialogClose:_this.reFormat(),
                    onLoadingEnd:_this.onLoadingEnd(),
          */
        });
        _this.onPrintLoadEnd()
      },

      onPrintLoadEnd(){
        $('.layui-btn').show();
        $('div.but_area').show();

        $('.printButtonDiv').show();
        $('.layui-form-radio').parent().parent().show();
        $('.ass-remark-div').show()
        $('.layui-form-checkbox').show();
        $('.bottomPrint').hide();
        $('.assBottom').show()

        // $('input').attr('placeholder',$('input').attr('placeholderHide'));
        // $('textarea').attr('placeholder', $('textarea').attr('placeholderHide'));
      },
      formatPagePara(){
        //let params=this.params || this.$route.params;
        if(this.params==undefined) this.params = {...this.$route.params}
/*
        if(params==undefined && JSON.stringify(this.$route.params)!=''){
          let o = this.$route.params
          this.$route.params = '测试名字';
          params = this.$route.params
        }
*/
/*
*         this.paraData={
          assId:obj.assId,
          assName:obj.assName,
          isLoop:obj.haveRacordRate,
          assRate:obj.assRate,
          patientId:this.patientId,
          saveDataFlag:this.saveDataFlag,
          levelType:obj.levelType || '1'
        }
        ass_info_id:this.params.
        //每页多次采集数据类评估表专用
        patientId:'', //100000001
        assTimes:'1',

* */
        this.isLoop=this.params.isLoop;
        this.assLoopNum=this.params.assRate;
        //this.thisLoop=this.params.isLoop;
        this.assId=this.params.assId;
        //this.assId=this.params.assId;

        console.log('paramsb',this.params);
        this.saveDataFlag = this.params.saveDataFlag;
        console.log('------params-------')
        console.log(this.params)
        //this.patientId = params.pid;
        this.patientId = this.params.patientId;
        //格式化SESSION_OBJ
        let empInfo = JSON.parse(localStorage.getItem('empInfo'));
        let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo'));
        /*
                console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>DEPTINFO---BEGIN');
                console.log(deptInfo);
                console.log('DEPTINFO--END<<<<<<<<<<<<<<<<<<<<<<<<<<')
        */
        this.SESSION_OBJ={
          SESSION_USER:{
            res_id:empInfo.empId,
            res_name:empInfo.empName
          },
          SESSION_DEPT:{
            res_id:deptInfo.deptId,
            res_name:deptInfo.deptName
          }
        }

        this.getLayui();
      },
      interfaceTmp(){
        let _this=this;
        //测试获取指定评估表字段
        AxiosApi('/nams/web-na/ass-dict/get-html?assId='+_this.assId, {}, 'GET', {}).then(res => {
          if(res.dexc='操作成功'){
            //let tmp='<div class="printClass"></div>';
            $('.mobanHtml').html(res.data)

            $('#mobanHtml form:last').append('<div class="bottomPrint">以上记录属实。&nbsp;&nbsp;家属/患者签字<span>&nbsp;</span>签字日期<span>&nbsp;</span></div>')

            _this.getAssInfo();
            console.log('local')
            //this.getAssInfoTmp();
            // if(_this.saveDataFlag+''=='true'){
            //   $('.res_checkout').click(function(){_this.res_checkout();})
            // }else{
            //   $('.res_checkout').addClass('layui-btn-disabled').click(function(){return})
            // }
            $('.printButton').click(function(){_this.clickPrint();})
          }else{
            _this.layer.alert('获取模板出错。')
          }
        })
        return;
      },
      getAssInfoTmp(_o){
        //通过评估问卷ID查询本评估问卷下所有选项内容
        let assObjTmp = [];

        for (let obj of assObjTmp) {
          obj.options=JSON.stringify(obj.options);
        }
        if(assObjTmp.length>0){
          this.assResList=[];
          for(let i=0;i<assObjTmp.length;i++){
            let  obj = assObjTmp[i];
            if(!$.isEmptyObject(obj)){
              this.formatDom(obj);
            }
          }
          if(this.isLoop=='1' ) this.cloneDom();
          this.bindLayer();
          this.bindDateTime()

          //获取HIS接口数据
          this.get_HIS_data();
          this.getRes();
          this.bindTotalScore();

        }



        //处理关联的评估得分填充主要是入院评估

        //if($('.mobanHtml div[data-tag="bind_ass_res"]').length>0) this.convert_bind_ass_res($('.mobanHtml div[data-tag="bind_ass_res"]'))
      },

    }
  }
</script>
<style lang="scss" type="text/css">
  /* 测试用 */
  /* 测试用 结束 */
  .assInfoContainer{
    width:100%;
  }
  .assTop{
    position:absolute;
    display: flex;
    bottom:57px;
    top:0;
    overflow:auto;
    flex-direction: column;
  }
  .assBottom{
    padding:8px 0;
    height: 40px;
    position:absolute;
    bottom:0px;
    text-align:center;
    border-top:1px solid #eee;
  }
  /*.mobanHtml{*/
    /*position:absolute;*/
    /*display:flex;*/
    /*width:100px;*/
    /*text-align:ctner;*/
    /*top:100px;*/
    /*bottom:30px;*/
    /*overflow:auto;*/
    /*background-color: #E14D4D;*/
  /*}*/
  .layui-btn{height:28px;line-height:28px;font-size:14px;}
  .topButtonDiv .layui-btn{
    width: 80px;
  }
  .res_checkout{background-color: #1E9FFF;}
  .printButtonDiv{ text-align:right;margin:13px 20px 0 0;}
  .mobanHtml{width:100%;/*width:902px;*/margin:0px auto;/*position: relative;*/}
  .mobanHtml{
  span div{display:inline-block}
  .layui-input, .layui-select, .layui-textarea{
    height: 28px;

  }
  .layui-input{padding-left:4px;}
  .layui-input_tc{text-align:center}
  .layui-form-label{
    padding: 4px 5px 4px 14px;
    width:auto;
    line-height:22px;
  }
  .ass-remark-div{
    margin-bottom:-10px;
    margin-right:0;
    display:inline-block;
    position:relative;
  }
  .layui-form-item .layui-form-checkbox[lay-skin=primary]{margin-top:0}
  .layui-form-radio{margin-top:0px}
  .labelDiv{float:left;width:auto;display:block;}
  .disLabel{color:#999}
  .layui-form div.lh35{line-height:28px;}
  .layui-form div.optDiv :after {
  }
  .bind-ass-tit{margin-left:20px;text-align:right;}
  .bind-ass-tit145{min-width:145px;}
  .ass_score{width:80px;}
  .ass_res{width:220px;}
  .mobalElement{margin:2px auto}
  /*.ass_act_but{width:80px}*/
  .layui-form-label-r {
    float: right;
    display: block;
    padding: 4px 5px;
    width: auto;
    font-weight: 400;
    line-height: 20px;
    text-align: left;
  }
  .layui-form-item .layui-input-inline{width:auto;}
  .layui-input-block{min-height:auto}
  .but_area{min-width:100px}
  .layui-form-item .layui-inline{margin-bottom:0px}
  span.text_out{
    display:block;
    min-height:22px;
    line-height:22px;
    min-width:14px;
    margin-top:4px;
    margin-bottom:4px;
    border-bottom:1px solid #333;
  }
  ul{margin:0;padding:0;width:149px;display:inline-block;border-right:1px solid #c0c0c0;}
  ul.ul_w_125{width:118px;}
  ul.ul_w_155{width:154px;}
  ul.ul_w_165{width:164px;}
  ul.ul_w_165{width:164px;}
  ul.ul_w_75{width:77px;float:left}
  ul.ul_no_r_border{border-right:none}
  ul li{list-style:none; height:35px;border-bottom:1px solid #c9c9c9;display:block;width:100%; vertical-align:middle;line-height:30px;}
  ul li.t_c{text-align:center}
  ul.put_is_modi{box-shadow:#FF3300 0px 0px 10px inset;}
  ul.post_is_modi{box-shadow:#0066FF 0px 0px 10px inset;}
  ul.put_is_modi li{ background-color: #FFF1E3}
  ul.post_is_modi li{ background-color: #EBFFD9}
  /*ul.isModi li{ background-color: #F0F7FF}*/
  .label-score {
    text-align: center;
    background-color: #1E9FFF;
    color:#EAF7FF;
    overflow: hidden;
    box-sizing: border-box;
    float:right;
    padding-left:5px;
    height:28px;
    cursor:pointer;
  }
  .label-score:hover {
    color:#fff;
    background-color: #48B1FF;
  }
  .layui-form-checkbox[lay-skin=primary] i{text-indent:0}
  /*防跌倒增加*/
  table{border:1px solid #c9c9c9; background-color: rgb(255, 255, 255); text-align: left; border-collapse: collapse;margin:0 auto;}
  table.td_p_l_10 tr td{padding-left:10px;}
  table  tr td.pl_none{padding-left:0px;}
  td{/*line-height:35px;*/font-size:14px;}
  table.ass_10002 tr td,table.ass_10003 tr td{padding:0 0 0 5px;line-height:150%;height:35px;}
  table.ass_take_care_by_self tr td{line-height:150%;height:35px;padding:0}

  table.ass_pain{border:none; border-style:none;margin-top:30px}
  table.ass_pain tr td{ line-height:50px;}

  table.ass_vte tr td{padding:0 0 0 10px;line-height:150%;height:35px;}
  table.ass_vte  tr td.pl_none{padding-left:0px;}

  td.td_textM{text-align:center}
  td#loop_container{
    padding:0;
    vertical-align: top;
  }
  td.fontW600,.fontW600{font-weight:600}
  table.ass_10003 tr td.titleV{line-height:120%;}
  div.w900{width:900px;margin:20px auto;}
  div.wAuto{width:95%;margin:20px auto;}
  div.w1000{width:1000px;margin:20px auto;}
  div.fl{float:left}
  div.fr{float:right}
  div.clear{clear:both}
  div.list{margin:10px 0 10px 0;}
  div.list div.mobalElement{margin-left:10px;margin-right:10px;}
  div.ass_title{font-weight: 600;margin-top:30px;}
  div.interval{width:100%;border-bottom:1px dashed #c9c9c9;margin-bottom:20px;margin-top:10px;}
  /*专供VTE-大出血并发症相关*/
  .radioTmp .layui-form-radio {padding-right:0;width:100%}
  .radioTmp .layui-form-radio i{float:left}
  .radioTmp .layui-form-radio div{float:left;width: 100%;width:-moz-calc(100% - 35px); width:calc(100% - 35px);}

  .checkTmp .layui-form-checkbox {padding-right:0;width:100%}
  .checkTmp .layui-form-checkbox i{float:left;}
  .checkTmp .layui-form-checkbox span{padding-right:0;float:left;display:inline-block;white-space:normal}
  .checkTmp .layui-form-label{padding-top:0;}
  .layui-icon-close,layui-icon-tips{color:#FF6666}
  table.lh28 tr td{ line-height:28px;}

  /*
    .bottomPrint{width:900px;margin:10px auto;text-align:right;display:none;}
    .bottomPrint span{display: inline-block;width:100px;border-bottom:1px solid #666;margin:0 10px;}
  */
  }
  .logo{font-size:18px;text-align:center;color:#333;width:100%;text-align:center;}
  .logo img{max-width:398px;margin:10px auto;}
  html{overflow:hidden;}
  #printDiv{overflow:auto;width:100%;height:100%;position:relative;}
  .printClass{position:absolute; top:50px;right:5px;}
  .assessTitle{width:100%;margin:5px auto; text-align:center;font-size:23px;}
  div.w750{width:750px;margin:auto;}
  .bottomPrint{width:100%;margin:10px auto;text-align:right;display:none;}
  .bottomPrint span{display: inline-block;width:100px;border-bottom:1px solid #666;margin:0 10px;}

  /*新加整理样式*/
  /*.layui-btn{background-color:#67c23a;}*/

  .layui-btn_foke{
    display: inline-block;
    white-space: nowrap;
    cursor: pointer;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    font-size: 14px;

    background: #409EFF;
    border-color: #409EFF;
    color: #FFF;
    border-radius: 2px !important;
    height: 30px;
    line-height:30px;
    vertical-align: middle;
    min-width: 78px;
  }
  .layui-btn_foke:hover{background-color: #66B1FF;}

  .layui-btn-green{background-color:#13CE66;}

  .markContainer{margin:10px;color:#666;font-size:14px;}
  .markContainer .markTitle{width:100%;line-height:35px; text-align:left;font-size:16px;}
  .markContainer .markInfo{margin-left:32px;}
  .markContainer .markInfo .infoTitle{font-weight:600;color:#333;}
  .markContainer .markInfo ul{margin:0 28px; padding:0; list-style:none;width:100%;border:none;}
  .markContainer .markInfo ul li{padding:0;margin:0;border:none;line-height:28px;height:auto;}
  .markContainer .markInfo ul li span.tStrong,.markTextStrong{font-weight:600;color:#333;}

/*
  .mobanHtml .layui-form-checked[lay-skin=primary] i{background:#fff url("/static/nams/print_radio.jpg") no-repeat center center;display: inline-block;}
*/

</style>
