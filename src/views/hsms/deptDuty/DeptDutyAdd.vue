<template>
    <!--护士排班-添加编辑-->
    <div class="typt-list-main">
        <div class="typt-tit-cls">
            <div class="typt-tit-logo"></div>
            <div class="typt-tit-content">{{titMsg}}班次</div>
        </div>
        <div class="typt-add-container">
            <div class="typt-add-form" style="padding-top: 40px;"
                 :class="{'width-85': businessType === 'NURSE', 'width-65': businessType !== 'NURSE'}">
                <el-form :model="addFormData"
                         :rules="rules"
                         ref="addForm"
                         label-width="130px">
                    <el-form-item label="班次名称:"
                                  prop="shiftName">
                        <el-input v-model="addFormData.shiftName"
                                  autocomplete="off"
                                  placeholder="请输入"
                                  maxlength="20"
                                  :clearable="true"
                                  style="width: 300px;"/>
                    </el-form-item>
                    <el-form-item label="班次类型:"
                                  prop="shiftType">
                        <el-select :popper-append-to-body="false"
                                   v-model="addFormData.shiftType"
                                   placeholder="请选择"
                                   style="width: 300px;">
                            <!--el-option label="请选择" value=""></el-option-->
                            <el-option v-for="(item, index) in dutyTypeData"
                                       :key="index"
                                       :label="item.name"
                                       :value="item.id"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="到岗时间:"
                                  prop="arrivalTime">
                        <el-time-picker
                                v-model="addFormData.arrivalTime"
                                format="HH:mm"
                                value-format="HH:mm"
                                placeholder="请选择"
                                style="width: 300px;"/>
                    </el-form-item>
                    <el-form-item
                            v-for="(item, index) in addFormData.spanList"
                            :label="'工作时间:'"
                            :key="item.key"
                            :prop="'spanList_' + index ">
                        <el-time-picker
                                style="width: 300px;"
                                class="smallInput"
                                v-model="item.beginDate"
                                type="date"
                                format="HH:mm"
                                value-format="HH:mm"
                                placeholder="开始时间">
                        </el-time-picker>
                            &nbsp;<span style="color: #666666;">至</span>&nbsp;
                        <el-time-picker
                                style="width: 300px;"
                                class="smallInput"
                                v-model="item.endDate"
                                type="date"
                                format="HH:mm"
                                value-format="HH:mm"
                                placeholder="结束时间">
                        </el-time-picker>
                        <i @click.prevent="addSpanList()"
                        v-uni:[index]="'ystianjiabanci_addTime'"
                        :key="'ystianjiabanci_addTime'+index"
                           class="el-icon-circle-plus-outline iconAddCls"/>
                        <i v-if="index!==0"
                           @click.prevent="removeSpanList(item)"
                           v-uni:[index]="'ystianjiabanci_delTime'"
                           :key="'ystianjiabanci_delTime'+index"
                           class="el-icon-remove-outline iconDelCls"/>
                    </el-form-item>
                    <el-form-item label="班次颜色:" prop="backgroundColor">
                      <div style="height: 34px;"><el-color-picker v-model="addFormData.backgroundColor"/></div>
                    </el-form-item>
                    <el-form-item label="字体颜色:" prop="foregroundColor">
                      <div style="height: 34px;"><el-color-picker v-model="addFormData.foregroundColor"/></div>
                    </el-form-item>
                    <el-form-item label="工时:" prop="workHours">
                        <!--el-input-number v-model="addFormData.workHours" :precision="1" :step="0.5" :max="24"></el-input-number-->
                        <el-input v-model="addFormData.workHours"
                                  :clearable="true"
                                  style="width: 300px;"
                                  placeholder="请输入"/>
                    </el-form-item>
                    <el-form-item v-if="isShow=='BED'&&businessType=='NURSE'" label="是否分床" prop="workHours">
                        <el-switch
                                v-model="bedOrRoomFlg"
                                active-color="#1e87f0"
                                inactive-color="#cccccc"/>
                    </el-form-item>
                    <el-form-item v-if="isShow=='ROOM'&&businessType=='NURSE'" label="是否分房:" prop="workHours">
                        <el-switch
                                v-model="bedOrRoomFlg"
                                active-color="#1e87f0"
                                inactive-color="#cccccc"/>
                    </el-form-item>
                    <el-form-item label="班次说明:" prop="shiftDescribe">
                        <el-input v-model="addFormData.shiftDescribe"
                                  rows="7"
                                  style="width: 300px;"
                                  type="textarea"
                                  placeholder="请输入"
                                  maxlength="200" show-word-limit/>
                    </el-form-item>
                    <el-form-item v-show="isShow=='BED'&&businessType=='NURSE'&&bedOrRoomFlg" label="床位列表:">
                        <bed-list :srcData="bedListData" @getBedOrRoomVal="setBedOrRoomVal"
                                  :checkData="addFormData.relationList"/>
                    </el-form-item>
                    <el-form-item v-show="isShow=='ROOM'&&businessType=='NURSE'&&bedOrRoomFlg" label="房间列表:">
                        <bed-list :srcData="roomListData" :checkData="addFormData.relationList"
                                  @getBedOrRoomVal="setBedOrRoomVal"/>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="typt-add-footer">
            <el-button @click="reloadUrl" v-uni="'ystianjiabanci_cancel'">取消</el-button>
            <el-button type="primary" @click="saveData" :loading="addVis" v-uni="'ystianjiabanci_save'">保存</el-button>
        </div>
    </div>
