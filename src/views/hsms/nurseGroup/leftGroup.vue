<template>
  <div class="page-aside-main" v-loading="loading">
    <div class="left-aside">
      <div class="l-title">护理分组</div>
      <div class="l-action">
        <el-button type="warning" icon="el-icon-plus" @click="showdialog(null, null,'Add')">添加</el-button>
      </div>
      <div class="l-content">
        <div class="ward-left-tree">
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
            :destroy-on-close="true"
            :close-on-press-escape=false
            :show-close="false"
            class="doctorGroupDialog"
            width="780px">
            <el-form label-width="90px" label-suffix=":" ref="treeForm" :rules="rules" :model="treeForm">
              <el-form-item label="类型" prop="groupType">
                <el-radio-group v-model="treeForm.groupType" @change="handlerTouch">
                  <el-radio :label="0">分组信息</el-radio>
                  <el-radio :label="1">护士信息</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="分组名称" prop="groupName" v-show="treeForm.groupType===0">
                <el-input style="width: 300px" v-model="treeForm.groupName" autocapitalize="off" maxlength="10" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="护士姓名" prop="userId" v-show="treeForm.groupType===1">
                <el-select
                  style="width: 300px;"
                  v-model="treeForm.userId"
                  @change="changeTime(treeForm)"
                  placeholder="请选择"
                  filterable
                  clearable>
                  <el-option
                    v-for="(item, index) in userData"
                    :key="index"
                    :disabled="JSON.stringify(selectedDataNurse).indexOf(item.empId) > -1"
                    :label="item.empName"
                    :value="item.empId"/>
                </el-select>
              </el-form-item>

              <el-form-item label="排班时间" v-show="treeForm.groupType===1 && switchHlfzSetting === 1">
                <el-date-picker
                  style="width: 150px"
                  v-model="treeForm.classesTime"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  @change="changeTime(treeForm)"
                  placeholder="请选择">
                </el-date-picker>
              </el-form-item>

              <el-form-item label="责任组长" v-show="treeForm.groupType===1">
                <el-switch v-model="treeForm.ifLeader" :inactive-value="0" :active-value="1" />
              </el-form-item>

              <el-form-item label="床位列表">
                <bed-list
                  :srcData="bedListData"
                  :disabledBedRoom="disabledBedRoom"
                  :checkData="checkData"
                  ref="bedList"
                />
              </el-form-item>

              <el-form-item label="房间列表">
                <bed-list
                  :srcData="roomListData"
                  :disabledBedRoom="disabledBedRoom"
                  :checkData="checkRoomData"
                  ref="roomList"
                />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="reset('treeForm')">取消</el-button>
              <el-button type="primary" @click="addForm()" :loading="btnLoading">确定</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

import { ApiNurseGroup, GetNurseUser, GetBed, GetRoom } from '../../../api/hsms/index'
import BedList from './BedList'

