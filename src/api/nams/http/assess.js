import { AxiosApi, AxiosJsonApi, GetUnit } from '../../../api/nams/http/index'
export default {
  data () {
    return {
      stopSave: false,
      importItems: undefined,
      hisData: null
    }
  },
  methods: {
    getLayui () {
      let _this = this
      layui.use(['form', 'element', 'layer', 'laydate'], function () {
        _this.layForm = layui.form
        _this.layTab = layui.element // Tab的切换功能，切换事件监听等，需要依赖element模块
        _this.layer = layui.layer
        _this.laydate = layui.laydate

        // 绑定select onchange

        // radio选项事件绑定
        _this.layForm.on('radio', function (data) {
          let opt_level_1 = $(data.elem).attr('rely_opt_flag')
          let po = $(data.elem).parent().parent().parent().find('input[rely_opt_flag="' + opt_level_1 + '"]')
          for (let i = 0; i < po.length; i++) {
            let obj = po[i]
            let parentObj = $(obj).parent().parent()

            if (obj.id == $(data.elem).attr('id')) {
              $(parentObj).find('[rely_opt_flag="' + obj.id + '"]').prop('disabled', false)
              $(parentObj).find('.layui-form-label').removeClass('disLabel')
            } else {
              $(parentObj).find('[rely_opt_flag="' + obj.id + '"]').prop('disabled', true).prop('checked', false)
              $(parentObj).find(':text').val('').prop('disabled', true)
              $(parentObj).find('.layui-form-label').addClass('disLabel')
            }
          }
          _this.layForm.render('radio')
          _this.layForm.render('checkbox')
        })
        _this.layForm.on('checkbox', function (data) {
          let obj = $(data.elem)
          let parent = $(obj).parent()
          if (data.elem.checked == true) {
            // $(parent).find('[rely_opt_flag="'+$(obj).attr('id')+'"]').prop('disabled',false);
            $(parent.parent()).find('[rely_opt_flag="' + $(obj).attr('id') + '"]').prop('disabled', false)
            $(parent).find('.layui-form-label').removeClass('disLabel')
            if ($(obj).attr('autoAddScore') != 'none') _this.sumScore($('.mobanHtml #' + $(obj).attr('autoAddScore')), $(obj).attr('opt_score'))
          } else {
            // 此处与单选，时间来不及了，应该加递归，遍历子节点的子节点进行过滤。此处临时处理
            $(parent.parent()).find('[rely_opt_flag="' + $(obj).attr('id') + '"]').prop('disabled', true).prop('checked', false)
            $(parent).find(':text').val('').prop('disabled', true)
            $(parent.parent()).find('textarea[rely_opt_flag="' + $(obj).attr('id') + '"]').val('')
            $(parent.parent()).find('input[type=text][rely_opt_flag="' + $(obj).attr('id') + '"]').val('')
            $(parent).find('.layui-form-label').addClass('disLabel')
            if ($(obj).attr('autoAddScore') != 'none') _this.sumScore($('.mobanHtml #' + $(obj).attr('autoAddScore')), '-' + $(obj).attr('opt_score'))
          }
          _this.layForm.render('checkbox')
          _this.layForm.render('radio')
        })
        _this.interfaceTmp()
        // _this.getAssInfoTmp();
      })
    },
    // 显示评估问卷
    getAssInfo (_o) {
      // 通过评估问卷ID查询本评估问卷下所有选项内容
      let _this = this
      let assObjTmp = []

      /** ****************关于OBJ的解析*****************
       * 1.HIS_ID != 0 表示为HIS数据。此是直接 执行_INPUT格式化且为不可操作状态
       *
       ************************************************/
      AxiosApi('/nams/web-na/ass-dict/query-items?assId=' + _this.assId, {}, 'GET', {}).then(res => {
        assObjTmp = res.data
        if (assObjTmp.length > 0) {
          this.assResList = []
          for (let i = 0; i < assObjTmp.length; i++) {
            let obj = assObjTmp[i]
            if (!$.isEmptyObject(obj)) {
              if (obj.item_id && obj.item_id == 'level_state') _this.levelEleType = obj.item_input_type || ''
              this.formatDom(obj)
            }
          }

          if (this.isLoop == '1') this.cloneDom()
          this.bindLayer()
          this.bindDateTime()

          // 获取HIS接口数据
          // this.get_HIS_data();
          this.getRes()
          this.bindTotalScore()
        } else {
          _this.saveDataFlag = false
        }
      })

      // 处理关联的评估得分填充主要是入院评估
      // ('处理关联的评估得分填充主要是入院评估------>>');
      // if($('.mobanHtml div[data-tag="bind_ass_res"]').length>0) this.convert_bind_ass_res($('.mobanHtml div[data-tag="bind_ass_res"]'))
    },
    sumScore (_o, _s) {
      // DOM，分值
      let score = isNaN(parseInt($(_o).val())) ? 0 : parseInt($(_o).val())
      // alert(score)
      score += (0 + parseInt(_s))
      // alert(score)
      $(_o).val(score).css('background-color', '#FFFF99')
      setTimeout(function () { $(_o).css('background-color', '#fff') }, 3000)
    },
    bindLoopChang () {
      let _this = this
      this.layForm.on('select(loopSelect)', function (data) {
        // ($(data.elem).parents('ul'))
        if ($(data.elem).parents('ul').length == 0) return
        _this.markLoopActive(data.elem, data.value)
      })
      _this.layForm.on('checkbox(loopCheckbox)', function (data) {
        // console.log(data.elem); //得到checkbox原始DOM对象
        // console.log(data.elem.checked); //是否被选中，true或者false
        // console.log(data.value); //复选框value值，也可以通过data.elem.value得到
        // console.log(data.othis); //得到美化后的DOM对象
        if ($(data.elem).parents('ul').length == 0) return
        _this.markLoopActive(data.elem, data.value)
      })
      $('#loop_container [lay-filter="loopInput"]').change(function () {
        _this.markLoopActive(this, $(this).val())
      })
    },
    markLoopActive (_obj, _val) {
      let _this = this
      // loopul:循环容器，_obj:当前DOM,_val:当前值
      let loopul = $(_obj).parents('ul')
      if ($(loopul).length == 0) return
      if ($(loopul).attr('modi_field') == undefined) $(loopul).attr('modi_field', '@@')
      if ($(loopul).attr('data_up_type') == undefined) $(loopul).attr('data_up_type', 'post')
      if ($(_obj).attr('data-load') == undefined) $(_obj).attr('data-load', '')

      let dl = $(_obj).attr('data-load')
      let s = $(loopul).attr('modi_field')
      let f = $(_obj).attr('id')

      if (dl != _val) {
        if (s.indexOf('@@' + f + '@@') == -1) $(loopul).attr('modi_field', s + f + '@@')
      } else {
        if (s.indexOf('@@' + f + '@@') > -1) $(loopul).attr('modi_field', s.replace(f + '@@', ''))
      }
      // console.log('markLoopActive_modi_filed',$(loopul).attr('modi_field'),$(loopul).attr('modi_field')=='@@')
      if ($(loopul).attr('modi_field') === '@@') {
        // console.log('222222222222222isNew')
        $(loopul).removeClass($(loopul).attr('data_up_type') + '_is_modi').attr('modi_flag', 'false')
      } else {
        // console.log('3333333333333')
        $(loopul).addClass($(loopul).attr('data_up_type') + '_is_modi').attr('modi_flag', 'true')
      }
    },
    bindDateTime () {
      let _this = this
      let dt = {
        datetime: 'yyyy-MM-dd HH:mm:ss',
        date: 'yyyy-MM-dd',
        time: 'HH:mm:ss'
      }
      $('.layui-form').find('input[datetime-flag="layui_datetime"]').each(function () {
        let initDate = ($(this).val() == 'nowDate' ? new Date() : $(this).val())
        _this.laydate.render({
          elem: this,
          trigger: 'click',
          type: $(this).attr('date-type'),
          format: $(this).attr('date-format'),
          value: initDate,
          btns: ['now', 'confirm'],
          position: 'fixed',
          done: function (value) {
          }
        })
      })
    },
    bindTotalScore () {
      let _this = this
      if (_this.totalScoreFlag == true) {
        $('.label-score').click(function () {
          let totalScore = 0
          if (_this.isLoop == '1') {
            if ($(this).parents('ul').length == 0) return
            let dom = $(this).parents('ul')
            let arr = $(dom).find('[item_op_type="is_score"]')
            $(dom).find('input#total_score').val(_this.getTotalScore(arr))

            if (_this.levelType == '1') {
              let levelState = _this.getLevelStr($(dom).find('input#total_score').val())
              _this.reWriteLevel(dom, levelState)
            }

            // if(levelState!=''){
            //   let selectVal = 'dd[lay-value=' + levelState + ']';
            //   $(dom).find('#level_state').siblings("div.layui-form-select").find('dl').find(selectVal).click();
            // }else{
            //   $(dom).find('#level_state').siblings("div.layui-form-select").find('dd').eq(0).click();
            // }
          } else {
            let arr = $('.layui-form').find('[item_op_type="is_score"]')
            $('input#total_score').val(_this.getTotalScore(arr))

            if (_this.levelType == '1') {
              let levelState = _this.getLevelStr($('input#total_score').val())
              _this.reWriteLevel($('.layui-form'), levelState)
            }
          }
        })
      }
    },
    reWriteLevel (_dom, _level) {
      if (this.levelType != '1' || $(_dom).find('#level_state').length == 0) return
      let levelObj = $(_dom).find('#level_state')[0]
      let objType = levelObj.tagName.toLowerCase()
      if (objType == 'input') {
        if (_level == '') {
          $(levelObj).attr('placeholder', '暂无匹配级别')
        } else {
          $(levelObj).val(_level)
        }
      }
    },
    getLevelStr (_totalScore) {
      let backVal = ''
      for (let o of this.levelData) {
        if (parseInt(_totalScore) >= parseInt(o.min) && parseInt(_totalScore) <= parseInt(o.max)) {
          backVal = o.opt_val
        }
      }
      return backVal
    },
    getTotalScore (_arr) {
      let arr = _arr
      let totalScore = 0
      for (let i = 0; i < _arr.length; i++) {
        let obj = _arr[i]
        if (obj.tagName == 'SELECT') {
          let tmp = $(obj).find('option:selected').attr('opt_score')
          totalScore += (isNaN(parseInt(tmp)) ? 0 : parseInt(tmp))
        } else if (obj.tagName == 'TEXTAREA') {
          // console.log('暂无此计算选项')
          // console.log(totalScore)
          if ($(obj).val().replace(' ', '').length > 0) totalScore += $(obj).val().split(',').length * $(obj).attr('item_score')
          // console.log(totalScore)
        } else if (obj.tagName == 'INPUT') {
          let t = $(obj).attr('type')
          if (t == 'text') {
            if ($(obj).val() != '') {
              if ($(obj).attr('item_score') == '-999') {
                totalScore += (isNaN(parseInt($(obj).val()))) ? 0 : parseInt($(obj).val())
              } else {
                totalScore += (isNaN(parseInt($(obj).attr('item_score')))) ? 0 : parseInt($(obj).attr('item_score'))
              }
            }
          } else if (t == 'checkbox' || t == 'radio') {
            // $(obj).prop('checked',true)
            // $(obj).prop('checked',true)
            if ($(obj).prop('checked')) {
              totalScore += $(obj).attr('opt_score') * 1
            }
          }
        }
      }
      return totalScore
    },
    bindLayer () {
      let _this = this
      $('input[extend_info="is_layer"]').dblclick(function () {
        let objDom = $('.layerContainer .layer_' + $(this).attr('id'))
        if ($(objDom).length <= 0) return
        $(objDom).removeClass('layui-hide')
        let that = this
        _this.layForm.render()
        _this.layer.open({
          type: 1,
          skin: 'layui-layer-rim', // 加上边框
          title: $(this).attr('title'),
          scrollbar: false,
          area: ['auto', 'auto'], // 宽高
          content: $('.layerContainer .layer_' + $(this).attr('id')),
          btn: ['确认', '取消'],
          yes: function (index, layero) {
            let inputFlag = layero.find('div.mobalElement').attr('data-tag')
            // 本类型计算只针对一级选项为单选
            /*
          * class取名以需要回写的INPUT的ID属性前加"layer_"
          * <div class="layer_ass_loop_test" calculate-type="1" style="width:600px;">
              <div class="layui-inline mobalElement" data-tag="layer_pipeline_type"></div>
          * </div>
          * */

            let textArr = [] // 计录所选项标题
            let rsVal = 0 // 计录子项所得分值
            let dataArr = layero.find('[name="' + inputFlag + '"]:checked') // 得分计算项
            if (dataArr.length > 0) {
              for (let i = 0; i < dataArr.length; i++) {
                let obj = dataArr[i]
                if ($('input[rely_opt_flag="' + $(obj).attr('id') + '"]:checked').length == 0) {
                  _this.layer.tips('请选择管道类型', $(obj).parent())
                  return
                } else {
                  $('input[rely_opt_flag="' + $(obj).attr('id') + '"]:checked').each(function () {
                    if ($(this).parent().find('input:text[rely_opt_flag="' + $(this).attr('id') + '"]').length > 0) {
                      // 判断备注项
                      let remarkArr = $(this).parent().find('input[rely_opt_flag="' + $(this).attr('id') + '"]')
                      for (let i = 0; i < remarkArr.length; i++) {
                        let o = remarkArr[i]
                        if ($(o).val() != '')textArr.push($(o).val())
                      }
                    } else {
                      textArr.push($(this).attr('title'))
                    }
                  })

                  let tmp = $(obj).val()
                  if (!isNaN(parseInt(tmp))) rsVal += parseInt(tmp)
                }
              }
            }
            if (textArr.length > 0) {
              $(that).val(textArr.join(',')).attr({ 'item_score': rsVal, 'title': textArr.join(',') })
              if (_this.isLoop == '1') _this.markLoopActive(that, $(that).val())
              _this.layer.close(index)
            } else {
              _this.layer.alert('请选择管道类型')
            }
          },
          btn2: function (index, layero) {
            layer.close(index)
          },
          success: function (layero) {
            var btn = layero.find('.layui-layer-btn')
            btn.css('text-align', 'center')
          },
          end: function () {
            // 清空,临时处理
            $(objDom).addClass('layui-hide')
            $(objDom).find('input').attr('lay-filter', 'layerElem')
            $(objDom).find('input:checkbox').prop('checked', false).prop('disabled', true)
            $(objDom).find('input:radio').prop('checked', false).prop('disabled', true)
            $(objDom).find('input:text').val('')
            $(objDom).find('input:checkbox[rely_opt_flag="layer_' + $(that).attr('id') + '"]').prop('disabled', false)
            $(objDom).find('input:radio[rely_opt_flag="layer_' + $(that).attr('id') + '"]').prop('disabled', false)

            _this.layForm.render(null, 'layerElem')
          }
        })
      })
    },
    getRes () {
      let _this = this
      /*
      let getUrl = '/nams/web-na/ass-info/get?assId='+_this.assId+'&patientId='+_this.patientId+'&assTimes='+_this.assTimes;
      if(_this.quickPageChange.pagination!=='') getUrl+='&pagination='_this.quickPageChange.pagination;
      console.log('getRes:',getUrl)
*/
      let getPara = {
        assId: _this.assId,
        patientId: _this.patientId,
        assTimes: _this.assTimes,
        pagination: _this.quickPageChange.pagination
      }
      let getUrl = '/nams/web-na/ass-info/get'
      AxiosApi(getUrl, {}, 'GET', getPara).then(res => {
        if (res.data != null) {
          _this.firstRecordFlag = false
          if (this.isLoop == '1' && res.data.loopInfo) {
            this.assLoopList = res.data.loopInfo
            let tmpObj = $('#loop_container .loop_list_0 .ass_active_but[extend_info="import_prev"]')
            if (res.data.pageUp != '')$('#loop_container .loop_list_0 .ass_active_but[extend_info="import_prev"]').show()

            this.re_write_loop_obj()
            if (_this.quickPageChange) {
              _this.quickPageChange.pageUp = res.data.pageUp
              _this.quickPageChange.pageDown = res.data.pageDown
              // _this.quickPageChange.pagination = ''
            }
          }
          this.re_write(res.data, '', this.assResList)
          _this.get_HIS_data()
          _this.layForm.render()
          if (res.data.ass_info_id) _this.ass_info_id = res.data.ass_info_id
          if (this.isLoop != '1') if ($('.layui-form').find('.label-score').length > 0) $('.layui-form').find('.label-score').trigger('click')
        } else {
          _this.get_HIS_data()
        }

        _this.resStatus = res.desc.split('@_@')[0] || ''
      }).catch(res => {
        _this.resStatus = ''
        _this.get_HIS_data()
      })
    },
    formatResObj (_o, _f) {
      // _o:循环至本次的返回数据
      if (_o == undefined) return
      let resObj = {
        item_id: _o.item_id,
        item_input_type: _o.item_input_type,
        // loadRes:'',
        options: _o.options,
        res: ''
      }

      if (_f == '1') {
        this.assResLoopList.push(resObj)
      } else if (_f == '2') {
      } else {
        this.assResList.push(resObj)
      }
    },
    formatDom (_o) {
      if ($.isEmptyObject(_o) || _o == null) return
      let loopFlag = '0'
      if (_o.is_loop) loopFlag = _o.is_loop
      let obj = _o
      if (obj.his_id != '0') {
        obj.item_input_type == 'text_out' ? this.convert_text_out(obj, 'hisObj') : this.convert_input(obj, 'hisObj')
        this.formatResObj(obj, loopFlag)
      } else if (obj.item_input_type == 'input') {
        this.convert_input(obj, obj.item_input_type)
        this.formatResObj(obj, loopFlag)
      } else if (obj.item_input_type == 'total_score') {
        this.convert_total_score(obj)
        this.formatResObj(obj, loopFlag)
      } else if (obj.item_input_type == 'datetime' || obj.item_input_type == 'date' || obj.item_input_type == 'time') { // datatime
        this.convert_datetime(obj)
        this.formatResObj(obj, loopFlag)
      } else if (obj.item_input_type == 'textarea') { // datatime
        this.convert_textarea(obj)
        this.formatResObj(obj, loopFlag)
      } else if (obj.item_input_type == 'select') {
        this.convert_select(obj, loopFlag)
        this.formatResObj(obj, loopFlag)
      } else if (obj.item_input_type == 'button') {
        this.convert_button(obj)
      } else if (obj.item_input_type == 'radio' || obj.item_input_type == 'checkbox') {
        this.convert_checkbox(obj, loopFlag)
        this.formatResObj(obj, loopFlag)
      } else if (obj.item_input_type == 'bind_ass_res') {
        this.convert_bind_ass_res(obj)
      } else if (obj.item_input_type == 'SESSION_USER' || obj.item_input_type == 'SESSION_DEPT') {
        this.convert_input(obj, 'input')
        let sessionObj = this.get_SESSION(obj.item_input_type)
        // console.log('sessionObj')
        // console.log(sessionObj)
        // $('#'+_o.item_id).attr('para_id',sessionObj.res_id).val(sessionObj.res_name);
        $('#' + _o.item_id).val(sessionObj.res_name)
        this.formatResObj(obj, loopFlag)
      } else if (obj.item_input_type == 'text_out') {
        this.convert_text_out(obj)
      }
    },
    cloneDom () {
      let _this = this
      $('#loop_container').html('')
      _this.thisLoop = 0
      for (let i = 0; i < this.assLoopNum; i++) {
        $('#loop_container').append($('.loop_sample').clone().removeClass('loop_sample').addClass('loop_list_' + _this.thisLoop).attr('ulflag', i))
        _this.thisLoop++
      }
      $('#loop_container .loop_list_0 .ass_active_but[extend_info="import_prev"]').hide()
      $('#loop_container .ass_active_but[extend_info="import_prev"]').click(function () { _this.extent_active('import_prev', this) })

      this.layForm.render()
      this.bindLoopChang()
    },
    // 将_o转换为input格式DOM对象
    convert_text_out (_o, _t) {
      let labelStr = this.formatEleTitle(_o)
      let labelR = this.format_label_r(_o.item_label_right, _o.item_label_right_css)
      let thisData = _o.init_data

      let inputStr = ' id="' + _o.item_id + '" ' +
          ' title="' + _o.item_title + '" ' +
          ' his_flag="' + _t + '"' +

          ' his_id="' + _o.his_id + '"' +
          ' item_op_type="' + _o.item_op_type + '"' +
          ' item_score="' + _o.item_score + '"' +
          ' extend_info="' + _o.extend_info + '"' +
          ' style="' + _o.item_input_css + '"'

      let eleStr = '<div class="layui-inline" >' +
          labelR +
          labelStr +
          ' <div class="layui-input-inline">' +
          ' <span class="text_out"  ' + inputStr + ' >' + thisData + '</span>' +
          ' </div>' +
          '</div>'
      $('.mobanHtml div[data-tag=' + _o.item_tag + ']').html(eleStr)
    },
    convert_input (_o, _t) {
      if (_o.item_id == 'pain_part') console.log('_t:', _t)
      let labelStr = this.formatEleTitle(_o)
      let labelR = this.format_label_r(_o.item_label_right, _o.item_label_right_css)
      let thisData = _o.init_data
      if (_o.init_data == 'SESSION_USER') {
        let sessionObj = this.get_SESSION('SESSION_USER')
        // $('#'+_o.item_id).attr('para_id',sessionObj.res_id).val(sessionObj.res_name);
        thisData = sessionObj.res_name
      }
      let inputStr = 'type="text" ' +
          ' id="' + _o.item_id + '" ' +
          ' title="' + _o.item_title + '" ' +
          ' his_flag="' + _t + '"' +

          ' his_id="' + _o.his_id + '"' +
          ' item_op_type="' + _o.item_op_type + '"' +
          ' item_score="' + _o.item_score + '"' +
          ' extend_info="' + _o.extend_info + '"' +
          ' value="' + thisData + '" ' +
          ' style="' + (_o.item_input_css == '' ? 'width:120px;' : _o.item_input_css) + '"'
      // if(_o.placeholder != undefined) inputStr +=' placeholder="'+_o.placeholder+'" '
      if (_o.is_loop == '1') inputStr += ' lay-filter="loopInput" '

      if (_o.item_disabled == '1' || (_o.item_id == 'level_state' && this.levelType == '1')) {
        thisData = ''
        inputStr += ' readonly=true '
      }
      let eleStr = '<div class="layui-inline" >' +
          labelR +
          labelStr +
          ' <div class="layui-input-inline">' +
          ' <input class="layui-input"  ' + inputStr + ' />' +
          ' </div>' +
          '</div>'
      $('.mobanHtml div[data-tag=' + _o.item_tag + ']').html(eleStr)
    },
    convert_total_score (_o) {
      let labelStr = this.formatEleTitle(_o)
      let labelR = this.format_label_r(_o.item_label_right, _o.item_label_right_css)
      let inputStr = 'type="text" ' +
        'id="' + _o.item_id + '" ' +
        'op_flag="' + _o.item_input_type + '"' +
        'value="' + _o.init_data + '" ' +
        'placeholder="' + _o.placeholder + '" ' +
        'oninput = "value=value.replace(\/[^\\d]\/g,\'\')"' +
        'style="' + (_o.item_input_css == '' ? 'width:120px;' : _o.item_input_css) + '"'
      if (_o.is_loop == '1') inputStr += ' lay-filter="loopInput" '

      let eleStr = '<div class="layui-inline" >' +
        // labelR +
        labelStr +
        ' <div class="layui-input-inline">' +
        '<label class="layui-form-label label-score"><i class="layui-icon">&#xe9aa;</i></label>' +
        ' <input class="layui-input"  ' + inputStr + ' />' +
        ' </div>' +
        '</div>'
      $('.mobanHtml div[data-tag=' + _o.item_tag + ']').html(eleStr)
      if (!this.totalScoreFlag) this.totalScoreFlag = true
    },
    convert_textarea (_o) {
      let inputStr = 'class="layui-textarea" ' +
        'id="' + _o.item_id + '" ' +
        ' item_op_type="' + _o.item_op_type + '"' +
        ' item_score="' + _o.item_score + '"' +
        (_o.item_disabled == '1' ? ' disabled=true ' : '') +
        'style="' + _o.item_input_css + '" '
      // if(_o.placeholder) inputStr += 'placeholder="'+_o.placeholder+'" ';
      if (_o.is_loop == '1') inputStr += ' lay-filter="loopInput" '

      let eleStr = '<textarea ' + inputStr + ' ></textarea>'
      $('.mobanHtml div[data-tag=' + _o.item_tag + ']').html(eleStr)

      if (_o.item_op_type == 'is_nursing_focus') {
        $('#' + _o.item_id).dblclick(function (obj) {
          _this.layer.alert('选择焦点')
          $(this).val('模拟返回所选焦点')
        })
      }
    },
    convert_datetime (_o) {
      let dt = {
        datetime: 'yyyy-MM-dd HH:mm:ss',
        date: 'yyyy-MM-dd',
        time: 'HH:mm:ss'
      }
      let labelStr = this.formatEleTitle(_o)
      let labelR = this.format_label_r(_o.item_label_right, _o.item_label_right_css)
      let inputStr = 'type="text" ' +
        'id="' + _o.item_id + '" ' +
        'value="' + _o.init_data + '" ' +
        'datetime-flag="layui_datetime" ' +
        'date-type="' + _o.item_input_type + '" ' +
        'date-format="' + dt[_o.item_input_type] + '" ' +
        'readonly '
        // 'placeholder="'+dt[_o.item_input_type]+'" '
      if (_o.is_loop == '1') inputStr += ' lay-filter="loopInput" '

      'style="' + (_o.item_input_css == '' ? 'width:120px;' : _o.item_input_css) + '"'
      let eleStr = '<div class="layui-inline" >' +
        labelR +
        labelStr +
        ' <div class="layui-input-inline">' +
        ' <input class="layui-input"  ' + inputStr + ' />' +
        ' </div>' +
        '</div>'
      $('.mobanHtml div[data-tag=' + _o.item_tag + ']').html(eleStr)
    },
    convert_button (_o) {
      let _this = this
      let labelStr = this.formatEleTitle(_o)
      let inputStr = '<span ' +
        'id="' + _o.item_id + '" ' +
        'extend_info="' + _o.extend_info + '" ' +
        'operation_item="' + _o.operation_item + '" ' +
        'lay-filter="ass-active-but" ' +
        'class="layui-btn layui-btn-sm ass_active_but layui-btn-normal" ' +
        (_o.item_disabled == '1' ? ' disabled=true ' : '') +
        'style="' + _o.item_input_css + '"> ' +
        _o.item_title +
        '</span>'
      let eleStr = '<div class="layui-inline">' +
        inputStr +
        '</div>'
      let dom = $('.mobanHtml div[data-tag=' + _o.item_tag + ']')
      $(dom).html(eleStr)
      if (_o.item_op_type == 'is_auto_print') {
        $('.printButtonDiv').find('div.mobalElement').remove()
        $('.printButton').before($(dom))
      }
      $('#' + _o.item_id).click(function () {
        _this.extent_active(_o.item_op_type, _o)
      })
    },
    // 转换SELECT
    convert_select (_o, _f) {
      let lay_filter = ''
      if (_f == true) lay_filter = 'lay-filter="loopSelect" '
      let labelStr = this.formatEleTitle(_o)
      let optObj = []
      let disabledStr = ''
      if (_o.item_id == 'level_state' && this.levelType == '1') {
        this.convert_input(_o, 'input')
        // _o.options=JSON.stringify(this.levelData);

        // 此处不可使用DISABLED属性会造成无法自动匹配
        // disabledStr = ' disabled=true '
      } else {
        let optS = '<option value="" selected="true">----------</option>'
        if (_o.options != '' || _o.options != null) {
          optObj = JSON.parse(_o.options)
          for (let i = 0; i < optObj.length; i++) {
            let obj = optObj[i]
            if (!$.isEmptyObject(obj)) {
              optS += '<option opt_score="' + obj.opt_score + '" ' + (obj.auto_selection == '1' ? ' selected=true ' : '') + ' value="' + obj.opt_val + '">' + obj.opt_text + '</option>'
            }
          }
        }
        if (_o.item_disabled == '1') disabledStr = ' disabled=true '
        let eleStr = '<div class="layui-inline">' +
          labelStr +
          ' <div class="layui-inline" style="' + _o.item_input_css + '">' +
          '   <select id="' + _o.item_id +
          '" item_op_type="' + _o.item_op_type +
          '" name="' + _o.item_tag +
          '"  ' + disabledStr + lay_filter + '>' +
          optS +
          '   </select>' +
          ' </div>' +
          '</div>'
        $('.mobanHtml div[data-tag=' + _o.item_tag + ']').html(eleStr)
        this.layForm.render('select')
      }
    },
    // 转换checkbox
    convert_checkbox (_o, _f = false) {
      let lay_filter = ''
      if (_f == true) lay_filter = 'lay-filter="loopCheckbox" '

      let labelStr = this.formatEleTitle(_o)
      let optObj = []
      let optS = ''
      if (_o.item_id == 'level_state' && this.levelType == '1') {
        this.convert_input(_o, 'input')
        // _o.options=JSON.stringify(this.levelData);

        // 此处不可使用DISABLED属性会造成无法自动匹配
        // disabledStr = ' disabled=true '
      } else {
        if (_o.options != '' || _o.options != null) {
          optObj = JSON.parse(_o.options)
          for (let obj of optObj) {
            if (!$.isEmptyObject(obj)) {
              let chkStr = obj.auto_selection == '1' ? ' checked=true ' : ''
              if (obj.opt_label_left && obj.opt_label_left != '')optS += obj.opt_label_left
              optS += '<div ' + (obj.opt_monopoly == '0' ? 'class="layui-inline lh35 optDiv"' : 'class="ass-form-noMT lh35 optDiv"') + ' style="' + (obj.opt_css || '') + '">'
              if (!obj.sub_opt) {
                optS += '<div>'
              } else {
                optS += '<div class="' + ((obj.sub_opt.length == 0 && obj.remark.length == 0) ? '' : 'labelDiv') + '">'
              }
              optS += '<input type="' + _o.item_input_type + '" ' +
                'id="' + obj.opt_id + '" ' +
                'rely_opt_flag="' + _o.item_id + '" ' +
                'name="' + _o.item_id + '" ' +
                'item_op_type="' + _o.item_op_type + '"' +
                'value="' + obj.opt_val + '" ' +
                'title="' + obj.opt_text + '" ' +
                'autoAddScore="' + (obj.autoAddScore != undefined ? obj.autoAddScore : 'none') + '" ' +
                'opt_score="' + (obj.opt_score != undefined ? obj.opt_score : '0') + '" ' +
                'lay-skin="primary" ' +
                lay_filter + chkStr + ' />'
              optS += '</div>'
              if (obj.sub_opt != '') {
                optS += this.formatSubOptionsHtml(obj)
              }
              if ($.isArray(obj.remark) && !(obj.remark.length < 1)) {
                optS += this.getRemarkHtml(obj)
              }
              optS += '</div>'
            }
          }
        }
        let eleStr = labelStr + '<div text="' + _o.item_id + '" id="' + _o.item_id + '" class="layui-input-block" style="' + _o.item_input_css + '">' + optS + '</div>'
        $('.mobanHtml div[data-tag=' + _o.item_tag + ']').html(eleStr)
        this.layForm.render(_o.item_input_type)
      }
    },
    // isImportTime 意思是如果当前不是初始加载，那就不要再监听引入按钮的click事件
    convert_bind_ass_res (_o, isImportTime) {
      let _this = this
      // let assListStr="10007,10009,10002,10004,10003";
      let assListStr = _o.init_data
      let rsArr = []
      AxiosApi('/nams/web-na/ass-info/get-ass-res?patientId=' + this.patientId + '&assIds=' + assListStr, {}, 'GET', {}).then(res => {
        if (res.desc == '操作成功') {
          rsArr = res.data
          // console.log(rsArr);
          if (rsArr.length > 0) {
            for (let rs of rsArr) {
              let o = $('.layui-form div[bind-ass-id="' + rs.ass_id + '"]')
              // console.log($(o))
              if (rs.ass_res) {
                $(o).find('input:text[name="ass_score"]').val(rs.ass_res.totalScore)
                if (rs.ass_res.level != '') {
                  let ruleInfo = '总分'
                  if (rs.ass_res.minRecord != '') {
                    ruleInfo = rs.ass_res.minRecord + '≤' + ruleInfo
                  }
                  if (rs.ass_res.maxRecord != '') {
                    ruleInfo = ruleInfo + '≤' + rs.ass_res.maxRecord
                  }
                  let str = rs.ass_res.level + (ruleInfo == '总分' ? '' : '(' + ruleInfo + ')')
                  $(o).find('input:text[name="ass_res"]').val(str)
                }
                $(o).find('span.ass_act_but').removeClass('layui-btn-normal').addClass('layui-btn-primary').text('查看评估内容')
                if (isImportTime) continue
                $(o).find('span.ass_act_but').click(function () {
                  let ass = layer.open({
                    type: 2,
                    title: $(o).find('div.bind-ass-tit145').text().replace(':', ''),
                    shadeClose: false,
                    // shade: false,
                    area: ['1100px', '100%'],
                    content: '#/assess_info_repeat/' + rs.ass_id + '/' + _this.patientId + '/' + rs.isLoop + '/' + rs.loopTimes + '/1/' + _this.saveDataFlag + '/' + (rs.levelType || '1'),
                    end: function () {
                      // console.log($(o));
                      // $(o).find('span.ass_act_but').unbind('click')
                      _this.convert_bind_ass_res(_o, true)
                    },
                    cancel: function (index, layero) {
                      _this.layer.confirm('确认要退出吗?<br />点击"确认"将不保存数据直接关闭评估窗口；<br />点击"取消"继续填写评估内容。', {
                        closeBtn: 0,
                        btn: ['确认', '取消']
                      }, function () {
                        // layer.closeAll()
                        _this.layer.closeAll()
                      }, function (index) {

                      })

                      /*
                                            if(confirm('确认要关闭吗?\r\n点击"确认"将不保存数据直接关闭评估窗口；\r\n点击"取消"继续填写评估内容。')){ //只有当点击confirm框的确认时，该层才会关闭
                                              layer.close(index)
                                            }
                      */
                      return false
                    }
                  })
                  // layer.full(ass)
                })
              } else {
                // console.log('no order');
                if (isImportTime) continue
                $(o).find('span.ass_act_but').click(function () {
                  let ass = layer.open({
                    type: 2,
                    title: $(o).find('div.bind-ass-tit145').text().replace(':', ''),
                    shadeClose: false,
                    // shade: false,
                    area: ['1100px', '100%'],
                    content: '#/assess_info_repeat/' + rs.ass_id + '/' + _this.patientId + '/' + rs.isLoop + '/' + rs.loopTimes + '/-1/' + _this.saveDataFlag + '/' + (rs.levelType || '1'),
                    end: function () {
                      // console.log($(o));
                      // $(o).find('span.ass_act_but').unbind('click')
                      _this.convert_bind_ass_res(_o, true)
                    },
                    cancel: function (index, layero) {
                      _this.layer.confirm('确认要退出吗?<br />点击"确认"将不保存数据直接关闭评估窗口；<br />点击"取消"继续填写评估内容。', {
                        closeBtn: 0,
                        btn: ['确认', '取消']
                      }, function () {
                        // layer.closeAll()
                        _this.layer.closeAll()
                      }, function (index) {

                      })

                      /*
                      if(confirm('确认要关闭吗?\r\n点击"确认"将不保存数据直接关闭评估窗口；\r\n点击"取消"继续填写评估内容。')){ //只有当点击confirm框的确认时，该层才会关闭
                        layer.close(index)
                      }
*/
                      return false
                    }
                  })
                  // layer.full(ass)
                })
              }
            }
          }
        } else {
          rsArr = []
        }
      })
    },
    formatSubOptionsHtml (_o) {
      if ($.isEmptyObject(_o) || _o == '') return
      let subObj = _o.sub_opt
      let disabledStr = subObj.rely_on == '1' ? ' disabled=true ' : ''
      let optS = ''
      if (subObj.sub_opt_list.length > 0) {
        for (let obj of subObj.sub_opt_list) {
          if (!$.isEmptyObject(obj)) {
            (obj.opt_monopoly == '1') ? optS += '<div class="lh35" style="' + obj.opt_css + '">' : optS += '<div class="layui-input-inline" style="' + obj.opt_css + '">'
            optS += '<input type="' + subObj.sub_input_type + '" ' +
              '    rely_opt_flag="' + _o.opt_id + '" ' +
              '               id="' + obj.opt_id + '"' +
              '             name="' + _o.opt_id + '" ' +
              '            value="' + obj.opt_val + '" ' +
              '     autoAddScore="' + (obj.autoAddScore != undefined ? obj.autoAddScore : 'none') + '" ' +

              '             title="' + obj.opt_text + '" ' +
              '          lay-skin="primary" ' +
              disabledStr + ' />'
            if ($.isArray(obj.remark) && !(obj.remark.length < 1)) {
              optS += this.getRemarkHtml(obj)
            }
            optS += '</div>'
          }
        }
      }
      optS = '<div class="layui-input-block ass_sub_opt-div" res_opt="' + _o.opt_id + '" style="' + _o.sub_opt.sub_container_css + '">' + optS + '</div>'
      return optS
    },
    getRemarkHtml (_o) {
      let _arr = _o.remark
      let str = '<div class="ass-remark-div" res_opt="' + _o.opt_id + '">'
      for (let i = 0; i < _arr.length; i++) {
        let obj = _arr[i]
        if (!$.isEmptyObject(obj)) {
          str += '<div class="layui-input-inline">' + this.format_label_r(obj.remark_label_right, obj.remark_label_right_css)
          if (obj.remark_title != '') str += '<label class="layui-form-label ' + (_o.auto_selection != '1' ? 'disLabel' : '') + '">' + obj.remark_title + '</label>'
          if (obj.remark_type && obj.remark_type == 'textarea') {
            let inputStr = 'class="layui-textarea" ' +
                'id="' + obj.remark_id + '" ' +
                'rely_opt_flag="' + _o.opt_id + '" ' +
                'style="' + obj.remark_css + '" ' +
                (_o.auto_selection != '1' ? ' disabled=true ' : '')
            // if(_o.placeholder) inputStr += 'placeholder="'+_o.placeholder+'" ';
            str += '<textarea ' + inputStr + ' ></textarea>'
          } else {
            str += '<input type="text" class="layui-input" id="' + obj.remark_id + '" rely_opt_flag="' + _o.opt_id + '" style="' + obj.remark_css + '" '
            if (_o.auto_selection != '1') str += ' disabled=true '
            str += ' />'
          }
          str += '</div>'
        }
      }
      // '+ obj.remark_type||'text' +'
      str += '</div>'
      return str
    },
    formatEleTitle (_o) {
      if (!this.is_legal(_o.item_title)) return ''

      return '<label class="layui-form-label" style="' + _o.item_title_css + '">' + _o.item_title + '</label>'
    },
    format_label_r (_text, _css) {
      if (!this.is_legal(_text)) return ''
      return '<label class="layui-form-label-r" style="' + _css + '">' + _text + '</label>'
    },
    extent_active (_opType, _obj) {
      let opType = _opType
      let _this = this
      let dataArr = ['sign_T', 'sign_P', 'sign_R', 'sign_BP_B', 'sign_BP_P', 'sign_height', 'sign_weight']
      let dataList = []// [{signCode:'sign_T',signValue:'37'},{signCode:'sign_P',signValue:'85'}.....,]

      if (opType == 'is_export') {
        for (let i = 0; i < dataArr.length; i++) {
          let val = $('#' + dataArr[i]).val() || ''
          if (val == '' || val == undefined) val = ''
          dataList.push({
            signCode: dataArr[i],
            signValue: val
          })
        }
        let url = '/nrms/web-nr/temperature/syncRYPGData'
        let postData = {
          deptId: _this.SESSION_OBJ.SESSION_DEPT.res_id,
          patientId: _this.patientId,
          targetDate: $('#p_in_time').val() || '',
          measureNurse: _this.SESSION_OBJ.SESSION_USER.res_id,
          dataList: dataList
        }
        console.log('postData', postData)
        AxiosJsonApi(url, postData, 'post', {}).then(res => {
          let rs = res
          if (rs.status && rs.status == '200') {
            _this.layer.msg('体征数据同步成功')
          } else {
            _this.layer.alert('体征数据同步失败，请联系管理员')
          }
        })
      } else if (opType == 'import_prev') {
        // 循环表复制数据
        let ul = $(_obj).parents('ul')
        // 非第一个UI，则复制上一条
        if ($(ul).prev().length > 0) {
          let p_ul = $(ul.prev())
          let arr = ($(_obj).attr('operation_item')).split(',')
          let modi_field = '@@'

          for (let i = 0; i < arr.length; i++) {
            let idFlag = arr[i]
            let obj = $(ul).find('#' + idFlag)
            let pobj = $(p_ul).find('#' + idFlag)
            // let domType = obj[0].tagName || false;
            if ($(obj)[0].tagName && $(obj)[0].tagName == 'DIV') {
              // 暂时只支持一级CHECKBOX，不支持递归

              let preArr = $(pobj).find('input[type=checkbox]')
              let objArr = $(obj).find('input[type=checkbox]')
              for (let i = 0; i < objArr.length; i++) {
                let o = objArr[i]
                let po = preArr[i]
                if (o && po) {
                  if ($(o).prop('checked') != $(po).prop('checked')) {
                    if (modi_field.indexOf(idFlag + '@@') == -1) modi_field += idFlag + '@@'
                    $(o).prop('checked', $(po).prop('checked'))
                  }
                }
              }
            } else {
              if ($(obj).val() != $(pobj).val()) {
                $(obj).val($(pobj).val())
                if (modi_field.indexOf(idFlag + '@@') == -1) modi_field += idFlag + '@@'
              }
              if ($(obj).attr('extend_info') == 'is_layer') {
                $(obj).attr('item_score', $(pobj).attr('item_score'))
              }
            }
          }
          if (modi_field != '@@') {
            if ($(ul).attr('data_up_type') && $(ul).attr('data_up_type') == 'put') {
              $(ul).addClass('put_is_modi').removeClass('post_is_modi')
              $(ul).attr('modi_flag', 'true')
            } else {
              $(ul).addClass('post_is_modi').removeClass('put_is_modi')
              $(ul).attr('modi_flag', 'true')
              $(ul).attr('modi_flag', 'true')
              $(ul).attr('data_up_type', 'post')
            }
          } else {
            _this.layer.msg('导入了相同的评估结果')
          }
          _this.layForm.render()
          // 激活总分统计
          if ($(ul).find('.label-score').length > 0) $(ul).find('.label-score').trigger('click')
        } else {
          // 本页第一次循环，则取当前最后一条记录
          _this.re_write_loop_obj($(ul).attr('ulflag'), $(_obj).attr('operation_item') || undefined)
          _this.layForm.render()
        }
      } else if (opType == 'is_href_self') {
        // 链接

        _this.layer.alert('在本页打开链接')
      } else if (opType == 'is_auto_print') {
        // 链接
        // _this.layer.alert('弹出层显示新链接')
        layer.open({
          type: 2,
          title: '打印',
          shadeClose: false,
          // shade: false,
          area: ['1100px', '100%'],
          content: '#/ass_auto_print/10011/' + _this.patientId + '/0/0/-1/false/1',
          cancel: function (index, layero) {
            _this.layer.closeAll()
            return false
          }
        })
      } else if (opType == 'is_link_ASS_self') {
        // 本页跳转至其他评估

      } else if (opType == 'is_link_ASS_layer') {
        // 弹出层打开评估

      } else if (opType == 'is_count') {
        // 统计得分
      } else if (opType == 'extend_op') {
        // 扩展接口，此类接口直接发送至后台接口，然后接收返回数据

      }
    },
    export_state (_o) {
      // alert('export_state')
      let obj = _o
      // 导出
      let exportObj = []
      let itemArr = obj.operation_item.split(',')
      if (itemArr.length > 0) {
        for (let i = 0; i < itemArr.length; i++) {
          // 暂时只支持INPUT:TEXT
          let tmpDom = $('.mobanHtml input:text#' + itemArr[i])
          if (tmpDom.length > 0) {
            exportObj.push({
              obj_id: itemArr[i],
              obj_val: $(tmpDom).val()
            })
          }
        }
      }
      return exportObj
    },
    get_SESSION (_para) {
      return eval('this.SESSION_OBJ.' + _para)
    },
    get_HIS_data () {
      let _this = this

      // alert(_this.saveDataFlag)
      if (!_this.saveDataFlag) return
      AxiosApi('/bnms/web-bn/patient-list/by-patient-id?patientId=' + _this.patientId, {}, 'GET', {}, 'bnms').then(res => {
        if (res.desc == '操作成功') {
          _this.hisData = {
            p_dept: '',
            p_unit: '',
            p_id: '',
            p_inp_no: '',
            p_bed_no: '',
            p_name: '',
            p_sex: '',
            p_age: '', // 年龄
            p_in_time: '', // 入院时间
            p_imp: ''// 诊断
          }
          let patient = res.data.patientInViewDTO
          _this.hisData.p_dept = patient.deptName || ''
          _this.hisData.p_id = patient.id || ''
          _this.hisData.p_inp_no = patient.inpNo || ''
          _this.hisData.p_unit = patient.deptName || ''
          _this.hisData.p_bed_no = patient.bedName || ''
          _this.hisData.p_name = patient.patientName || ''
          _this.hisData.p_sex = patient.sex || ''
          _this.hisData.p_age = patient.patientAge || ''
          _this.hisData.p_in_time = patient.inTime || ''
          _this.hisData.p_imp = patient.diagnose || ''
          formatHisDom(_this)
        } else {
          _this.$message({
            message: '该病人当前状态或为出院或已经转科，此处基本信息为进行评估时所保存的数据',
            type: 'warning'
          })
        }
      })
      //
      // if(_this.hisData==null){
      //
      // }else{
      //   formatHisDom(_this)
      // }

      function formatHisDom (_this) {
        let hisDom = $('.layui-form input[his_flag="hisObj"]')
        if (hisDom.length > 0) {
          for (let i = 0; i < hisDom.length; i++) {
            let hObj = hisDom[i]
            $(hObj).val(_this.hisData[$(hObj).attr('his_id')] || '')
          }
        }
        let hisDomText = $('.layui-form span[his_flag="hisObj"]')
        if (hisDomText.length > 0) {
          for (let i = 0; i < hisDomText.length; i++) {
            let hObj = hisDomText[i]
            $(hObj).text(_this.hisData[$(hObj).attr('his_id')] || '')
          }
        }
      }

      /*
            if(_this.saveDataFlag!='auto'){
              _this.$message({
                message: '当前病人为出院或转科状态，无法获取HIS相关的病人数据',
                type: 'warning'
              });
            }else{
            }

      */
    },
    is_legal (_s) {
      let rs = false
      if (_s != '' && _s != undefined && _s != null) rs = true
      return rs
    },
    re_write (_index, _c, _rs) {
      let _this = this
      /*
    *   _o: 数据对象即查询结果集
    *   _c: CONTAINER，容器识别
    *   _rs:res变量，待提交的结果集
    * */
      // console.log('_index:',_index)
      // console.log('_c:',_c)
      // console.log('_rs:',_rs)

      let _o = _this.assLoopList[_index] || _index
      if (_rs == undefined || _o == undefined) return
      let baseContainer = '.mobanHtml ' + _c

      let rs = _rs

      for (let obj of rs) {
        if (obj.item_input_type === 'text_out') {
          _o[obj.item_id] && $(baseContainer + ' #' + obj.item_id).text(_o[obj.item_id])
        } else if (obj.item_input_type == 'input' || obj.item_input_type == 'total_score' || obj.item_input_type == 'select' || obj.item_input_type == 'textarea' || obj.item_input_type == 'datetime' || obj.item_input_type == 'date' || obj.item_input_type == 'time') {
          if (this.is_legal(_o[obj.item_id])) {
            let dom = $(baseContainer + ' #' + obj.item_id) // extend_info
            if ($(dom).attr('extend_info') || $(dom).attr('extend_info') == 'is_layer') {
              if (_o[obj.item_id].indexOf('@@') > -1) {
                let arr = _o[obj.item_id].split('@@')
                $(dom).val(arr[0]).attr('data-load', arr[0]).attr('item_score', arr[1])
              }
            } else {
              if (obj.item_id == 'pain_part') { console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&pain_part:', _o[obj.item_id]); $(dom).val('11111111111') }
              $(dom).val(_o[obj.item_id]).attr('data-load', _o[obj.item_id])
            }
          }
        } else if (obj.item_input_type == 'radio' || obj.item_input_type == 'checkbox') {
          if (_o[obj.item_id] != '' && _o[obj.item_id] != '[]') {
            let res = JSON.parse(_o[obj.item_id])
            let optDom = $(baseContainer + ' div[data-tag="' + obj.item_id + '"]')
            $(optDom).find('[rely_opt_flag="' + obj.item_id + '"]:checked').prop('checked', false)

            for (let optRes of res) {
              $(optDom).find('#' + optRes.opt_id).prop('checked', true).attr('data-load', optRes.opt_id)
              let subDom = $(optDom).find('.ass_sub_opt-div[res_opt="' + optRes.opt_id + '"]')
              $(subDom).find('[rely_opt_flag="' + optRes.opt_id + '"]').prop('disabled', false)
              // 格式化一级选项
              if (optRes.sub_opt && optRes.sub_opt.length > 0) {
                // 格式化二级选项
                for (let subRes of optRes.sub_opt) {
                  $(subDom).find('[id="' + subRes.opt_id + '"]').prop('checked', true).attr('data-load', subRes.opt_id)
                  if (subRes.remark && !$.isEmptyObject(subRes.remark)) this.re_write_opt_remark(subDom, subRes)
                }
              }
              // 格式化REMARK
              if (optRes.remark && !$.isEmptyObject(optRes.remark)) {
                this.re_write_opt_remark(optDom, optRes)
              }
            }
          }
        } else if (obj.item_input_type == 'SESSION_USER' || obj.item_input_type == 'SESSION_DEPT') {
        }
      }

      // _this.get_HIS_data();
      // _this.layForm.render()
    },
    imoprt_re_write (_index, _c, _rs, importItems = undefined) {
      let _this = this
      /*
    *   _o: 数据对象即查询结果集
    *   _c: CONTAINER，容器识别
    *   _rs:res变量，待提交的结果集
    * */
      // console.log('_c:',_c)
      // console.log('_rs:',_rs)
      let baseContainer = '.mobanHtml ' + _c
      // $(baseContainer).attr('ass_times','5')
      let _o
      if (_index == 0) {
      //    let res={
      //        "status":200,
      //        "desc":"操作成功",
      //        "data":{
      //          "p_sex":"女",
      //          "p_bed_no":"1",
      //          "pageDown":"5,5",
      //          "create_time":"2020-11-23 14:09:10",
      //          "p_age":"10天",
      //          "ass_info_id":"f71e81f7a7b04bd2b95c7217c84a4cb8",
      //          "p_imp":"",
      //          "pageUp":"",
      //          "SESSION_USER":"吴双",
      //          "update_time":"2020-11-27 16:00:24",
      //          "update_user":"4521c2dfc5654e7f8faa5b06527d65a0",
      //          "patient_id":"2",
      //          "p_name":"2",
      //          "ass_times":1,
      //          "create_user":"",
      //          "loopInfo": {
      //            "assessor":"吴双",
      //            "head_nurse":"q",
      //            "level_state":"",
      //            "bed_card_flag":'[{"opt_id":"bed_card_flag-1","opt_res":"否"}]',
      //            "step_9":'[{"opt_id":"step_9-1","opt_res":"否"}]',
      //            "step_8":'[{"opt_id":"step_8-0","opt_res":"是"}]',
      //            "step_7":'[{"opt_id":"step_7-1","opt_res":"否"}]',
      //            "step_6":'[{"opt_id":"step_6-0","opt_res":"是"}]',
      //            "step_5":'[{"opt_id":"step_5-1","opt_res":"否"}]',
      //            "step_4":'[{"opt_id":"step_4-0","opt_res":"是"}]',
      //            "step_3":'[{"opt_id":"step_3-1","opt_res":"否"}]',
      //            "step_10":'[{"opt_id":"step_10-0","opt_res":"是"}]',
      //            "step_11":'[{"opt_id":"step_11-1","opt_res":"否"}]',
      //            "update_time":"2020-11-23 14:20:26",
      //            "age_state":'[{"opt_id":"age_state-0","opt_res":"年龄≥70岁 或年龄＜5岁"}]',
      //            "update_user":"4521c2dfc5654e7f8faa5b06527d65a0",
      //            "step_14":'[{"opt_id":"step_14-0","opt_res":"是"}]',
      //            "step_12":'[{"opt_id":"step_12-0","opt_res":"是"}]',
      //            "step_13":'[{"opt_id":"step_13-1","opt_res":"否"}]',
      //            "total_score":"58",
      //            "is_print":0,
      //            "ass_loop_time":"14:08:55",
      //            "type1_state":'[{"opt_id":"type1_state-0","opt_res":"导尿管"},{"opt_id":"type1_state-1","opt_res":"鼻肠管"},{"opt_id":"type1_state-2","opt_res":"盆、腹腔引流"},{"opt_id":"type1_state-3","opt_res":"胃肠减压管"},{"opt_id":"type1_state-4","opt_res":"深静脉置管"},{"opt_id":"type1_state-5","opt_res":"PICC"},{"opt_id":"type1_state-6","opt_res":"造瘘管"},{"opt_id":"type1_state-7","opt_res":"专科非高危导管"}]',
      //            "create_time":"2020-11-23 14:09:09",
      //            "ass_loop_date":"2020-11-23",
      //            "ass_info_id":"86840148829a491fa9025130b88a857c",
      //            "op_state":'[{"opt_id":"op_state-0","opt_res":"粘贴固定局部多汗、渗血或分泌物多"}]',
      //            "step_2":'[{"opt_id":"step_2-0","opt_res":"是"}]',
      //            "patient_id":"2",
      //            "type2_state":'[{"opt_id":"type2_state-0","opt_res":"气管插管或切开"},{"opt_id":"type2_state-1","opt_res":"脑室引流管"},{"opt_id":"type2_state-2","opt_res":"心包引流管"},{"opt_id":"type2_state-3","opt_res":"胸腔引流管"},{"opt_id":"type2_state-4","opt_res":"T管"},{"opt_id":"type2_state-5","opt_res":"动静脉插管"},{"opt_id":"type2_state-6","opt_res":"专科高危导管"}]',
      //            "realize_state":'[{"opt_id":"realize_state-0","opt_res":"烦躁/嗜睡/谵妄/意识模糊/精神障碍"}]',
      //            "ass_times":1,
      //            "create_user":""
      //          },
      //   "is_print":0,
      //       "p_dept":"测试部",
      //       "p_id":"2"
      // }
      // }
      //
      //
      //   _o = res.data.loopInfo;
        // 注意-1的坑
        let page = _this.quickPageChange.pageUp.split(',')
        let tmpTimes = page[0] * 1 + page[1] * 1 + 1
        $(baseContainer).attr('ass_times', tmpTimes)
        AxiosApi('/nsms/web-na/ass-info/get-one',
          {},
          'GET',
          {
            assId: _this.assId,
            patientId: _this.patientId,
            assTimes: tmpTimes // 本次评估次数
          },
          'nsms').then(res => {
          if (res.desc == '操作成功') {
            if (res.data.loopInfo) _o = res.data.loopInfo
            _render(_this)
          } else {
            _this.$message({
              message: '数据获取有异常请联系管理员',
              type: 'warning'
            })
          }
        })
      } else {
        // 现页面逻辑为每页第一条才会取数据否则复制前一个UL的当前数据。
        // console.log('_this.assLoopList',_this.assLoopList)
        // _o = _this.assLoopList[_index-1] || undefined;
        // console.log('_o',_o)
        // _render(_this)
      }

      function _render (_this) {
        if (_this.assLoopList[_index] == undefined) _this.assLoopList.push({})
        if (_rs == undefined || _o == undefined) return
        let rs = _rs
        let arr = []
        if (importItems && importItems != '') arr = importItems.split(',')
        // console.log('_render_arr:',arr)
        let modiStr = $(baseContainer).attr('modi_field') || '@@'
        for (let obj of rs) {
          if (arr.indexOf(obj.item_id) > -1) {
            if (obj.item_input_type == 'input' || obj.item_input_type == 'total_score' || obj.item_input_type == 'select' || obj.item_input_type == 'textarea' || obj.item_input_type == 'datetime' || obj.item_input_type == 'date' || obj.item_input_type == 'time') {
              // if( _o[obj.item_id] !=_this.assLoopList[_index][obj.item_id]) {
              modiStr += obj.item_id + '@@'
              let dom = $(baseContainer + ' #' + obj.item_id) // extend_info
              _this.$set(_this.assLoopList[_index], obj.item_id, _o[obj.item_id])

              if ($(dom).attr('extend_info') || $(dom).attr('extend_info') == 'is_layer') {
                if (_o[obj.item_id].indexOf('@@') > -1) {
                  let arr = _o[obj.item_id].split('@@')
                  $(dom).val(arr[0]).attr('data-load', arr[0]).attr('item_score', arr[1])
                }
              } else {
                $(dom).val(_o[obj.item_id]).attr('data-load', _o[obj.item_id])
              }
              // }
            } else if (obj.item_input_type == 'radio' || obj.item_input_type == 'checkbox') {
              // if(_o[obj.item_id]!='' && _o[obj.item_id]!='[]' ){
              if (!_o[obj.item_id]) continue
              let res = JSON.parse(_o[obj.item_id]) || ''
              // if(_this.assLoopList[_index][obj.item_id]!=_o[obj.item_id]){
              modiStr += obj.item_id + '@@'

              _this.$set(_this.assLoopList[_index], obj.item_id, _o[obj.item_id])
              // console.log('_this.assLoopList',_index,_this.assLoopList[_index]);

              let optDom = $(baseContainer + ' div[data-tag="' + obj.item_id + '"]')
              $(optDom).find('[rely_opt_flag="' + obj.item_id + '"]:checked').prop('checked', false)

              for (let optRes of res) {
                // console.log('for_optRes',optRes)
                $(optDom).find('#' + optRes.opt_id).prop('checked', true).attr('data-load', optRes.opt_id)
                let subDom = $(optDom).find('.ass_sub_opt-div[res_opt="' + optRes.opt_id + '"]')
                $(subDom).find('[rely_opt_flag="' + optRes.opt_id + '"]').prop('disabled', false)
                // 格式化一级选项
                if (optRes.sub_opt && optRes.sub_opt.length > 0) {
                  // 格式化二级选项
                  for (let subRes of optRes.sub_opt) {
                    $(subDom).find('[id="' + subRes.opt_id + '"]').prop('checked', true).attr('data-load', subRes.opt_id)
                    if (subRes.remark && !$.isEmptyObject(subRes.remark))_this.re_write_opt_remark(subDom, subRes)
                  }
                }
                // 格式化REMARK
                if (optRes.remark && !$.isEmptyObject(optRes.remark)) {
                  _this.re_write_opt_remark(optDom, optRes)
                }
              }
              // }
              // }
            } else if (obj.item_input_type == 'SESSION_USER' || obj.item_input_type == 'SESSION_DEPT') {
            }
          }
        }
        if (modiStr != '@@') {
          if ($(baseContainer).attr('data_up_type') && $(baseContainer).attr('data_up_type') == 'put') {
            $(baseContainer).addClass('put_is_modi').removeClass('post_is_modi')

            $(baseContainer).attr('modi_flag', 'true')
          } else {
            $(baseContainer).addClass('post_is_modi').removeClass('put_is_modi')
            $(baseContainer).attr('modi_flag', 'true')
            $(baseContainer).attr('data_up_type', 'post')
          }
          $(baseContainer).attr('modi_field', modiStr)
          // 激活总分统计
          if ($(baseContainer).find('.label-score').length > 0) $(baseContainer).find('.label-score').trigger('click')
        } else {
          _this.layer.msg('导入了相同的评估结果')
        }
        _this.layForm.render()
      }
    },
    re_write_loop_obj (order = 'none', importItems = undefined) {
      let _this = this
      let _a = _this.assLoopList
      if (typeof parseInt(order) === 'number' && order % 1 === 0 && order > _a.length) return

      if (_this.is_legal(_a) && _a.length <= 0 && $('#loop_container ul').length <= 0) return
      let ulList = $('#loop_container ul')
      let maxLoop = (ulList.length > _a.length) ? _a.length : ulList.length
      if (order === 'none') {
        for (let i = 0; i < maxLoop; i++) {
          $(ulList[i]).attr(
            {
              'data_up_type': 'put',
              'ass_info_id': _a[i].ass_info_id,
              'ass_times': _a[i].ass_times,
              'modi_field': '@@'
            }
          )
          if (_a[i].ass_times == _this.assTimes)$(ulList[i]).addClass('put_is_modi')
          _this.re_write(i, '.loop_list_' + i, _this.assResLoopList)
          if ($(ulList[i]).find('.label-score').length > 0) $(ulList[i]).find('.label-score').trigger('click')
        }
      } else if (typeof parseInt(order) === 'number' && order % 1 === 0) {
        let i = order
        /*
        if($(ulList[i]).attr('data_up_type') && $(ulList[i]).attr('data_up_type')=='put'){
          $(ulList[i]).addClass('put_is_modi').removeClass('post_is_modi');

          $(ulList[i]).attr('modi_flag','true');
        }else{
          $(ulList[i]).addClass('post_is_modi').removeClass('put_is_modi');
          $(ulList[i]).attr('modi_flag','true');
          $(ulList[i]).attr('data_up_type','post');
        }
*/
        // $(ulList[i]).attr({'data_up_type':'put','ass_info_id':_a[i].ass_info_id,'ass_times':_a[i].ass_times,'modi_field':'@@'});
        // $(ulList[i]).addClass('put_is_modi')
        // $(ulList[i]).attr('modi_flag','true')
        _this.imoprt_re_write(i, '.loop_list_' + i, _this.assResLoopList, importItems)
        // if($(ulList[i]).find('.label-score').length>0) $(ulList[i]).find('.label-score').trigger('click')
      } else {
        console.log(typeof parseInt(order) === 'number', order % 1 === 0, order * 1 < ulList.length)
      }
    },
    re_write_opt_remark (_dom, _o) {
      let remarkDom = $(_dom).find('.ass-remark-div[res_opt="' + _o.opt_id + '"]')
      $(remarkDom).find('label.disLabel').removeClass('disLabel')
      let remarkObj = $(remarkDom).find('[rely_opt_flag="' + _o.opt_id + '"]')
      if (remarkObj.length > 0) {
        for (let i = 0; i < remarkObj.length; i++) {
          let ro = remarkObj[i]
          $(ro).prop('disabled', false).val(_o.remark[$(ro).attr('id')]).attr('data-load', _o.remark[$(ro).attr('id')])
        }
      }
    },
    get_remark_res (_remark, _dom) {
      let remarkRes = {}
      for (let i = 0; i < _remark.length; i++) {
        let obj = _remark[i]
        remarkRes[obj.remark_id] = $(_dom).find('#' + obj.remark_id).val()
      }
      return remarkRes
    },
    get_sub_opt_res (_subOpt, _dom) {
      let subOptRes = []
      for (let i = 0; i < _subOpt.length; i++) {
        let optObj = _subOpt[i]
        let optRes
        if ($(_dom).find('#' + optObj.opt_id + ':checked').length) {
          optRes = {
            opt_id: optObj.opt_id,
            opt_res: optObj.opt_val
          }

          if (optObj.remark !== undefined && optObj.remark.length > 0) {
            optRes.remark = this.get_remark_res(optObj.remark, $(_dom).find('div.ass-remark-div[res_opt="' + optObj.opt_id + '"]'))
          }
          subOptRes.push(optRes)
        }
        // subOptRes[obj.remark_id]=$(_dom).find('#'+obj.opt_id).val();
      }
      return subOptRes
    },
    res_checkout () {
      let _this = this
      let flag = true
      let info = ''
      let ulIndex = 0
      let ulArr = $('#loop_container ul[modi_flag="true"]')

      if (_this.stopSave) {
        return
      } else {
        _this.stopSave = true
      }

      setTimeout(() => { _this.stopSave = false }, 2000)

      if (ulArr && ulArr.length > 0) {
        saveData(ulArr[ulIndex])
        function saveData (obj) {
          // console.log('saveData:'+ulIndex)
          let ass_info_id = $(obj).attr('ass_info_id')
          let ass_times = $(obj).attr('ass_times')
          let patient_id = _this.patientId
          let ass_id = _this.assId
          let res = []
          let opType = $(obj).attr('data_up_type')
          let urlPara = (opType == 'put' ? 'update' : 'add')

          if ($(obj).find('.label-score').length > 0) $(obj).find('.label-score').trigger('click')
          res = _this.get_res('.' + $(obj).attr('class').replace(/\s+/g, '.'), _this.assResLoopList)

          res.push(_this.format_res_base_obj('patient_id', patient_id))
          res.push(_this.format_res_base_obj('ass_id', ass_id))
          if (opType == 'put') {
            res.push(_this.format_res_base_obj('ass_info_id', ass_info_id))
            res.push(_this.format_res_base_obj('ass_times', ass_times))
          }

          let para = {
            isLoop: _this.isLoop,
            data: res
          }
          // 标识当前为循环记录的第几条
          let ulFlag = (1 * $(obj).attr('ulflag')) + 1
          AxiosJsonApi('/nams/web-na/ass-info/' + urlPara, para, opType, {}).then(res => {
            let rs = res
            if (rs.desc == '操作成功') {
              info += "<i class='layui-icon layui-icon-ok'></i> 第" + ulFlag + '条记录数据' + (opType == 'put' ? '修改' : '添加') + '成功<br />'
            } else {
              info += "<i class='layui-icon layui-icon-close'></i> <strong style='color:#FF6666'>第" + ulFlag + '条记录数据' + (opType == 'put' ? '修改' : '添加') + '失败</strong><br />'
              flag = false
            }
            res = []
            ulIndex++;
            (ulIndex < ulArr.length) ? saveData(ulArr[ulIndex]) : saveMain()
          })
        }
      } else {
        if ($('.label-score').length > 0) $('.label-score').trigger('click')
        saveMain()
      }
      function saveMain () {
        let _arr = _this.get_res('', _this.assResList)
        _arr.push({
          item_id: 'patient_id',
          res: _this.patientId
        })
        _arr.push({
          item_id: 'ass_id',
          res: _this.assId
        })
        let para = {
          isLoop: 0,
          data: _arr
        }
        if (_this.resStatus != '15010') {
          _arr.push({
            item_id: 'ass_info_id',
            res: _this.ass_info_id
          })

          AxiosJsonApi('/nams/web-na/ass-info/update', para, 'put', {}).then(res => {
            let rs = res
            if (rs.desc == '操作成功') {
              info += "<i class='layui-icon layui-icon-ok'></i> 基本数据修改成功<br />"
            } else {
              info += "<i class='layui-icon layui-icon-close'></i> <strong style='color:#FF6666'>基本数据修改失败</strong><br />"
              flag = false
            }
            if (flag === false) info += "<strong style='color:red'>数据或程序运行异常请联系管理员</strong>"
            _this.layer.alert(info, {
              closeBtn: 0
            }, function () {
              (_this.assId == '10001') ? _this.layer.closeAll() : parent.layer.closeAll()
            })
            _this.stopSave = false
          })
        } else {
          AxiosJsonApi('/nams/web-na/ass-info/add', para, 'POST', {}).then(res => {
            let rs = res
            if (rs.desc == '操作成功') {
              info += "<i class='layui-icon layui-icon-ok'></i> 基本数据添加成功<br />"// layui-icon-close
            } else {
              info += "<i class='layui-icon layui-icon-close'></i> <strong style='color:#FF6666'>基本数据添加失败</strong><br />"
              flag = false
            }
            if (flag === false) info += "<i class='layui-icon layui-icon-tips'></i><strong style='color:#FF6666'>数据或程序运行异常请联系管理员</strong>"
            _this.layer.alert(info, {
              closeBtn: 0
            }, function () {
              (_this.assId == '10001') ? _this.layer.closeAll() : parent.layer.closeAll()
            })
            _this.stopSave = false
          })
        }
      }
    },
    res_checkoutMark () {
      let _this = this
      let flag = true
      let info = ''
      let ulIndex = 1
      if (this.isLoop == 1) {
        let list = this.assLoopList
        let ulArr = $('#loop_container ul[modi_flag="true"]')
        if (ulArr.length > 0) {
          for (let i = 0; i < ulArr.length; i++) {
            let obj = ulArr[i]
            let ass_info_id = $(obj).attr('ass_info_id')
            let ass_times = $(obj).attr('ass_times')
            let patient_id = this.patientId
            let ass_id = this.assId
            let res = []
            let opType = $(obj).attr('data_up_type')
            let urlPara = (opType == 'put' ? 'update' : 'add')

            if ($(obj).find('.label-score').length > 0) $(obj).find('.label-score').trigger('click')

            res = this.get_res('.' + $(obj).attr('class').replace(/\s+/g, '.'), this.assResLoopList)

            res.push(this.format_res_base_obj('patient_id', patient_id))
            res.push(this.format_res_base_obj('ass_id', ass_id))
            if (opType == 'put') {
              res.push(this.format_res_base_obj('ass_info_id', ass_info_id))
              res.push(this.format_res_base_obj('ass_times', ass_times))
            }

            let para = {
              isLoop: this.isLoop,
              data: res
            }
            AxiosJsonApi('/nams/web-na/ass-info/' + urlPara, para, opType, {}).then(res => {
              let rs = res
              if (rs.desc == '操作成功') {
                info += '第' + ulIndex + '条记录数据' + (opType == 'put' ? '修改' : '添加') + '成功<br />'
                ulIndex++
              } else {
                info += '第' + ulIndex + '条记录数据' + (opType == 'put' ? '修改' : '添加') + '失败<br />'
                flag = false
                ulIndex++
              }
            })
            res = []
          }
        }
      }
      let _arr = this.get_res('', this.assResList)
      _arr.push({
        item_id: 'patient_id',
        res: _this.patientId
      })
      _arr.push({
        item_id: 'ass_id',
        res: this.assId
      })
      let para = {
        isLoop: 0,
        data: _arr
      }

      if (_this.resStatus != '15010') {
        _arr.push({
          item_id: 'ass_info_id',
          res: _this.ass_info_id
        })

        AxiosJsonApi('/nams/web-na/ass-info/update', para, 'put', {}).then(res => {
          let rs = res
          if (rs.desc == '操作成功') {
            info += '基本数据修改成功<br />'
          } else {
            info += '基本数据修改失败<br />'
            flag = false
          }
        })
      } else {
        AxiosJsonApi('/nams/web-na/ass-info/add', para, 'POST', {}).then(res => {
          let rs = res
          if (rs.desc == '操作成功') {
            info += '基本数据添加成功<br />'
          } else {
            info += '基本数据添加失败<br />'
            flag = false
          }
        })
      }
      if (flag === false) info += "<strong style='color:red'>数据或程序运行异常请联系管理员</strong>"
      _this.layer.alert(info)
      // this.save_ass_answer(rs);
    },
    get_res (_c, _rs) {
      /*
    *   _c: CONTAINER，容器识别
    *   _rs:res变量，待提交的结果集
    * */
      if (_rs == undefined) return
      let baseContainer = '.mobanHtml ' + _c
      let rs = [..._rs]
      for (let obj of rs) {
        if (obj.item_input_type === 'text_out') {
          obj.res = $(baseContainer + ' #' + obj.item_id).text()
        } else if (obj.item_input_type == 'input' || obj.item_input_type == 'total_score') {
          let dom = $(baseContainer + ' #' + obj.item_id)
          if ($(dom).attr('extend_info') && $(dom).attr('extend_info') == 'is_layer') {
            obj.res = ($(dom).val() + '@@' + $(dom).attr('item_score'))
          } else {
            obj.res = $(baseContainer + ' #' + obj.item_id).val()
          }
        } else if (obj.item_input_type == 'textarea' || obj.item_input_type == 'date' || obj.item_input_type == 'select' || obj.item_input_type == 'time' || obj.item_input_type == 'datetime') {
          obj.res = $(baseContainer + ' #' + obj.item_id).val()
        } else if (obj.item_input_type == 'radio' || obj.item_input_type == 'checkbox') {
          let options = JSON.parse(obj.options)
          let optDom = $(baseContainer + ' div[data-tag="' + obj.item_id + '"]')
          let optResArr = []
          for (let i = 0; i < options.length; i++) {
            let optObj = options[i]
            if ($(optDom).find('input#' + optObj.opt_id + ':checked').length > 0) {
              let optRes = {
                opt_id: optObj.opt_id,
                opt_res: optObj.opt_val
              }

              if (optObj.remark !== undefined && optObj.remark.length > 0) {
                optRes.remark = this.get_remark_res(optObj.remark, $(optDom).find('div.ass-remark-div[res_opt="' + optObj.opt_id + '"]'))
              }

              if (optObj.sub_opt.sub_opt_list !== undefined && optObj.sub_opt.sub_opt_list.length > 0) {
                optRes.sub_opt = this.get_sub_opt_res(optObj.sub_opt.sub_opt_list, $(optDom).find('div.ass_sub_opt-div[res_opt="' + optObj.opt_id + '"]'))
              }
              optResArr.push(optRes)
            }
          }
          obj.res = JSON.stringify(optResArr)
        } else if (obj.item_input_type == 'SESSION_USER' || obj.item_input_type == 'SESSION_DEPT') {
          obj.res = $(baseContainer + ' #' + obj.item_id).val()
          // obj.res=($(baseContainer + ' #'+obj.item_id).attr('para_id')==undefined?'待测试':$(baseContainer + ' #'+obj.item_id).attr('para_id'))
        }
      }
      return rs
    },
    format_res_base_obj (_id, _res) {
      if (_id == '') return undefined
      return {
        item_id: _id,
        res: _res
      }
    }
  }
}
