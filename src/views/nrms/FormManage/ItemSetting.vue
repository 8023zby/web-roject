<template>
  <layoutEdit>
    <div slot="title">体征项配置</div>
    <div slot="right_btn">
      <el-button type="primary" @click="() => { $emit('changed', 'list') }">返回</el-button>
    </div>
    <layout slot="main" v-loading="loading">
      <!-- 搜索条件 -->
      <div slot="query" class="query-items">
        <el-form ref="search_form" :inline="true" :model="search_from" label-suffix=":">
          <el-form-item prop="signName" label="体征项名称">
            <el-input
              v-model="search_from.signName"
              placeholder="体征项名称"
              autocomplete="off"
              clearable
            />
          </el-form-item>
          <el-form-item v-if="detail.formType == 4" prop="signType" label="出入项">
            <el-select
              v-model="search_from.signType"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in signList"
                :key="index"
                :label="item.label"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="searchForm"
            >搜索
            </el-button>
            <el-button
              type="text"
              @click="resetForm()"
            >重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="right_btn" class="tool-bar">
        <el-button type="primary" @click="showImportItem">导入体征项</el-button>
      </div>
      <!-- 表格 -->
      <div slot="main" class="main-list">
        <el-table
          :data="table_data"
          row-key="itemId"
          stripe
          highlight-current-row
          height="100%"
        >
          <!-- <el-table-column prop="sort" label="序号" align="center" width="120" /> -->
          <el-table-column v-if="detail.formType !== 9" prop="signClassifyName" label="所属分类" align="center" min-width="100" />
          <el-table-column prop="signItemName" label="体征项名称" align="center" min-width="100" />
          <el-table-column prop="signItemShowName" label="显示名称" align="center" min-width="100" />
          <el-table-column prop="signItemUnit" label="体征项单位" align="center" min-width="100" />
          <el-table-column v-if="detail.formType == 4" prop="signType" label="是否为出入项" align="center" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.signType == 0">非出入项</span>
              <span v-if="scope.row.signType == 1">入项</span>
              <span v-if="scope.row.signType == 2">出项</span>
            </template>
          </el-table-column>
          <!-- 只有体温单使用 -->
          <el-table-column v-if="detail.formType == 2" prop="isShow" align="center" min-width="100">
            <template slot="header">
              是否始终显示
              <el-tooltip class="item" effect="dark" placement="bottom">
                <div slot="content">
                  体征项在体温单的显示规则:<br>
                  若设置为“是”，则无论是否有值，始终在体温单中显示；<br>
                  若设置为“否”，则该项体征有录入值后才在体温单中显示
                </div>
                <img style="margin-bottom: 3px;" src="../../../assets/nrms/images/wenhao.png">
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isShow"
                :active-value="1"
                :inactive-value="2"
                :disabled="isShowSwitchDisabled(scope.row)"
                @change="handleAlwaysShowSwitch($event, scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" label="排序" width="350">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="itemSort(scope.$index, scope.row, 'top')"
              >置顶
              </el-button>
              <el-button
                type="text"
                @click="itemSort(scope.$index, scope.row, 'up')"
              >上移
              </el-button>
              <el-button
                type="text"
                @click="itemSort(scope.$index, scope.row, 'down')"
              >下移
              </el-button>
              <el-button
                type="text"
                @click="itemSort(scope.$index, scope.row, 'bottom')"
              >置尾
              </el-button>
              <el-button
                type="text"
                @click="itemSort(scope.$index, scope.row, 'assign')"
              >指定位置
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </layout>

    <el-dialog
      title="导入体征项"
      :visible="visible"
      :close-on-click-modal="false"
      :show-close="false"
      width="780px"
      class="import-item-dialog"
    >
      <import-item ref="importItem" :selected-ids="selectedIds" :detail="detail" @refresh="importRefresh" />
      <div slot="footer">
        <el-button size="small" @click="visible = false">取消</el-button>
        <el-button type="primary" size="small" @click="submitForm()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </layoutEdit>
</template>

<script>
import { ApiTemperatureItemSetting } from '../../../api/nrms/index'
import layoutEdit from '../../../components/nrms/layout/edit'
import layout from '../../../components/nrms/layout/list'
import importItem from './importItem'
import { temperatureInitItem } from './temperatureConfig'