export default {
  name: 'component-tree',
  props: {
    switchHlfzSetting: {
      type: Number,
      default: 0
    }
  },
  components: {
    'bed-list': BedList
  },
  data () {
    const validateGroupName = (rule, value, callback) => {
      if (this.treeForm.groupType === 0 && value === '') {
        callback(new Error('分组名称不能为空'))
      } else if (value.length > 10) {
        callback(new Error('最多可输入10个字符'))
      } else {
        callback()
      }
    }
    const validateUserId = (rule, value, callback) => {
      if (this.treeForm.groupType === 1 && value === '') {
        callback(new Error('护士姓名不能为空'))
      } else {
        callback()
      }
    }
    return {
      selectedDataNurse: [],
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
      dialogFormGroupVisible: false,
      treeForm: {
        classesTime: moment().format('YYYY-MM-DD'),
        groupType: 0, // 分组类型
        groupName: '',
        userId: '', // 用户id
        ifLeader: 0, // 责任组长
        groupParentId: 0, // 父级id
        beds: '', // 床位id字符串
        rooms: '',
        level: 1,
        T: 'Add'
      },
      userData: [], // 护士姓名
      roomListData: [],
      bedListData: [],
      disabledBedRoom: '', // 已经选过的所有床位
      checkData: '', // 当前节点需要返显的床位
      checkRoomData: '', // 当前节点需要返显的房间
      cudata: {
        _node: [],
        _data: []
      },
      rules: {
        groupName: [
          { required: true, validator: validateGroupName, trigger: 'blur' }
        ],
        userId: [
          { required: true, validator: validateUserId, trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getTreeData()
    this.getUser()
    this.getRoomAndBed()
    this.getSelectedNurse()
  },
  methods: {
    changeTime (item) {
      ApiNurseGroup.getTimeBeds({ 'nurseId': item.userId, 'classesTime': item.classesTime }).then(res => {
        if (res.data) {
          this.checkRoomData = res.data.rooms
          this.checkData = res.data.beds
        } else {
          this.checkRoomData = ''
          this.checkData = ''
        }
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    getSelectedNurse () {
      ApiNurseGroup.selectedNurse().then(res => {
        this.selectedDataNurse = res.data || []
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    // 获取左侧树结构
    getTreeData () {
      this.loading = true
      ApiNurseGroup.selectTree().then(res => {
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
      this.treeForm.ifLeader = 0
    },
    handleNodeClick (data, node, self) {
      let id = data.id
      this.$emit('option-changed', id)
    },
    // 获取用户
    getUser () {
      this.loading = true
      GetNurseUser().then(res => {
        this.userData = res
        this.loading = false
      })
    },
    getRoomAndBed () { // 获取床和房间数据
      // 获取床位信息
      this.getBed()
      // 获取房间信息
      this.getRoom()
    },
    getBed () { // 获取床位
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
    getRoom () { // 获取房间
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
      // beds为要返显该医生选择的床位/房间
      _this.checkData = ''
      this.checkRoomData = ''

      // 拿到已经选过的床位/房间
      if (T === 'Edit') {
        // 返显的数据通过接口查询重新获取 ---后台设计如此
        ApiNurseGroup.selectEdit({ id: _data.id }).then(res => {
          let editData = res.data || {}
          // // existList为不能选择的床位/房间
          _this.disabledBedRoom = editData.existList || ''
          // // beds为要返显该医生选择的床位/房间
          _this.checkData = editData.beds || ''
          this.checkRoomData = editData.rooms
          _this.treeForm.id = editData.id || ''
          _this.treeForm.groupName = editData.groupName || ''
          _this.treeForm.groupType = editData.groupType === null ? 0 : editData.groupType
          // _this.treeForm.userId = editData.groupType === 1 ? editData.userId : ''
          _this.treeForm.userId = editData.userId || ''
          _this.treeForm.ifLeader = editData.ifLeader || 0
          _this.treeForm.level = editData.level === null ? 1 : editData.level
          _this.treeForm.T = T
          _this.cudata._node = _node
          _this.cudata._data = _data
          _this.dialogFormGroupVisible = true
        }).catch((res) => {
          this.$message.error(res.message)
        })
      } else {
        this.treeForm.level = _node ? _node.level + 1 : 1
        if (_node && _node.level >= _this.maxLevel) {
          _this.$message.warning('当前所在第' + this.maxLevel + '层级，不允许继续添加层级！')
          return false
        }

        _this.cudata._node = _node
        _this.cudata._data = _data

        delete _this.treeForm.id
        this.treeForm.groupName = ''
        this.treeForm.groupType = 0
        this.treeForm.ifLeader = 0
        this.treeForm.beds = ''
        this.treeForm.rooms = ''
        _this.dialogFormGroupVisible = true
      }
    },
    addForm () {
      this.btnLoading = true
      this.$refs.treeForm.validate((valid) => {
        if (valid) {
          // 将选择的床位信息整合为字符串形式
          this.treeForm.beds = this.$refs['bedList'].checkAllData.length > 0 ? this.$refs['bedList'].checkAllData.join(',') : ''
          this.treeForm.rooms = this.$refs['roomList'].checkAllData.length > 0 ? this.$refs['roomList'].checkAllData.join(',') : ''

          if (this.treeForm.id) {
            this.treeForm.groupParentId = this.cudata._data.groupParentId
            ApiNurseGroup.updateNurse(this.treeForm).then(() => {
              this.$message.success('保存正确！')
              this.reset()
              this.dialogFormGroupVisible = false
              this.getTreeData()// 更新左侧树
              this.getSelectedNurse()
              this.$emit('updateNurseList')// 更新右侧列表信息
            }).catch(res => {
              this.dialogFormGroupVisible = false
              this.$message.error(res.message)
            }).finally(() => {
              this.btnLoading = false
            })
          } else {
            this.treeForm.groupParentId = this.cudata._data && this.cudata._data.id ? this.cudata._data.id : 0
            ApiNurseGroup.saveNurse(this.treeForm).then(() => {
              this.$message.success('保存正确！')
              this.reset()
              this.dialogFormGroupVisible = false
              this.getTreeData()// 更新左侧树
              this.getSelectedNurse()
              this.$emit('updateNurseList')// 更新右侧列表信息
            }).catch(res => {
              this.dialogFormGroupVisible = false
              this.reset()
              this.$message.error(res.message)
            }).finally(() => {
              this.btnLoading = false
            })
          }
        } else {
          this.btnLoading = false
          return false
        }
      })
    },
    handleDelete (_node, _data) { // 删除节点
      if (_data.childs && _data.childs.length !== 0) { // 判断是否存在子节点
        this.$message.error('该节点下有子节点，无法进行删除！')
        return false
      } else {
        this.$confirm('确认要进行删除操作吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          ApiNurseGroup.delete({ id: _data.id, userId: _data.userId }).then(res => {
            this.$message.success('删除成功！')
            this.getTreeData()
            this.getSelectedNurse()
            this.$emit('updateNurseList')// 更新右侧列表信息
          }).catch((res) => {
            this.$message.error(res)
          })
        })
      }
    },
    // 重置
    reset () {
      this.$nextTick(() => {
        this.treeForm.classesTime = moment().format('YYYY-MM-DD')
        this.$refs['bedList'].checkAllData = []
        this.$refs['roomList'].checkAllData = []
        this.checkData = ''
        this.checkRoomData = ''
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

                .el-tree-node__expand-icon:is(.is-leaf) {
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
        padding: 0px 15px 15px 7px;
      }

      .el-form-item {
        margin-bottom: 0px;
        .el-form-item__label, .el-form-item__content {
          line-height: 46px;
        }

        .el-input__inner {
          height: 32px;
        }
      }
    }
  }

  /deep/.el-form-item__error {
    position: relative;
  }
  .dialog-footer {
    text-align: center;
  }
</style>
