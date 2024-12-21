<template>
  <div>
    <el-form ref="add_form" :inline="true" :model="add_form" label-suffix=":">
      <el-form-item
        prop="layoutName"
        label="布局名称"
        :rules="[
          { required: true, message: '请填写布局名称'}
        ]"
      >
        <el-input v-model="add_form.layoutName" placeholder="请输入" autocomplete="off" maxlength="10" />
      </el-form-item>
      <el-form-item label="备注" class="markClass">
        <el-input v-model="add_form.remark" placeholder="请输入" autocomplete="off" maxlength="20" />
      </el-form-item>
    </el-form>
    <div class="box_container">
      <!-- ************************************* 统计信息 ************************************* -->
      <div class="unit unit_w_550 unit_h_330">
        <div class="unit_title">
          <el-select
            v-model="dataJson.position_1"
            class="blueInput"
            value-key="classId"
            placeholder="请选择"
            @change="setCheckedPostion($event,'position_1')"
          >
            <el-option
              v-for="(item, index) in labelTypeSelect"
              :key="index"
              :disabled="item.checked && item.position !== 'position_1'"
              :label="item.className"
              :value="item"
            />
          </el-select>
        </div>
      </div>

      <!-- ************************************* 病区概况（触屏版） ************************************* -->
      <div class="unit unit_w_550  unit_h_330">
        <div class="unit_title">
          <el-select
            v-model="dataJson.position_2"
            class="blueInput"
            value-key="classId"
            placeholder="请选择"
            @change="setCheckedPostion($event,'position_2')"
          >
            <el-option
              v-for="(item, index) in labelTypeSelect"
              :key="index"
              :disabled="item.checked && item.position !== 'position_2'"
              :label="item.className"
              :value="item"
            />
          </el-select>
        </div>
      </div>

      <!-- ************************************* 调床信息 ************************************* -->
      <div class="unit unit_w_550 unit_h_330">
        <div class="unit_title">
          <el-select
            v-model="dataJson.position_3"
            class="blueInput"
            value-key="classId"
            placeholder="请选择"
            @change="setCheckedPostion($event,'position_3')"
          >
            <el-option
              v-for="(item, index) in labelTypeSelect"
              :key="index"
              :disabled="item.checked && item.position !== 'position_3'"
              :label="item.className"
              :value="item"
            />
          </el-select>
        </div>
      </div>

      <!-- ************************************* 呼叫信息 ************************************* -->
      <div class="unit unit_w_550 unit_h_330">
        <div class="unit_title">
          <el-select
            v-model="dataJson.position_4"
            class="blueInput"
            value-key="classId"
            placeholder="请选择"
            @change="setCheckedPostion($event,'position_4')"
          >
            <el-option
              v-for="(item, index) in labelTypeSelect"
              :key="index"
              :disabled="item.checked && item.position !== 'position_4'"
              :label="item.className"
              :value="item"
            />
          </el-select>
        </div>
      </div>

      <!-- ************************************* 护理信息 ************************************* -->
      <div class="unit unit_w_550 unit_h_330">
        <div class="unit_title">
          <el-select
            v-model="dataJson.position_5"
            class="blueInput"
            value-key="classId"
            placeholder="请选择"
            @change="setCheckedPostion($event,'position_5')"
          >
            <el-option
              v-for="(item, index) in labelTypeSelect"
              :key="index"
              :disabled="item.checked && item.position !== 'position_5'"
              :label="item.className"
              :value="item"
            />
          </el-select>
        </div>
      </div>

      <!-- ************************************* 高危管理 ************************************* -->
      <div class="unit unit_w_550  unit_h_330">
        <div class="unit_title">
          <el-select
            v-model="dataJson.position_6"
            class="blueInput"
            value-key="classId"
            placeholder="请选择"
            @change="setCheckedPostion($event,'position_6')"
          >
            <el-option
              v-for="(item, index) in labelTypeSelect"
              :key="index"
              :disabled="item.checked && item.position !== 'position_6'"
              :label="item.className"
              :value="item"
            />
          </el-select>
        </div>
      </div>

      <!-- ************************************* 患者提醒 ************************************* -->
      <div class="unit unit_w_550  unit_h_330">
        <div class="unit_title">
          <el-select
            v-model="dataJson.position_7"
            class="blueInput"
            value-key="classId"
            placeholder="请选择"
            @change="setCheckedPostion($event,'position_7')"
          >
            <el-option
              v-for="(item, index) in labelTypeSelect"
              :key="index"
              :disabled="item.checked && item.position !== 'position_7'"
              :label="item.className"
              :value="item"
            />
          </el-select>
        </div>
      </div>

      <!-- ************************************* 常用联系方式  ************************************* -->
      <div class="unit unit_w_550 unit_h_330">
        <div class="unit_title">常用联系方式</div>
        <div class="unit_detail unit_detail_notice">
          <div class="notice">
            <div class="notice_title">
              <div class="title_list">
                <div class="title_info">
                  <span :class="noticeTab=='notice_1'?'is_check':''">公告栏</span>
                </div>
                <div class="title_info">
                  <span :class="noticeTab=='notice_2'?'is_check':''">手写板</span>
                </div>
              </div>
            </div>
            <div v-show="noticeTab=='notice_1'" class="notice_container">
              <div class="info_list" />
            </div>
            <div v-show="noticeTab=='notice_2'" class="notice_container notice_block" />
          </div>
        </div>
      </div>
    </div>

    <div class="btns">
      <el-button @click="backBefore('back')" v-uni="'yemianshezhi_layout_edit_cancel'">取消</el-button>
      <el-button type="primary" @click="saveLayout()" v-uni="'yemianshezhi_layout_edit_save'">确认</el-button>
    </div>

  </div>
