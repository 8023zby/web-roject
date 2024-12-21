<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm">

    <el-divider>
      <h2 :id="anchorList[0].src">{{anchorList[0].title}}</h2>
    </el-divider>

    <el-form-item label="护理单元:" prop="deptId">
      <treeselect
        v-model="ruleForm.deptId"
        :multiple="false"
        :options="detail.deptList"
        :normalizer="normalizer"
        :default-expand-level="2"
        placeholder="请选择科室" />
    </el-form-item>

    <el-form-item label="设备编号:">
      <el-input readonly v-model="ruleForm.deviceCode"></el-input>
    </el-form-item>

    <el-form-item label="房间名:" prop="roomId">
      <!-- <el-input v-model="ruleForm.roomName"></el-input> -->
      <el-select v-model="ruleForm.roomId" placeholder="请选择房间">
        <el-option
          v-for="item in roomList"
          :key="item.roomId"
          :label="item.roomName"
          :value="item.roomId">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="终端号:">
      <el-input v-model="ruleForm.deviceNo"></el-input>
    </el-form-item>

    <el-form-item label="终端名称:" prop="deviceName">
      <el-input v-model="ruleForm.deviceName"></el-input>
    </el-form-item>

    <el-divider>
      <h2 :id="anchorList[1].src">{{anchorList[1].title}}</h2>
    </el-divider>

    <el-form-item label="灯光及排气扇总开关:">
      <el-switch v-model="ruleForm.fansAndlightSwitch"></el-switch>
    </el-form-item>

    <div>
      <el-form-item label="灯光及排气扇回路:" prop="desc">
        <el-button @click="addType(1)" type="primary">添加</el-button>
      </el-form-item>

      <el-form-item v-if="ruleForm.light.length > 0">
        <div v-for="(item, index) in ruleForm.light" :key="index" class="light_group">
          <div class="light_group_box">
            <div class="light_group_box_div">家居类型：</div>
            <el-input v-model="item.lineName" placeholder="请输入家居类型" maxlength="10"></el-input></div>
          <div class="light_group_box">
            <div class="light_group_box_div">回路序号：</div>
            <!-- <el-input v-model="item.lineLoop" type="number" placeholder="请输入对应的回路序号" maxlength="10" ></el-input> -->
            <el-select v-model="item.lineLoop" placeholder="请选择地址码">
              <el-option
                v-for="item in addressList1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div>
            <i class="el-icon-remove-outline iconDelCls-item" @click="delScore(index, 1)" style="margin-top: 3px;"></i>
          </div>
        </div>
      </el-form-item>
    </div>

    <el-form-item label="窗帘设置总开关:">
      <el-switch v-model="ruleForm.curtainsSetSwitch"></el-switch>
    </el-form-item>

    <div>
      <el-form-item label="窗帘设置回路:" prop="desc">
        <el-button @click="addType(2)" type="primary">添加</el-button>
      </el-form-item>

      <el-form-item v-if="ruleForm.curtains.length > 0">
        <div v-for="(item, index) in ruleForm.curtains" :key="index" class="light_group">
          <div class="light_group_box">
            <div class="light_group_box_div">家居类型：</div>
            <el-input v-model="item.lineName" placeholder="请输入家居类型" maxlength="10"></el-input></div>
          <div class="light_group_box">
            <div class="light_group_box_div">地址码:</div>
            <!-- <el-input v-model="item.lineLoop" type="number" placeholder="请输入对应的回路序号" maxlength="10"></el-input> -->
            <el-select v-model="item.lineLoop" placeholder="请选择地址码">
            <el-option
              v-for="item in addressList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          </div>
          <div>
            <i class="el-icon-remove-outline iconDelCls-item" @click="delScore(index, 2)" style="margin-top: 3px;"></i>
          </div>
        </div>
      </el-form-item>
    </div>

    <el-form-item class="bottom">
      <el-button @click="backList">取消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import { queryRoomListApi, editSmartHome, getSmartHomeOne } from '@/api/wnms/furnitureControl/furnitureControl.js'
