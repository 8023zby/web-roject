<template>
    <div class="page-aside-main">
        <div class="left-aside">
            <div class="l-title">检验类型</div>
            <div class="l-action">
                <el-button v-uni="'jianyanxiangmu_tianjiafenlei'" type="primary" @click="addShow(null)" v-checkAuth="'addChildExamineClassify'">
          添加分类
        </el-button>

                <el-button v-uni="'jianyanxiangmu_sort'" type="primary" @click="toSort()" v-checkAuth="'childExamineClassifySort'" style="float: right;">
          排序
        </el-button>
      </div>
      <div class="l-content">
        <div class="ward-left-tree">
          <el-row @click.native="updateRightData(null,-1)">全部</el-row>
          <section
            v-for="(item,index) in classfyData"
            @click="updateRightData(item,index)"
            :key="index"
            :style="rowSelected === index?'background-color: #EDF7FD;':''"
            @mouseover="mouseOver(index)"
            @mouseout="mouseOut(index)"
          >
            <el-row>
              <el-col :span="17">
                <div class="ct-name">{{item.classValue}}</div>
              </el-col>
              <el-col :span="7">
                <div :style="rowHover === index?'display:inline-block':'display:none'"
                     v-if="checkAuth('editDangerDictClass,deleteDangerDictClass')"
                     class="classifyOperate">
                  <i
                    class="el-icon-edit-outline"
                    style="color: #1A7CED;font-size: 15px;"
                    @click.stop="addShow(item)"
                    v-checkAuth="'editChildExamineClassify'"
                                    ></i>

                  <i
                    style="color: #1A7CED;font-size: 15px;padding-left:14px"
                    class="el-icon-delete"
                    @click.stop="itemDelete(item)"
                    v-checkAuth="'deleteChildExamineClassify'"
                  ></i>
                </div>
              </el-col>
            </el-row>
          </section>
        </div>
      </div>
    </div>
    <!--添加分类弹窗-->
    <template>
      <!--添加编辑分类弹框-->
      <el-dialog
        :title="form_type_text"
        :visible.sync="addClassifyDialogVisible"
        width="490px"
        :show-close="false"
        :close-on-click-modal="false"
        custom-class="classifyDialogStyle">

                <el-form
                        v-uni="'jianyanxiangmu_tianjiafenleiform'"
                        :model="classify_form"
                        :rules="rules"
                        ref="classify_form"
                        label-width="100px"
                        label-suffix=":"
                >
                    <el-form-item label="分类名称" prop="classValue">
                        <el-input
                                v-uni="'jianyanxiangmu_fenleimingcheng'"
                                v-model="classify_form.classValue"
                                clearable
                                placeholder=""
                                autocomplete="off"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
          <el-button v-uni="'jianyanxiangmu_fenleicancel'" @click="close">取消</el-button>
          <el-button v-uni="'jianyanxiangmu_fenleiconfirm'" type="primary" @click="addClassify">确认</el-button>
      </span>
            </el-dialog>
        </template>
        <!--排序弹窗-->
        <el-dialog
                :visible.sync="dialogSortVisible"
                width="780px"
                class="clsStor"
                :show-close="false"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                custom-class="dialogSortClass"
        >
            <div slot="title" class="header-title">
                <span class="storTitle">排序</span>
            </div>
            <el-table
                    ref="dragTable"
                    :data="sort_data"
                    style="width: 100%;"
                    row-key="id"
                    fit
                    stripe
                    highlight-current-row
                    height="100%"
            >
                <el-table-column label="序号" type="index" width="120" align="center"/>
                <el-table-column label="标题" prop="classValue" align="center"/>
                <el-table-column label="操作" align="center" width="350">
                    <template slot-scope="scope">
                        <el-button v-uni:[scope.row.crisisClassId]="'jianyanxiangmu_head'" type="text" @click="itemSort(scope.$index, scope.row, 'top')">置顶</el-button>
                        <el-button v-uni:[scope.row.crisisClassId]="'jianyanxiangmu_up'" type="text" @click="itemSort(scope.$index, scope.row, 'up')">上移</el-button>
                        <el-button
                                v-uni:[scope.row.crisisClassId]="'jianyanxiangmu_down'"
                                type="text"
                                @click="itemSort(scope.$index, scope.row, 'down')"
                        >下移
                        </el-button>
                        <el-button
                                v-uni:[scope.row.crisisClassId]="'jianyanxiangmu_bottom'"
                                type="text"
                                @click="itemSort(scope.$index, scope.row, 'bottom')"
                        >置底
                        </el-button>
                        <el-button  v-uni:[scope.row.crisisClassId]="'jianyanxiangmu_setposition'" type="text" @click="itemSort(scope.$index, scope.row, 'assign')">指定位置</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button v-uni="'jianyanxiangmu_sortcancel'" @click="dialogSortVisible = false">取消</el-button>
                <el-button v-uni="'jianyanxiangmu_sortconfirm'" type="primary" @click="onSortSubmit()">确认</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
