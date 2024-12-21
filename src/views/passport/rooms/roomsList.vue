<template>
  <div class="typt-list-main">
    <div class="typt-list-container">
      <!--查询-->
      <el-form class="typt-list-search" :inline="true" >
        <el-form-item label="房间名称：">
          <el-input v-uni="actFormKey + 'fangjianmingcheng'" placeholder="请输入" v-model="formSearchData.roomName" clearable></el-input>
        </el-form-item>
        <el-form-item label="科室：" v-if="landingEndCode === 'OPEX'" class="deptCls">
          <treeselect v-uni="actFormKey + 'keshi'" placeholder="请选择" v-model="formSearchData.deptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :multiple="false" :options="deptData" noChildrenText="无子节点"/>
        </el-form-item>
        <el-form-item v-else-if="orgLevel!==2" label="部门：" class="deptCls">
          <el-select v-uni="actFormKey + 'bumen'" v-model="formSearchData.deptId" placeholder="请选择" filterable>
            <el-option v-for="item in dataDeptInfoList" :label="item.deptName" :value="item.deptId" :key="item.deptId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域：" class="deptCls">
          <treeselect v-uni="actFormKey + 'quyu'" :default-expand-level="10" noResultsText="无匹配数据" placeholder="请选择" v-model="formSearchData.area" noOptionsText="暂无数据" :options="defaultRegionOp" noChildrenText="无子节点">
            <div slot="value-label" slot-scope="{ node }">{{ node.raw.allName }}</div>
          </treeselect>
        </el-form-item>
        <el-form-item>
          <div class="typt-search-btn">
            <el-button v-uni="actKey + 'search'" type="primary"  icon="el-icon-search" @click="onSearchSubmit" size="small">搜索</el-button>
            <el-button v-uni="actKey + 'reset'" type="text" @click="reload">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <!--end-->
      <hr />
      <div class="typt-list-add-div">
        <el-button v-if="authorityObj['roomsList_add']" type="warning" size="small" icon="el-icon-plus" @click="addRoom('add')">添加</el-button>
        <div class="action_div">
          <sort-type v-uni="actKey + 'sortType'" :orderBy="orderBy" @query="queryByOrder" style="float: left"/>
          <!--<el-button v-if="multipleSelection.length===0" type="info" @click="relation()" disabled>关联区域</el-button>
          <el-button v-else type="primary" @click="relation()">关联区域</el-button>-->
          <el-button v-uni="actKey + 'sort'" v-if="authorityObj['room_srot']" type="primary" @click="sort()">排序</el-button>
          <!--<el-button type="primary" size="small" @click="addRooms('add')">批量添加</el-button>-->
        </div>
      </div>
      <!--列表-->
      <el-table
        :data="tableData"
        stripe
        :row-key="getRowKey"
        v-loading="loading"
        height="80%"
        @selection-change="handleSelectionChange"
        :row-class-name="tableRowClassName"
        v-if="tableVis"
      >
        <el-table-column type="selection" width="55" align="center"
                         :reserve-selection = "true"></el-table-column>
