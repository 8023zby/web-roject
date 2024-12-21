<!--
 * @Description: 风险级别配置
 * @Author: bjp
 * @Date: 2021-04-07 14:11:11
-->
<template>
  <!-- <div class="riskLevel"> -->
  <layoutEdit>
    <div slot="title">风险级别配置</div>
    <div slot="right_btn">
      <el-button
        type="primary"
        @click="
          () => {
            $emit('changed', 'list');
          }
        "
      >返回</el-button>
    </div>
    <layout slot="main" v-loading="loading">
      <!-- 搜索条件 -->
      <div slot="query" class="query-items">
        <el-form ref="search_form" :inline="true" label-suffix=":">
          <el-form-item>
            <el-button
              type="warning"
              icon="el-icon-plus"
              @click="addOrUpdateForm()"
            >添加
            </el-button>
          </el-form-item>
        </el-form>
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
          <!-- <el-table-column
            type="index"
            label="序号"
            align="center"
            width="120"
          /> -->
          <el-table-column
            prop="minRecord"
            label="最小值"
            align="center"
            min-width="100"
          />
          <el-table-column
            prop="maxRecord"
            label="最大值"
            align="center"
            min-width="100"
          />
          <el-table-column
            prop="level"
            label="风险程度"
            align="center"
            min-width="100"
          />
          <el-table-column
            prop="levelColor"
            label="颜色"
            align="center"
            min-width="100"
          >
            <template slot-scope="scope">
              <div class="levelColor-main">
                <div
                  class="levelColor-color"
                  :style="{ background: scope.row.levelColor }"
                />
                <div class="levelColor-value">{{ scope.row.levelColor }}</div>
                <div class="clear-both" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="assessmentConfigId"
            label="评估频次"
            align="center"
            min-width="100"
          >
            <template slot-scope="scope">
              <span>{{ calAssess(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="signItemUnit"
            label="操作"
            align="center"
            min-width="100"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="addOrUpdateForm(scope.row)"
              >编辑</el-button>
              <el-button type="text" size="small" @click="assDel(scope.row)">
                <div class="warmText">删除</div>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </layout>

    <!--新增、编辑对话框-->
    <el-dialog
      :title="form_type_text + '风险级别'"
      :visible.sync="showDialog"
      width="910px"
      :show-close="false"
    >
      <el-form
        ref="addForm"
        :model="dataObj"
        class="typt-add-dialog"
        :rules="rules"
      >
        <el-row :gutter="20">
          <el-col :span="9">
            <el-form-item
              label="分值区间:"
              label-width="100px"
              prop="minRecord"
            >
              <el-input
                v-model="dataObj.minRecord"
                placeholder="最小值"
                style="width: 180px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <label class="el-form-item__label" style="width: 20px">~</label>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" label-width="0px" prop="maxRecord">
              <el-input
                v-model="dataObj.maxRecord"
                placeholder="最大值"
                style="width: 180px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8" class="tips">
            <div class="assess-tip">
              <span>说明:分值区间包含“等于”，即:最小值≤X≤最大值</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-if="error.visible" :span="24" :offset="0">
            <div class="assess-error">
              <span>{{ error.text }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="18">
            <el-form-item label="风险级别:" label-width="100px" prop="level">
              <el-input
                v-model="dataObj.level"
                placeholder="请输入风险级别名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="18">
            <el-form-item label="颜色：" label-width="100px" prop="levelColor">
              <el-input v-model="dataObj.levelColor" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" label-width="1px">
              <el-color-picker
                v-model="dataObj.levelColor"
                popper-class="safe_color"
                :predefine="predefineColors"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="24">
            <el-form-item
              label="是否需要设置评估频次:"
              prop="isAssessment"
              label-width="180px"
            >
              <el-radio v-model="dataObj.isAssessment" :label="1">是</el-radio>
              <el-radio v-model="dataObj.isAssessment" :label="0">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="dataObj.isAssessment === 1" :gutter="20">
          <el-col :span="18">
            <el-form-item
              label="评估频次:"
              label-width="100px"
              prop="assessmentConfigId"
            >
              <el-select
                v-model="dataObj.assessmentConfigId"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in isAssessmentArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <!-- <el-radio v-model="dataObj.assRateCorrect" label="0"
                >每日评估</el-radio
              >
              <el-radio v-model="dataObj.assRateCorrect" label="1"
                >每周评估</el-radio -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="submitForm()">确认</el-button>
      </div>
    </el-dialog>
  </layoutEdit>

  <!-- </div> -->
</template>
<script>
import layoutEdit from '../../../components/nrms/layout/edit'
import layout from '../../../components/nrms/layout/list'
import { AxiosApi, AxiosJsonApi } from '../../../api/nams/http/index.js'
import { ApiAssessSetting } from '../../../api/nams'
export default {
  name: '',
  components: {
    layout,
    layoutEdit
  },
  props: ['detail', 'formPara'],
  data () {
    /**
     * 输入数字范围
     */
    var validateRange = (rule, value, callback) => {
      if (value < 0 || value > 999) {
        this.error.visible = false
        callback(new Error('范围0-999'))
      } else {
        callback()
      }
    }
    /**
     * 分值区间须最小值≤最大值
     */
    var validateAround = (rule, value, callback) => {
      const that = this

      const min = that.dataObj.minRecord
      const max = that.dataObj.maxRecord

      const flag = this.recordArr.some((item) => {
        return value >= item.min && value <= item.max
      })
      if (flag && !this.dataObj.scoreId) {
        // callback(new Error("该分值区间与其他风险级别的分值区间有重合，请检查"));
        // that.error.visible = true;
        that.error = {
          visible: true,
          text: '该分值区间与其他风险级别的分值区间有重合，请检查'
        }
        return false
      }
      if (min === '' || max === '') {
        callback()
        that.error.visible = false
        return false
      }
      if (+min > +max) {
        callback()
        that.error = {
          visible: true,
          text: '分值区间须最小值≤最大值，请检查'
        }
      } else {
        callback()
        that.error.visible = false
      }
    }
    /**
     * 输入小数点后一位
     */
    var validateOneNum = (rule, value, callback) => {
      const reg = /^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1})?$/
      if (!reg.test(value)) {
        this.error.visible = false
        callback(new Error('限定小数点后一位'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      assId: '',
      assName: '',
      dataObj: {
        assId: this.detail.assId,
        scoreId: '',
        level: '',
        levelColor: '#333333',
        minRecord: '',
        maxRecord: '',
        // assRateCorrect: "0",
        assessmentConfigId: '', // 评估频次
        isAssessment: 1, // 是否设置评估频次
        isWarm: 1, // 提醒
        isUsed: 1 // 启用
      },
      isAssessmentArr: [], // 评估频次数组
      table_data: [],
      // 搜索表单
      search_status: false,
      search_from: {
        signName: '',
        signType: '',
        deptId: '',
        formId: ''
      },
      visible: false,
      showDialog: false,
      predefineColors: [],
      error: {
        visible: false,
        text: '该分值区间与其他风险级别的分值区间有重合，请检查'
      },
      form_type_text: '', // 添加还是编辑
      recordArr: [],
      rules: {
        minRecord: [
          { required: true, message: '请输入最小值', trigger: 'blur' },
          { validator: validateRange, trigger: 'blur' },
          { validator: validateOneNum, trigger: 'blur' },
          { validator: validateAround, trigger: 'blur' }
        ],
        maxRecord: [
          { required: true, message: '请输入最大值', trigger: 'blur' },
          { validator: validateRange, trigger: 'blur' },
          { validator: validateOneNum, trigger: 'blur' },
          { validator: validateAround, trigger: 'blur' }
        ],
        levelColor: [
          { required: true, message: '请输入颜色', trigger: 'blur' }
        ],
        isAssessment: [
          {
            required: true,
            message: '请选择是否需要设置评估频次',
            trigger: 'blur'
          }
        ],
        assessmentConfigId: [
          { required: true, message: '请选择评估频次', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '风险级别不允许为空', trigger: 'blur' }
        ]
      },
      activeType: 'POST',
      scoreId: '',
      baseUrl: '/nams/web-na/ass-setting/'
    }
  },
  mounted () {
    // 列表
    this.getAssList()
    // 评估频次
    this.getAssessCodes()
  },
  methods: {
    // 获取列表
    getAssList () {
      const _this = this
      const url = _this.baseUrl + 'query?assId=' + _this.dataObj.assId
      AxiosApi(url, {}, 'GET', {}).then((res) => {
        if (res.status == '200') {
          _this.table_data = [...res.data]
          _this.recordArr = []
          _this.table_data.forEach((item) => {
            _this.recordArr.push({
              min: item.minRecord,
              max: item.maxRecord
            })
          })
        }
      })
    },
    // 格式化obj
    formatDataObj () {
      this.activeType = 'POST'
      this.dataObj.scoreId = ''
      this.dataObj.minRecord = ''
      this.dataObj.maxRecord = ''
      this.dataObj.level = ''
      this.dataObj.levelColor = '#333333'
      this.dataObj.isWarm = '1'
      this.dataObj.isUsed = '1'
      this.dataObj.assessmentConfigId = this.isAssessmentArr.length > 0 ? this.isAssessmentArr[0].value : ''
      this.showDialog = false
    },
    // 获取全部评估频次编码数据
    getAssessCodes () {
      this.isAssessmentArr = []
      this.loading = true
      ApiAssessSetting.select({ page: null, size: '' })
        .then((res) => {
          const list = res.data || []
          for (let i = 0; i < list.length; i++) {
            const item = list[i]
            const frequencyName = item.frequencyName
            const assessmentConfigId = item.assessmentConfigId
            this.isAssessmentArr.push({
              label: frequencyName,
              value: assessmentConfigId
            })
          }
          this.loading = false
        })
        .catch((res) => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    // 列表格式化-评估频次
    calAssess (row) {
      if (row.isAssessment) {
        // 需要设置评估频次
        const assessmentConfigDo = row.assessmentConfigDo || ''
        let frequencyName = ''
        if (assessmentConfigDo) {
          frequencyName = assessmentConfigDo.frequencyName || ''
        }
        return frequencyName
      } else {
        return '-'
      }
    },
    // 删除
    assDel (_data) {
      const _this = this
      const delObj = {
        scoreId: _data.scoreId
      }
      const tit = '风险级别为:"' + _data.level + '" 的数据'
      this.$confirm('确认要删除' + tit + '吗?', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      })
        .then(() => {
          AxiosApi(_this.baseUrl + 'delete', delObj, 'DELETE', {}).then(
            (res) => {
              _this.formatDataObj()
              if (res.desc === '操作成功') {
                this.$message({
                  message: tit + '成功删除',
                  type: 'success'
                })
                _this.getAssList()
                // this.tableData=res.data;
              } else {
                this.$message({
                  message: tit + '删除失败',
                  type: 'warning'
                })
              }
            }
          )
        })
        .catch(() => {})
    },
    // 初始化
    init () {
      if (this.dataObj.scoreId === '') {
        this.activeType = 'POST'
      } else {
        this.activeType = 'PUT'
        this.dataObj.isUsed = 1
        if (
          this.dataObj.isAssessment === null ||
          this.dataObj.isAssessment === '' ||
          this.dataObj.isAssessment === undefined
        ) {
          this.dataObj.isAssessment = 1
        }
        this.dataObj.assessmentConfigId = this.dataObj.assessmentConfigId
        const assessmentConfigDo = this.dataObj.assessmentConfigDo || ''
        let assessmentConfigId = ''
        if (assessmentConfigDo) {
          assessmentConfigId = assessmentConfigDo.assessmentConfigId || ''
        }
        this.dataObj.assessmentConfigId = assessmentConfigId
        this.form_type_text = this.dataObj.scoreId ? '编辑' : '添加'
      }
      this.getColor()
    },
    // 选择颜色
    getColor () {
      this.predefineColors = []
      const aColor = ['00', '33', '66', '99', 'CC', 'FF']
      const iLen = aColor.length
      let i = 0
      for (let r = 0; r < iLen; r++) {
        for (let g = 0; g < iLen; g++) {
          for (let b = 0; b < iLen; b++) {
            this.predefineColors.push(
              '#' +
                aColor[r].toString() +
                aColor[g].toString() +
                aColor[b].toString()
            )
            i++
          }
        }
      }
    },
    // 添加
    addOrUpdateForm (_data) {
      if (_data) {
        // 编辑
        this.dataObj = JSON.parse(JSON.stringify(_data))
      } else {
        // 添加
        this.formatDataObj()
      }
      this.init()
      this.showDialog = true
    },
    // 保存
    submitForm () {
      const that = this
      this.error.visible = false
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          that.error.visible = false
          that.dataObj.maxRecord = +that.dataObj.maxRecord
          that.dataObj.minRecord = +that.dataObj.minRecord
          that.dataObj.isUsed = 1
          const url =
            that.baseUrl + (that.activeType === 'PUT' ? 'update' : 'add')

          AxiosJsonApi(url, that.dataObj, that.activeType, {})
            .then((res) => {
              const status = res.status
              const desc = res.desc
              if (status === 200 || status === '200') {
                that.$message.success('保存正确！')
                that.error.visible = false
                that.showDialog = false
                that.getAssList()
              } else if (status === 500 || status === '500') {
                that.error = {
                  visible: true,
                  text: res.desc
                }
              } else {
                that.error.visible = false
                that.$message.error(desc || '保存异常1！')
              }
            })
            .catch((res) => {
              that.error.visible = false
              that.$message.error(res.desc || '保存异常2')
            })
        }
      })
    }
  }
}
</script>.<style lang="scss" type="text/scss" scoped>
@import "../../../assets/nrms/css/self_common";
/deep/ .el-main {
  > div {
    height: 100%;
  }
}

.import-item-dialog {
  /deep/ .el-dialog__body {
    padding: 0;
    height: 900px;
  }

  /deep/ .el-form {
    .el-input {
      width: 300px !important;
    }

    .el-input__inner {
      width: 100%;
    }
  }

  /deep/ .el-select {
    width: 100px;
  }
}
.safe_color {
  min-width: 475px;

  .el-color-dropdown__main-wrapper {
    display: none;
  }

  .el-color-predefine {
    width: 475px;
  }

  .el-color-predefine__color-selector {
    margin: 0 0 4px 4px;
    height: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 2px;
  }

  .el-color-predefine__color-selector:nth-child(10n + 1) {
    margin-left: 5px;
    border-radius: 2px;
  }

  .el-color-predefine__color-selector > div {
    border-radius: 2px;
  }
}

.form-main-center {
  max-width: 900px;
}

.assess-zhi {
  width: 20px;
  color: #666666;
  font-size: 14px;
  padding-left: 16px;
}
.tips {
  padding-right: 0 !important;
}
.assess-tip {
  height: 34px;
  line-height: 46px;
  white-space: nowrap;
  span {
    color: #9a9a9a;
    font-size: 12px;
  }
}

.assess-error {
  position: relative;
  top: -20px;
  left: 100px;

  span {
    color: #f56c6c;
    font-size: 12px;
  }
}

/deep/.el-col .color-item {
  height: 34px;
}
.safe_color {
  min-width: 475px;

  .el-color-dropdown__main-wrapper {
    display: none;
  }

  .el-color-predefine {
    width: 475px;
  }

  .el-color-predefine__color-selector {
    margin: 0 0 4px 4px;
    height: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 2px;
  }

  .el-color-predefine__color-selector:nth-child(10n + 1) {
    margin-left: 5px;
    border-radius: 2px;
  }

  .el-color-predefine__color-selector > div {
    border-radius: 2px;
  }
}

.warmText {
  color: #f56c6c;
}

.levelColor-main {
  text-align: center;
  /*border: 1px solid red;*/
  width: 100px;
  margin: 0 auto;

  .levelColor-color {
    float: left;
    width: 16px;
    height: 16px;
    border: 1px solid #f2f6fc;
    background: #ffffff;
    border-radius: 2px;
  }

  .levelColor-value {
    float: left;
    height: 16px;
    line-height: 16px;
    color: #666666;
    font-size: 14px;
    margin: 0 0 0 10px;
  }
}

.clear-both {
  clear: both;
}
</style>
