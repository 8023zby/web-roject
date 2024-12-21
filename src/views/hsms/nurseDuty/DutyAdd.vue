<template>
  <layout v-loading="loading">
    <div slot="title">{{title}}班次库</div>
    <div slot="main" class="add-from">
      <el-form  :model="addFormData" :rules="rules" ref="addForm" label-suffix=":" class="form-main-center" label-width="130px">
        <el-form-item label="班次类型" prop="shiftType" ref="shiftType">
          <el-select
            v-model="addFormData.shiftType"
            placeholder="请选择">
            <el-option
              v-for="(item, index) in shiftTypes"
              :key="index"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="班次名称" prop="repoShiftName" ref="repoShiftName">
          <el-input
            v-model.trim="addFormData.repoShiftName"
            autocomplete="off"
            maxlength="20"
            clearable
            placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="到岗时间" prop="arrivalTime">
          <el-time-picker
            v-model="addFormData.arrivalTime"
            format="HH:mm"
            value-format="HH:mm"
            placeholder="请选择">
          </el-time-picker>
        </el-form-item>

        <el-form-item
          v-for="(item, index) in addFormData.shiftTime"
          :label="'起止时间'"
          :key="index"
        >
          <el-form-item :prop="'shiftTime.'+ index +'.beginTime'" style="float:left">
            <el-time-picker
              v-model="item.beginTime"
              type="date"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="开始时间">
            </el-time-picker>
          </el-form-item>
          &nbsp;<div style="color: #666666; display: inline-block; padding: 0 10px; float: left">至</div>&nbsp;
          <el-form-item :prop="'shiftTime.'+ index +'.endTime'" style="float: left">
            <el-time-picker
              v-model="item.endTime"
              type="date"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="结束时间">
            </el-time-picker>
          </el-form-item>
          <div style="float: left;">
            <i v-uni:[index]="'tianjiabanciku_addTime'" :key="'tianjiabanciku_addTime' + index" @click.prevent="addShiftTime()" class="el-icon-circle-plus-outline iconAddCls"/>
            <i v-uni:[index]="'tianjiabanciku_delTime'" :key="'tianjiabanciku_delTime' + index" v-if="index!==0" @click.prevent="removeShiftTime(index)"
               class="el-icon-remove-outline iconDelCls"/>
          </div>
        </el-form-item>
        <el-form-item label="工时" prop="workHours">
          <el-input
            v-model="addFormData.workHours"
            clearable
            style=" width: 254px"
            placeholder="请输入"/>
          &nbsp;&nbsp;小时
        </el-form-item>
        <el-form-item label="班次颜色" prop="backgroundColor">
          <el-input  v-model="addFormData.backgroundColor" style="float: left; width: 254px"></el-input>
          <el-color-picker v-model="addFormData.backgroundColor"  style="float: left; margin-left: 15px"/>
        </el-form-item>
        <el-form-item label="字体颜色" prop="foregroundColor">
          <el-input  v-model="addFormData.foregroundColor" style="float: left; width: 254px"></el-input>
          <el-color-picker v-model="addFormData.foregroundColor" style="float: left; margin-left: 15px"/>
        </el-form-item>
        <el-form-item label="图标设置" prop="foregroundColor">
          <el-input v-model="addFormData.shiftImgName" clearable style="float: left"></el-input>
          <el-button v-uni="'tianjiabanciku_upload'" type="primary" @click="icons_visible = true" style="float: left; margin-left: 10px; ">
            上传
          </el-button>
          <div v-if="addFormData.shiftImg" style="margin-left: 10px; width:28px; height: 28px; text-align: center; color: #1e87f0; line-height: 28px; border: 1px solid #EBEEF5; border-radius: 2px; float: left">
            <i style="" class="iconfont-hsms" :class="iconContrast[addFormData.shiftImg]['id']"></i>
          </div>
        </el-form-item>
        <el-form-item label="加扣班设置" prop="isExtra">
          <el-checkbox v-model="addFormData.isExtra" @change="resetSetting">开启加扣班</el-checkbox>
        </el-form-item>
        <el-form-item class="setting" v-if="addFormData.isExtra">
          <el-form-item label="类型" label-width="90px" prop="extraType">
            <el-radio-group v-model="addFormData.extraType" @change="resetSetting">
              <el-radio :label="1">加班设置</el-radio>
              <el-radio :label="2">扣班设置</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="(addFormData.extraType === 1 ? '加班' : '扣班') + '时长'" label-width="90px" prop="extraTime">
            <el-input
              style="width: 185px"
              @input="onInput"
              v-model="addFormData.extraTime"
              autocomplete="off"
              clearable
              placeholder="请输入"/>
            小时
          </el-form-item>
          <el-form-item class="self-form-item" label-width="90px" >
            <el-form-item style="float: left">
              <el-checkbox v-model="addFormData.status1">
                {{addFormData.extraType === 1 ? '增加' : '扣除'}}存假
              </el-checkbox>
            </el-form-item>
            <el-form-item style="float: left" prop="vacationTime">
              <el-input
                style="width: 90px"
                :disabled="!addFormData.status1"
                v-model="addFormData.vacationTime"
                autocomplete="off"
                clearable
                placeholder="请输入"/>
              小时
            </el-form-item>
          </el-form-item>
          <el-form-item class="self-form-item" label-width="90px" v-if="addFormData.extraType === 2">
            <el-form-item style="float: left">
              <el-checkbox v-model="addFormData.status2">
                扣除年假
              </el-checkbox>
            </el-form-item>
            <el-form-item style="float: left" prop="annualTime">
              <el-input
                style="width: 90px"
                v-model="addFormData.annualTime"
                autocomplete="off"
                clearable
                :disabled="!addFormData.status2"
                placeholder="请输入"/>
              小时
            </el-form-item>
          </el-form-item>
        </el-form-item>
        <el-form-item label="班次说明" prop="shiftDescribe">
          <el-input
            v-model="addFormData.shiftDescribe"
            rows="7"
            autocomplete="off"
            type="textarea"
            placeholder="请输入"
            show-word-limit
            maxlength="200"/>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer_btn">
      <el-button v-uni="'tianjiabanciku_calcel'" @click="$emit('changed', 'list')">取消</el-button>
      <el-button v-uni="'tianjiabanciku_save'" type="primary" @click="saveData">保存</el-button>
    </div>
    <!--图片库-->
    <el-dialog
      class="icons-change"
      title="选择图标"
      :visible="icons_visible"
      :close-on-click-modal="false"
      :show-close="false"
      width="490px">
      <div>
        <div v-for="(icon, key) in iconContrast"
             :key="icon.id" class="icon-item">
          <input
            type="radio"
            :id="'img_radio' + icon.id"
            :value="key"
            name="imgDepository"
            v-model="selectedIconKey">
          <el-tooltip
            effect="dark"
            :content="icon.name"
            placement="bottom">
            <label :for="'img_radio' + icon.id">
              <i class="iconfont-hsms" :class="icon.id"></i>
            </label>
          </el-tooltip>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-uni="'tianjiabanciku_upload_calcel'" @click="icons_visible = false">取消</el-button>
        <el-button v-uni="'tianjiabanciku_upload_save'" type="primary" @click="onChangedIcon">确认</el-button>
      </div>
    </el-dialog>
  </layout>
