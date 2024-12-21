<template>
  <div id="printDiv">
    <div class="assTop assInfoContainer" :style="saveDataFlag || 'bottom:0'">
      <div class="printButtonDiv topButtonDiv">
        <button type="button" v-show="printFlag" class="layui-btn  printButton layui-btn-green">打印</button>
        <button type="button" v-if="quickPageChange.flag" class="layui-btn" @click="quickChange('pageUp',quickPageChange.pageUp)" :class="quickPageChange.pageUp==''?'layui-btn-disabled':'layui-btn-green'">上一页</button>
        <button type="button" v-if="quickPageChange.flag" class="layui-btn" @click="quickChange('pageDown',quickPageChange.pageDown)"  :class="quickPageChange.pageDown==''?'layui-btn-disabled':'layui-btn-green'">下一页</button>
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
      <span class="layui-btn_foke" @click="res_checkout">保存</span>
    </div>
  </div>
</template>
<script>
  import { AxiosApi, AxiosJsonApi, GetUnit } from '../../../api/nams/http/index';
  import assess from '../../../api/nams/http/assess';
  import printJS from 'print-js'

  import $ from 'jquery';
  export default {
    props:['data'],
    mixins:[assess],
    components:{
      assess
    },
    data() {
      return {
        logoSrc:'../../../../static/nams/unit_logo/logo.png',
        orgName:'',
        logoFlag:false,
        quickPageChange:{
          flag:false,
          pageUp:'',
          pageDown:'',
          pagination:''
        },
        hisData:null,
        //firstRecordFlag:true,//是否首次评估，用于判断第一个导入按钮是否可用
        printFlag:false,
        assessTitle:'',
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
        thisLoop:0,
        assId:'',
        patientId:'', //100000001
        assTimes:'1',
        SESSION_OBJ:null,
        saveDataFlag:true,
        levelType:'auto',
        levelData:[],
        levelEleType:'',
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
    computed:{
    },
    mounted(){
      this.formatPagePara();
      this.formatLogo();
    },
    created(){
/*
      window.onload = function () {
        //禁止后退键 作用于Firefox、Opera
        document.onkeypress = this.banBackSpaces;
        //禁止后退键  作用于IE、Chrome
        document.onkeydown = this.banBackSpaces;
      }
*/
      parent.window.addEventListener("popstate", function(e) {
        parent.layer.closeAll();
      }, false);
    },
    methods: {
      quickChange(_type,_val){
        let _this = this;
        if(_val !== ''){
          _this.quickPageChange.pagination=_val;
          _this.interfaceTmp();
/*
          if(_this.quickPageChange.pagination!==''){

          }
          _this.getRes('/nams/web-na/ass-info/get?assId='+_this.assId+'&patientId='+_this.patientId+'&assTimes='+_this.assTimes+'&pagination='+_val);
*/
        }
      },
      formatLogo(){
        let _this = this;
        let img = new Image();
        img.src = _this.logoSrc;
        img.addEventListener("load",function (e) {
          _this.logoFlag = true;

        })
        img.addEventListener("error",function (e) {
          _this.logoFlag = false;
          _this.orgName = JSON.parse(localStorage.getItem('orgInfo')).orgName || ''

        })
      },
      formatPringCss(){
        $('#printSign').show();
        if($('.layui-form table tr td:contains("依从性低或者沟通障碍")').length>0){
          $('#loop_container').css('overflow','visible');
          $($('.layui-form table tr td:contains("依从性低或者沟通障碍")')[0]).parent().find('td').css({'padding-top':'30px'})
          //$($('.layui-form div:contains("基础预防措施")')[0]).parent().css({'top':'802px'})
          $($('#loop_container div:contains("基础预防措施")')[0]).css({'top':'783px','z-index':'333'})

          let arrObj =  $('#loop_container ul');
          for(let i=0;i<arrObj.length;i++){
            let obj = arrObj[i];
            $(obj).find('li:eq(10)').css({'padding-top':'39px'})
          }
          //console.log()//.css({'height':'100px;'})
        }
        if($('.layui-form table tr td:contains("需要照护程度")').length>0){
          $($('.layui-form table tr td:contains("需要照护程度")')[0]).css({'padding-top':'15px'})
          //$('#loop_container ul').css({'float':'left','display':'inline-block','width':'154px'})
          let arrObj =  $('#loop_container ul');
          for(let i=0;i<arrObj.length;i++){
            let obj = arrObj[i];
            $(obj).find('li:eq(15)').css({'padding-top':'15px'})
          }
        }
      },
      formatWebCss(){
        $('#printSign').hide();

        if($('.layui-form table tr td:contains("依从性低或者沟通障碍")').length>0){
          $('#loop_container').css({'overflow':'hidden'})
          $($('.layui-form table tr td:contains("依从性低或者沟通障碍")')[0]).parent().find('td').css({'padding-top':'0px'})
          $($('#loop_container div:contains("基础预防措施")')[0]).css('top','744px')

          let arrObj =  $('#loop_container ul');
          for(let i=0;i<arrObj.length;i++){
            let obj = arrObj[i];
            $(obj).find('li:eq(10)').css({'padding-top':'0px'})
          }
        }
        if($('.layui-form table tr td:contains("需要照护程度")').length>0){
          $($('.layui-form table tr td:contains("需要照护程度")')[0]).css({'padding-top':'0px'})
          let arrObj =  $('#loop_container ul');
          for(let i=0;i<arrObj.length;i++){
            let obj = arrObj[i];
            $(obj).find('li:eq(15)').css({'padding-top':'0px'})
          }

        }
      },
      clickPrint(){
        this.formatPringCss();
        let _this=this;
        const style =
          `
          @charset "UTF-8";

          @page {size:portrait,margin:0 auto;}
            html{overflow:hidden;}
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
            ul.ul_w_155{width:153px;}
            ul.ul_w_75{width:74px;float:left}
            ul.ul_no_r_border{border-right:none}
            ul li{list-style:none; height:35px;border-bottom:1px solid #c9c9c9;display:block;width:100%; vertical-align:middle;line-height:30px;}
            ul li.t_c{text-align:center}
            ul.chkLoop li input,ul.chkLoop li textarea{background-color:#FFFFE1;}
            ul.put_is_modi{box-shadow:#FF3300 0px 0px 10px inset;}
            ul.post_is_modi{box-shadow:#0066FF 0px 0px 10px inset;}
            ul.put_is_modi li{ background-color: #FFF8EE}
            ul.post_is_modi li{ background-color: #F2FFE8}
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
            table.w960,div.w960{width:950px;margin:0 auto;}
            table.ass_pain{border:none; border-style:none;margin-top:30px}
            table.ass_pain tr td{ line-height:50px;}

            table.ass_vte tr td{padding:0 0 0 10px;line-height:150%;height:35px;}
            table.ass_vte  tr td.pl_none{padding-left:0px;}

            td.td_textM{text-align:center}
            td#loop_container{
              padding:0;
              vertical-align: top;
              overflow:hidden;
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
            .bottomPrint{width:900px;margin:10px auto;text-align:right}
            .bottomPrint span{display: inline-block;width:100px;border-bottom:1px solid #666;margin:0 10px;}
            .layui-form-radioed>i{background:#fff url("/static/img/print_radio.png") no-repeat center center;display: inline-block;width:22px;}
            .layui-form-checked[lay-skin=primary] i {background:#fff url("/static/img/print_checked.png") no-repeat center center;display: }
              .logo{font-size:18px;text-align:center;color:#333;}
            .logo img{max-width:398px;margin:10px auto;}
            .assessTitle{width:950px;margin:5px auto; text-align:center;font-size:23px;}
             .mobanHtml .layui-form-checked[lay-skin=primary] i,.mobanHtml .layui-form-radioed i{display:none;}
          `;
        $('.layui-btn').hide();
        $('.printButtonDiv').hide();

        $('.layui-form-radio').hide();
        $('.ass-remark-div').hide()
        $('.layui-form-checkbox').hide();
        if($('.layui-form-radioed').parent().next().attr('class')=='ass-remark-div') $('.layui-form-radioed').parent().next().show();
        $('.layui-form-radioed').show();
        if($('.layui-form-checkbox.layui-form-checked').parent().next().attr('class')=='ass-remark-div') $('.layui-form-checkbox.layui-form-checked').parent().next().show();
        $('.layui-form-checkbox.layui-form-checked').show();
        $('.assBottom').hide()
        $('.bottomPrint').show()
        printJS({
          printable: 'mobanHtml',
          type: 'html',
          style: style,
          scanStyles: false,
          css:'./static/nams/layui/css/layui.css',
          /*
                    onPrintDialogClose:_this.reFormat(),
                    onLoadingEnd:_this.onLoadingEnd(),
          */
        });
        _this.onPrintLoadEnd()
      },
      onPrintLoadEnd(){
        $('.layui-btn').show();
        $('.printButtonDiv').show();

        $('.layui-form-radio').show();
        $('.ass-remark-div').show()
        $('.layui-form-checkbox').show();
        $('.assBottom').show()
        $('.bottomPrint').hide()

        this.formatWebCss();
      },
      formatPagePara(){
        let params=this.$route.params;
        //console.log('params:',params)
        this.saveDataFlag = params.saveDataFlag ;
        this.assId = params.aid;
        this.isLoop = params.loopflag;
        this.patientId = params.pid;
        this.assLoopNum = params.sum;
        this.assTimes = params.asstimes;
        this.levelType = params.levelType;
        if(this.isLoop=='1') {
          this.quickPageChange.flag=true;
/*
          this.quickPageChange.pageUp=true;
          this.quickPageChange.pageDown=true;
*/

        }

        //格式化SESSION_OBJ
        let empInfo = JSON.parse(localStorage.getItem('empInfo'));
        let deptInfo = JSON.parse(localStorage.getItem('deptInfo'));

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
        this.getLevelInfo();
      },
      getLevelInfo(){
        //console.log('getLevelInfo')
        let _this=this;
        if(this.levelType=='1') {
          let url='/nams/web-na/ass-setting/query?assId='+_this.assId;
          AxiosApi(url, {}, 'GET', {}).then(res => {
            if(res.desc=='操作成功'){
              //console.log('评估级别：')
              //console.log(res.data)
              if(res.data.length>0){
                for(let o of res.data){
                  this.levelData.push({"opt_text":o.level,"opt_val":o.level,"auto_selection":"0","min":o.minRecord,"max":o.maxRecord});
                }
              }

              this.getLayui();
            }else{
              this.getLayui();
              _this.$message({
                message: '获取“评估设置”中级别信息出错',
                type: 'error'
              });
            }
          })
        }else{
          this.getLayui();
        }
      },
      interfaceTmp(){
        let _this=this;
        //测试获取指定评估表字段
        AxiosApi('/nams/web-na/ass-dict/get-html?assId='+_this.assId, {}, 'GET', {}).then(res => {
          if(res.dexc='操作成功'){
            $('.mobanHtml').html(res.data)
            $('#mobanHtml').find('table:last').after('<div id="printSign" class="bottomPrint">以上记录属实。&nbsp;&nbsp;（打印后）家属/患者签字<span>&nbsp;</span>签字日期<span>&nbsp;</span></div>')

            _this.getAssInfo();
            //_this.getAssInfoTmp();
            if(_this.saveDataFlag+'' == 'true'){
              $('.res_checkout').click(function(){_this.res_checkout();})
            }else{
              $('.res_checkout').addClass('layui-btn-disabled').click(function(){return})
            }
            $('.printButton').click(function(){_this.clickPrint();})

            //_this.getAssInfoTmp();

          }else{
            _this.layer.alert('获取模板出错。')
          }
        })
        return;
      },
      banBackSpaces(e) {
        //console.log(e);
        var ev = e || window.event;//获取event对象
        var obj = ev.target || ev.srcElement;//获取事件源
        //alert(obj.className);
        var t = obj.type || obj.getAttribute('type');//获取事件源类型
        //alert(obj.className);
        //获取作为判断条件的事件类型
        var vReadOnly = obj.getAttribute('readonly');
        //处理null值情况
        vReadOnly = (vReadOnly == "") ? false : vReadOnly;
        //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
        //并且readonly属性为true或enabled属性为false的，则退格键失效
        var flag1 = (ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea" )
          && vReadOnly == "readonly") ? true : false;
        //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
        var flag2 = (ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea")
          ? true : false;
        if(ev.keyCode == 8 && obj.className == "layui-input layui-unselect"){
          return false;
        }
        if (ev.keyCode == 8 && obj.className == "xm-input xm-select") {
          return false;
        }
        if (ev.keyCode == 8 && obj.className == "xm-input xm-select-input") {
          return false;
        }

        //&& obj.className != "layui-input layui-unselect"
        //判断
        if (flag2) {
          return false;
        }
        if (flag1) {
          return false;
        }
      },
      getAssInfoTmp(_o){
        //通过评估问卷ID查询本评估问卷下所有选项内容
        let assObjTmp =[];

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
<style lang="scss" >
  html{overflow:hidden;}
  #printSign{display:none;}
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
    padding:12px 0;
    height:31px;
    position:absolute;
    bottom:0px;
    text-align:center;
    border-top:1px solid #eee;
  }
  .printClass{position:absolute; top:10px;right:0px;}
  .mobanHtml{width:945px;margin:0px auto;position: relative}
  .layui-btn{height:28px;line-height:28px;}
  .printButtonDiv{ text-align:right;margin:13px 20px 0 0;}
  .res_checkout{background-color: #1E9FFF;margin-top:20px;margin-bottom:20px;}

  .mobanHtml{
    span div{display:inline-block}
    .layui-select-title input.layui-unselect,#loop_container .layui-input{text-align:center;}
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
  span.text_out{
    display:block;
    min-height:22px;
    line-height:22px;
    min-width:14px;
    margin-top:4px;
    margin-bottom:4px;
  }

    ul{margin:0;padding:0;width:149px;display:inline-block;border-right:1px solid #c0c0c0;}
    ul.ul_w_125{width:118px;}
    ul.ul_w_155{width:154px;}
    ul.ul_w_165{width:164px;}
    ul.ul_w_75{width:74px;float:left}
    ul.ul_no_r_border{border-right:none}
    ul li{list-style:none; height:35px;border-bottom:1px solid #c9c9c9;display:block;width:100%; vertical-align:middle;line-height:30px;}
    ul li.t_c{text-align:center}
    ul.chkLoop li input,ul.chkLoop li textarea{background-color:#FFFFE1;}
    ul.put_is_modi{box-shadow:#FF3300 0px 0px 10px inset;}
    ul.post_is_modi{box-shadow:#0066FF 0px 0px 10px inset;}
    ul.put_is_modi li{ background-color: #FFF8EE}
    ul.post_is_modi li{ background-color: #F2FFE8}
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
    table.lh35 td{line-height:35px;font-size:14px;}
    table.ass_10002 tr td,table.ass_10003 tr td{padding:0 0 0 5px;line-height:150%;height:35px;}
    table.ass_take_care_by_self tr td{line-height:150%;height:35px;padding:0}
    table.w960,div.w960{width:950px;margin:0 auto;}
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
    .bottomPrint{width:900px;margin:10px auto;text-align:right;display:none;}
    .bottomPrint span{display: inline-block;width:100px;border-bottom:1px solid #666;margin:0 10px;}
  }
  #app{
    display:block;
  }
  /*头部样式*/
  .printButton{position:fixed;top:20px;right:10px;display:none;}
  .logo{font-size:18px;text-align:center;color:#333;}
  .logo img{max-width:398px;margin:10px auto;}
  .assessTitle{width:950px;margin:5px auto; text-align:center;font-size:23px;}
  div.w750{width:750px;margin:auto;}

  /deep/ tr:hover{
    transform: none;
    box-shadow:none;
  }
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


</style>
