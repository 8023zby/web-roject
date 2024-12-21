<template>
  <div class="typt-list-main">
    <div class="typt-list-container">
      <el-form class="typt-list-search" :inline="true" >
        <el-form-item label="部门名称：">
          <el-input v-uni="actFormKey + 'bumenmingcheng'" placeholder="请输入" v-model="formSearchData.deptName" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <div class="typt-search-btn">
            <el-button v-uni="actKey + 'search'" type="primary"  icon="el-icon-search" @click="queryNode" size="small">搜索</el-button>
            <el-button v-uni="actKey + 'reset'" type="text" @click="reload">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <hr />
      <div class="typt-list-add-div">
        <el-button v-uni="actKey + 'add'" type="warning" @click="addNode()" icon="el-icon-plus">添加</el-button>
      </div>
      <!--列表-->
      <el-table
        :data="dataTree"
        row-key="deptId"
        v-loading="loading"
        height="90%"
        default-expand-all
      >
        <el-table-column prop="deptName" label="部门名称"></el-table-column>
        <el-table-column prop="deptKey" label="部门编号" align="center"></el-table-column>
        <el-table-column v-if="ipShow" prop="ipStr" :formatter="dealIp" label="IP号段" align="center"></el-table-column>
        <el-table-column v-if="authorityObj['saveDept'] || authorityObj['updateDept'] || (orgLevel === 3 && authorityObj['deleteDept'])"  align="center" label="操作" width="350">
          <template slot-scope="scope">
            <el-button v-uni="actKey + 'add_next-' + scope.row.deptId" v-if="scope.row.level<3 && authorityObj['saveDept']" type="text"  @click="() => append(scope.row, 1)">
              添加下一级
            </el-button>
            <el-button v-uni="actKey + 'edit-' + scope.row.deptId" v-if="authorityObj['updateDept']" type="text" @click="() => edit(scope.row)">
              编辑
            </el-button>
            <el-button v-uni="actKey + 'add-' + scope.row.deptId" v-if="authorityObj['saveDept']" type="text" @click="() => append(scope.row, 0)">
              添加
            </el-button>
            <el-button v-uni="actKey + 'delete-' + scope.row.deptId" v-if="orgLevel === 3 && authorityObj['deleteDept']" type="text" @click="() => remove(scope.row)" class="el-text-danger">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--<div class="departConfig">
       <el-tree :data="dataTree" node-key="id" default-expand-all :props="defaultProps" :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <el-button v-if="hasData&&node.level<3" type="text"  @click="() => appendChild(node, data)">
                  添加下一级
                </el-button>
                <el-button v-if="hasData" type="text" @click="() => edit(node,data)">
                  编辑
                </el-button>
                <el-button type="text" @click="() => append(node,data)">
                  添加
                </el-button>
                &lt;!&ndash;<el-button v-if="hasData" type="text" @click="() => remove(node,data)" class="el-text-danger">
                  删除
                </el-button>&ndash;&gt;
              </span>
            </span>
        </el-tree>
      </div>-->
    </div>
    <!--新增床位对话框-->
    <el-dialog :title="dialogTitle" :show-close="false" :visible.sync="dialogFormVisible" width="580px" :close-on-click-modal="false">
      <el-form v-if="dialogFormVisible" :rules="rules" :model="addFormData" label-width="100px" ref="addForm" class="typt-add-dialog">
        <el-form-item class="ifms-add-input" label="部门名称：" prop="deptName">
          <el-input v-uni="actAddFormKey + 'bumenmingcheng'" placeholder="请输入" v-model="addFormData.deptName" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item class="ifms-add-input" label="部门编号：" prop="deptKey" v-if="deptShowVis">
          <el-input v-uni="actAddFormKey + 'bumenbianhao'" placeholder="请输入" v-model="addFormData.deptKey" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="IP号段：" v-if="ipShow">
          <div class="ifms-ip-div" v-for="(item, index) in ipList" :key="index">
            <el-input v-uni="actAddFormKey + 'ipStart' + index" placeholder="请输入" v-model="item.startIp" autocomplete="off" clearable></el-input>
            &nbsp;至&nbsp;
            <el-input v-uni="actAddFormKey + 'ipEnd' + index" placeholder="请输入" v-model="item.endIp" autocomplete="off" clearable></el-input>
            <div class="ifms-ip-btn">
              <i class="el-icon-circle-plus-outline i-add" @click="addItem"></i>
              <i v-if="index !== 0" class="el-icon-remove-outline i-remove" @click="removeItem(index)"></i>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-uni="actAddKey + 'cancel'" @click="dialogFormVisible = false; addVis = false">取 消</el-button>
        <el-button v-uni="actAddKey + 'save'" type="primary" @click="onSubmit()" :loading="addVis">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { ResultMsg, MsgShow } from '../../../assets/passport/js/Message'
