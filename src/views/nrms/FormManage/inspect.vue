<template>
  <layoutEdit>
    <div slot="title">检查通知单内容</div>
    <layout slot="main">
      <div slot="main" class="main-list" @click="cancelAllEdit()">
        <el-table :data="list" stripe highlight-current-row border>
          <el-table-column
            prop="date"
            label="日期"
            align="left"
            header-align="center"
          ></el-table-column>
          <el-table-column
            prop="inspect"
            label="检查项目"
            align="left"
            width="200"
            header-align="center"
           >
            <template slot-scope="scope">
              <div
                v-if="!scope.row.inspects || !scope.row.inspects.length"
                class="pointer"
                @dblclick="openInspectDialog(scope.$index)"
              >
                请双击编辑
              </div>
              <div
                v-else
                @dblclick="openInspectDialog(scope.$index)"
              >
                <el-checkbox-group disabled>
                  <el-checkbox :label="item" :key="index" v-for="(item, index) in scope.row.inspects"></el-checkbox>
                </el-checkbox-group>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="time"
            label="检查时间"
            align="left"
            header-align="center"
          ></el-table-column>
          <el-table-column prop="places" label="地点" align="center" width="200">
            <template slot-scope="scope">
              <div v-if="!list[scope.$index].isPlacesEdit">
                <div
                  v-if="!scope.row.places"
                  class="pointer"
                  @dblclick="columnEdit(scope.$index, 'isPlacesEdit')"
                >
                  请双击编辑
                </div>
                <div
                  v-else
                  class="pointer"
                  @dblclick="columnEdit(scope.$index, 'isPlacesEdit')"
                 >
                  <div v-html="scope.row.places" style="white-space: pre-wrap;"></div>
                </div>
              </div>
              <div v-else>
                <div @click.stop="">
                  <el-input
                    type="textarea"
                    autosize
                    placeholder="请输入内容"
                    v-model="scope.row.places"
                  >
                  </el-input>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="attention"
            label="注意事项"
            align="left"
            width="200"
            header-align="center"
          >
            <template slot-scope="scope">
              <div v-if="!list[scope.$index].isAttentionEdit">
                <div
                  v-if="!scope.row.attention"
                  class="pointer"
                  @dblclick="columnEdit(scope.$index, 'isAttentionEdit')"
                >
                  请双击编辑
                </div>
                <div
                  v-else
                  class="pointer"
                  @dblclick="columnEdit(scope.$index, 'isAttentionEdit')"
                  >
                  <div v-html="scope.row.attention" style="white-space: pre-wrap;"></div>
                </div>
              </div>
              <div v-else>
                <div @click.stop="">
                  <el-input
                    type="textarea"
                    autosize
                    placeholder="请输入内容"
                    v-model="scope.row.attention"
                  >
                  </el-input>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            align="left"
            width="200"
            header-align="center"
          >
            <template slot-scope="scope">
              <div v-if="!list[scope.$index].isRemarkEdit">
                <div
                  v-if="!scope.row.remark"
                  class="pointer"
                  @dblclick="columnEdit(scope.$index, 'isRemarkEdit')"
                >
                  请双击编辑
                </div>
                <div
                  v-else
                  class="pointer"
                  @dblclick="columnEdit(scope.$index, 'isRemarkEdit')"
                  >
                  <div v-html="scope.row.remark" style="white-space: pre-wrap;"></div>
                </div>
              </div>
              <div v-else>
                <div @click.stop="">
                  <el-input
                    type="textarea"
                    autosize
                    placeholder="请输入内容"
                    v-model="scope.row.remark"
                  >
                  </el-input>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="signature"
            label="护士/家属签名"
            align="left"
            header-align="center"
          ></el-table-column>
          <el-table-column prop="" label="" align="center">
            <template slot-scope="scope">
              <div class="operate">
                <i
                  @click.prevent="addItem(scope.$index + 1)"
                  class="el-icon-circle-plus-outline iconAddCls"
                ></i>
                <i
                  @click.prevent="removeItem(scope.$index)"
                  class="el-icon-remove-outline iconDelCls"
                ></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="describe" @click.stop="" @dblclick="isDescribeEdit = true">
          <div v-if="!isDescribeEdit">
            <div v-if="!describe">
              请双击输入检查单提示
            </div>
            <div v-else>
              <div style="width: 680px;margin: 0 auto">
                <div v-html="describe" style="white-space: pre-wrap;"></div>
              </div>
            </div>
          </div>
          <div v-else>
            <div style="width: 680px;margin: 0 auto">
              <textarea name="" id="" cols="110" rows="4" v-model="describe"></textarea>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="footer">
        <el-button @click="cancel" size="small">取消</el-button>
        <el-button type="primary" @click="save()" size="small">
          保存
        </el-button>
      </div>
    </layout>
    <!--------  start -------->
    <el-dialog
      title="检查项目"
      :visible="inspectVisible"
      :close-on-click-modal="false"
      :show-close="false"
      width="500px"
      class="inspect-dialog"
    >
      <div style="padding: 0 0 20px">
        <el-input
          type="textarea"
          placeholder="请输入内容"
          :rows="4"
          v-model="inspectItem"
        >
        </el-input>
      </div>
      <div slot="footer">
        <el-button @click="inspectVisible = false" size="small">取消</el-button>
        <el-button type="primary" @click="submitInspectColumn()" size="small">
          确认
        </el-button>
      </div>
    </el-dialog>
    <!--------  end -------->
  </layoutEdit>
