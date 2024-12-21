<template>
  <div class="typt-list-main">
    <div class="typt-list-container">
      <!--查询-->
      <el-form class="typt-list-search" :inline="true" >
        <el-form-item label="床位号：">
          <el-input placeholder="请输入" v-model="formSearchData.bedName" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="orgLevel!==2" class="deptCls" label="部门：">
          <el-select @change="getSearchSelectRoom" v-model="formSearchData.deptId" placeholder="请选择" filterable clearable>
            <el-option v-for="item in dataDeptInfoList" :label="item.deptName" :value="item.deptId" :key="item.deptId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域：" class="deptCls">
          <treeselect @select="getSearchSelectRoom" :default-expand-level="10" noResultsText="无匹配数据" placeholder="请选择" v-model="formSearchData.area" noOptionsText="暂无数据" :options="defaultRegionOp" noChildrenText="无子节点">
            <div slot="value-label" slot-scope="{ node }">{{ node.raw.allName }}</div>
          </treeselect>
        </el-form-item>
        <el-form-item label="所属房间：" prop="roomId">
          <el-select v-model="formSearchData.roomId" placeholder="请选择" filterable clearable>
            <el-option v-for="item in searchRoom" :label="item.roomName" :value="item.roomId" :key="item.index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="typt-search-btn">
            <el-button type="primary"  icon="el-icon-search" @click="onSearchSubmit" size="small">搜索</el-button>
            <el-button type="text" @click="reload">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <!--end-->
      <hr />
      <div class="typt-list-add-div">
        <el-button v-if="authorityObj['bedList_pims_add']" type="warning" size="small" icon="el-icon-plus" @click="addBed('add')">添加</el-button>
        <div class="action_div">
          <sort-type :orderBy="orderBy" @query="queryByOrder" style="float: left"/>
          <!--<el-button v-if="multipleSelection.length===0" type="info" @click="relation()" disabled>关联房间</el-button>
          <el-button v-else type="primary" @click="relation()">关联房间</el-button>-->
          <el-button v-if="authorityObj['bedList_pims_sort']" type="primary" @click="sort()">排序</el-button>
          <!--<el-button type="primary" size="small" @click="addBeds('add')">批量添加</el-button>-->
        </div>
      </div>
      <!--列表-->
      <el-table
        :data="tableData"
        stripe
        v-loading="loading"
        height="80%"
        @selection-change="handleSelectionChange"
        :row-class-name="tableRowClassName"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
