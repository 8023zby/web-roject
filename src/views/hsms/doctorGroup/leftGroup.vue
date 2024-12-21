<template>
  <div class="page-aside-main" v-loading="loading">
    <div class="left-aside">
      <div class="l-title">医疗分组</div>
      <div class="l-action">
        <el-button type="warning" icon="el-icon-plus" @click="showdialog(null, null,'Add')">添加</el-button>
      </div>
      <div class="l-content">
        <div class="ward-left-tree">
          <!-- tree -->
          <el-tree
            ref="SlotTree"
            :data="treeData"
            :props="defaultProps"
            :expand-on-click-node="false"
            :default-expand-all="true"
            @node-click="handleNodeClick"
            highlight-current
            :node-key="nodeKey"
          >

            <div class="comp-tr-node" slot-scope="{ node, data }">
              <!-- 名称: 新增节点增加class（is-new） -->
              <div class="comp-tr-node--name">{{ node.label }}</div>
              <!-- 按钮 -->
              <div class="comp-tr-node--btns">
                <!-- 新增 -->
                <span style="margin:0 10px 0 0" @click="showdialog(node, data,'Add')">
                  <i class="el-icon-plus"></i>
                </span>
                <!-- 编辑 -->
                <span style="margin:0 10px 0 0" @click="showdialog(node, data,'Edit')">
                  <i class="el-icon-edit-outline"></i>
                </span>
                <!-- 删除 -->
                <span @click="handleDelete(node, data)">
                  <i class="el-icon-delete"></i>
                </span>
              </div>
            </div>
          </el-tree>
          <!--添加树-->
          <el-dialog
            :title="treeForm.T === 'Add' ? '添加' : '编辑'"
            :visible.sync="dialogFormGroupVisible"
            :close-on-click-modal=false
            :close-on-press-escape=false
            :show-close="false"
            class="doctorGroupDialog"
            width="780px">
            <el-form
              label-width="90px"
              label-suffix=":"
              ref="treeForm"
              :rules="rules"
              :model="treeForm"
            >
              <el-form-item label="类型" prop="groupType">
                <el-radio-group v-model="treeForm.groupType" @change="handlerTouch">
                  <el-radio :label="1">分组信息</el-radio>
                  <el-radio :label="2">医生信息</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="分组名称" prop="groupName" v-show="treeForm.groupType===1">
                <el-input
                  style="width: 300px"
                  v-model="treeForm.groupName"
                  autocapitalize="off"
                  maxlength="10"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="医生姓名" prop="userId" v-show="treeForm.groupType===2">
                <el-select
                  style="width: 300px;"
                  v-model="treeForm.userId"
                  placeholder="请选择"
                  filterable
                  clearable>
                  <el-option
                    v-for="(item, index) in userData"
                    :key="index"
                    :label="item.empName"
                    :value="item.empId"/>
                </el-select>
              </el-form-item>

              <el-form-item label="值班类别" prop="dutyType" v-show="treeForm.groupType === 2">
                <el-checkbox v-model="treeForm.dutyType" :true-label="1" false-label="">一线</el-checkbox>
                <el-checkbox v-model="treeForm.dutyType" :true-label="2" false-label="">二线</el-checkbox>
                <el-checkbox v-model="treeForm.dutyType" :true-label="3" false-label="">三线</el-checkbox>
              </el-form-item>
              <el-form-item :label="treeForm.modelType==='BED'?'床位列表':'房间列表'" v-show="treeForm.groupType === 2">
                <bed-list
                  :srcData="treeForm.modelType==='BED'?bedListData:roomListData"
                  :disabledBedRoom="disabledBedRoom"
                  :checkData="checkData"
                  ref="bedOrRoomList"
                />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="reset('treeForm')">取消</el-button>
              <el-button type="primary" @click="addForm()" :loading="btnLoading">确认</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { ApiDoctorGroup, GetDoctorByDept, GetModelType, GetBed, GetRoom } from '../../../api/hsms/index'
import BedList from './BedList'