<!--        <el-table-column label="序号" type="index" width="100" align="center" :index="indexMethod"></el-table-column>-->
        <el-table-column label="房间名称" prop="roomName" align="center"></el-table-column>
        <el-table-column label="房间类型" prop="roomType" align="center" :formatter="formatterType"></el-table-column>
        <el-table-column label="所属区域" prop="area" align="center" :formatter="formatterArea"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
        <el-table-column v-if="authorityObj['roomsList_del'] || authorityObj['roomsList_mod']" label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button v-uni="actKey + 'edit-' + scope.row.roomId" v-if="authorityObj['roomsList_mod']" type="text" @click="editRoom(scope.row,'edit')">编辑</el-button>
            <el-button v-uni="actKey + 'delete-' + scope.row.roomId" v-if="authorityObj['roomsList_del']" type="text" @click="delRoom(scope.row)" style="color:#f56f6c">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--end-->
      <!--分页-->
        <!--组件页码显示-->
      <page-info :pageInfo="pageInfo"></page-info>
      <!--end-->
    </div>
    <!--新增房间对话框-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="580px" :show-close="false" :close-on-click-modal="false">
      <el-form :rules="rules_room" :model="form" label-width="100px" ref="addForm" class="typt-add-dialog bed-room">
        <el-form-item label="房间名称：" prop="name">
          <el-input v-uni="actAddFormKey + 'fangjianmingcheng'" v-model="form.name" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
        <!--运维端-->
        <el-form-item label="科室：" v-if="landingEndCode === 'OPEX'" class="deptAddCls" prop="editCheckedDept">
          <treeselect v-uni="actAddFormKey + 'keshi'" :disabled = disabled placeholder="请选择部门" v-model="form.editCheckedDept" noResultsText="无匹配数据" noOptionsText="暂无数据" :options="deptData" noChildrenText="无子节点"/>
        </el-form-item>
        <el-form-item label="部门：" class="deptAddCls" prop="editCheckedDept" v-else-if="deptShowVis">
          <el-select v-uni="actAddFormKey + 'bumen'" v-model="form.editCheckedDept" placeholder="请选择" filterable>
            <el-option v-for="item in dataDeptInfoList" :label="item.deptName" :value="item.deptId" :key="item.deptId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属区域：" class="deptAddCls" prop="region" >
          <treeselect v-uni="actAddFormKey + 'quyu'" :disable-branch-nodes="true" :default-expand-level="10" noResultsText="无匹配数据" placeholder="请选择" v-model="form.region" noOptionsText="暂无数据" :options="defaultRegionOp" noChildrenText="无子节点">
            <div slot="value-label" slot-scope="{ node }">{{ node.raw.allName }}</div>
          </treeselect>
        </el-form-item>
        <el-form-item label="房间类型：" prop="roomType">
          <el-select v-uni="actAddFormKey + 'fangjianleixing'" v-model="form.roomType" placeholder="请选择">
            <el-option label="房间" value="1"></el-option>
            <el-option label="病房" value="2"></el-option>
            <el-option label="诊室" value="3"></el-option>
            <el-option label="检查室" value="4"></el-option>
            <el-option label="窗口" value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-uni="actAddKey + 'cancel'" @click="dialogFormVisible = false;addVis = false">取 消</el-button>
        <el-button v-uni="actAddKey + 'save'" type="primary" @click="onSubmit(form,'add')" :loading="addVis">确 认</el-button>
      </div>
    </el-dialog>

    <!--批量新增房间对话框-->
    <el-dialog title="批量添加房间" :visible.sync="addRoomVis" width="580px" :show-close="false" :close-on-click-modal="false">
      <el-form :rules="rules" :model="fromBatch" label-width="140px" ref="addMoreForm" class="typt-add-dialog">
        <el-form-item label="房间名前缀：" prop="roomNamePro">
          <el-input placeholder="请输入" v-model="fromBatch.roomNamePro" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="房间数量：" prop="roomCount">
          <el-input placeholder="请输入" v-model="fromBatch.roomCount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="房间名显示位数：" prop="digitNumber">
          <el-input v-if="isShowFlag" placeholder="请输入" disabled v-model="fromBatch.digitNumber" autocomplete="off"></el-input>
          <el-input v-else placeholder="请输入" v-model="fromBatch.digitNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门：" prop="deptBatchDeptId" v-if="deptShowVis">
          <el-select v-model="fromBatch.deptBatchDeptId" placeholder="请选择" filterable>
            <el-option v-for="item in dataDeptInfoList" :label="item.deptName" :value="item.deptId" :key="item.deptId"></el-option>
          </el-select>
          <!--
                    <treeselect class="deptAddCls" placeholder="请选择部门" v-model="fromBatch.deptBatchDeptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :options="defaultDeptIdOp" noChildrenText="无子节点"/>
          -->
        </el-form-item>
        <el-form-item label="所属区域：" class="deptAddCls" prop="region" >
          <treeselect :disable-branch-nodes="true" :default-expand-level="10" noResultsText="无匹配数据" placeholder="请选择" v-model="fromBatch.region" noOptionsText="暂无数据" :options="defaultRegionOp" noChildrenText="无子节点">
            <div slot="value-label" slot-scope="{ node }">{{ node.raw.allName }}</div>
          </treeselect>
        </el-form-item>
        <el-form-item label="房间类型：" prop="roomBatchType">
          <el-select v-model="fromBatch.roomBatchType" placeholder="请选择">
            <el-option label="房间" value="1"></el-option>
            <el-option label="病房" value="2"></el-option>
            <el-option label="诊室" value="3"></el-option>
            <el-option label="检查室" value="4"></el-option>
            <el-option label="窗口" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="空位补'0'：">
          <el-switch v-model="fromBatch.setZero" @change="changeShow"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoomVis = false;addVis = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitBatch(fromBatch,'add')" :loading="addVis">确 认</el-button>
      </div>
    </el-dialog>
    <!--关联区域对话框-->
    <el-dialog title="关联区域" :visible.sync="relationFormVisible" :show-close="false" :close-on-click-modal="false" width="490px">
      <el-form :rules="rules_relation" :model="relationData" label-width="100px" ref="relationForm" class="typt-add-dialog">
        <el-form-item label="所属区域：" class="deptAddCls" prop="region" >
          <treeselect :disable-branch-nodes="true" :default-expand-level="10" noResultsText="无匹配数据" placeholder="请选择" v-model="relationData.region" noOptionsText="暂无数据" :options="defaultRegionOp" noChildrenText="无子节点">
            <div slot="value-label" slot-scope="{ node }">{{ node.raw.allName }}</div>
          </treeselect>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="relationFormVisible = false;addVis = false">取 消</el-button>
        <el-button type="primary" @click="saveRelationData()" :loading="addVis">确 认</el-button>
      </div>
    </el-dialog>
    <!----排序------>
    <el-dialog custom-class="bedDialog" title="排序" :visible.sync="sortVisible" width="780px" :close-on-click-modal="false" @close="reloadData">
      <sort v-if="sortVisible" :typeStr="'room'" :deptId="formSearchData.deptId"></sort>
    </el-dialog>
  </div>