<!--        <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>-->
        <el-table-column label="床位号" prop="bedName" align="center"></el-table-column>
        <el-table-column label="所属房间" prop="roomName" align="center"></el-table-column>
        <el-table-column label="状态" prop="display" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.display === 1 ? 'danger' : 'success'"
              disable-transitions
            >{{scope.row.display === 1?'隐藏':'显示'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
        <el-table-column v-if="authorityObj['bedList_pims_mod'] || authorityObj['bedsList_pims_del']" label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button v-if="authorityObj['bedList_pims_mod']" type="text" @click="editBed(scope.row,'edit')">编辑</el-button>
            <el-button v-if="authorityObj['bedsList_pims_del']" type="text" @click="delBed(scope.row)" style="color:#f56f6c">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--end-->
      <!--分页-->
      <!--组件页码显示-->
      <page-info :pageInfo="pageInfo"></page-info>
      <!--end-->
    </div>
    <!--新增床位对话框-->
    <el-dialog :title="dialogTitle" :show-close="false" :visible.sync="dialogFormVisible" width="580px" :close-on-click-modal="false">
      <el-form :rules="rules_bed" :model="form" label-width="100px" ref="addForm" class="typt-add-dialog">
        <el-form-item label="床位号：" prop="bedName">
          <el-input placeholder="请输入" v-model="form.bedName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属部门：" class="deptAddCls" prop="deptId" >
          <el-select v-model="form.deptId" placeholder="请选择" filterable @change="getSelectRoom">
            <el-option v-for="item in dataDeptInfoList" :label="item.deptName" :value="item.deptId" :key="item.deptId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属区域：" class="deptAddCls" prop="area" >
          <treeselect @select="getSelectRoom" :disable-branch-nodes="true" :default-expand-level="10" noResultsText="无匹配数据" placeholder="请选择" v-model="form.area" noOptionsText="暂无数据" :options="defaultRegionOp" noChildrenText="无子节点">
            <div slot="value-label" slot-scope="{ node }">{{ node.raw.allName }}</div>
          </treeselect>
        </el-form-item>
        <el-form-item label="所属房间：" prop="roomId">
          <el-select @change="initArea" v-model="form.roomId" placeholder="请选择" @focus="selectRoom" filterable>
            <el-option v-for="item in regionRoom" :label="item.roomName" :value="item.roomId" :key="item.index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="display">
          <el-radio-group v-model="form.display">
            <el-radio :label="0">显示</el-radio>
            <el-radio :label="1">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false; addVis = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit(form,'add')" :loading="addVis">确 认</el-button>
      </div>
    </el-dialog>

    <!--新增床位对话框-->
    <el-dialog :title="dialogTitle" :visible.sync="addBedsVis" width="580px" :show-close="false" :close-on-click-modal="false">
      <el-form :rules="rules" :model="form" label-width="140px" ref="addMoreForm" class="typt-add-dialog">
        <el-form-item label="床位号前缀：">
          <el-input placeholder="请输入" v-model="form.bedNamePro" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="床位数量：" prop="bedCount">
          <el-input placeholder="请输入" v-model="form.bedCount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="床位号显示位数：" prop="digitNumber">
          <el-input v-if="isShowFlag" placeholder="请输入" disabled v-model="form.digitNumber" autocomplete="off"></el-input>
          <el-input v-else placeholder="请输入" v-model="form.digitNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属部门：" class="deptAddCls" prop="deptId" >
          <el-select v-model="form.deptId" placeholder="请选择" filterable @change="getSelectRoom">
            <el-option v-for="item in dataDeptInfoList" :label="item.deptName" :value="item.deptId" :key="item.deptId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属区域：" class="deptAddCls" prop="area" >
          <treeselect @select="getSelectRoom" :disable-branch-nodes="true" :default-expand-level="10" noResultsText="无匹配数据" placeholder="请选择" v-model="form.area" noOptionsText="暂无数据" :options="defaultRegionOp" noChildrenText="无子节点">
            <div slot="value-label" slot-scope="{ node }">{{ node.raw.allName }}</div>
          </treeselect>
        </el-form-item>
        <el-form-item label="所属房间：" prop="roomId">
          <el-select @change="initArea"  v-model="form.roomId" placeholder="请选择" filterable>
            <el-option v-for="item in regionRoom" :label="item.roomName" :value="item.roomId" :key="item.index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="空位补'0'：">
          <el-switch v-model="form.setZero" @change="changeShow"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBedsVis = false; addVis = false">取 消</el-button>
        <el-button type="primary" @click="onBatchSubmit(form,'add')" :loading="addVis">确 认</el-button>
      </div>
    </el-dialog>

    <!--关联房间-->
    <el-dialog title="关联房间" :visible.sync="roomVisible" width="490px" :close-on-click-modal="false">
      <el-form :rules="rules_room" :model="formRoom" label-width="100px" ref="addRoomForm" class="typt-add-dialog">
        <el-form-item label="所属区域：" class="deptAddCls" prop="region" >
          <treeselect @select="getRelationRoom" :disable-branch-nodes="true" :default-expand-level="10" noResultsText="无匹配数据" placeholder="请选择" v-model="formRoom.region" noOptionsText="暂无数据" :options="defaultRegionOp" noChildrenText="无子节点">
            <div slot="value-label" slot-scope="{ node }">{{ node.raw.allName }}</div>
          </treeselect>
        </el-form-item>
        <el-form-item label="所属房间：" prop="roomId">
          <el-select v-model="formRoom.roomId" placeholder="请选择" @focus="selectRelationRoom" filterable>
            <el-option v-for="item in relationRoom" :label="item.roomName" :value="item.roomId" :key="item.index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roomVisible = false; addVis = false">取 消</el-button>
        <el-button type="primary" @click="saveRoom" :loading="addVis">确 认</el-button>
      </div>
    </el-dialog>
    <!----排序------>
    <el-dialog custom-class="bedDialog" title="排序" :visible.sync="sortVisible" width="780px" :close-on-click-modal="false" @close="reloadMain">
      <sort :typeStr="'bed'"></sort>
    </el-dialog>
  </div>
</template>

<script>
import RoomOrBed from '../../../assets/passport/mixins/RoomOrBed'
import { AxiosApi } from '../../../api/passport/http'
import { ResultMsg, MsgShow } from '../../../assets/passport/js/Message'
import { $getLocationsTree } from '../../../api/passport/region/regionApi'
import SortType from '../../../components/passport/SortType'
import PageInfo from '../../../components/passport/PageInfo'
import Sort from '../../../components/passport/Sort'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'bedsList',
  components: {
    PageInfo, Treeselect, Sort, SortType
  },
  inject: ['checkMoreAuthority'],
  mixins: [RoomOrBed],
  data () {
    let validateCount = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error('请输入正整数'))
      } else if (parseInt(value) < 1) {
        callback(new Error('床位数量至少为1位！'))
      } else if (parseInt(value) > 9999) {
        callback(new Error('床位数量不能大于9999位！'))
      } else {
        callback()
      }
    }
    let validateBedCount = (rule, value, callback) => {
      if (value.length > 14) {
        callback(new Error('床位号不能超过14位！'))
      } else {
        callback()
      }
    }
    return {
      searchRoom: [],
      orderBy: [{
        id: 'createTime desc',
        label: '创建时间降序'
      },
      {
        id: 'createTime asc',
        label: '创建时间升序'
      },
      {
        id: 'bedName desc',
        label: '床位号降序'
      }, {
        id: 'bedName asc',
        label: '床位号升序'
      }],
      sortVisible: false,
      roomVisible: false,
      formRoom: {
        region: null,
        roomId: ''
      },
      multipleSelection: [],
      defaultRegionOp: [],
      addMoreVis: false,
      dialogFormVisible: false,
      addBedsVis: false,
      roomObj: {},
      dataDeptInfoList: [],
      isShowFlag: true,
      regionRoom: [],
      relationRoom: [],
      regionObj: {},
      roomDataObj: {},
      form: {
        deptId: '',
        area: null,
        bedName: '',
        roomName: '',
        roomId: '',
        bedId: '',
        bedNamePro: '',
        bedCount: '',
        digitNumber: '',
        setZero: true,
        display: 0
      },
      dataTree: [],
      checkedDept: '',
      inputName: '',
      editType: '',
      editCheckedDept: '',
      dialogTitle: '添加床位',
      list: [],
      selectedDeptID: null,
      defaultDeptIdOp: [],
      modelName: '床位',
      formSearchData: {
        bedName: '',
        deptId: '',
        area: null,
        roomId: ''
      },
      formSearchDataStatic: {
        pageHelper: '1',
        display: 3
      },
      orgLevel: '',
      url: '/ifms/web-org/beds',
      rules: {
        bedNamePro: [
          { message: '床位号前缀长度不能超过10个字符！', trigger: 'blur', pattern: /^.{0,10}$/ }
        ],
        bedCount: [
          { required: true, message: '请输入床位数量', trigger: 'blur' },
          { pattern: /^[1-9][0-9]*$/, message: '请输入正整数！', trigger: 'blur' },
          { validator: validateCount, trigger: 'blur' }
        ],
        digitNumber: [],
        roomId: [
          { required: true, message: '请选择房间', trigger: 'change' }
        ],
        deptId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        area: [
          { required: true, message: '请选择区域', trigger: 'change' }
        ]
      },
      rules_bed: {
        bedName: [
          { required: true, message: '请输入床位号', trigger: 'blur' },
          { validator: validateBedCount, trigger: 'blur' }
        ],
        roomId: [
          { required: true, message: '请选择房间', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        area: [
          { required: true, message: '请选择区域', trigger: 'change' }
        ],
        display: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      rules_room: {
        roomId: [
          { required: true, message: '请选择房间', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择区域', trigger: 'change' }
        ]
      },
      authorityArr: ['bedList_pims_add', 'bedsList_pims_del', 'bedList_pims_mod', 'bedList_pims_room', 'bedList_pims_more', 'bedList_pims_sort']
    }
  },
  mounted: function () {
    // 判断是否有动作权限
    this.getListAuthority()
    this.primaryId = 'bedId'
    let dataDeptInfoList = JSON.parse(localStorage.getItem('dataDeptInfoList')) || []
    let orgInfo = JSON.parse(localStorage.getItem('orgInfo')) || []
    this.orgLevel = orgInfo.orgLevel
    this.dataDeptInfoList = dataDeptInfoList
    this.onSearchSubmitDefault()
    this.queryRegion()
  },
  methods: {
    // 返显区域
    initArea () {
      let obj = this.roomDataObj[this.form.roomId] || {}
      if (obj.area) {
        this.form.area = obj.area
      } else {
        this.form.area = null
      }
    },
    // 查询区域下房间
    getSearchSelectRoom () {
      this.$nextTick(() => {
        this.formSearchData.roomId = ''
        AxiosApi('/ifms/web-org/rooms', {}, 'GET', {
          pageHelper: '2',
          deptId: this.formSearchData.deptId,
          area: this.formSearchData.area
        }).then(res => {
          let data = res.data
          this.searchRoom = data
        })
      })
    },
    // 查询区域下房间
    getSelectRoom (act) {
      if (act && act !== 'modify') {
        this.form.roomId = ''
      }
      this.$nextTick(() => {
        AxiosApi('/ifms/web-org/rooms', {}, 'GET', {
          pageHelper: '2',
          deptId: this.form.deptId,
          area: this.form.area
        }).then(res => {
          let data = res.data
          data.forEach((item, index) => {
            this.roomObj[item.roomId] = item.roomName
            this.roomDataObj[item.roomId] = item
          })
          this.regionRoom = data
        })
      })
    },
    // 关联房间下的房间
    getRelationRoom () {
      this.formRoom.roomId = ''
      this.$nextTick(() => {
        AxiosApi('/ifms/web-org/rooms', {}, 'GET', {
          pageHelper: '2',
          area: this.formRoom.region
        }).then(res => {
          let data = res.data
          this.relationRoom = data
        })
      })
    },
    // 关联房间
    relation () {
      if (this.multipleSelection.length < 1) {
        MsgShow('warning', '请选择至少一条床位信息！')
        return false
      }
      this.roomVisible = true
    },
    // 保存关联信息
    saveRoom () {
      this.$refs['addRoomForm'].validate((valid) => {
        if (valid) {
          let ids = ''
          this.multipleSelection.forEach((item) => {
            ids += item.bedId + ','
          })
          AxiosApi('/ifms/web-org/beds/room', {
            bedIds: ids.substring(0, ids.length - 1),
            roomId: this.formRoom.roomId
          }, 'PUT').then(res => {
            ResultMsg(res, '关联房间', () => {
              this.roomVisible = false
              this.onSearchSubmit('page')
            })
          })
        }
      })
    },
    // 排序
    sort () {
      this.sortVisible = true
    },
    // 选择房间
    selectRelationRoom () {
      if (this.formRoom.region === undefined || this.formRoom.region === '' || this.formRoom.region === null) {
        this.$message.warning('请先选择区域！')
      }
    },
    // 选择房间
    selectRoom () {
      if (this.form.deptId === '') {
        this.$message.warning('请先选择部门！')
      }
    },
    queryRegion () {
      $getLocationsTree({}).then(res => {
        let temp = JSON.stringify(res.data.list || [])
        temp = temp.replace(/locationId/g, 'id').replace(/locationName/g, 'label').replace(/,"children":null/g, '')
        this.defaultRegionOp = JSON.parse(temp)
        this.getChild(this.defaultRegionOp)
        this.onSearchSubmit()
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
    // 房间显示位数切换
    changeShow () {
      if (this.form.setZero === true || this.form.setZero === 'true') {
        this.isShowFlag = false
        let validateNum = (rule, value, callback) => {
          if (isNaN(value)) {
            callback(new Error('请输入正整数'))
          } else if (parseInt(value) > 14) {
            callback(new Error('床位显示位数不能大于14位！'))
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
    // 查询部门下房间
    onSearchSubmitDefault () {
      // 获取部门id
      AxiosApi('/ifms/web-org/rooms', {}, 'GET', {
        pageHelper: '2'
      }).then(res => {
        let data = res.data
        data.forEach((item, index) => {
          this.roomObj[item.roomId] = item.roomName
        })
      })
    },

    // 格式转化
    formatterArea (row, column) {
      return this.roomObj[row.roomId] || ''
    },
    // 新增房间
    addBed (type) {
      this.dialogTitle = '添加床位'
      this.dialogFormVisible = true
      this.editType = type
      this.form.bedId = ''
      this.form.bedName = ''
      this.form.deptId = ''
      this.form.area = null
      this.form.roomId = ''
      this.form.display = 0
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate()
      })
    },
    addBeds () {
      this.dialogTitle = '添加床位'
      this.addBedsVis = true
      this.bedNamePro = ''
      this.form.bedCount = ''
      this.form.area = null
      this.form.deptId = ''
      this.form.digitNumber = ''
      this.form.setZero = false
      this.form.roomId = ''
      this.rules.digitNumber = []
      this.isShowFlag = true
      this.$nextTick(() => {
        this.$refs['addMoreForm'].clearValidate()
      })
    },
    // 编辑房间
    editBed (row, type) {
      this.dialogTitle = '编辑床位'
      this.editType = type
      this.dialogFormVisible = true
      this.form.bedId = row.bedId
      this.form.bedName = row.bedName
      this.form.roomId = row.roomId
      this.form.area = row.area
      this.form.deptId = row.deptId
      this.form.display = row.display
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate()
      })
      this.getSelectRoom('modify')
    },

    // 删除房间
    delBed (row) {
      this.del(`${this.url}/${row.bedId}`)
    },
    // 提交表单
    onSubmit (form) {
      let _this = this
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          let remark = JSON.stringify({
            type: this.form.remark,
            val: this.form.remark === 1 ? this.form.area : this.form.deptId
          })
          if (this.editType === 'add') {
            this.saveDataDo({
              roomId: _this.form.roomId,
              bedName: form.bedName,
              roomName: _this.roomObj[_this.form.roomId] || '',
              remark: remark,
              display: _this.form.display
            }, 'add', {}, false)
          } else if (this.editType === 'edit') {
            this.saveDataDo({
              roomId: _this.form.roomId,
              roomName: _this.roomObj[_this.form.roomId] || '',
              bedId: _this.form.bedId,
              bedName: _this.form.bedName,
              remark: remark,
              display: _this.form.display
            }, 'modify', {}, false)
          }
        }
      })
    },
    onBatchSubmit (from) {
      let _this = this
      this.$refs['addMoreForm'].validate((valid) => {
        if (valid) {
          this.addVis = true
          let remark = JSON.stringify({
            type: this.form.remark,
            val: this.form.remark === 1 ? this.form.area : this.form.deptId
          })
          AxiosApi('/ifms/web-org/beds/batch', {
            bedNamePro: _this.form.bedNamePro,
            roomId: _this.form.roomId,
            bedCount: Number(_this.form.bedCount),
            digitNumber: Number(_this.form.digitNumber),
            remark: remark,
            setZero: _this.form.setZero ? 1 : 0
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
</style>