</template>
<script>
import { LayoutApi, ApiClassifyManage } from '../../../../api/bnms/index'

export default {
  name: 'FirstLayoutConfig',
  components: {

  },
  mixins: [],
  props: {
    curRow: {
      type: Object,
      default: function () {
        return {}
      }
    },
    modLayout: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      labelTypeSelect: [],
      otherType: [
        {
          classId: 'tcxx_12315',
          className: '调床信息',
          labelType: 'changeBed'
        },
        {
          classId: 'hjxx_12315',
          className: '呼叫信息',
          labelType: 'calling'
        },
        {
          classId: 'hztx_12315',
          className: '患者提醒',
          labelType: 'warning'
        }
      ],
      search_from: {
        labelType: '201'
      },
      actionType: '',
      dataJson: {
        position_1: {},
        position_2: {},
        position_3: {},
        position_4: {},
        position_5: {},
        position_6: {},
        position_7: {}
      },
      add_form: {
        layoutName: '',
        layoutStr: '',
        remark: ''
      },
      noticeTab: 'notice_1' // 公告、手写板TAB
    }
  },
  watch: {

  },
  created () {
    // 查询护理标签分类
    this.getLabelType()
    if (Object.keys(this.modLayout).length !== 0) {
      this.dataJson = JSON.parse(this.modLayout.layoutStr)
      this.add_form.layoutName = this.modLayout.layoutName
      this.add_form.remark = this.modLayout.remark
      this.add_form.id = this.modLayout.id
      this.actionType = 'mod'
    } else {
      this.actionType = ''
    }
  },
  mounted () {

  },
  destroyed () {

  },
  methods: {
    initChoseState () {
      for (const item of this.labelTypeSelect) {
        for (const one in this.dataJson) {
          if (item.className === this.dataJson[one].className) {
            item.checked = true
            item.position = this.dataJson[one].position
          }
        }
      }
    },
    setCheckedPostion (val, position) {
      if (val.labelType !== 'noneChose') {
        for (const item of this.labelTypeSelect) {
          if (item.position === position) {
            item.checked = false
            item.position = ''
          }
        }

        val.checked = true
        val.position = position
      } else {
        for (const item of this.labelTypeSelect) {
          if (item.position === position) {
            item.checked = false
            item.position = ''
          }
        }
      }
    },
    getLabelType () {
      this.labelTypeSelect = []
      ApiClassifyManage.select(this.search_from).then(res => {
        this.labelTypeSelect = res.data || []
        this.labelTypeSelect = this.labelTypeSelect.concat(this.otherType)
        this.labelTypeSelect.unshift({ classId: 'qxz_12315', className: '请选择', labelType: 'noneChose' })
        for (const item of this.labelTypeSelect) {
          this.$set(item, 'checked', false)
          this.$set(item, 'position', '')
        }
        this.initChoseState()
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    saveLayout () {
      this.$refs.add_form.validate((valid) => {
        if (valid) {
          this.add_form.pageId = this.curRow.pageId

          // 校验模块是否选择
          let _flag = false
          for (const item in this.dataJson) {
            if (Object.keys(this.dataJson[item]).length === 0 || (this.dataJson[item] && this.dataJson[item].labelType === 'noneChose')) {
              _flag = true
            }
          }

          if (_flag) {
            this.$message.warning('请选择模块显示数据！')
            return false
          }

          this.add_form.layoutStr = JSON.stringify(this.dataJson)
          if (this.actionType) {
            LayoutApi.updateLayout(this.add_form).then((res) => {
              if (res.status === 200) {
                this.$message.success(res.desc)
                this.$refs.add_form.resetFields()
                this.backBefore()
              } else {
                this.$message.warning(res.desc)
              }
            }).catch((res) => {
              this.$message.warning(res.desc)
            })
          } else {
            LayoutApi.saveLayout(this.add_form).then((res) => {
              if (res.status === 200) {
                this.$message.success(res.desc)
                this.$refs.add_form.resetFields()
                this.backBefore()
              } else {
                this.$message.warning(res.desc)
              }
            }).catch((res) => {
              this.$message.warning(res.desc)
            })
          }
        }
      })
    },
    backBefore (type) {
      this.$emit('closeDialog', type)
    }
  }
}
</script>

<style lang="scss" scoped>
  .unit {
    background: #FFFFFF;
    margin: 3px 4px;
    padding-top: 50px;
    box-sizing: border-box;
    position: relative;
    float: left; /*消除间隔*/
    border-radius: 2px;
  }

  .unit_title {
    width: 100%;
    color: #FFFFFF;
    text-align: center;
    line-height: 40px;
    background: #1e87f0;
    position: absolute;
    top: 0;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
  }

  .unit .unit_detail .info_list {
    line-height: 58px;
    margin: 15px 25px 0 25px;
    padding: 0;
  }

  .unit .unit_detail div.notice {
    margin: 0;
    background: #FFFEE0;
    width: 100%;
    position: relative;
    height: 60px;

    div.notice_title {
      background: #e0e0e0;
      padding-top: 7px;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;

      div.title_list {
        div.title_info {
          float: left;
          width: 50%;
          border: 0;
          height: 34px;
          color: #1e87f0;
          background: #F7FBFF;
          line-height: 34px;
          text-align: center;
          font-weight: 500;
          position: relative;

          span {
            display: inline-block;
            z-index: 99;
            width: 100%;
          }

          span.is_check {
            background: #1e87f0;
            height: 34px;
            box-shadow: 0px 0px 11px 3px rgba(0, 120, 183, 0.3);
            border-radius: 6px;
            color: #fff;
            font-size: 12px;
            margin: 0px -1px;
            position: absolute;
            line-height: 34px;
            top: 0;
            left: 0;
            z-index: 100;
          }
        }
      }
    }

    div.notice_container {
      display: flex;
      height: 100%;
      background: #FFFEE0;

      .info_list {
        margin: 18px 0;
        line-height: 34px;
        width: 100%;
      }
    }

    div.notice_block {
      background: #ECF5FF;
      width: 100%;
      display: block;
      padding-top: 10px;
    }
  }

  .unit_w_550 {
    width: 23.8%;
  }

  .unit_h_330 {
    height: 136px;
  }

  .unit_detail_notice {
    margin-top: 26px;
  }

  .blueInput {
    /deep/.el-input__inner {
      background: #1e87f0;
      color: white;
      border: none;
      text-align: center;
    }

    & ::placeholder {
      color: white;
    }
  }

  /deep/.el-input__suffix {
    .el-input__suffix-inner {
      .el-icon-circle-close:hover {
        color:white !important;
      }
    }
  }
  /deep/.is-reverse {
    color: white !important;
  }

  .btns {
    margin-top: 25px;
    display: inline-block;
    text-align: right;
    width: 100%;
  }

  .markClass {
    margin-left: 10px;
  }

  .box_container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    align-content: center;
    background: #F4F4F5;
    padding: 9px 4px 9px 9px;
    border-radius: 2px;
  }
</style>