export default {
  name: 'component-tree',
  components: {
    'bed-list': BedList
  },
  data () {
    const validateGroupName = (rule, value, callback) => {
      if (this.treeForm.groupType === 1 && value === '') {
        callback(new Error('分组名称不能为空'))
      } else if (value.length > 10) {
        callback(new Error('最多可输入10个字符'))
      } else {
        callback()
      }
    }
    const validateUserId = (rule, value, callback) => {
      if (this.treeForm.groupType === 2 && value === '') {
        callback(new Error('医生姓名不能为空'))
      } else {
        callback()
      }
    }
    return {
      loading: false, // 是否加载
      btnLoading: false,
      treeData: [],
      defaultProps: {
        children: 'childs',
        label: 'groupName',
        id: 'id'
      },
      nodeKey: 'id', // id对应字段
      maxLevel: 5, // 设定最大层级
      startId: null,
      dialogFormGroupVisible: false,
      treeForm: {
        groupType: 1, // 分组类型
        groupName: '',
        userId: '', // 用户id
        groupParentId: 0, // 父级id
        dutyType: '', // 值班类别
        modelType: 'BED',
        dataList: '', // 床位id字符串
        level: 1,
        T: 'Add'
      },
      treeFormBack: {
        groupType: 1, // 分组类型
        groupName: '',
        userId: '', // 用户id
        groupParentId: 0, // 父级id
        dutyType: '', // 值班类别
        modelType: 'BED',
        dataList: '', // 床位id字符串
        level: 1,
        T: 'Add'
      },
      userData: [], // 医生姓名
      roomListData: [],
      bedListData: [],
      disabledBedRoom: '', // 已经选过的所有床位
      checkData: '', // 当前节点需要返显的床位
      cudata: {
        _node: [],
        _data: []
      },
      rules: {
        groupName: [
          { required: true, validator: validateGroupName, trigger: 'blur' }
        ],
        userId: [
          { required: true, validator: validateUserId, trigger: 'blur' }
        ]
      }

    }
  },
  created () {
    this.getTreeData()
    this.getUser()
    this.getModelType()
  },
  methods: {
    // 获取左侧树结构
    getTreeData () {
      this.loading = true
      ApiDoctorGroup.selectTree().then(res => {
        this.treeData = res.data || []
        this.loading = false
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    handlerTouch (val) {
      this.$refs.treeForm.clearValidate()
      this.treeForm.groupType = val
      this.treeForm.userId = ''
      this.treeForm.groupName = ''
      this.treeForm.dutyType = ''
    },
    handleNodeClick (data, node, self) {
      let id = data.id
      this.$emit('option-changed', this.treeForm.modelType, id)
    },
    // 获取用户
    getUser () {
      GetDoctorByDept().then(res => {
        this.userData = res
        this.getTempDoc()
      })
    },
    getTempDoc () { // 获取手动添加的医生
      ApiDoctorGroup.apiTempDoc({ orgId: this.orgId, deptId: this.deptId }).then(res => {
        if (res.status === 200) {
          let _temp = JSON.parse(JSON.stringify(this.userData))
          this.userData = []
          this.userData = _temp.concat(res.data)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 获取管房管床模式
    getModelType () {
      GetModelType('DOCTOR').then(res => {
        if (res === null) {
          res = {}
        }
        this.treeForm.modelType = res.nurseMode || 'BED'
        this.$emit('option-changed', this.treeForm.modelType, '')
        if (this.treeForm.modelType === 'BED') {
          // 获取床位信息
          this.getBed()
        } else {
          // 获取房间信息
          this.getRoom()
        }
      })
    },
    // 获取床位
    getBed () {
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
    // 获取房间
    getRoom () {
      GetRoom().then(res => {
        res.forEach((item, index) => {
          this.roomListData.push({
            objId: item.roomId,
            objName: item.roomName
          })
        })
      })
    },
    // 弹窗
    showdialog (_node, _data, T) {
      const _this = this
      _this.disabledBedRoom = ''
      // dataList为要返显该医生选择的床位/房间
      _this.checkData = ''
      // 先将当前获取的管房还是管床模式覆盖treeFormBack.modelType
      _this.treeFormBack.modelType = _this.treeForm.modelType
      _this.treeForm = JSON.parse(JSON.stringify(_this.treeFormBack))

      // 拿到已经选过的床位/房间
      if (T === 'Edit') {
        // 返显的数据通过接口查询重新获取 ---后台设计如此
        ApiDoctorGroup.selectEdit({ id: _data.id, modelType: this.treeForm.modelType }).then(res => {
          let editData = res.data || {}
          // existList为不能选择的床位/房间
          _this.disabledBedRoom = editData.existList || ''
          // dataList为要返显该医生选择的床位/房间
          _this.checkData = editData.dataList || ''
          _this.treeForm.id = editData.id || ''
          _this.treeForm.groupName = editData.groupName || ''
          _this.treeForm.groupType = editData.groupType === null ? 1 : editData.groupType
          // userId 里面存放的值 只有是在医生类型的时候存放的是医生id，在分组类型的时候放的是分组id---后台设计如此
          _this.treeForm.userId = editData.groupType === 2 ? editData.userId : ''
          _this.treeForm.dutyType = editData.dutyType || ''
          _this.treeForm.level = editData.level === null ? 1 : editData.level
          _this.treeForm.T = T
          _this.cudata._node = _node
          _this.cudata._data = _data
          this.getUser()
          _this.dialogFormGroupVisible = true
        }).catch((res) => {
          this.$message.error(res.message)
        })
      } else {
        this.treeForm.level = _node ? _node.level + 1 : 1
        if (_node && _node.level >= _this.maxLevel) {
          _this.$message.warning('当前已达到' + this.maxLevel + '级，无法新增！')
          return false
        }
        // 查询不能选择的床位/房间
        ApiDoctorGroup.selectAdd({ modelType: this.treeForm.modelType }).then(res => {
          let editData = res.data || ''
          _this.disabledBedRoom = editData
          _this.checkData = null
          _this.treeForm.T = T
          _this.cudata._node = _node
          _this.cudata._data = _data
          _this.dialogFormGroupVisible = true
        }).catch((res) => {
          this.$message.error(res.message)
        })
      }
    },
    addForm () {
      this.btnLoading = true
      this.$refs.treeForm.validate((valid) => {
        if (valid) {
          // 将选择的床位信息整合为字符串形式
          this.treeForm.dataList = this.treeForm.groupType === 2 && this.$refs['bedOrRoomList'].checkAllData.length > 0 ? this.$refs['bedOrRoomList'].checkAllData.join(',') : ''
          this.treeForm.groupParentId = this.cudata._data && this.cudata._data.id ? this.cudata._data.id : 0
          // 判断一下当前的医生是不是新增的
          if (this.treeForm.groupType === 2) {
            let _newDoc = this.userData.filter(item => {
              if (item.empId === this.treeForm.userId) {
                return item
              }
            })

            if (_newDoc.length === 0) { // 说明是新输入的医生
              this.treeForm.temporaryType = 0
            } else {
              this.treeForm.temporaryType = 1
            }

            if (this.treeForm.temporaryType === 0) {
              this.treeForm.groupName = this.treeForm.userId
            }
          }

          ApiDoctorGroup.save(this.treeForm).then(() => {
            this.$message.success('保存正确！')
            this.dialogFormGroupVisible = false
            this.getTreeData()// 更新左侧树
            this.$emit('updateDoctorList')// 更新右侧列表信息
          }).catch(res => {
            this.dialogFormGroupVisible = false
            this.$message.error(res.message)
          }).finally(() => {
            this.btnLoading = false
          })
        } else {
          this.btnLoading = false
          return false
        }
      })
    },
    handleDelete (_node, _data) {
      // 删除节点
      // 判断是否存在子节点
      if (_data.childs && _data.childs.length !== 0) {
        this.$message.error('此节点有子级，不可删除！')
        return false
      } else {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(res => {
            ApiDoctorGroup.delete({ id: _data.id }).then(res => {
              this.$message.success('删除成功！')
              this.getTreeData()
              this.getUser()
              this.$emit('updateDoctorList')// 更新右侧列表信息
            }).catch((res) => {
              this.$message.error(res)
            })
          })
      }
    },
    // 重置
    reset () {
      this.$nextTick(() => {
        this.checkData = ''
        this.disabledBedRoom = ''
        this.$refs.treeForm.resetFields()
        this.dialogFormGroupVisible = false
      })
    }
  }
}
</script>
<style lang="scss" type="text/scss" scoped>
  .page-aside-main {
    width: 306px;
    height: 100%;
    border-right: 1px solid #e6e6e6;
    -webkit-transition: width .25s;
    transition: width .25s;

    .left-aside {
      width: 100%;
      height: 100%;
      // 标题样式
      .l-title {
        height: 36px;
        line-height: 36px;
        padding-left: 10px;
        color: #1E87F0;
        font-size: 16px;
        border-bottom: 1px solid rgba(241, 241, 241, 1);
      }

      // 动作按钮
      .l-action {
        padding: 10px;

        /deep/ .el-button {
          width: 70px;
          height: 28px;
          line-height: 28px;
          font-size: 14px;
          padding: 0;
          text-align: center;
        }
      }

      // 左侧内容
      .l-content {
        width: 100%;
        height: calc(100% - 100px);
        overflow: hidden;
        /*宣教左侧分类列表样式 =========== START*/
        .ward-left-tree {
          width: 100%;
          height: 100%;
          overflow-y: auto;

          /deep/ .el-tree {
            .el-tree-node {
              .el-tree-node__content {
                align-items: center;
                height: 36px;

                .el-tree-node__expand-icon:not(.is-leaf) {
                  color: #1E87F0;
                  font-size: 12px;
                }

                .comp-tr-node {
                  display: flex;
                  align-items: baseline;

                  .comp-tr-node--name {
                    max-width: 140px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }

                  .comp-tr-node--btns {
                    color: #1E87F0;
                    margin-left: 12px;
                    opacity: 0;
                    transition: opacity 0.1s;
                  }
                }
              }

              .el-tree-node__content:hover {
                box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.14);

                .comp-tr-node--btns {
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
  }

  .doctorGroupDialog {

    /deep/ .el-dialog {
      .el-dialog__body {
        padding-left: 7px !important;
      }

      .el-form-item {
        .el-form-item__label, .el-form-item__content {
          line-height: 46px;
        }
      }
    }
  }
</style>