</template>

<script>
import { MsgShow } from '../../../assets/hsms/js/Message'
import BedList from '../../../components/hsms/BedList'
import BaseManage from '../../../assets/hsms/mixins/BaseManage'
import { GetRoom, GetBed, AxiosApi } from '../../../api/hsms'
import moment from 'moment'

export default {
  name: 'NurseDeptDutyAdd',
  components: {
    'bed-list': BedList
  },
  mixins: [BaseManage],
  props: ['modifyData', 'params'],
  data () {
    return {
      bedListData: [],
      dutyTypeData: [],
      isShow: 'BED',
      spanListNum: 1,
      bedOrRoomFlg: true,
      roomListData: [],
      actFlag: 'add',
      titMsg: '添加',
      businessType: 'NURSE',
      addFormData: {
        shiftName: '',
        backgroundColor: '#FFFFFF',
        arrivalTime: '',
        shiftType: '',
        shiftDescribe: '',
        relationList: [],
        workHours: '',
        shiftConfig: '',
        foregroundColor: '#606266',
        spanList: [{
          key: Date.now(),
          beginDate: '',
          endDate: ''
        }]
      },
      locationUrl: '/deptDuty',
      modelName: '班次',
      url: '/hsms/web-hs/shift',
      rules: {
        shiftName: [
          { required: true, message: '请填写班次名称！' }
          // { message: '班次名称长度不超过20个字符！', trigger: 'blur', pattern: /^.{1,20}$/ }
        ],
        shiftDescribe: [
          // { message: '班次说明长度不超过200个字符！', trigger: 'blur', pattern: /^.{0,200}$/ }
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
        shiftType: [
          { required: true, message: '请选择班次类型！' }
        ]
      }
    }
  },
  // 初始化数据
  created () {
    this.businessType = this.params.businessType
    this.getDutyType()
    let obj = this.modifyData
    let key = obj['shiftId'] || ''
    let modelType = this.params.modelType || 'BED'

    if (modelType === 'BED') {
      this.getBedList()
    } else {
      this.getRoomList()
    }
    this.isShow = modelType
    if (key) {
      this.actFlag = 'modify'
      this.titMsg = '编辑'
      // 对象的复制，不然会影响原来的值（假数据导致，要是请求后台应该不会有这问题）
      let temp = { ...obj }
      // 床位或者房间
      let relationList = temp.relationList
      if (relationList.length > 0) {
        // 是否分床等
        this.bedOrRoomFlg = true
      } else {
        // 是否分床等
        this.bedOrRoomFlg = false
      }
      // 工作时间转换
      let spanList = temp.spanList
      if (spanList === '' || spanList.length === 0) {
        temp.spanList = [{
          key: Date.now(),
          beginDate: '',
          endDate: ''
        }]
        // 是否分床等
        this.bedOrRoomFlg = false
      } else {
        let obj = []
        for (let i = 0; i < spanList.length; i++) {
          obj.push({
            key: Date.now() + i,
            beginDate: spanList[i].beginTime,
            endDate: spanList[i].endTime
          })
        }
        this.spanListNum = spanList.length
        temp.spanList = obj
      }
      this.addFormData = temp
    }
  },
  methods: {
    // 赋值
    setBedOrRoomVal (res) {
      this.addFormData.relationList = res
    },
    // 加载房间
    getRoomList () {
      GetRoom().then(res => {
        res.forEach((item, index) => {
          this.roomListData.push({
            objId: item.roomId,
            objName: item.roomName
          })
        })
      })
    },
    // 加载床位
    getBedList () {
      GetBed().then(res => {
        res.forEach((item, index) => {
          this.bedListData.push({
            objId: item.bedId,
            objName: item.bedName,
            sort: item.sort
          })
        })
      })
    },
    // 获取班次类型
    getDutyType () {
      AxiosApi('/hsms/web-hs/shift/' + this.businessType + '/type', {}, 'GET', { businessType: this.businessType }).then(res => {
        let data = res.data
        data.forEach((item, index) => {
          for (let p in item) {
            this.dutyTypeData.push({
              id: p,
              name: item[p]
            })
          }
        })
      })
    },
    // 保存数据
    saveData () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.addFormData.shiftConfig = JSON.stringify({
            nurse_mode: this.isShow
          })
          if (!this.bedOrRoomFlg) {
            this.addFormData.relationList = []
          }
          // 班次时间数据转换
          let workObj = []
          let saveData = { ...this.addFormData }
          let temp = saveData.spanList
          for (let i = 0; i < temp.length; i++) {
            let val = temp[i]
            if (!val || (!val.beginDate && !val.endDate)) continue
            workObj.push({
              beginTime: val.beginDate,
              endTime: val.endDate,
              sort: i + 1
            })
          }
          if (workObj.length === 0) {
            delete saveData.spanList
          } else {
            saveData.spanList = workObj
          }
          this.saveDataDo(saveData, this.actFlag)
        }
      })
    },
    // 删除工作时间
    removeSpanList (item) {
      let index = this.addFormData.spanList.indexOf(item)
      if (index !== -1) {
        this.addFormData.spanList.splice(index, 1)
      }
      this.spanListNum--
    },
    // 添加工作时间
    addSpanList () {
      if (this.spanListNum < 5) {
        this.addFormData.spanList.push({
          key: Date.now(),
          beginDate: '',
          endDate: ''
        })
        this.spanListNum++
      } else {
        MsgShow('warning', '最多添加五个工作时间段！')
      }
    }
  },
  watch: {
    'addFormData.spanList': {
      handler (val) {
        let time = 0
        // debugger
        for (let i = 0; i < val.length; i++) {
          const sTime = val[i].beginDate
          const eTime = val[i].endDate

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
        this.addFormData.workHours = (Math.abs(time) / 60).toFixed(2)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/hsms/css/self_common";
    /deep/ .el-input--small .el-input__inner {
        height: 34px;
    }

    .smallInput {
        width: 135px;
    }

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

    /deep/ .el-textarea__inner {
        padding-bottom: 28px;
        border-radius: 2px;
    }

    /deep/ .el-textarea .el-input__count {
        text-align: right;
        left: 1px;
        right: 1px;
        bottom: 1px;
        padding: 7px 5px;
        font-size: 12px;
        line-height: normal;
    }

    .width-85 {
        width: 85%;
    }

    .width-65 {
        width: 65%;
    }
</style>