export default {
  name: 'ItemSetting',
  components: { layout, layoutEdit, importItem },
  props: ['detail'],
  data () {
    return {
      loading: false,
      temperatureInitItem,
      signList: [
        {
          label: '全部',
          key: ''
        },
        {
          label: '非出入项',
          key: '0'
        },
        {
          label: '入项',
          key: '1'
        },
        {
          label: '出项',
          key: '2'
        }
      ],
      table_data: [],
      // 搜索表单
      search_status: false,
      search_from: {
        signName: '',
        signType: '',
        deptId: '',
        formId: this.detail.formId
      },
      visible: false,
      selectedIds: [] // 已导入的体征项ids
    }
  },
  created () {
    const deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.search_from.deptId = deptInfo.deptId || ''
    this.getData()
  },
  methods: {
    showImportItem () {
      ApiTemperatureItemSetting.select(this.search_from)
        .then(res => {
          const _data = res.data || []
          const arr = []
          for (let i = 0; i < _data.length; i++) {
            arr.push(_data[i]['signId'])
          }
          this.selectedIds = arr
        })
        .catch(res => {
          this.$message.error(res.message)
        })
        .finally(() => {
          this.visible = true
        })
    },
    submitForm () {
      this.$refs.importItem.import()
    },
    getData () {
      this.loading = true
      ApiTemperatureItemSetting.select(this.search_from)
        .then(res => {
          res.data = res.data || []
          this.table_data = res.data
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    importRefresh () {
      this.visible = false
      this.getData()
    },
    searchForm () {
      if (this.search_from.itemName) {
        this.search_status = true
      }
      this.getData()
    },
    resetForm () {
      this.search_status = false
      this.$refs.search_form.resetFields()
      this.getData()
    },
    isShowSwitchDisabled (row) {
      // 体温 脉搏 心率 疼痛等级 呼吸 血压 收缩压 舒张压 是默认初始化项，不能取消复选
      const initItem = this.temperatureInitItem[this.detail.formRelationStyle] || []
      return initItem.includes(row['signItemFieldName'])
    },
    handleAlwaysShowSwitch (val, row) {
      ApiTemperatureItemSetting.updateAlwaysShow({
        formSignId: row.id,
        isShow: row.isShow
      })
        .then(() => {
          // row.positionList = val;
        })
        .catch(res => {
          row.isShow = val === 1 ? 1 : 2
          this.$message.error(res.message)
        })
    },
    itemSort (currentIndex, currentData, type) {
      if (this.search_status) {
        this.search_status = false
        this.resetForm()
        return false
      }
      const _itemData = JSON.parse(JSON.stringify(this.table_data))
      if (type === 'up') {
        if (currentIndex === 0) {
          this.$message.warning('已经是第一个！')
          return
        }
        const prevIndex = currentIndex - 1
        const prevData = _itemData[prevIndex]
        // 交换序号
        prevData['sort'] = currentData['sort']
        currentData['sort'] = currentData['sort'] - 1
        // 交换位置
        _itemData[currentIndex] = prevData
        _itemData[prevIndex] = currentData
        this.updateSort(_itemData)
      } else if (type === 'down') {
        if (currentIndex === _itemData.length - 1) {
          this.$message.warning('已经是最后一个！')
          return
        }
        const nextIndex = currentIndex + 1
        const nextData = _itemData[nextIndex]
        // 交换序号
        nextData['sort'] = currentData['sort']
        currentData['sort'] = currentData['sort'] + 1
        // 交换位置
        _itemData[currentIndex] = nextData
        _itemData[nextIndex] = currentData
        this.updateSort(_itemData)
      } else if (type === 'top') {
        if (currentIndex === 0) {
          this.$message.warning('已经是第一个！')
          return
        }
        const currentData = _itemData.splice(currentIndex, 1)
        _itemData.unshift(currentData[0])
        // 重新排序
        for (let i = 0; i < _itemData.length; i++) {
          _itemData[i]['sort'] = i + 1
        }
        this.updateSort(_itemData)
      } else if (type === 'bottom') {
        if (currentIndex === _itemData.length - 1) {
          this.$message.warning('已经是最后一个！')
          return
        }
        const currentData = _itemData.splice(currentIndex, 1)
        _itemData.push(currentData[0])
        // 重新排序
        for (let i = 0; i < _itemData.length; i++) {
          _itemData[i]['sort'] = i + 1
        }
        this.updateSort(_itemData)
      } else if (type === 'assign') {
        this.$prompt('跳转至', '指定位置', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          inputPattern: /^\d+$/,
          inputErrorMessage: `请输入数字序号(1-${_itemData.length})`,
          showClose: false
        }).then(({ value }) => {
          const currentData = _itemData.splice(currentIndex, 1)
          _itemData.splice(+value ? value - 1 : 0, 0, currentData[0])
          // 重新排序
          for (let i = 0; i < _itemData.length; i++) {
            _itemData[i]['sort'] = i + 1
          }
          this.updateSort(_itemData)
        })
      }
    },
    // 给后台更新数据
    updateSort (tableData) {
      const sortData = []
      tableData.forEach(v => {
        sortData.push({ id: v.id, sort: v.sort })
      })
      ApiTemperatureItemSetting.sort(sortData)
        .then(() => {
          this.table_data = tableData
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
  /deep/ .el-main {
    > div {
      height: 100%;
    }
  }

  .import-item-dialog {
    /deep/ .el-dialog {
      padding: 0;
      height: 900px;
    }

    /deep/ .el-form {
      .el-input {
        width: 300px !important;
      }

      .el-input__inner {
        width: 100%
      }
    }

    /deep/ .el-select {
      width: 100px;
    }
  }

  /deep/.el-dialog__body {
    padding-top: 0px !important;
  }
</style>