</template>

<script>
import RoomOrBed from '../../../assets/passport/mixins/RoomOrBed'
import { AxiosApi } from '../../../api/passport/http'
import { $getLocationsTree } from '../../../api/passport/region/regionApi'
import { ResultMsg, MsgShow } from '../../../assets/passport/js/Message'
import PageInfo from '../../../components/passport/PageInfo'
import SortType from '../../../components/passport/SortType'
import Sort from '../../../components/passport/Sort'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'roomsList',
  components: {
    PageInfo, Treeselect, Sort, SortType
  },
  mixins: [RoomOrBed],
  inject: ['checkMoreAuthority'],
  data () {
    let validateCount = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error('请输入正整数'))
      } else if (parseInt(value) < 1) {
        callback(new Error('房间数量至少为1位！'))
      } else if (parseInt(value) > 9999) {
        callback(new Error('房间数量不能大于9999位！'))
      } else {
        callback()
      }
    }
    let validateRoomCount = (rule, value, callback) => {
      if (value.length > 14) {
        callback(new Error('房间名称不能超过14位！'))
      } else {
        callback()
      }
    }
    return {
      tableVis: true,
      ORG_TYPE: window.GLOBAL_CONFIG.ORG_TYPE || '',
      orderBy: [{
        id: 'createTime desc',
        label: '创建时间降序'
      },
      {
        id: 'createTime asc',
        label: '创建时间升序'
      },
      {
        id: 'roomName desc',
        label: '房间名称降序'
      }, {
        id: 'roomName asc',
        label: '房间名称升序'
      }],
      sortVisible: false,
      relationData: {
        region: null
      },
      relationFormVisible: false,
      multipleSelection: [],
      isShowFlag: true,
      value: '',
      dialogFormVisible: false,
      addRoomVis: false,
      form: {
        roomNamePro: '',
        name: '',
        region: null,
        editCheckedDept: null,
        roomType: '',
        roomId: ''
      },
      fromBatch: {
        deptBatchDeptId: null,
        roomNamePro: '',
        roomCount: '',
        region: null,
        digitNumber: '',
        roomBatchType: '',
        setZero: false
      },
      dataTree: [],
      checkedDept: null,
      inputName: '',
      editType: '',
      checkSt: true,
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      temData: [],
      depData: [],
      depBatchData: [],
      roomTypeNum: {
        '房间': 1,
        '病房': 2,
        '诊室': 3,
        '检查室': 4,
        '窗口': 5
      },
      orgLevel: '',
      selectedDeptID: null,
      defaultDeptIdOp: [],
      defaultRegionOp: [],
      dataDeptInfoList: [],
      regionObj: {},
      modelName: '房间',
      dialogTitle: '添加房间',
      formSearchData: {
        roomName: '',
        deptId: null,
        area: null
      },
      formSearchDataStatic: {
        pageHelper: '1'
      },
      url: '/ifms/web-org/rooms',
      defaultDeptId: '',
      deptShowVis: false,
      rules: {
        roomNamePro: [
          { message: '房间名前缀长度不能超过10个字符！', trigger: 'blur', pattern: /^.{0,10}$/ }
        ],
        roomCount: [
          { required: true, message: '请输入房间数量', trigger: 'blur' },
          { pattern: /^[1-9][0-9]*$/, message: '请输入正整数！', trigger: 'blur' },
          { validator: validateCount, trigger: 'blur' }
        ],
        digitNumber: [],
        deptBatchDeptId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        roomBatchType: [
          { required: true, message: '请选择房间类型', trigger: 'change' }
        ]
      },
      rules_relation: {
        region: [
          { required: true, message: '请选择区域', trigger: 'change' }
        ]
      },
      rules_room: {
        name: [
          { required: true, message: '请输入房间名称', trigger: 'blur' },
          { validator: validateRoomCount, trigger: 'blur' }
        ],
        editCheckedDept: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        roomType: [
          { required: true, message: '请选择房间类型', trigger: 'change' }
        ]
      },
      authorityArr: ['roomsList_add', 'roomsList_del', 'roomsList_mod', 'room_srot', 'relationRegion'],
      disabled: false,
      actFormKey:  'fangjianguanli__',
      actKey: 'fangjianguanli_',
      actAddFormKey:  'fangjianguanlitianjia__',
      actAddKey: 'fangjianguanlitianjia_'
    }
  },
  mounted: function () {
    // 判断登录应用
    this.getLandingEndCode()
    // 判断是否有动作权限
    this.getListAuthority()
    this.primaryId = 'roomId'
    let orgInfo = JSON.parse(localStorage.getItem('orgInfo')) || []
    this.orgLevel = orgInfo.orgLevel
    let dataDeptInfoList = JSON.parse(localStorage.getItem('dataDeptInfoList')) || []
    this.dataDeptInfoList = dataDeptInfoList
    let obj = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    let empId = obj.deptId || ''
    this.defaultDeptId = empId
    this.queryRegion()
    if (this.ORG_TYPE === 3) {
      this.deptShowVis = true
      this.rules['region'] = [
        { required: true, message: '请选择区域', trigger: 'change' }
      ]
      this.rules_room['region'] = [
        { required: true, message: '请选择区域', trigger: 'change' }
      ]
    }
    this.getDeptList()
  },
  methods: {
    // 排序刷新
    reloadData () {
      this.sortVisible = false
      this.getData()
    },
    // 获取row-key
    getRowKey (row) {
      return row.roomId
    },
    // 关联区域
    relation () {
      if (this.multipleSelection.length < 1) {
        MsgShow('warning', '请选择至少一条房间信息！')
        return false
      }
      this.relationFormVisible = true
    },
    // 保存关联信息
    saveRelationData () {
      this.$refs['relationForm'].validate((valid) => {
        if (valid) {
          let ids = ''
          this.multipleSelection.forEach((item) => {
            ids += item.roomId + ','
          })
          AxiosApi('/ifms/web-org/rooms/area', {
            roomIds: ids.substring(0, ids.length - 1),
            locationId: this.relationData.region
          }, 'PUT').then(res => {
            ResultMsg(res, '关联区域', this.reloadMain)
          })
        }
      })
    },
    // 排序
    sort () {
      this.sortVisible = true
    },
    // 房间显示位数切换
    changeShow () {
      if (this.fromBatch.setZero === true || this.fromBatch.setZero === 'true') {
        this.isShowFlag = false
        let validateNum = (rule, value, callback) => {
          if (isNaN(value)) {
            callback(new Error('请输入正整数'))
          } else if (parseInt(value) > 14) {
            callback(new Error('房间显示位数不能大于14位！'))
          } else {
            callback()
          }
        }
        this.rules.digitNumber = [
          { required: true, message: '请输入房间名显示位数', trigger: 'blur' },
          { pattern: /^[1-9][0-9]*$/, message: '请输入正整数！', trigger: 'blur' },
          { validator: validateNum, trigger: 'blur' }
        ]
      } else {
        this.isShowFlag = true
        this.rules.digitNumber = []
      }
      this.$nextTick(() => {
        this.$refs['addMoreForm'].clearValidate()
      })
    },
    formatterArea (row, column) {
      // 根据area id查询所属区域名称
      return this.regionObj[row.area] || ''
    },
    formatterType (row, column) {
      switch (row.roomType) {
        case 1:
          return '房间'
        case 2:
          return '病房'
        case 3:
          return '诊室'
        case 4:
          return '检查室'
        case 5:
          return '窗口'
        default:
          return ''
      }
    },
    getRegionObj () {
      $getLocationsTree({ pageHelper: 1 }).then(res => {
        let temp = res.data.list || []
        temp.forEach((item, index) => {
          this.regionObj[item.locationId] = item.locationName
        })
      })
    },
    queryRegion () {
      $getLocationsTree({}).then(res => {
        let temp = JSON.stringify(res.data.list || [])
        temp = temp.replace(/locationId/g, 'id').replace(/locationName/g, 'label').replace(/,"children":null/g, '')
        this.defaultRegionOp = JSON.parse(temp)
        this.getChild(this.defaultRegionOp)
      })
    },
    // 查找子集
    getChild (data, name = '') {
      data.forEach((item) => {
        item.allName = name + item.label
        this.regionObj[item.id] = item.allName
        if (item.children && item.children.length > 0) {
          this.getChild(item.children, item.allName)
        }
      })
    },

    // 新增房间
    addRoom (type) {
      this.actAddFormKey = 'fangjianguanlitianjia__'
      this.actAddKey = 'fangjianguanlitianjia_'
      this.dialogTitle = '添加房间'
      this.dialogFormVisible = true
      this.editType = type
      this.form.name = ''// 房间名
      this.form.region = null// 区域
      this.form.roomType = ''// 房间类型
      this.form.roomId = ''// 房间id
      this.form.roomNamePro = ''
      // 添加个编辑时共用的部门id，添加前需清空
      this.form.editCheckedDept = null

      // 运维端
      if (this.landingEndCode === 'OPEX') {
        this.form.editCheckedDept = this.formSearchData.deptId
        if (this.formSearchData.deptId && this.formSearchData.deptId !== null) {
          this.disabled = true
        } else {
          this.disabled = false
        }
      } else if (this.ORG_TYPE !== 3) {
        this.form.editCheckedDept = this.defaultDeptId
      }
      this.temData = []
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate()
      })
    },

    addRooms () {
      this.actAddFormKey = 'fangjianguanlitianjia__'
      this.actAddKey = 'fangjianguanlitianjia_'
      this.dialogTitle = '添加房间'
      this.addRoomVis = true
      this.fromBatch.region = null// 区域
      this.fromBatch.roomNamePro = ''
      this.fromBatch.roomCount = ''
      this.fromBatch.digitNumber = ''
      this.fromBatch.roomBatchType = ''
      this.fromBatch.setZero = false
      this.fromBatch.deptBatchDeptId = null
      this.rules.digitNumber = []
      this.isShowFlag = true
      if (this.ORG_TYPE !== 3) {
        this.fromBatch.deptBatchDeptId = this.defaultDeptId
      }
      this.$nextTick(() => {
        this.$refs['addMoreForm'].clearValidate()
      })
    },
    // 编辑房间
    editRoom (row, type) {
      this.actAddFormKey = 'fangjianguanlibianji__'
      this.actAddKey = 'fangjianguanlibianji_'
      this.disabled = false
      this.dialogTitle = '编辑房间'
      this.form.editCheckedDept = row.deptId
      this.dialogFormVisible = true
      this.form.name = row.roomName // 房间名
      this.form.region = row.area // 区域
      this.form.roomType = row.roomType === null ? '' : row.roomType.toString() // 房间类型
      this.form.roomId = row.roomId // 房间id
      this.editType = type
      this.temData.push(row.deptId)
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate()
      })
    },
    // 删除房间
    delRoom (row) {
      this.del(`${this.url}/${row.roomId}`)
    },
    // 提交表单
    onSubmit () {
      if (this.defaultDeptId === '' || this.defaultDeptId === null) {
        MsgShow('warning', '该用户尚未设置部门，请先到用户账号管理中设置用户部门信息！', 5000)
        return false
      }
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          if (this.editType === 'add') {
            this.saveDataDo({
              roomNamePro: this.form.roomNamePro,
              deptId: this.form.editCheckedDept,
              roomName: this.form.name,
              area: this.form.region,
              roomType: this.form.roomType
            }, 'add', {}, false)
          } else if (this.editType === 'edit') {
            this.saveDataDo({
              roomNamePro: this.form.roomNamePro,
              deptId: this.form.editCheckedDept,
              roomId: this.form.roomId,
              roomName: this.form.name,
              area: this.form.region,
              roomType: this.roomTypeNum['' + this.form.roomType] || this.form.roomType
            }, 'modify', {}, false)
          }
        }
      })
    },
    // 刷新页面
    reload () {
      this.formSearchData = this.clearObj(this.formSearchData)
      this.formSearchData.area = null
      // 兼容运维端
      if (this.landingEndCode === 'OPEX') {
        this.formSearchData.deptId = this.deptData[0].id
      }
      this.pageInfo.currentPage = 1
      this.multipleSelection = []
      this.tableVis = false
      this.$nextTick(() => {
        this.tableVis = true
      })
      this.getData()
    },
    onSubmitBatch () {
      if (this.defaultDeptId === '' || this.defaultDeptId === null) {
        MsgShow('warning', '该用户尚未设置部门，请先到用户账号管理中设置用户部门信息！', 5000)
        return false
      }
      let _this = this
      this.$refs['addMoreForm'].validate((valid) => {
        if (valid) {
          this.addVis = true
          AxiosApi('/ifms/web-org/rooms/batch', {
            area: _this.fromBatch.region,
            roomNamePro: _this.fromBatch.roomNamePro,
            deptId: _this.fromBatch.deptBatchDeptId,
            roomType: Number(_this.fromBatch.roomBatchType),
            roomCount: Number(_this.fromBatch.roomCount),
            digitNumber: Number(_this.fromBatch.digitNumber),
            setZero: _this.fromBatch.setZero ? 1 : 0
          }).then(res => {
            ResultMsg(res, `批量添加${this.modelName}`, this.reloadMain)
            if (res.status !== 200) {
              this.addVis = false
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .bedDialog{
    .el-dialog__body{
      height: 500px;
    }
  }
  .bed-room .vue-treeselect__control{
    height: 46px !important;
  }
</style>