import moduleMixin from '../../../assets/nrms/mixins/moduleMixin'
import { ApiDangerClassify } from '../../../api/nrms'

export default {
  name: 'checkClassifyList',
  mixins: [moduleMixin],
  data () {
    return {
      rowSelected: -1,
      rowHover: -1,
      form_type_text: '',
      addClassifyDialogVisible: false,
      dialogSortVisible: false,
      isShow: false,
      classfyData: [],
      sort_data: [], // 排序的数据
      classify_form: {
        'classType': 2,
        'classValue': '',
        'sort': '1'
      },
      classify_form_catch: {
        'classType': 2,
        'classValue': '',
        'sort': ''
      },
      rules: {
        classValue: [
          { required: true, message: '请填写分类名称！', trigger: 'blur' },
          { min: 1, max: 20, message: '长度不超过20个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getClassifyData()
  },
  methods: {
    // 获取分类列表
    getClassifyData () {
      ApiDangerClassify.select({ classValue: '', classType: 2 }).then(res => {
        this.classfyData = res.data || []
        this.classify_form_catch.sort = this.classify_form.sort = this.classfyData.length + 1
      })
    },
    // 添加编辑分类弹窗
    addShow (row = null) {
      // 清空
      this.classify_form = JSON.parse(JSON.stringify(this.classify_form_catch))
      this.form_type_text = row && row['crisisClassId'] ? '编辑' : '添加分类'
      if (row && row['crisisClassId']) {
        this.classify_form.crisisClassId = row.crisisClassId
        this.classify_form.classValue = row.classValue
      }
      this.addClassifyDialogVisible = true
    },
    addClassify () {
      this.$refs.classify_form.validate(valid => {
        if (valid) {
          ApiDangerClassify.save(this.classify_form)
            .then(() => {
              this.$message.success('保存正确！')
              this.addClassifyDialogVisible = false
              this.getClassifyData()
            })
            .catch(res => {
              this.addClassifyDialogVisible = false
              this.$message.error(res.message)
            })
        } else {
          return false
        }
      })
    },
    itemDelete (row) {
      let _row = JSON.parse(JSON.stringify(row))
      ApiDangerClassify.deleteSelect({ crisisClassId: _row.crisisClassId, classType: 2 })
        .then((res) => {
          let result = res.data
          if (result) {
            // 为true时可以删除
            this.$confirm('确认要进行删除吗？', '删除', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning',
              showClose: false
            }).then(() => {
              ApiDangerClassify.delete({ crisisClassId: _row.crisisClassId, classType: 2 })
                .then(() => {
                  this.$message.success('删除成功！')
                  this.getClassifyData()
                  // 删除成功后，执行点击全部函数，将左侧选中的分类清空，以防再次添加数据时 检查类型查不到已删除的数据
                  this.updateRightData(null, -1)
                })
                .catch(res => {
                  this.$message.error(res.message)
                })
            })
          } else {
            this.$confirm('该分类下有检查项目，不允许删除！', '删除', {
              showCancelButton: false,
              confirmButtonText: '关闭',
              type: 'warning',
              showClose: false
            }).then(() => {
            })
          }
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    // 排序
    toSort () {
      this.dialogSortVisible = true
      console.log('前this.classfyData', this.classfyData)
      this.sort_data = JSON.parse(JSON.stringify(this.classfyData))
    },
    itemSort (current_index, current_data, type) {
      let _item_data = this.sort_data
      console.log('排序前_item_data', _item_data)
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
        // console.log('当前序号',current_index)
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
        // console.log('_item_data',_item_data)
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
          inputPattern: /^[1-9]\d*$/,
          customClass: 'classifyPromptStyle',
          inputErrorMessage: `请输入数字序号(1-${_item_data.length})`,
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              let value = instance.inputValue
              if (parseInt(value) > _item_data.length) {
                this.$message.warning(`指定位置不能超过${_item_data.length}！`)
              } else {
                done()
              }
            } else {
              done()
            }
          }
        }).then(({ value }) => {
          let current_data = _item_data.splice(current_index, 1)
          _item_data.splice(value - 1, 0, current_data[0])
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
      this.sort_data = []
      // 重新排序
      for (let i = 0; i < item_data.length; i++) {
        let _d = item_data[i]
        _d['sort'] = i + 1
        this.sort_data.push({ crisisClassId: _d['crisisClassId'], classValue: _d['classValue'], sort: i + 1 })
      }
      // console.log('确认前this.classfyData',this.classfyData)
    },
    onSortSubmit () {
      console.log('确认后this.sort_data', this.sort_data)
      ApiDangerClassify.sort(this.sort_data)
        .then(() => {
          this.classfyData = JSON.parse(JSON.stringify(this.sort_data))
          this.dialogSortVisible = false
          // console.log('确认后this.classfyData',this.classfyData)
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    // 更新右侧列表
    updateRightData (row, index) {
      this.rowSelected = index
      this.$emit('getClissfyItem', row)
    },
    mouseOver (index) {
      this.rowHover = index
    },
    mouseOut (index) {
      this.rowHover = -1
    },
    close () {
        this.$refs['classify_form'].resetFields()
        this.classify_form = JSON.parse(JSON.stringify(this.classify_form_catch))
      this.addClassifyDialogVisible = false
    }

  }
}
</script>

<style lang="scss" type="text/scss" scoped>

    /*左侧树、右侧表格的页面样式 ====== START*/
    .page-aside-main {
        width: 200px;
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

                    .el-row {
                        padding: 12px 5px 12px 35px;

                        .el-col {
                            font-size: 14px;

                            .ct-name {
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                        }

                        &:hover {
                            box-shadow: 0px 0px 5px 0px rgba(101, 101, 101, 0.3);
                        }

                        &:active {
                            background: #EDF7FD;;
                        }

                        .classifyOperate {
                            display: none;
                        }
                    }

                }

                /*宣教左侧分类列表样式 =========== END*/

            }
        }

        .el-button:last-child {
            margin-left: 10px !important;
        }
    }

    /*左侧树、右侧表格的页面样式 ====== END*/
</style>
<style lang="scss" type="text/scss">
    .dialogSortClass {
        height: 668px;

        .el-dialog__body {
            padding: 0;
        }

        .el-dialog__footer {
            padding-top: 35px;
        }

        /* 表格-表头样式 */
        .el-table th {
            background-color: #f7f7f7;
            color: #333333;
            font-size: 16px;
            font-weight: normal;

            > .cell {
                color: initial;
            }
        }

        /* 单元格高度扩充 */
        .el-table td, .el-table th {
            padding: 12px 0;
            height: 48px;
        }

        .el-button--text, .el-button--textred {
            padding: 0 !important;
            font-size: 14px;
        }

        .el-table--mini, .el-table--small, .el-table__expand-icon {
            font-size: 14px;
        }

        [class*=el-button--text] {
            margin: 0 15px;
        }

        .el-table--striped .el-table__body tr.el-table__row--striped > td {
            background: #FCFCFC;
        }

        .el-table--enable-row-hover .el-table__body tr:hover > td {
            background: #fff;
        }

        .el-table tr:hover {
            transform: translate3d(0, 0, 0);
            box-shadow: 0 0 6px 0 rgba(124, 124, 124, 0.3);
        }
    }
</style>
