<template>
  <el-container style="height: 100%">
    <el-main>
      <deptInsideMenu @dataInit="reLoadData" :deptId="deptId" :anchorList="[]" :disabled="deptDisabled"></deptInsideMenu>
      <el-form ref="configContent" :model="configContent" :rules="rules" label-width="160px">
        <!-- 探视公告 -->
        <el-form-item label="探视公告" prop="name">
          <el-row :gutter="10">
            <el-col :sm="18" :md="20" :lg="20" :xl="16" style="margin-bottom: 10px">
              <el-input type="textarea" :rows="2" maxlength="200" show-word-limit placeholder="请输入内容" v-model="configContent.notice"></el-input>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 探视转接 -->
        <el-form-item label="开启探视转接">
          <el-switch v-model="configContent.visitTransfer" :active-color="switchActiveColor" />
        </el-form-item>

        <!-- 单次探视时长 -->
        <el-form-item label="单次探视时长" prop="onceVisitDuration">
          最长
          <el-input v-model.trim="configContent.onceVisitDuration" type="text" class="w60" maxlength="4" />
          分钟后自动挂断
        </el-form-item>

        <div v-for="(item, index) in configContent.businessHours" :key="index" class="casual_paicker_main">

          <el-form-item :label="'探视时间' + (index + 1)" label-width="150px" :prop="'businessHours[' + index +'].start'" :rules="[{ required: false,  message: '探视时间不能为空', trigger: 'change' }]">
            <!-- 任意时间段 -->

            <el-time-picker v-model="configContent.businessHours[index].start" class="casual_paicker_statr" value-format="HH:mm:ss" placeholder="开始时间">
            </el-time-picker>
            <span>至</span>
          </el-form-item>

          <el-form-item label-width="10px" style="margin-left:0" :prop="'businessHours[' + index +'].end'" :rules="[ { required: false,  message: '探视时间不能为空',    trigger: 'blur' }]">
            <el-time-picker v-model="configContent.businessHours[index].end" class="casual_paicker_end" value-format="HH:mm:ss" placeholder="结束时间">
            </el-time-picker>
            <div class="item-title" style="display: inline-block" @click="addOpenTime">
              &nbsp;
              <i class="el-icon-circle-plus-outline" style="cursor: pointer" />
            </div>
            <div class="item-title" style="display: inline-block">
              &nbsp;
              <i class="el-icon-remove-outline" style="cursor: pointer" @click="deleteTime(item,index,$event)" />
            </div>
          </el-form-item>

        </div>

        <!-- 终端音量 -->
        <el-form-item label="终端音量" prop="name">
          <el-row :gutter="10">
            <el-col v-for="(o, index) in 4" :key="o" :xs="12" :sm="6" :md="5" :lg="5" :xl="4" style="margin-bottom: 10px">
              <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px;">
                <el-time-picker v-model="configContent.volumeVisit[index].Time" format="HH:mm:ss" value-format="HH:mm:ss" :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }" :clearable="false" placeholder="选择时间" style="width:100%" />
                <el-select class="volume-select" v-model="configContent.volumeVisit[index].Vol" placeholder="请选择音量" style="width:100%; margin-top: 10px">
                  <el-option v-for="item in volumeOptionsList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 终端亮度 -->
        <el-form-item label="终端亮度" prop="name">
          <el-row :gutter="10">
            <el-col v-for="(o, index) in 4" :key="o" :xs="12" :sm="6" :md="5" :lg="5" :xl="4" style="margin-bottom: 10px">
              <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px;">
                <el-time-picker v-model="configContent.lightVisit[index].Time" format="HH:mm:ss" value-format="HH:mm:ss" :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }" :clearable="false" placeholder="选择时间" style="width:100%" />
                <el-select class="light-select" v-model="configContent.lightVisit[index].Light" placeholder="请选择亮度" style="width:100%; margin-top: 10px">
                  <el-option v-for="item in lightOptionsList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 重启终端 -->
        <el-form-item label="重启终端" prop="name">
          <el-button round type="primary" size="mini" @click="rebootEC(deviceType.rvKinVisitExtension)">重启</el-button>
        </el-form-item>

        <!-- 定时重启 -->
        <el-form-item label="定时重启" prop="name">
          <el-switch v-model="configContent.autoRestarVisit.state" :active-color="switchActiveColor" />每天
          <el-time-picker v-model="configContent.autoRestarVisit.time" format="HH:mm:ss" value-format="HH:mm:ss" :clearable="false" :disabled="!configContent.autoRestarVisit.state" class="w120" />时间，自动重启
        </el-form-item>

        <!-- 终端设置 -->
        <el-form-item label="终端设置">
          <el-switch v-model="configContent.deviceSettingVisit" :active-color="switchActiveColor" />
        </el-form-item>
      </el-form>

      <el-row class="top-24" style="text-align: center">
        <el-button @click="goParent">取消</el-button>
        <el-button type="primary" @click.prevent.stop="saveConfig(deviceConfigName)">保存</el-button>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import './systemConfig.css'
import configMixin from './mixin'
import deptInsideMenu from '@/components/wnms/deptInsideMenu/deptInsideMenu'

export default {
  name: 'visitConfig',
  mixins: [configMixin],
  components: { deptInsideMenu },
  data () {
    return {

      // 时间选择器数量
      timeIndex: 0,
      // 配置页面名称
      deviceConfigName: 'visit',
      // 配置内容
      configContent: {
        notice: '',
        onceVisitDuration: '15',
        visitTransfer: true, // 探视转接
        businessHours: [],
        volumeVisit: [
          {
            Time: '08:00:00',
            Vol: '10'
          },
          {
            Time: '12:00:00',
            Vol: '8'
          },
          {
            Time: '14:00:00',
            Vol: '10'
          },
          {
            Time: '18:00:00',
            Vol: '6'
          }
        ],
        lightVisit: [
          {
            Time: '08:00:00',
            Light: '50'
          },
          {
            Time: '12:00:00',
            Light: '50'
          },
          {
            Time: '14:00:00',
            Light: '50'
          },
          {
            Time: '18:00:00',
            Light: '50'
          }
        ],
        autoRestarVisit: {
          state: false,
          time: '08:00:00'
        },
        deviceSettingVisit: false
      },
      rules: {
        onceVisitDuration: [
          {
            validator: (rule, value, callback) => {
              if (/^(?:[1-9]\d*)$/.test(value) === false) {
                callback(new Error('请输入正整数'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    deleteTime (item, index, event) {
      if (this.configContent.businessHours.length === 1) return this.$message('默认数据无法删除!')
      this.configContent.businessHours.splice(index, 1)
    },
    // 添加
    addOpenTime () {
      if (this.configContent.businessHours.length < 3) {
        this.configContent.businessHours.push({
          start: '',
          end: ''
        })
      }
    },
    changeState () {
      for (const i in this.configContent) {
        this.configContent[i] = ''
      }
      // this.index = 0
      this.editShop()
    },
    updateState (isOpened) {
      updateState(Number(isOpened) === 1 ? 0 : 1)
        .then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.editShop()
        })
        .catch(error => {
          this.$message.error(JSON.stringify(error) + '数据获取失败')
        })
    }
  }
}
</script>
<style lang="scss" >
.casual_paicker_main {
  display: flex;
}
</style>
