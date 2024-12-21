<template>
  <el-dialog
    title="应用"
    :visible="visible"
    :close-on-click-modal="false"
    :show-close="false"
    width="490px"
    class="deptDialogCss"
    @close="resetCloseForm"
  >
    <div class="query-items">
      科室：
      <el-input class="searchStyle" style="width: 182px;" v-model.trim="searchContent" clearable placeholder="请输入" @clear="clearSearch"/>
      <el-button
              type="primary"
              class="el-button-radius"
              icon="el-icon-search"
              size="small"
              @click="searchDept"
      >搜索
      </el-button>
      <el-button type="text" @click="resetSearch">重置</el-button>
    </div>
    <div class="deptTree">
      <el-checkbox v-model="checkedAll" @change="handleCheckAllChange"
      >全选/取消全选
      </el-checkbox>

      <el-tree
              ref="tree"
              node-key="deptId"
              show-checkbox
              :expand-on-click-node="false"
              :default-checked-keys="deptIds"
              check-on-click-node
              check-strictly
              :data="treeData"
              @check="handleNodeCheck"
      ></el-tree>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="resetCloseForm()" size="small">取消</el-button>
      <el-button type="primary" @click="submitForm()" size="small">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { ApiAutoForm, ApiFormMange } from '../../../api/nrms/index'
import { EFormType, FormApplyOneToMore } from '../../../assets/nrms/enum/formManage'
import { AutoFormType, FormTypeMap } from './temperatureConfig'