import mixin from './mixin'
export default {
  components: { Treeselect },
  props: ['detail'],
  mixins: [mixin],
  data () {
    return {
      ruleForm: {
        fansAndlightSwitch: false,
        curtainsSetSwitch: false,
        light: [],
        curtains: []
      },
      roomList: [],
      rules: {
        deptId: [
          { required: true, message: '请选择护理单元', trigger: 'blur' }
        ],
        roomName: [
          { required: true, message: '请选择房间', trigger: 'blur' }
        ],
        deviceName: [
          { required: true, message: '请选输入终端名称', trigger: 'blur' },
          { min: 1, max: 10, message: '最多输入10个字符', trigger: 'blur' }
        ]
      },
      // 锚点列表
      anchorList: [
        {
          src: 'divider1',
          title: '网关设置'
        },
        {
          src: 'divider2',
          title: '智能家居回路设置'
        }
      ]
    }
  },
  created () {
    this.getRoomListData()
    this.queryOne()
  },
  methods: {
    // 获取房间列表
    getRoomListData () {
      queryRoomListApi({ deptId: this.ruleForm.deptId, pageHelper: 2 }).then(res => {
        console.log(res)
        this.roomList = res.data
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取单个设备信息
    queryOne () {
      getSmartHomeOne({ deviceId: this.detail.row.deviceId }).then(res => {
        console.log(res)
        this.ruleForm = { ...res.data, ...this.ruleForm }
        // console.log(this.ruleForm, 'ppppppppppp')
        if (this.ruleForm.xjdDeviceLineDos && this.ruleForm.xjdDeviceLineDos.length > 0) {
          this.dealHaveData(this.ruleForm.xjdDeviceLineDos)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 保存数据
    submitForm (formName) {
      console.log(this.dealData())
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveData()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    saveData () {
      const params = this.dealData()
      editSmartHome(params).then(res => {
        console.log(res, '>>>>>>>>>')
        this.$message.success('保存成功')
        this.$emit('option-changed', 'list')
      })
        .catch(err => {
          console.log(err.desc)
          this.$message.warning(err.desc)
        })
    },
    backList () {
      this.$emit('option-changed', 'list')
    },
    delScore (index, type) {
      if (type === 1) {
        this.ruleForm.light.splice(index, 1)
      } else if (type === 2) {
        this.ruleForm.curtains.splice(index, 1)
      }
    },
    // 点击编辑有回路时处理的数据de
    dealHaveData (xjdDeviceLineDos) {
      console.log(xjdDeviceLineDos, 'PPP')
      const switchArr = []
      const lightArr = []
      const curtainsArr = []
      for (let index = 0; index < xjdDeviceLineDos.length; index++) {
        if (xjdDeviceLineDos[index].lineName === 'gateway-master') {
          switchArr.push(xjdDeviceLineDos[index])
        }
        if (xjdDeviceLineDos[index].lineClass === '灯光及排气扇设置' && xjdDeviceLineDos[index].lineName !== 'gateway-master') {
          lightArr.push(xjdDeviceLineDos[index])
        }
        if (xjdDeviceLineDos[index].lineClass === '窗帘设置' && xjdDeviceLineDos[index].lineName !== 'gateway-master') {
          curtainsArr.push(xjdDeviceLineDos[index])
        }
      }
      // 处理总开关
      this.dealSwitchIsShow(switchArr)
      // 处理灯光
      this.dealLight(lightArr)
      // 处理窗帘
      this.dealCurtains(curtainsArr)
    },
    // 处理总开关的显示
    dealSwitchIsShow (switchArr) {
      for (let index = 0; index < switchArr.length; index++) {
        if (switchArr[index].lineClass === '灯光及排气扇设置') {
          this.ruleForm.fansAndlightSwitch = true
        } else if (switchArr[index].lineClass === '窗帘设置') {
          this.ruleForm.curtainsSetSwitch = true
        }
      }
    },
    // 处理灯光设置回路显示
    dealLight (lightArr) {
      for (let index = 0; index < lightArr.length; index++) {
        this.ruleForm.light.push({
          lineId: lightArr[index].lineId,
          lineName: lightArr[index].lineName,
          lineClass: '灯光及排气扇设置',
          lineLoop: lightArr[index].lineLoop,
          lineSort: lightArr[index].lineSort
        })
      }
    },
    // 处理窗帘设置回路显示
    dealCurtains (curtainsArr) {
      for (let index = 0; index < curtainsArr.length; index++) {
        this.ruleForm.curtains.push({
          lineId: curtainsArr[index].lineId,
          lineName: curtainsArr[index].lineName,
          lineClass: '窗帘设置',
          lineLoop: curtainsArr[index].lineLoop,
          lineSort: curtainsArr[index].lineSort
        })
      }
    },
    // 没有回路时处理的数据
    dealData () {
      const xjdDeviceLineDos = []
      // 灯光及排气扇总开关
      if (this.ruleForm.fansAndlightSwitch) {
        xjdDeviceLineDos.push({
          lineId: '', // 回路ID
          lineName: 'gateway-master',
          lineClass: '灯光及排气扇设置',
          lineSort: -1,
          lineLoop: null
        })
      }

      // 窗帘设置总开关
      if (this.ruleForm.curtainsSetSwitch) {
        xjdDeviceLineDos.push({
          lineId: '', // 回路ID
          lineName: 'gateway-master',
          lineClass: '窗帘设置',
          lineSort: -1,
          lineLoop: null
        })
      }

      // 灯光及排气扇回路
      for (let index = 0; index < this.ruleForm.light.length; index++) {
        xjdDeviceLineDos.push({
          lineId: this.ruleForm.light[index].lineId, // 回路ID
          lineName: this.ruleForm.light[index].lineName,
          lineClass: '灯光及排气扇设置',
          lineSort: this.ruleForm.light[index].lineSort ? this.ruleForm.light[index].lineSort : index + 1,
          lineLoop: this.ruleForm.light[index].lineLoop
        })
      }

      // 窗帘回路
      for (let index = 0; index < this.ruleForm.curtains.length; index++) {
        xjdDeviceLineDos.push({
          lineId: this.ruleForm.curtains[index].lineId, // 回路ID
          lineName: this.ruleForm.curtains[index].lineName,
          lineClass: '窗帘设置',
          lineSort: this.ruleForm.curtains[index].lineSort ? this.ruleForm.curtains[index].lineSort : this.ruleForm.light.length + index + 1,
          lineLoop: this.ruleForm.curtains[index].lineLoop
        })
      }

      const params = {
        deviceId: this.ruleForm.deviceId,
        deptId: this.ruleForm.deptId,
        roomId: this.ruleForm.roomId,
        deviceNo: this.ruleForm.deviceNo,
        deviceName: this.ruleForm.deviceName,
        xjdDeviceLineDos: xjdDeviceLineDos
      }
      return params
    },
    normalizer (node) {
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children && node.children.length > 0 ? node.children : undefined
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-ruleForm{
  padding: 15px;
}
.vue-treeselect {
  width: 200px;
}
/deep/.el-input__inner {
  width: 200px;
}
.bottom {
  text-align: center;
}
.light_group{
  display: flex;
  align-items: center;
  padding-bottom: 10px;
}
.light_group_box {
  display: flex;
  margin-right: 20px;
}
.light_group_box_div {
  width: 80px;
}
.iconDelCls-item {
  font-size: 24px;
  color: #f56c6c;
  cursor: pointer;
  margin-left: 10px;
  vertical-align: top;
}
/deep/.el-input {
  width: 200px;
}
</style>