</template>

<script>
import moment from 'moment'
import { ApiNurseDuty, ApiNurseShift } from '../../../api/hsms/api'
import layout from '../../../components/hsms/layout/edit'
import iconContrast from './iconContrast'

export default {
  name: 'NurseDutyAdd',
  props: ['detail'],
  components: { layout },
  data () {
    return {
      loading: false,
      icons_visible: false,
      selectedIconKey: '',
      iconContrast,
      shiftTypes: [],
      icons: [],
      addFormData: {
        repoShiftName: '',
        backgroundColor: '#FFFFFF',
        arrivalTime: '',
        shiftType: '',
        shiftDescribe: '',
        workHours: '',
        foregroundColor: '#606266',
        shiftTime: [{
          beginTime: '',
          endTime: ''
        }],
        shiftImg: '',
        shiftImgName: '',
        isExtra: false,
        extraType: 1,
        extraTime: null,
        vacationTime: null,
        annualTime: null,
        // 两个状态仅仅页面用
        status1: true,
        status2: true
      },
      rules: {
        repoShiftName: [
          { required: true, message: '请填写班次名称！' },
          { message: '班次名称长度不超过20个字符！', trigger: 'blur', pattern: /^.{1,20}$/ }
        ],
        shiftType: [
          { required: true, message: '请选择班次类型！' }
        ],
        workHours: {
          validator: (rule, value, callback) => {
            if (value && !/^(\d+|\d+\.\d{1,2})$/.test(value)) {
              callback(new Error('请输入数字,小数支持2位!'))
            } else if (value && value > 24) {
              callback(new Error('工时必须为0-24范围内的数字！'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        },
        extraTime: [
          {
            validator: (rule, value, callback) => {
              if (!/^(\d+|\d+\.\d{1,2})$/.test(value)) {
                callback(new Error('请输入数字,小数支持2位!'))
              } else if (value && value > 100) {
                callback(new Error('最大支持100小时！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        vacationTime: [
          {
            validator: (rule, value, callback) => {
              if (value && !/^(\d+|\d+\.\d{1,2})$/.test(value)) {
                callback(new Error('请输入数字,小数支持2位!'))
              } else if (value && value > 100) {
                callback(new Error('最大支持100小时！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        annualTime: [
          {
            validator: (rule, value, callback) => {
              if (value && !/^(\d+|\d+\.\d{1,2})$/.test(value)) {
                callback(new Error('请输入数字,小数支持2位!'))
              } else if (value && value > 100) {
                callback(new Error('最大支持100小时！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        shiftDescribe: [
          // {message: '班次说明长度不超过200个字符！', trigger: 'blur', pattern: /^.{0,200}$/}
        ]
      },
      // 首次进入编辑页面
      isFirstEnterEdit: false
    }
  },
  computed: {
    title: function () {
      return this.detail && this.detail['repoShiftId'] ? '编辑' : '添加'
    }
  },
  // 初始化数据
  created () {
    if (this.detail && this.detail.repoShiftId) {
      let d = JSON.parse(JSON.stringify(this.detail))
      // 复制的班次置空id
      if (d.repoShiftId === 'clone') {
        d.repoShiftId = ''
      }
      if (d.shiftTime) {
        d.shiftTime = JSON.parse(d.shiftTime)
      } else {
        delete d.shiftTime
      }
      if (!d.vacationTime) {
        this.addFormData.status1 = false
      }
      if (!d.annualTime) {
        this.addFormData.status2 = false
      }

      this.isFirstEnterEdit = true
      Object.assign(this.addFormData, d)
    }
    this.getDutyType()
  },
  methods: {
    onChangedIcon () {
      this.icons_visible = false
      this.addFormData.shiftImg = this.selectedIconKey
      this.addFormData.shiftImgName = this.iconContrast[this.selectedIconKey]['name']
    },
    resetSetting (val) {
      this.addFormData.extraTime = ''
      this.addFormData.vacationTime = ''
      this.addFormData.annualTime = ''
      // 加班设置
      if (val === 1) {
        this.addFormData.status1 = true
      } else {
        this.addFormData.status1 = true
        this.addFormData.status2 = true
      }
    },
    // 保存数据
    saveData () {
      this.$refs['addForm'].validate((valid, object) => {
        if (valid) {
          this.loading = true
          let formData = JSON.parse(JSON.stringify(this.addFormData))

          // 处理起止时间
          let newShiftTime = []
          for (let i = 0; i < formData.shiftTime.length; i++) {
            let s = formData.shiftTime[i]
            if (!s.beginTime && !s.endTime) continue
            s.sort = newShiftTime.length + 1
            newShiftTime.push(s)
          }
          formData.shiftTime = newShiftTime.length > 0 ? JSON.stringify(newShiftTime) : null

          ApiNurseDuty.save(formData)
            .then(() => {
              this.$message.success('保存成功！')
              this.$emit('changed')
            })
            .catch(res => {
              this.$message.error(res.message || '保存失败！')
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          let keys = Object.keys(object)
          if (this.$refs[keys[0]]) {
            this.$refs[keys[0]].$el.querySelector('input').focus()
          }
        }
      })
    },
    // 删除工作时间
    removeShiftTime (index) {
      this.addFormData.shiftTime.splice(index, 1)
    },
    // 添加工作时间
    addShiftTime () {
      if (this.addFormData.shiftTime.length < 5) {
        this.addFormData.shiftTime.push({
          beginTime: '',
          endTime: ''
        })
      } else {
        this.$message.warning('最多添加五个工作时间段！')
      }
    },
    onInput () {
      if (this.addFormData.status1) {
        this.addFormData.vacationTime = this.addFormData.extraTime
      }
      if (this.addFormData.status2 && this.addFormData.extraType === 2) {
        this.addFormData.annualTime = this.addFormData.extraTime
      }
    },
    // 获取班次类型
    getDutyType () {
      ApiNurseShift.types({ businessType: 'NURSE' })
        .then(res => {
          let data = res.data
          data.forEach((item) => {
            for (let p in item) {
              this.shiftTypes.push({
                id: p,
                name: item[p]
              })
            }
          })
        })
    }
  },
  watch: {
    'addFormData.shiftImgName' (val) {
      if (val === '') {
        this.addFormData.shiftImg = val
      }
    },
    'addFormData.shiftTime': {
      handler (val) {
        let time = 0
        // debugger
        for (let i = 0; i < val.length; i++) {
          const sTime = val[i].beginTime
          const eTime = val[i].endTime

          if (sTime && eTime) {
            let dsTime = ''
            let deTime = ''

            dsTime = moment().format('YYYY-MM-DD') + ' ' + sTime
            deTime = moment().format('YYYY-MM-DD') + ' ' + eTime

            const v = moment(deTime).diff(moment(dsTime))
            // 第二个时间比第一个小，第二个算明天的
            if (v <= 0) {
              deTime = moment().add(1, 'day').format('YYYY-MM-DD') + ' ' + eTime
            }

            time += moment(deTime).diff(moment(dsTime), 'minute')
          }
        }
        // 首次进入编辑页面不进行工时计算，以保证用户手动输入的工时
        if (!this.isFirstEnterEdit) this.addFormData.workHours = (Math.abs(time) / 60).toFixed(2)
        else {
          this.isFirstEnterEdit = false
        }
      },
      deep: true
    },
    'addFormData.status1' (val) {
      this.addFormData.vacationTime = val ? this.addFormData.extraTime : ''
    },
    'addFormData.status2' (val) {
      this.addFormData.annualTime = val ? this.addFormData.extraTime : ''
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../assets/hsms/css/self_common";
  @import "../../../../public/static/hsms/icons/iconfont.css";

  .iconAddCls {
    font-size: 24px;
    color: #409EFF;
    cursor: pointer;
    margin-left: 10px;
    vertical-align: middle;
  }

  .iconDelCls {
    font-size: 24px;
    color: #F56C6C;
    cursor: pointer;
    margin-left: 10px;
    vertical-align: middle;
  }

  .add-from {
    .setting {
      > /deep/ .el-form-item__content {
        display: inline-block;
        padding-right: 20px;
        border: 1px solid #EEF0F6;
      }
    }

    .self-form-item {
      margin-bottom: 0 !important;

      /deep/ .el-checkbox {
        margin-right: 10px !important;
      }

      /dee/ .el-input__inner {
        padding-right: inherit !important;
      }
    }
  }

  .icons-change {
    /deep/ .el-dialog__body {
      padding: 15px;
    }
    .icon-item, label {
      display: inline-block;
    }

    input {
      display: none;
    }

    label {
      margin: 13px;
      padding: 6px;
      border: 1px solid #efefef;
      text-align: center;
      cursor: pointer;
    }

    image {
      max-margin: 100%;
      height: auto;
    }

    input[type="radio"]:checked + label, label:hover {
      border: 1px solid #1E87F0;
      background-color: #1E87F0;
      color: #fff;
    }
  }
</style>