</template>

<script>
import { ApiInspectionTemp } from '../../../api/nrms'
import layoutEdit from '../../../components/nrms/layout/edit'
import layout from '../../../components/nrms/layout/list'

export default {
  name: 'inspect',
  components: {
    layout,
    layoutEdit
  },
  props: ['detail'],
  data () {
    return {
      list: [], // 表格，每一列是一项
      item: {
        // 表格的每一项
        date: '',
        inspects: [],
        time: '',
        places: '',
        attention: '',
        remark: '',
        signature: '',
        isInspectsEdit: false,
        isPlacesEdit: false,
        isAttentionEdit: false,
        isRemarkEdit: false
      },
      describe: '', // 最下方提示内容
      isDescribeEdit: false, // 最下方提示内容是否是编辑
      isEdit: false, // 判断是编辑或者添加
      /**
      * ------------------------------------------------------------------
      * 检查项目弹框
      * ------------------------------------------------------------------
      */
      inspectVisible: false,
      inspectItem: '',
      inspectIndex: null
    }
  },
  created () {
  },
  async mounted () {
    await this.getInspectNotice()
    if (!this.list || !this.list.length) {
      this.addItem(0)
    }
  },
  methods: {
    /**
    * ------------------------------------------------------------------
    * 页面逻辑
    * ------------------------------------------------------------------
    */
    async cancel () {
      this.$confirm('取消将会对检查通知单未保存的内容重置, 是否继续？', '提示', {
        confirmButtonText: '继续取消',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        this.$emit('changed', 'list')
      })
    },
    /**
    * ------------------------------------------------------------------
    * 获取当前检查通知单
    * ------------------------------------------------------------------
    */
    async getInspectNotice () {
      try {
        const res = await ApiInspectionTemp.get({
          formId: this.detail.formId
        })
        if (res.data && res.data.inspectionTemplate) {
          this.isEdit = true
          let list = res.data.inspectionTemplate.list || []
          this.list = list.map(item => {
            return {
              ...this.item,
              ...item
            }
          })
          this.describe = res.data.inspectionTemplate.describe || ''
        }
      } catch (error) {
      }
    },
    /**
     * ------------------------------------------------------------------
     * 列表右侧的增加删除操作
     * ------------------------------------------------------------------
     */
    /**
     * @description: 添加一行
     * @param {*} item 操作的当前行
     * @return {*}
     */
    addItem (index) {
      let item = {
        ...this.item,
        id: Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
      }
      this.list.splice(index, 0, JSON.parse(JSON.stringify(item)))
    },
    /**
     * @description: 删除一行
     * @param {*} item 操作的当前行
     * @return {*}
     */
    removeItem (index) {
      this.$confirm('确定要删除该行内容吗?', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      })
        .then(() => {
          if (this.list.length <= 1) {
            this.$message.error('不可删除最后一项')
            return
          }
          this.list.splice(index, 1)
        })
        .catch(() => {})
    },
    /**
     * ------------------------------------------------------------------
     * 每一项编辑
     * ------------------------------------------------------------------
     */
    cancelAllEdit () {
      this.list.map(item => {
        item.isPlacesEdit = false
        item.isAttentionEdit = false
        item.isRemarkEdit = false
      })
      this.isDescribeEdit = false
    },
    /**
     * @description: 地点编辑
     * @param {*} scope
     * @return {*}
     */
    columnEdit (index, columnEdit) {
      this.list[index][columnEdit] = true
    },

    /**
    * ------------------------------------------------------------------
    * 检查项目编辑
    * ------------------------------------------------------------------
    */
    /**
     * @description: 检查项目弹框确认
     * @param {*}
     * @return {*}
     */
    submitInspectColumn () {
      if (this.inspectItem) {
        this.list[this.inspectIndex].inspects = this.inspectItem.split(/[(\r\n)\r\n]+/)
      } else {
        this.list[this.inspectIndex].inspects = []
      }
      this.inspectVisible = false
    },
    /**
     * @description: 打开检查项目弹框
     * @param {*}
     * @return {*}
     */
    openInspectDialog (index) {
      this.inspectIndex = index
      this.inspectItem = this.list[index].inspects.join('\r')
      this.inspectVisible = true
    },
    /**
    * ------------------------------------------------------------------
    * 点击保存
    * ------------------------------------------------------------------
    */
    async save () {
      const list = this.list.map(item => {
        return {
          id: item.id,
          date: item.date,
          inspects: item.inspects,
          time: item.time,
          places: item.places,
          attention: item.attention,
          remark: item.remark,
          signature: item.signature
        }
      })
      let inspectionTemplate = {
        list,
        describe: this.describe
      }
      console.log({
        formId: this.detail.formId,
        inspectionTemplate
      })
      try {
        if (this.isEdit) {
          // 编辑
          await ApiInspectionTemp.update({
            formId: this.detail.formId,
            inspectionTemplate
          })
          this.$message.success('编辑成功')
        } else {
          // 添加
          await ApiInspectionTemp.add({
            formId: this.detail.formId,
            inspectionTemplate
          })
          this.$message.success('添加成功')
        }
        await this.getInspectNotice()
        this.cancelAllEdit()
      } catch (error) {
        this.$message.error(error.message)
      }
    }

  }
}
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../assets/nrms/css/self_common";
/deep/ .el-main > div {
  height: 100%;
}
.iconAddCls {
  font-size: 24px;
  color: #409eff;
  cursor: pointer;
  vertical-align: middle;
}