import { $getDepartTree, $addDepartTree, $delDepartTree, $departDetails, $editDepart } from '../../../api/passport/departmentApi/departmentApi'
import { AxiosApi } from '../../../api/passport/http'
export default {
  inject: ['checkMoreAuthority'],
  data () {
    return {
      loading: false,
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      dataTree: [],
      orgLevel: '',
      authorityObj: {},
      dialogTitle: '添加部门',
      dialogFormVisible: false,
      deptShowVis: false,
      addVis: false,
      formSearchData: {
        deptName: ''
      },
      rules: {
        deptName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { pattern: /\S/, message: '请输入正确的部门名称！', trigger: 'blur' },
          { max: 10, message: '部门名称长度不能超过10位', trigger: 'blur' }
        ],
        deptKey: [
          { required: true, message: '请输入部门编号', trigger: 'blur' }
        ]
      },
      addFormData: {
        deptName: '',
        deptKey: ''
      },
      tempData: {},
      addLevel: 0,
      authorityArr: ['saveDept', 'updateDept', 'deleteDept'],
      ipList: [{
        startIp: '',
        endIp: ''
      }],
      ipShow: false,
      actFormKey: 'bumenpeizhi__',
      actKey: 'bumenpeizhi_',
      actAddFormKey: 'bumenpeizhitianjia__',
      actAddKey: 'bumenpeizhitianjia_'
    }
  },
  mounted: function () {
    // 判断是否有动作权限
    this.getListAuthority()
    let orgInfo = JSON.parse(localStorage.getItem('orgInfo')) || []
    this.orgLevel = orgInfo.orgLevel
    this.queryNode()
    // 养老想用
    // if (this.orgLevel === 2) {
    this.deptShowVis = true
    // }
    if (this.orgLevel === 2) {
      this.ipShow = true
    }
  },
  methods: {
    // 处理ip号段显示
    dealIp (row) {
      const ipNum = row.ipNum || ''
      let str = ''
      if (ipNum && ipNum !== null) {
        const arr = JSON.parse(ipNum)
        arr.forEach(val => {
          str += val.startIp + '-' + val.endIp + ','
        })
        str = str.substr(0, str.length - 1)
      }
      return str
    },
    // 添加ip号段
    addItem () {
      this.ipList.push({
        startIp: '',
        endIp: ''
      })
    },
    // 删除ip号段
    removeItem (index) {
      this.ipList.splice(index, 1)
    },
    // 请求列表中动作权限
    getListAuthority () {
      this.authorityObj = this.checkMoreAuthority(this.authorityArr)
    },
    // 重置
    reload () {
      this.formSearchData.deptName = ''
      this.queryNode()
    },
    // 节点查询
    queryNode () {
      let _this = this
      let obj = {}
      if (this.formSearchData.deptName) {
        obj = this.formSearchData
      }
      _this.dataTree = []
      $getDepartTree(obj).then(res => {
        if (res.data.list === null) {
          res.data.list = []
        }
        _this.dataTree = res.data.list
      }).catch(() => {
        this.$message.error('数据获取失败')
      })
    },
    // 保存数据
    onSubmit () {
      let ipNum = ''
      if (this.ipList.length === 1 && this.ipList[0].startIp === '' && this.ipList[0].endIp === '') {
        ipNum = ''
      } else {
        let temp = this.ipList
        let flag = false
        let ipFlag = false
        let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].startIp === '' || temp[i].endIp === '') {
            flag = true
            break
          }
          if (!reg.test(temp[i].startIp) || !reg.test(temp[i].endIp)) {
            ipFlag = true
            break
          }
        }
        if (flag) {
          MsgShow('error', '存在ip号段起始IP未填的数据', 3000)
          return false
        }
        if (ipFlag) {
          MsgShow('error', '存在非法的ip数据，请按照正确的ip格式填写', 3000)
          return false
        }
        ipNum = JSON.stringify(this.ipList)
      }
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          let data = this.tempData
          if (this.dialogTitle === '编辑部门') {
            this.editData(data, ipNum)
            return false
          }
          if (data.deptId === '') {
            this.addVis = true
            $addDepartTree({
              deptKey: this.addFormData.deptKey,
              deptName: this.addFormData.deptName,
              deptLevel: 1,
              parentId: 0,
              orgId: '',
              ipNum: ipNum
            }).then(res => {
              if (res.status === 200) {
                ResultMsg(res, '添加', () => {
                  this.dialogFormVisible = false
                  this.addVis = false
                  this.queryNode()
                  this.refreshCache()
                })
              } else {
                this.addVis = false
                this.$message.error(res.desc)
              }
            }).catch(() => {
              this.addVis = false
              this.$message.error('数据获取失败')
            })
          } else {
            $departDetails(data.deptId).then(res => {
              this.addVis = true
              let parentId = res.data.parentId || 0
              if (this.addLevel === 1) {
                parentId = res.data.deptId
              }
              $addDepartTree({
                deptKey: this.addFormData.deptKey,
                deptName: this.addFormData.deptName,
                deptLevel: Number(res.data.deptLevel) || 1,
                parentId: parentId,
                orgId: res.data.orgId || '',
                ipNum: ipNum
              }).then(res => {
                if (res.status === 200) {
                  ResultMsg(res, '添加', () => {
                    this.addVis = false
                    this.dialogFormVisible = false
                    this.queryNode()
                    this.refreshCache()
                  })
                } else {
                  this.addVis = false
                  this.$message.error(res.desc)
                }
              }).catch(() => {
                this.addVis = false
                this.$message.error('数据获取失败')
              })
            })
          }
        }
      })
    },
    // 添加本级节点
    append (data, level) {
      this.addFormData.deptKey = ''
      this.addFormData.deptName = ''
      this.ipList = [{
        startIp: '',
        endIp: ''
      }]
      this.dialogTitle = '添加部门'
      this.actAddFormKey = 'bumenpeizhitianjia__'
      this.actAddKey = 'bumenpeizhitianjia_'
      // 获取部门编号
      AxiosApi('/ifms/web-org/depts/createDeptKey', {}, 'GET').then(res => {
        this.dialogFormVisible = true
        this.addFormData.deptKey = res.data
        this.tempData = data
        this.addLevel = level
      })
    },
    // 根节点添加
    addNode () {
      this.append({
        deptId: ''
      })
    },
    // 编辑数据
    editData (data, ipNum) {
      $departDetails(data.deptId).then(res => {
        let orgId = res.data.orgId
        this.addVis = true
        $editDepart(
          {
            deptName: this.addFormData.deptName,
            deptKey: this.addFormData.deptKey,
            deptId: data.deptId,
            orgId: orgId,
            ipNum: ipNum
          }
        ).then(res => {
          if (res.status === 200) {
            ResultMsg(res, '修改', () => {
              this.queryNode()
              this.refreshCache()
              this.dialogFormVisible = false
              this.addVis = false
            })
          } else {
            this.addVis = false
            this.$message.error(res.desc)
          }
        })
      })
    },
    // 编辑节点
    edit (data) {
      let ipNum = data.ipNum
      if (ipNum && ipNum !== null && ipNum !== '') {
        this.ipList = JSON.parse(ipNum)
      } else {
        this.ipList = [{
          startIp: '',
          endIp: ''
        }]
      }
      this.addFormData.deptKey = data.deptKey
      this.addFormData.deptName = data.deptName
      this.dialogFormVisible = true
      this.tempData = data
      this.dialogTitle = '编辑部门'
      this.actAddFormKey = 'bumenpeizhibianji__'
      this.actAddKey = 'bumenpeizhibianji_'
    },
    // 删除节点
    remove (data) {
      this.$confirm('是否确认删除该部门?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        $delDepartTree('' + data.deptId).then(res => {
          ResultMsg(res, '删除', this.queryNode)
        })
      }).catch(() => {

      })
    },
    // 更新本地数据范围缓存
    refreshCache () {
      AxiosApi('/passport/web-rbac/logins/getDataDeptInfoList', {}, 'GET').then(res => {
        if (res.status === 200) {
          localStorage.setItem('dataDeptInfoList', JSON.stringify(res.data))
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .departConfig{
    padding-top: 60px;
    width: 40%;
    margin-left: 25%;
  }
  .custom-tree-node{
    flex:1;
    display:flex;
    align-items:center;
    justify-content:space-between;
    padding-right:8px;
  }
  .el-tree-node__content {
    height: 38px;
  }
  /deep/ .ifms-ip-div {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    &:last-child{
      margin-bottom: 0;
    }
    .el-input__inner{
      width: 160px;
    }
  }
  /deep/ .ifms-add-input{
    .el-input__inner, .el-input{
      width: 344px;
    }
  }
  .i-add{
    color: #1e87f0;
    font-size: 24px;
    cursor: pointer;
  }
  .i-remove{
    color: #f56c6c;
    font-size: 24px;
    margin-left: 5px;
    cursor: pointer;
  }
  .ifms-ip-btn{
    height: 46px;
    display: flex;
    align-items: center;
    flex: 0 0 100px;
    padding-left: 10px;
  }
</style>
