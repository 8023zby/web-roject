<template>
  <layout v-loading="loading" style="height: 500px">
    <!--<div slot="query" class="query-items"></div>-->
    <!-- 操作按钮 -->
    <!--<div slot="left_btn" class="tool-bar">-->
      <!--<el-button type="warning" icon="el-icon-plus" @click="itemAdd(null)"-->
      <!--&gt;添加-->
      <!--</el-button>-->
    <!--</div>-->
    <!-- 表格 -->
    <div slot="main" class="main-list">
      <el-table
        :data="data_table"
        stripe
        highlight-current-row
        height="100%"
        ref="table2"
      >
        <!-- <el-table-column type="index" label="序号" width="70" align="center"></el-table-column> -->
        <el-table-column
          prop="signClassifyName"
          label="分类名称"
          min-width="150"
          align="center"
        ></el-table-column>
        <el-table-column label="排序" width="350" align="center">
          <template slot-scope="scope">
            <el-button
              v-uni:[scope.$index]="'tizhengxiang_fenlei_sort_head'"
              type="text"
              @click="itemSort(scope.$index, scope.row, 'top')"
            >置顶
            </el-button>
            <el-button
              v-uni:[scope.$index]="'tizhengxiang_fenlei_sort_up'"
              type="text"
              @click="itemSort(scope.$index, scope.row, 'up')"
            >上移
            </el-button>
            <el-button
              v-uni:[scope.$index]="'tizhengxiang_fenlei_sort_down'"
              type="text"
              @click="itemSort(scope.$index, scope.row, 'down')"
            >下移
            </el-button>
            <el-button
              v-uni:[scope.$index]="'tizhengxiang_fenlei_sort_bottom'"
              type="text"
              @click="itemSort(scope.$index, scope.row, 'bottom')"
            >置底
            </el-button>
            <el-button
              v-uni:[scope.$index]="'tizhengxiang_fenlei_sort_setposition'"
              type="text"
              @click="itemSort(scope.$index, scope.row, 'assign')"
            >指定位置
            </el-button>
          </template>
        </el-table-column>
        <!--<el-table-column fixed="right" label="操作" width="250">-->
          <!--<template slot-scope="scope">-->
            <!--<el-button @click="itemAdd(scope.row)" type="text" size="small"-->
            <!--&gt;编辑-->
            <!--</el-button-->
            <!--&gt;-->
            <!--<el-button-->
              <!--type="textred"-->
              <!--size="small"-->
              <!--@click="itemDeleteSelect(scope.row)"-->
            <!--&gt;删除-->
            <!--</el-button-->
            <!--&gt;-->
          <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
    </div>
    <template>
      <!--添加编辑弹框-->
      <el-dialog
        :title="form_type_text"
        :visible.sync="addClassifyDialogVisible"
        width="490px"
        :show-close="false"
        custom-class="classifyDialogStyle">

        <el-form
          :model="classify_form"
          :rules="rules"
          ref="add_form"
          label-width="100px"
          label-suffix=":"
        >
          <el-form-item label="分类名称" prop="signClassifyName">
            <el-input
              v-uni="'tizhengxiang_fenlei_add_fenleimingcheng'"
              v-model="classify_form.signClassifyName"
              clearable
              placeholder=""
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button v-uni="'tizhengxiang_fenlei_add_cancel'" @click="addClassifyDialogVisible = false">取消</el-button>
          <el-button v-uni="'tizhengxiang_fenlei_add_confirm'" type="primary" @click="addClassify">确认</el-button>
      </span>
      </el-dialog>
    </template>
  </layout>
</template>

<script>
import { ApiSignClassify, ApiSignItemClassifySort } from '../../../api/nrms/index'
import layout from '../../../components/nrms/layout/list'