export default {
  name: 'form2Dept',
  props: {

    visible: {
      type: Boolean,
      default: false
    },
    // 新加功能
    deptList: {
      type: Array,
      default: function () {
        return []
      }
    },
    deptFormObj: {
      type: Object,
      default: function () {
        return {}
      }
    },
    checkFormId: {
      type: String,
      default: function () {
        return {}
      }
    },
    formType: {
      type: String,
      default: function () {
        return {}
      }
    },
    formRelationStyle: {
      type: String,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      checkedAll: false,
      deptIds: [],
      treeData: {},
      defaultProps: {
        label: 'deptName'
      },
      saveObj: {
        formId: '',
        addDeptIds: [],
        subDeptIds: []
      },
      deptListBack: [],
      searchContent: '', // 搜索内容
      flatDept: []// 扁平化全部科室
      // usedDeptFormObj:{},//当前表单应用的科室对应
    }
  },
  mounted () {
    this.$nextTick(() => {
      // this.$refs.tree.setCheckedKeys(this.initArr);
    })
  },
  created () {
    this.init()
  },
  activated () {
  },
  computed: {
    // formtype对应的参数字段
    formTypeMap () {
      return FormTypeMap.get(this.formType)
    },
    // 是否是自动表单出来的
    isAutoForm () {
      return AutoFormType.indexOf(this.formType) >= 0
    }
  },
  methods: {
    init () {
      let _this = this
      _this.treeData = [...this.deptList]
      if (FormApplyOneToMore.indexOf(this.formType) > -1) {
        // 多个表单可以应用于同一个科室处理
        _this.formatNrFormProp(_this.treeData)
        _this.deptListBack = JSON.parse(JSON.stringify(_this.treeData))
      } else {
        // 一个表单只能应用于一个科室处理
        _this.formatFormProp(_this.treeData)
        _this.deptListBack = JSON.parse(JSON.stringify(_this.treeData))
      }
      // 扁平化科室
      let flatDept = JSON.parse(JSON.stringify(_this.treeData))
      this.recursion(flatDept)
    },
    // searchCurFormDept(){
    //   this.usedDeptFormObj = {}
    //   for(let key in this.deptFormObj){
    //     let value = this.deptFormObj[key]
    //     if(value===this.checkFormId){
    //       this.usedDeptFormObj[key] = value
    //     }
    //  }
    // },
    // 多个表单可以应用于同一个科室处理
    formatNrFormProp (data) {
      let _this = this
      for (let item of data) {
        if (_this.deptFormObj[item.deptId]) {
          _this.$set(item, 'baseFormId', _this.deptFormObj[item.deptId])
          _this.$set(item, 'disabled', false)
          this.deptIds.push(item.deptId)
        } else {
          _this.$set(item, 'baseFormId', _this.deptFormObj[item.deptId] || '')
          _this.$set(item, 'disabled', false)
        }
        if (item.children && item.children.length > 0) {
          _this.formatNrFormProp(item.children)
        }
      };
    },
    // 一个表单只能应用于一个科室处理
    formatFormProp (data) {
      let _this = this
      for (let item of data) {
        if (!_this.deptFormObj[item.deptId]) {
          _this.$set(item, 'baseFormId', _this.deptFormObj[item.deptId] || '')
          _this.$set(item, 'disabled', false)
        } else if (this.deptFormObj[item.deptId] != this.checkFormId) {
          _this.$set(item, 'baseFormId', _this.deptFormObj[item.deptId])
          _this.$set(item, 'disabled', true)
          this.deptIds.push(item.deptId)
        } else {
          _this.$set(item, 'baseFormId', _this.deptFormObj[item.deptId])
          _this.$set(item, 'disabled', false)
          this.deptIds.push(item.deptId)
        }
        if (item.children && item.children.length > 0) {
          _this.formatFormProp(item.children)
        }
      };
    },
    handleCheckAllChange (val) {
      // 全选
      if (val) {
        let arr = (this.deptIds = this.getDeptId(this.treeData, 0))
        this.$refs.tree.setCheckedKeys(arr)
      } else {
        this.deptIds = []
        let arr = (this.deptIds = this.getDeptId(this.treeData, 1))
        this.$refs.tree.setCheckedKeys(arr)
      }
    },
    getDeptId (data, type) {
      let arr = []

      for (let i = 0; i < data.length; i++) {
        if (type == 0) {
          arr.push(data[i].deptId)
        } else if (data[i].disabled) {
          arr.push(data[i].deptId)
        }
        if (data[i].children) {
          let a = this.getDeptId(data[i].children, type)
          arr.push(...a)
        }
      }
      return arr
    },
    handleNodeCheck (checkedNodes) {
      const { deptId } = checkedNodes
      const index = this.deptIds.indexOf(deptId)
      if (index >= 0) {
        this.deptIds.splice(index, 1)
      } else {
        this.deptIds.push(deptId)
      }
    },
    getDeptFormStat (data) {
      let _this = this
      for (let item of data) {
        if (!item.disabled) {
          if (item.baseFormId == '' && _this.deptIds.indexOf(item.deptId) != -1) {
            _this.saveObj.addDeptIds.push(item.deptId)
          }
          if (item.baseFormId != '' && _this.deptIds.indexOf(item.deptId) == -1) {
            _this.saveObj.subDeptIds.push(item.deptId)
          }
        }
        if (item.children) {
          _this.getDeptFormStat(item.children)
        }
      }
    },
    async submitForm () {
      let _this = this
      _this.saveObj.formId = _this.checkFormId
      _this.saveObj.addDeptIds = []
      _this.saveObj.subDeptIds = []
      _this.getDeptFormStat(_this.treeData)

      if (_this.saveObj.addDeptIds.length === 0 && _this.saveObj.subDeptIds.length === 0) {
        this.$message.warning('未进行任何操作')
      } else {
        try {
          let res = ''
          if (this.isAutoForm) {
            const str = this.flatDept.filter(item => this.deptIds.indexOf(item.deptId) >= 0 && !item.disabled).map(item => item.deptId)
            res = await ApiFormMange.used({ assId: _this.saveObj.formId, deptIds: str.join(',') })
            // observeRes = await ApiAutoForm.observe({ assType: this.formRelationStyle, deptIds: _this.$refs.tree.getCheckedKeys().join(',') })
          } else {
            res = await ApiAutoForm.postForm2Dept(_this.saveObj)
          }
          if (res.status === 200) {
            this.$message.success('应用成功！')
            this.resetCloseForm()
          } else {
            throw new Error()
          }
        } catch (e) {
          this.$message.error('应用失败！')
        }
      }
    },
    // 重置表单 & 关闭窗体
    resetCloseForm () {
      this.checkedAll = false
      this.deptIds = []

      this.$refs.tree.setCheckedKeys([])
      this.$emit('update:visible', false)
      this.$emit('reDataList')
    },
    // 递归调用，将树结构变成平级
    recursion (deptList) {
      deptList.forEach(el => {
        this.flatDept.push(el)
        el.children && el.children.length > 0 ? this.recursion(el.children) : ''
      })
    },
    // 筛选科室
    searchDept () {
      // 解析扁平化数组,筛选符合条件的
      this.parseFlatDept(this.flatDept)
    },
    parseFlatDept (flatDept) {
      let _flatDept = flatDept
      let tempArr = []
      _flatDept.forEach(el => {
        el.children = []
        let labelName = el.label || ''
        if (labelName.indexOf(this.searchContent) >= 0) {
          tempArr.push(el)
        }
      })
      this.treeData = tempArr
    },
    resetSearch () {
      this.searchContent = ''
      this.treeData = this.deptListBack
    },
    clearSearch () {
      this.searchContent = ''
    }
  },
  watch: {
    /*
        init_checked(data) {
          data = data || [];
          this.deptIds = data;
          this.$nextTick(function() {
             this.$refs.tree.setCheckedKeys(data);
          });
        }
      */
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";
  .deptDialogCss{
    /deep/.el-dialog{
      height: 700px;
      .el-dialog__body{
        display: flex;
        flex-direction: column;
        overflow-y: hidden;
        padding-left: 30px;
        padding-right: 0;
        .query-items{
          height: 57px;
          .searchStyle{
            margin-right: 14px;
            width: 182px;
            margin-bottom: 20px;
            .el-input__inner{
              height: 32px !important;
              line-height: 32px;
            }
          }
        }
        .deptTree{
          flex: 1;
          overflow-y: auto;
          padding-right: 20px;
        }
      }
    }
  }
  /*根据UI调整*/
  /deep/ .el-tree-node__expand-icon{
    color:#333;
    font-size:18px;
    margin-bottom:2px;
  }
  /deep/.el-tree-node__content{
    overflow: hidden;
  }
  /deep/ .el-tree-node__expand-icon.expanded{
    padding:0 3px 3px 0;
  }
  /deep/ .el-tree-node__content>.el-tree-node__expand-icon{padding:0px;}
  /deep/ .el-tree-node__expand-icon.is-leaf{
    color:transparent;
  }
</style>
