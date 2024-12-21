<template>
  <div class="card_container" id="cardContainer" ref="cardContainer" v-loading="loading">
    <!-- 统计标签 -->
    <input id="statistics_checked" type="checkbox"/>
    <div class="statistics_labels" v-if="statistics_label.length">
      <el-checkbox-group v-model="statistics_label_checked" ref="statistics_checkbox">
        <el-checkbox
          v-for="item in statistics_label"
          :key="item.labelId"
          :label="item.labelId"
          :disabled="!item.labelEvent"
          @change="searchSubmit1($event, item)"
          v-uni="'chuangweiyilan_changeTag'"
        >
          <div class="content">
            <div>{{ item.labelName }}</div><div>:{{ item.labelValue || 0 }}</div>
          </div>
        </el-checkbox>
      </el-checkbox-group>

      <label for="statistics_checked" class="triangle_up_btn" v-if="statistics_label_extend">
        <img src="../../../assets/bnms/images/triangle_up.png"/>
      </label>
      <label for="statistics_checked" class="triangle_down_btn" v-if="statistics_label_extend">
        <img src="../../../assets/bnms/images/triangle_down.png"/>
      </label>
    </div>
    <!-- 查询条件 -->
    <div class="searchTool">
      <div>
        <el-form label-width="auto" :model="search_from" :inline="true"  rel="searchSubmit2">
          <el-form-item label="">
            <el-select
              v-model="search_from_patient"
              placeholder="全部患者"
              size="small"
              clearable
              @change="handlePatientChange"
              autocomplete="off"
              v-uni="'chuangweiyilan_changePatient'"
            >
              <!--<el-option label="全部患者" value=""></el-option>-->
              <el-option label="我的患者" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="10px">
            <el-button
              type="primary"
              @click="showSetMyPatient"
              size="small"
              v-uni="'chuangweiyilan_setting'"
            >设置
            </el-button>
          </el-form-item>
          <el-form-item label="房间">
            <el-select
              v-model="search_from_room"
              placeholder="全部"
              size="small"
              clearable
              @change="handleRoomChange"
              autocomplete="off"
              v-uni="'chuangweiyilan_changeRoom'"
            >
              <!--<el-option label="全部" value=""></el-option>-->
              <el-option
                v-for="item in room_bed_data_cache"
                :label="item.roomName"
                :value="item.roomId"
                :key="item.roomId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关键字">
            <el-input
              type="text"
              size="small"
              clearable
              v-model="search_from_keyword"
              @input="handleKeyword"
              placeholder="床号/住院号/姓名"
              v-uni="'chuangweiyilan_inputKeyword'"
            ></el-input>
          </el-form-item>
          <el-form-item label-width="10px">
            <el-button
              type="success"
              @click="refreshResponse"
              size="small"
              v-uni="'chuangweiyilan_refresh'"
            >刷新
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div >
        <el-button-group>
          <el-button
            :type="model_bed_cls"
            @click="changeModel('bed')"
            size="small"
            v-uni="'chuangweiyilan_bedMode'"
          >床位模式
          </el-button>
          <el-button
            :type="model_room_cls"
            @click="changeModel('room')"
            size="small"
            v-uni="'chuangweiyilan_roomMode'"
          >房间模式
          </el-button>
          <el-button
            :type="model_simple_cls"
            @click="changeModel('simple')"
            size="small"
            v-uni="'chuangweiyilan_easyMode'"
          >极简模式
          </el-button>
        </el-button-group>
      </div>
    </div>
    <!-- 床位列表 -->
    <div class="bed_container">
      <!-- 管房模式 -->
      <div v-if="card_model === 'room'">
        <div class="card_room" v-for="room in room_bed_data" :key="room.roomId">
          <div class="room">
            <div>
              <img src="../../../assets/bnms/images/room.png"/><span>{{room.roomName}}</span>
            </div>
            <div>
              <span>管房医生:{{ room.doctorName }}</span>
            </div>
            <div>
              <span>管房护士:{{ room.nurseName }}</span>
            </div>
          </div>
          <div class="bed">
            <div class="box" v-for="bed in room.bedList" :key="bed.name" :id="'cardRoom-' + index">
              <BedCard
                :bed_name="bed.name"
                :patient="
                  patient_list_data[bed.name]
                    ? patient_list_data[bed.name].patientIn
                    : null
                "
                :nurse_level="
                  patient_list_data[bed.name]
                    ? patient_list_data[bed.name].nurseLevelConfig
                    : null
                "
                :patient_info="
                  patient_list_data[bed.name]
                    ? patient_list_data[bed.name].patientInfoDtos2
                    : null
                "
                :label_data="label_data"
                v-uni:[bed.name]="'chuangweiyilan_bedSetting'"
                @dblclick.native="showDetail(bed.name, patient_list_data[bed.name] || '', 'cardRoom-' + index, $event)"
              ></BedCard>
            </div>
            <div style="clear: both"></div>
          </div>
        </div>
      </div>
      <!-- 极简模式 -->
      <div v-else-if="card_model === 'simple'">
        <div
          class="card_simple"
          v-for="(bed, index) in all_bed_name_data"
          :key="index"
          :id="'cardSimple-' + index"
          v-uni:[index]="'chuangweiyilan_easy_detail'"
          @dblclick="showDetail(bed.name, patient_list_data[bed.name] || '', 'cardSimple-' + index, $event)"
        >
          <div class="bed_no">
            <div>
              {{ bed.name }}
            </div>
          </div>
          <div class="name" v-if="patient_list_data[bed.name]">
            {{ patient_list_data[bed.name].patientIn.patientName }}
          </div>
          <div class="add" v-else>
            <img src="../../../assets/bnms/images/add.png"/>
          </div>
          <div
            class="nurse_level"
            :style="{
              borderTopColor:
                patient_list_data[bed.name] &&
                patient_list_data[bed.name].nurseLevelConfig &&
                patient_list_data[bed.name].nurseLevelConfig.backgroundColor
                  ? patient_list_data[bed.name].nurseLevelConfig.backgroundColor
                  : '',
              borderRightColor:
                patient_list_data[bed.name] &&
                patient_list_data[bed.name].nurseLevelConfig &&
                patient_list_data[bed.name].nurseLevelConfig.backgroundColor
                  ? patient_list_data[bed.name].nurseLevelConfig.backgroundColor
                  : '',
              color:
                patient_list_data[bed.name] &&
                patient_list_data[bed.name].nurseLevelConfig &&
                patient_list_data[bed.name].nurseLevelConfig.fontColor
                  ? patient_list_data[bed.name].nurseLevelConfig.fontColor
                  : ''
            }"
          >
            <span>{{
              patient_list_data[bed.name] &&
              patient_list_data[bed.name].nurseLevelConfig &&
              patient_list_data[bed.name].nurseLevelConfig.nurseLevelShort
                ? patient_list_data[bed.name].nurseLevelConfig.nurseLevelShort
                : ""
            }}</span>
          </div>
        </div>
      </div>
      <!-- 管床模式 -->
      <div v-else>
        <div
          class="card_bed"
          v-for="(bed, index) in all_bed_name_data"
          :key="index"
          :id="'cardBed-' + index"
        >
          <div class="box">
            <BedCard
              :bed_name="bed.name"
              :patient="
                patient_list_data[bed.name] ? patient_list_data[bed.name].patientIn : null
              "
              :nurse_level="
                patient_list_data[bed.name]
                  ? patient_list_data[bed.name].nurseLevelConfig
                  : null
              "
              :patient_info="
                patient_list_data[bed.name]
                  ? patient_list_data[bed.name].patientInfoDtos2
                  : null
              "
              :label_data="label_data"
              v-uni:[index]="'chuangweiyilan_bed_detail'"
              @dblclick.native="showDetail(bed.name, patient_list_data[bed.name] || '', 'cardBed-' + index, $event)"
            ></BedCard>
          </div>
          <div class="room" v-if="patient_list_data[bed.name]">
            <div class="left">
              <img src="../../../assets/bnms/images/room.png"/><span> {{bed.roomName}}</span>
            </div>
            <div class="right">
              <span
              ><span class="none">医生:</span>{{
                  doctor_data[patient_list_data[bed.name].patientIn.doctorName] || (patient_list_data[bed.name].patientIn.doctorName && patient_list_data[bed.name].patientIn.doctorName.length>=32 ? '' : patient_list_data[bed.name].patientIn.doctorName)
                }}</span
              >
            </div>
            <div class="right">
              <span
              ><span class="none">护士:</span>{{
                  nurse_data[patient_list_data[bed.name].patientIn.nurseName] || (patient_list_data[bed.name].patientIn.nurseName && patient_list_data[bed.name].patientIn.nurseName.length>=32 ? '' : patient_list_data[bed.name].patientIn.nurseName)
                }}</span
              >
            </div>
          </div>
          <div class="room" v-else>
            <div class="left">
              <span>&nbsp;</span>
            </div>
            <div class="right">
              <span>&nbsp;</span>
            </div>
            <div class="right">
              <span>&nbsp;</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 我的患者 -->
    <el-dialog title="设置" :visible.sync="setPatientDialogVisible" width="612px" :show-close="false">
      <div class="changing_bed_container">
        <el-checkbox-group v-model="myPatientBeds">
          <el-checkbox
            v-for="(item) in my_bed_list_data_cache"
            :key="item.bedId"
            :label="item.bedName"
            :class="
              bed_has_patient_data.length > 0 &&
              bed_has_patient_data.indexOf(item.bedName) != -1
                ? 'has'
                : ''
            "
          >
            {{ item.bedName }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          @click="setPatientDialogVisible = false"
          v-uni="'chuangweiyilan_setting_cancel'"
        >
          取消
        </el-button>
        <el-button type="primary" size="small" @click="changingMyPatientSave" v-uni="'chuangweiyilan_setting_save'">
          确认
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { ApiBedCard, ApiBedRoom, ApiDept, ApiUsers } from '../../../api/bnms/index'

export default {
  name: 'card_list',
  data () {
    return {
      loading: false,
      // 当前模式
      card_model: 'bed',
      model_bed_cls: 'primary',
      model_room_cls: '',
      model_simple_cls: '',
      // 查表单使用数据
      search_from_keyword: '',
      search_from_keyword_condition: '',
      search_from_room: '',
      search_from_patient: '',
      search_from: {
        patientInCondition: '',
        patientInfoSelectDtos: [],
        deptId: ''
      },
      statistics_label_extend: false,
      statistics_label_checked: [],
      room_bed_data: [], // 过滤后的房间加床位
      room_bed_data_cache: [], // 所有房间床位缓存
      bed_list_data: [],
      bed_list_data_cache: [],

      all_bed_name_data: [], // 所有床位
      response_bed_name_data: [], // 患者信息列表中的bedName
      enableHis: false,
      patient_list_data: {}, // 患者信息列表
      patient_list_data_cache: {}, // 患者信息列表缓存
      statistics_label: [], // 统计标签
      label_data: {
        basic: [],
        basicTopThree: [],
        nurse: []
      },
      nurse_data: {},
      doctor_data: {},
      setPatientDialogVisible: false,
      myPatientBeds: [],
      bed_has_patient_data: [] // 已住人的床
    }
  },
  computed: {
    my_bed_list_data_cache: function () {
      function sort (a, b) {
        return a.sort - b.sort
      }
      let all_red = []
      for (let p in this.bed_list_data_cache) {
        all_red.push(this.bed_list_data_cache[p])
      }

      return all_red.sort(sort)
    }
  },
  created () {
    let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.search_from.deptId = deptInfo.deptId || ''
    this.loading = true

    this.getBedData()
    this.getDataInit()
  },
  activated () {
    this.statistics_label_checked = []
    this.getBedData()
    this.getDataInit()
    this.refreshResponse()
  },
  updated () {
    this.$nextTick(function () {
      if (this.$refs.statistics_checkbox) {
        const h = this.$refs.statistics_checkbox.$el.getBoundingClientRect().height
        if (h > 70) {
          this.statistics_label_extend = true
        }
      }
    })
  },
  methods: {
    getDataInit () {
      Promise.all([this.getPatientListData(), this.getPatient2LabelData(),
        this.getNurse2LabelData(), this.getBedListData(), this.getRoomListData(), this.getRoomDNData(),
        this.getNurseData(),
        this.getDoctorData()
      ]).then(res => {
        if (res[6].data) {
          const userData = res[6].data || {}
          this.parseNurseData(userData)
        }

        if (res[7].data) {
          const userData = res[7].data || {}
          this.parseDoctorData(userData)
        }

        // console.log(res, res[0], res[0].status)
        if (res[0].data) {
          const patientList = res[0].data || {}
          this.parsePatientListData(patientList)
        }

        if (res[1].data) {
          const patientLabel = res[1].data || []
          this.parsePatient2LabelData(patientLabel)
        }

        if (res[2].data) {
          const nurseLabel = res[2].data || []
          this.parseNurse2LabelData(nurseLabel)
        }

        if (res[3].data) {
          const bedList = res[3].data || []
          this.parseBedList(bedList)
        }

        if (res[4].data && res[5].data) {
          const roomList = res[4].data || []
          const roomRN = res[5].data || []
          this.parseRoomBedRNData(roomList, roomRN)
          this.mergeBedToRoom()
        }

        this.loading = false
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    // 获取有人和所有床位 【调床用】
    getBedData () {
      // 获取有人的床位
      ApiBedCard.hasPatientBed().then(res => {
        this.bed_has_patient_data = res.data
      })
    },
    getDoctorData () {
      return ApiUsers.doctor2({ dataDeptId: this.search_from.deptId })
    },
    // 解析医生信息
    parseDoctorData (data) {
      let list = data
      let arr = []
      for (let i = 0; i < list.length; i++) {
        let _d = list[i]
        arr[_d['empId']] = _d['empName']
      }
      this.doctor_data = arr
    },
    // 获取护士信息
    getNurseData () {
      return ApiUsers.nurse2({ dataDeptId: this.search_from.deptId })
    },
    // 解析护士信息
    parseNurseData (data) {
      let list = data
      let arr = {}
      for (let i = 0; i < list.length; i++) {
        let _d = list[i]
        arr[_d['empId']] = _d['empName']
      }
      this.nurse_data = arr
    },
    // 获取患者信息
    getPatientListData () {
      return ApiBedCard.patientList(this.search_from)
    },
    // 解析患者信息
    parsePatientListData (data) {
      data = data || { enableHis: false, patientSelectDtos: [] }
      this.enableHis = data.enableHis

      // 处理成key-value方便比对
      this.patient_list_data = {}
      this.response_bed_name_data = []
      data.patientSelectDtos.forEach(v => {
        v.patientInfoDtos2 = { basic: {}, nurse: {} }
        let _basic = {}
        let _nurse = {}
        if (v.patientInfoDtos) {
          for (let y = 0; y < v.patientInfoDtos.length; y++) {
            let dto = v.patientInfoDtos[y]
            if (dto.labelType === '301') {
              _basic[dto.labelSql] = dto.infoValue || ''
            }
            if (dto.labelType === '201') {
              _nurse[dto.labelSql] = dto.infoValue || ''
            }
          }
        }

        v.patientInfoDtos2['basic'] = { ..._basic, ...v.patientIn }
        v.patientInfoDtos2['nurse'] = _nurse
        v.patientIn.doctorName = v.patientIn.doctorName || ''
        v.patientIn.nurseName = v.patientIn.nurseName || ''
        this.patient_list_data[v.patientIn.bedName] = v
        this.response_bed_name_data.push(v.patientIn.bedName)
      })
    },
    // 获取患者一览使用的标签
    getPatient2LabelData () {
      return ApiBedCard.patientLabel({
        deptId: this.search_from.deptId
      })
    },
    // 解析患者一览使用的标签
    parsePatient2LabelData (data) {
      let patientLabel = data || []
      for (let i = 0; i < patientLabel.length; i++) {
        if (patientLabel[i]['isMiddle'] === 1) {
          this.label_data.basic.push(patientLabel[i].labelSql)
        } else {
          this.label_data.basicTopThree.push(patientLabel[i])
        }
      }
    },
    getNurse2LabelData () {
      return ApiBedCard.nurseLabel({
        deptId: this.search_from.deptId
      })
    },
    // 解析患者一览使用的标签
    parseNurse2LabelData (data) {
      let nurseLabel = data || []
      nurseLabel.forEach(v => {
        if (v.labelShowInfo) {
          v.labelShowInfo = v.labelShowInfo.split('|')
        }
        return v
      })
      this.label_data.nurse = nurseLabel
    },
    // 获取床位列表
    getBedListData () {
      return ApiBedRoom.bedList({ deptId: this.search_from.deptId, pageHelper: 2 })
    },
    // 解析床位数据
    parseBedList (data) {
      let _obj = {}
      for (let i = 0; i < data.length; i++) {
        if (data[i]['display'] !== 1) {
          _obj[data[i]['bedName']] = data[i]
        }
      }
      this.bed_list_data = _obj
      this.bed_list_data_cache = _obj
    },
    // 获取房间列表
    getRoomListData () {
      return ApiBedRoom.roomList({ deptId: this.search_from.deptId, pageHelper: 2 })
    },
    // 获取排班中管房管床医生护士
    getRoomDNData () {
      return ApiBedRoom.roomDN({ deptId: this.search_from.deptId })
    },
    // 解析整合房间 管房管床医生护士
    parseRoomBedRNData (roomList, roomRN) {
      let arr = {} // ---
      // 处理房间
      for (let i = 0; i < roomList.length; i++) {
        let _d = roomList[i]
        if (!arr[_d['roomId']]) arr[_d['roomId']] = {}
        arr[_d['roomId']]['bedList'] = []
        arr[_d['roomId']]['roomId'] = _d['roomId']
        arr[_d['roomId']]['roomName'] = _d['roomName']
      }
      // 管房医生和管房护士合并进去
      for (let i = 0; i < roomRN.length; i++) {
        let _d = roomRN[i]
        // 根据要求拿第一个
        if (arr[_d['roomId']]) {
          arr[_d['roomId']]['doctorName'] = _d['medicalLeader'][0]
            ? _d['medicalLeader'][0].name
            : ''
          arr[_d['roomId']]['nurseName'] = _d['nursingLeader'][0]
            ? _d['nursingLeader'][0].name
            : ''
        }
      }
      // 拆成数组
      // let arr2 = [];
      // for (let p in arr) {
      //   arr2.push(arr[p]);
      // }
      this.room_bed_data = JSON.parse(JSON.stringify(arr))
      this.room_bed_data_cache = JSON.parse(JSON.stringify(arr))
    },
    // 获取统计标签数据
    getStatisticsLabelData () {
      ApiBedCard.statisticsLabel({
        deptId: this.search_from.deptId,
        labelShowPosition: 2
      })
        .then(res => {
          this.statistics_label = res.data
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    showDetail (bedName, data, domId, event) {
      event.stopPropagation()
      // his开启 && 患者为空 return false
      if (this.enableHis && !data) {
        return false
      }
      // 记录当前scroll位置
      const position = document.querySelector('#cardContainer').parentNode.scrollTop
      sessionStorage.setItem('cardContainerScrollTop', JSON.stringify({ domId: domId, position }))

      this.$emit('changed', 'tabs', { enableHis: this.enableHis, bedName: bedName, patient: data })
    },
    // 显示模式切换
    changeModel (model) {
      this.card_model = model
      this.model_bed_cls = model === 'bed' ? 'primary' : ''
      this.model_room_cls = model === 'room' ? 'primary' : ''
      this.model_simple_cls = model === 'simple' ? 'primary' : ''
      this.statistics_label_checked = []
      this.refreshResponse()
    },
    // 统计标签查询
    searchSubmit1 (val, item) {
      if (item.labelEvent.trim() === '') {
        return false
      }
      if (val) {
        this.search_from_keyword = ''
        this.search_from_room = ''
        if (item.labelName.includes('空床')) {
          // 暂不处理
        } else {
          this.statistics_label_checked = [item.labelId]
          let condition = val ? item.labelEvent : '{}'
          condition = JSON.parse(condition)
          this.search_from.patientInCondition = condition.patientInCondition
          this.search_from.patientInfoSelectDtos = condition.patientInfoSelectDtos

          this.getPatientListData().then(res => {
            this.parsePatientListData(res.data)
            this.bed_list_data = {}
            for (let p in this.patient_list_data) {
              let v = this.patient_list_data[p]
              this.bed_list_data[v.patientIn.bedName] = (this.bed_list_data_cache[v.patientIn.bedName])
            }
            this.mergeBedToRoom2()
          }).catch(res => {
            this.$message.error(res.message)
          })
        }
      } else {
        this.refreshResponse()
      }
    },
    // 显示床位-我的画着
    showSetMyPatient () {
      // console.log(this.bed_list_data_cache)
      // console.log(this.room_bed_data_cache)
      ApiBedCard.selectMyPatient()
        .then(res => {
          this.myPatientBeds = res.data && res.data.bedIdList ? res.data.bedIdList.split(',') : []
          this.setPatientDialogVisible = true
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 保存我的患者
    changingMyPatientSave () {
      ApiBedCard.setMyPatient({ bedList: this.myPatientBeds.join(',') })
        .then(() => {
          this.setPatientDialogVisible = false
          if (this.search_from_patient === '1') {
            let beds = this.myPatientBeds || []
            for (let i = 0; i < beds.length; i++) {
              this.bed_list_data[beds[i]] = (this.bed_list_data_cache[beds[i]])
            }

            this.mergeBedToRoom2()
          }
          this.$message.success('设置成功！')
        })
        .catch(err => {

        })
        .finally(() => {
          this.myPatientBeds = []
        })
    },
    // 我的患者|全部患者
    handlePatientChange (val) {
      this.search_from_room = ''
      this.search_from_keyword = ''
      // 我的患者
      if (val === '1') {
        this.bed_list_data = {}
        ApiBedCard.selectMyPatient()
          .then(res => {
            let beds = res.data && res.data.bedIdList ? res.data.bedIdList.split(',') : []
            for (let i = 0; i < beds.length; i++) {
              this.bed_list_data[beds[i]] = (this.bed_list_data_cache[beds[i]])
            }

            this.mergeBedToRoom2()
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.bed_list_data = this.bed_list_data_cache
        this.mergeBedToRoom2()
      }
    },
    // 查询查询条件中的房间
    handleRoomChange () {
      this.search_from_patient = ''
      this.filterByRoomIdOrKeyword()
    },
    // 根据查询条件中的关键词
    handleKeyword (keyword) {
      let that = this
      that.search_from_patient = ''
      if (window.xxxxxtimer) {
        clearTimeout(window.xxxxxtimer)
      }
      window.xxxxxtimer = setTimeout(function () {
        that.filterByRoomIdOrKeyword()
        // console.log('输入')
        window.xxxxxtimer = undefined
      }, 500)
    },
    filterByRoomIdOrKeyword () {
      const room_id = this.search_from_room
      const keyword = this.search_from_keyword
      // 房间
      if (room_id) {
        for (let p in this.room_bed_data_cache) {
          let _d = this.room_bed_data_cache[p]
          if (_d.roomId === room_id) {
            let o = {}
            o[_d['roomId']] = _d
            this.room_bed_data = o
            break
          }
        }
      } else {
        this.room_bed_data = JSON.parse(JSON.stringify(this.room_bed_data_cache))
      }

      // 关键词
      if (keyword) {
        this.bed_list_data = {}
        for (let p in this.bed_list_data_cache) {
          let _d = this.bed_list_data_cache[p]
          if (_d['bedName'].includes(keyword)) {
            this.bed_list_data[_d['bedName']] = _d
          }
        }

        // 患者
        for (let p in this.patient_list_data) {
          let v = this.patient_list_data[p]
          if (
            v.patientIn.bedName.includes(keyword) ||
              v.patientIn.inpNo.includes(keyword) ||
              v.patientIn.patientName.includes(keyword)
          ) {
            this.bed_list_data[v.patientIn.bedName] = (this.bed_list_data_cache[v.patientIn.bedName])
          }
        }
      } else {
        this.bed_list_data = JSON.parse(JSON.stringify(this.bed_list_data_cache))
      }

      this.mergeBedToRoom()
    },
    mergeBedToRoom () {
      // 清空房间的床位
      for (let p in this.room_bed_data) {
        this.room_bed_data[p]['bedList'] = []
      }

      for (let q in this.bed_list_data) {
        let _d = this.bed_list_data[q]
        if (!_d || !_d['roomId'] || !this.room_bed_data[_d['roomId']]) {
          continue
        }
        if (!this.room_bed_data[_d['roomId']]['bedList']) {
          this.room_bed_data[_d['roomId']]['bedList'] = []
        }
        this.room_bed_data[_d['roomId']]['bedList'].push({ name: _d['bedName'], sort: _d['sort'] })
      }

      this.sortBed()
    },

    mergeBedToRoom2 () {
      this.room_bed_data = {}
      for (let q in this.bed_list_data) {
        let _d = this.bed_list_data[q]
        if (!_d || !_d['roomId'] || !this.room_bed_data_cache[_d['roomId']]) {
          continue
        }
        if (!this.room_bed_data[_d['roomId']]) {
          let room = this.room_bed_data_cache[_d['roomId']]
          room['bedList'] = []
          this.room_bed_data[_d['roomId']] = room
        }
        this.room_bed_data[_d['roomId']]['bedList'].push({ name: _d['bedName'], sort: _d['sort'] })
      }

      this.sortBed()
    },
    sortBed () {
      function sort (a, b) {
        return a.sort - b.sort
      }
      this.all_bed_name_data = []
      let _all_bed = []
      for (let p in this.room_bed_data) {
        this.room_bed_data[p]['bedList'].sort(sort)
        // console.log('whc - ', this.room_bed_data[p])
        for (let x = 0; x < this.room_bed_data[p]['bedList'].length; x++) {
          let _bed = this.room_bed_data[p]['bedList'][x]
          _bed['roomName'] = this.room_bed_data[p]['roomName']
          _all_bed.push(_bed)
        }
      }

      _all_bed.sort(sort)
      // for (let i=0; i<_all_bed.length; i++) {
      //   this.all_bed_name_data.push(_all_bed[i]['name'])
      // }
      this.all_bed_name_data = _all_bed
    },

    // 重置
    refreshResponse () {
      this.search_from_patient = ''
      this.search_from_room = ''
      this.search_from_keyword = ''
      this.search_from.patientInCondition = ''
      this.search_from.patientInfoSelectDtos = []
      this.statistics_label_checked = []
      this.loading = true
      this.room_bed_data = JSON.parse(JSON.stringify(this.room_bed_data_cache))
      this.bed_list_data = JSON.parse(JSON.stringify(this.bed_list_data_cache))
      this.mergeBedToRoom()

      this.getPatientListData().then(res => {
        this.parsePatientListData(res.data)
        this.loading = false
      }).catch(res => {
        this.$message.error(res.message)
      })

      this.getStatisticsLabelData({
        deptId: this.search_from.deptId,
        labelShowPosition: 2
      })
    }
  },
  components: {
    BedCard: () => import('@/components/bnms/BedCard')
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  .card_container /deep/ .el-checkbox__input {
    display: none;
  }

  .blue {
    box-shadow: 0 2px 4px 0 #409eff !important;
  }

  .card_container .statistics_labels {
    /deep/ .el-checkbox__label {
      /*padding-left: 0 !important;*/
      padding: 7px;
    }

    /deep/ .is-checked + .el-checkbox__label {
      font-weight: bold;
    }
  }

  .card_container {
    /*height: 100%;*/
    position: relative;

    > div {
      /*background-color: #fff;*/
    }
  }

  #statistics_checked {
    display: none;

    &:checked ~ .statistics_labels {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      overflow: visible;
      max-height: none;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
      background-color: #fff;
      margin-right: 0;

      .triangle_down_btn {
        display: none;
      }

      .triangle_up_btn {
        display: initial;
      }
    }

    &:checked ~ .searchTool {
      padding-top: 69px;
    }
  }

  //统计标签
  .statistics_labels {
    overflow: hidden;
    max-height: 66px;
    padding: 8px 40px 8px 0;
    z-index: 9;
    transition: max-height 0.25s;
      border-bottom: 1px solid #E0E0E0;

    /deep/.el-checkbox {
      width: 133px;
      text-align: center;
        margin-right: 0;

      .el-checkbox__label {
        max-width: 100%;
        .content {
          display: flex;
          justify-content: flex-start;

          div:first-child {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: right;
          }
        }
      }
    }

    .triangle_up_btn,
    .triangle_down_btn {
      position: absolute;
      top: 5px;
      right: 18px;
      cursor: pointer;
    }

    .triangle_up_btn {
      display: none;
    }
  }

  //查询条件
  .searchTool {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 14px;
    /*margin-top: 39px;*/

    /deep/ .el-button {
      border-radius: 2px !important;
      font-size: 14px !important;
      padding: 6px 12px !important;
    }
    /deep/ .el-button-group {
      .el-button {
        padding: 6px 20px !important;
      }
    }

    /deep/ .el-form-item {
      margin-bottom: 0;
    }
    > div:last-child {
      width: 300px; line-height: 40px; text-align: right
    }
  }

  .bed_container {
    padding: 0 5px 5px;
  }

  .box {
    width: 270px;
    height: 168px;
  }

  /*管床模式*/
  .card_bed {
    display: inline-block;
    margin: 4px 4px 4px 0;
    font-size: 12px;
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);

    &:hover {
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.3);
    }

    .room {
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 2;
      border-radius: 0 0 5px 5px;
      color: #333;
      width: 270px;

      .left {
        width: 50px;
        text-align: center;
        background-color: #f7f7f7;
        white-space: nowrap;

        img {
          width: 15px;
          height: 15px;
          vertical-align: sub;
        }
      }

      .right {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        background-color: #f7f7f7;
      }
    }
  }

  /*管房模式*/
  .card_room {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: #f7f7f7;
    font-size: 12px;
    margin-bottom: 10px;

    .room {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      /*margin: 30px 35px;*/
      font-size: 13px;
      color: #333;
      width: 120px;
      padding: 20px;

      div {
        margin-top: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        &:first-child {
          font-size: 15px;
        }
      }

      img {
        height: 20px;
        width: 20px;
        margin-right: 10px;
      }
    }

    .bed {
      border-left: 2px dashed #ccc;
      padding: 10px;
      flex: 1;

      .box {
        margin: 4px;
        float: left;
        border-radius: 5px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

        &:hover {
          box-shadow: 2px 2px 3px #aaaaaa;
        }

        .personIn {
          border-radius: 5px;
        }
      }
    }
  }

  .changing_bed_container {
    /deep/ .el-checkbox {
      margin-right: 14px;
      margin-bottom: 20px;
    }

    /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #fff;
      background-color: #1E87F0;
      border-color: #1E87F0;
    }

    /deep/ .el-checkbox__inner {
      display: none;
    }

    /deep/ .el-checkbox__label {
      font-size: 14px;
      padding-left: 0;
      width: 36px;
      height: 36px;
      border: 1px solid #BFBFBF;
      display: inline-block;
      line-height: 36px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #666;
      text-align: center;
      border-radius: 2px;
    }

    .has /deep/.el-checkbox__label {
      color: #CCCECE;
      background-color: #F4F4F4;
      border-color: #F4F4F4;
    }
  }

  /*极简模式*/
  .card_simple {
    float: left;
    width: 200px;
    margin: 5px 10px 5px 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;
    position: relative;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    &:hover {
      box-shadow: 2px 2px 3px #aaaaaa;
    }

    .bed_no {
      font-size: 18px;

      > div {
        width: 60px;
        height: 50px;
        margin-right: 5px;
        text-align: center;
        line-height: 50px;
        background-color: #69b3ff;
        color: #fff;
        border-radius: 5px 0 0 5px;
      }
    }

    .name {
      font-size: 18px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-right: 27px;
      color: #418eec;
    }

    .add {
      flex: 1;
      margin-right: 27px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 30px;
        height: 30px;
      }
    }
  }

  .nurse_level {
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border: 17px solid #ccc;
    border-bottom-color: transparent;
    border-left-color: transparent;
    color: #fff;
    border-top-right-radius: 5px;

    span {
      position: absolute;
      top: -14px;
      right: -14px;
    }
  }

  @media screen and (max-width: 1280px) {
    .box {
      width: 185px !important;
    }
    .card_bed .room {
      width: 185px !important;
    }
    .card_bed .room span.none {
      display: none !important;
    }
  }
  @media screen and (max-width: 1500px) {
    .searchTool {
      flex-direction: column;
      align-items: flex-start;
      > div:last-child {
        text-align: inherit;
      }
    }
  }
</style>