export default {
  name: 'sign_items_classify',
  components: { layout },
  data () {
    return {
      loading: false,
      data_table: [],
      form_type_text: '',
      addClassifyDialogVisible: false,
      classify_form: {
        'signClassifyName': ''
      },
      rules: {
        signClassifyName: [
          { required: true, message: '请填写分类名称！', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getSignClassifyData()
  },
  methods: {
    reload () {
      this.$nextTick(function () {
        this.$refs.table2.doLayout()
      })
    },
    // 获取体征项分类
    getSignClassifyData () {
      ApiSignClassify.select().then(res => {
        this.data_table = res.data || []
      })
    },
    itemAdd (row) {
      this.form_type_text = row && row['signClassifyId'] ? '编辑' : '添加分类'
      this.classify_form.signClassifyId = ''
      this.classify_form.signClassifyName = ''
      this.addClassifyDialogVisible = true
      Object.assign(this.classify_form, row)
    },
    // 添加分类
    addClassify () {
      this.$refs.add_form.validate(valid => {
        if (valid) {
          ApiSignClassify.save(this.classify_form)
            .then(() => {
              this.$message.success('保存正确！')
              this.getSignClassifyData()
            })
            .catch(res => {
              this.$message.error(res.message)
            })
          this.addClassifyDialogVisible = false
          this.getSignClassifyData()
        } else {
          return false
        }
      })
    },
    itemDeleteSelect (row) {
      ApiSignClassify.delete({ signClassifyId: row.signClassifyId })
        .then(() => {
          this.itemDelete(row)
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    itemDelete (row) {
      this.$confirm('确认要进行删除吗？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        ApiSignClassify.delete({ signClassifyId: row.signClassifyId })
          .then(() => {
            this.$message.success('删除成功！')
            this.getSignClassifyData()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    itemSort (current_index, current_data, type) {
      let _item_data = this.data_table
      if (type === 'up') {
        if (current_index == 0) {
          this.$message.warning('已经是第一个！')
          return
        }
        let prev_index = current_index - 1
        let prev_data = _item_data[prev_index]
        // 交换序号
        prev_data['sort'] = current_data['sort']
        current_data['sort'] = current_data['sort'] - 1
        // 交换位置
        _item_data[current_index] = prev_data
        _item_data[prev_index] = current_data

        this.updateSort(_item_data)
      } else if (type === 'down') {
        if (current_index == _item_data.length - 1) {
          this.$message.warning('已经是最后一个！')
          return
        }
        let next_index = current_index + 1
        let next_data = _item_data[next_index]
        // 交换序号
        next_data['sort'] = current_data['sort']
        current_data['sort'] = current_data['sort'] + 1
        // 交换位置
        _item_data[current_index] = next_data
        _item_data[next_index] = current_data

        this.updateSort(_item_data)
      } else if (type === 'top') {
        if (current_index == 0) {
          this.$message.warning('已经是第一个！')
          return
        }
        let current_data = _item_data.splice(current_index, 1)
        _item_data.unshift(current_data[0])
        // 重新排序
        for (let i = 0; i < _item_data.length; i++) {
          _item_data[i]['sort'] = i + 1
        }
        this.updateSort(_item_data)
      } else if (type === 'bottom') {
        if (current_index == _item_data.length - 1) {
          this.$message.warning('已经是最后一个！')
          return
        }
        let current_data = _item_data.splice(current_index, 1)
        _item_data.push(current_data[0])
        this.updateSort(_item_data)
      } else if (type === 'assign') {
        this.$prompt('跳转至:', '指定位置', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          showClose: false,
          inputPattern: /^\d+$/,
          customClass: 'classifyPromptStyle',
          inputErrorMessage: `请输入数字序号(1-${_item_data.length})`
        }).then(({ value }) => {
          let current_data = _item_data.splice(current_index, 1)
          _item_data.splice(+value ? value - 1 : 0, 0, current_data[0])
          // 重新排序
          for (let i = 0; i < _item_data.length; i++) {
            _item_data[i]['sort'] = i + 1
          }
          this.updateSort(_item_data)
        })
      }
    },
    // 给后台更新数据
    updateSort (item_data) {
      let sort_data = []
      // 重新排序
      for (let i = 0; i < item_data.length; i++) {
        let _d = item_data[i]
        _d['sort'] = i + 1
        sort_data.push({ signClassifyId: _d['signClassifyId'], signClassifyName: _d['signClassifyName'], sort: i + 1 })
      }

      ApiSignItemClassifySort.itemSetting(sort_data)
        .then(() => {
          this.data_table = JSON.parse(JSON.stringify(item_data))
          this.$emit('sortCallBack', true)
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";
</style>
<style lang="scss" type="text/scss">
  .classifyDialogStyle{
    .el-dialog__body{
      padding-bottom: 15px;
    }
    .el-input,.el-input__inner {
      width: 300px !important;
    }
    .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap>.el-form-item__label:before, .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before{
      content: '';
    }
    .el-dialog__footer{
      padding: 0 20px 20px 20px;
    }
    .el-form-item__label{
      padding-right: 5px !important;
    }
  }
  .classifyPromptStyle{
    .el-input--small .el-input__inner{
      width: 300px;
      height: 46px;
      line-height: 46px;
    }
    .el-message-box__content .el-message-box__message p{
      margin-right: 5px !important;
    }
    .el-message-box__btns{
       padding-top: 0 !important;
     }
  }
  .el-message-box__wrapper .el-message-box .el-message-box__btns{
    padding-top: 0;
  }
</style>