.iconDelCls {
  font-size: 24px;
  color: #f56c6c;
  cursor: pointer;
  margin-left: 10px;
  vertical-align: middle;
}

.operate {
  display: none;
}

.main-list {
  padding-bottom: 20px;
  height: 100%;
  overflow: auto;
}

/deep/ .main-list .el-table tbody tr:hover .operate {
  display: block;
}

.pointer {
  cursor: pointer;
}
/deep/ .el-checkbox {
  width: 100%;
}
/deep/ .el-checkbox .el-checkbox__label {
  white-space: normal;
  vertical-align: middle;
}
/deep/.el-checkbox__input.is-disabled .el-checkbox__inner {
  background-color: #FFF;
  border-color: #DCDFE6;
  cursor: pointer;
}
/deep/.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #1e87f0;
  border-color: #1e87f0;
}
/deep/ .el-checkbox__input.is-disabled + span.el-checkbox__label {
  color: #333;
  cursor: pointer;
}
/deep/ .is-checked .el-checkbox__input.is-disabled + span.el-checkbox__label {
  color: #1E87F0;
}
/deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
  border-color: #fff;
}

.describe {
  min-height: 100px;
  border-bottom: 1px solid #EBEEF5;
  box-sizing: border-box;
  padding: 20px;
  cursor: pointer;
}

.footer {
  height: 56px;
  line-height: 56px;
  box-shadow: 0px 0px 6px 1px rgba(114, 114, 114, 0.3);
}
/deep/ .tool-container {
  padding: 0;
}
/deep/ .el-footer {
  padding: 0;
}
textarea {
  border-color: #C0C4CC;
  border-radius: 5px;
}
</style>
