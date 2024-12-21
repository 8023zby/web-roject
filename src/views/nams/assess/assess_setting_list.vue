<template>
  <div class="typt-list-main">
    <div class="typt-list-container">
      <div class="typt-list-add-div">
        <el-button v-uni="'fengxianjibie_add'" type="warning"
                   size="small"
                   @click="add"
                   icon="el-icon-plus">添加
        </el-button>
      </div>
      <!--列表-->
      <el-table ref="table"
                :data="tableData"
                style="width: 100%">
        <!-- <el-table-column type="index"
                         align="center"
                         label="序号"
                         width="80">
        </el-table-column> -->
        <el-table-column align="center"
                         prop="minRecord"
                         label="最小值"
                         min-width="10%">
        </el-table-column>
        <el-table-column align="center"
                         prop="maxRecord"
                         label="最大值"
                         min-width="10%">
        </el-table-column>
        <el-table-column align="center"
                         prop="level"
                         label="风险程度"
                         min-width="10%">
        </el-table-column>
        <el-table-column align="center"
                         prop="levelColor"
                         label="颜色"
                         max-width="10%"
                         min-width="10%">
          <template slot-scope="scope">
            <div class="levelColor-main">
              <div class="levelColor-color"
                   :style="{background:scope.row.levelColor}"></div>
              <div class="levelColor-value">{{scope.row.levelColor}}</div>
              <div class="clear-both"></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         prop="assessmentConfigId"
                         label="评估频次"
                         min-width="10%">
          <template slot-scope="scope">
            <span>{{calAssess(scope.row)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         prop="isWarm"
                         label="是否提醒"
                         min-width="10%">
          <template slot-scope="scope">
            {{scope.row.isWarm == '1'? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column prop="ass_op"
                         label="操作"
                         min-width="25%"
                         align="center">
          <template slot-scope="scope">

            <!--el-button v-if="scope.row.isUsed==1"
                       @click="changeState(scope.row)"
                       type="text" size="small">
              <div class="warmText">停用</div>
            </el-button>
            <el-button v-else
                       @click="changeState(scope.row)"
                       type="text" size="small">
              <div>启用</div>
            </el-button-->

            <el-button v-uni="'fengxianjibie_edit'" @click="assEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button v-uni="'fengxianjibie_delete'" @click="assDel(scope.row)" type="text" size="small">
              <div class="warmText">删除</div>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--end-->
    </div>

    <!--新增、编辑对话框-->
    <el-dialog title="添加风险级别" :visible.sync="showDialog" width="500px" :showClose="false">
      <el-form :model="dataObj" class="typt-add-dialog" :rules="rules" ref="addForm">
        <el-row :gutter="20">
          <el-col :span="14">
            <el-form-item label="分值区间:"
                          label-width="100px"
                          prop="minRecord">
              <el-input v-model="dataObj.minRecord" placeholder="最小值"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <label class="el-form-item__label" style="width: 20px;">~</label>
          </el-col>
          <el-col :span="8">
            <el-form-item label="" label-width="0px" prop="maxRecord">
              <el-input v-model="dataObj.maxRecord" placeholder="最大值"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">

          <el-col :span="24">
            <el-form-item label="风险级别:" label-width="100px" prop="level">
              <el-input v-model="dataObj.level" placeholder="请输入风险级别名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="颜色:" label-width="100px">
              <el-color-picker
                v-model="dataObj.levelColor"
                popper-class="safe_color"
                :predefine="predefineColors">
              </el-color-picker>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="" label-width="1px">
              <el-input v-model="dataObj.levelColor"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="评估频次:" label-width="100px">
              <el-radio v-model="dataObj.assRateCorrect" label="0">每日评估</el-radio>
              <el-radio v-model="dataObj.assRateCorrect" label="1">每周评估</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="是否提醒:" label-width="100px">
              <el-radio v-model="dataObj.isWarm" label="1">是</el-radio>
              <el-radio v-model="dataObj.isWarm" label="0">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="状态:" label-width="100px">
              <el-radio v-model="dataObj.isUsed" label="1">启用</el-radio>
              <el-radio v-model="dataObj.isUsed" label="0">停用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="onSubmit(form)">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { AxiosApi, AxiosJsonApi } from '../../../api/nams/http/index'

export default {
  props: {
    params: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
      assId: '',
      assName: '',
      tableData: [],
      showDialog: false,
      form: {
        locationType: ''
      },
      rules: {
        minRecord: [
          { required: true, message: '请输入最小值', trigger: 'blur' },
          { pattern: /^[0-9][0-9]*$/, message: '请输入正整数！', trigger: 'blur' }
        ],
        maxRecord: [
          { required: true, message: '请输入最小值', trigger: 'blur' },
          { pattern: /^[0-9][0-9]*$/, message: '请输入正整数！', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '风险级别不允许为空', trigger: 'blur' }
        ]
      },
      temp: 'tamp',
      color: '#ccc',
      predefineColors: [],
      dataObj: {
        assId: this.params.assId,
        scoreId: '',
        level: '',
        levelColor: '#333333',
        minRecord: '',
        maxRecord: '',
        assRateCorrect: '0',
        isWarm: '1',
        isUsed: '1'
      },
      activeType: 'POST',
      scoreId: '',
      baseUrl: '/nams/web-na/ass-setting/'
    }
  },
  created () {
  },
  mounted () {
    console.log('mounted-params-----------------------------')
    console.log(this.params)
    this.assId = this.params.assId
    this.assName = this.params.assName
    this.getAssList()
    this.getColor()
  },
  updated () {
    this.$nextTick(function () {
      this.$refs.table.doLayout()
    })
  },
  methods: {
    // 比对评估频次
    calAssess (row) {
      let assessmentConfigDo = row.assessmentConfigDo || ''
      let frequencyName = ''
      if (assessmentConfigDo) {
        frequencyName = assessmentConfigDo.frequencyName || ''
      }
      return frequencyName
    },
    // 启用/禁用
    changeState (_data) {
      let _this = this
      _this.activeType = 'PUT'
      _this.dataObj.scoreId = _data.scoreId
      console.log(_data)
      _this.dataObj.minRecord = _data.minRecord
      _this.dataObj.maxRecord = _data.maxRecord
      _this.dataObj.level = _data.level
      _this.dataObj.levelColor = _data.levelColor
      _this.dataObj.isWarm = _data.isWarm + ''
      _this.dataObj.isUsed = 2 - (_data.isUsed + 1) + ''
      _this.dataObj.assRateCorrect = _data.assRateCorrect + ''
      console.log('_this.dataObj.isUsed:' + _this.dataObj.isUsed)
      let url = _this.baseUrl + 'update'
      AxiosJsonApi(url, _this.dataObj, _this.activeType, {}).then(res => {
        _this.formatDataObj()
        if (res.desc === '操作成功') {
          // _this.tableData=[...res.data];
          _this.getAssList()
        } else {
          // alert('error')
          _this.getAssList()
        }
      })
    },
    // 获取列表
    getAssList () {
      let _this = this
      let url = _this.baseUrl + 'query?assId=' + _this.assId
      AxiosApi(url, {}, 'GET', {}).then(res => {
        if (res.desc === '操作成功') {
          _this.tableData = [...res.data]
        } else {
          _this.tableData = []
        }
      })
    },
    // 编辑
    assEdit (_data) {
      this.$emit('option-changeds', 'Add', _data)
      /* let _this = this
      _this.activeType = 'PUT'
      _this.dataObj.scoreId = _data.scoreId
      _this.dataObj.minRecord = _data.minRecord
      _this.dataObj.maxRecord = _data.maxRecord
      _this.dataObj.level = _data.level
      _this.dataObj.levelColor = _data.levelColor
      _this.dataObj.isWarm = _data.isWarm + ''
      _this.dataObj.isUsed = _data.isUsed + ''
      _this.dataObj.assRateCorrect = _data.assRateCorrect + ''
      _this.showDialog = true */
    },
    // 格式化obj
    formatDataObj () {
      let _this = this
      _this.activeType = 'POST'
      _this.dataObj.scoreId = ''
      _this.dataObj.minRecord = ''
      _this.dataObj.maxRecord = ''
      _this.dataObj.level = ''
      _this.dataObj.levelColor = '#333333'
      _this.dataObj.isWarm = '1'
      _this.dataObj.isUsed = '1'
      _this.dataObj.assRateCorrect = '0'
      _this.showDialog = false
    },
    // 删除
    assDel (_data) {
      console.log('assDel')
      console.log(_data)
      let _this = this
      let delObj = {
        scoreId: _data.scoreId
      }
      let tit = '风险级别为："' + _data.level + '" 的数据'
      this.$confirm('确认要删除' + tit + '吗?', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        AxiosApi(_this.baseUrl + 'delete', delObj, 'DELETE', {}).then(res => {
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
        })
      }).catch(() => {
      })
    },
    // 添加
    add () {
      let _this = this
      _this.formatDataObj()
      // _this.showDialog = true

      let param = this.dataObj
      this.$emit('option-changeds', 'Add', param)
    },
    // 选择颜色
    getColor: function () {
      let aColor = ['00', '33', '66', '99', 'CC', 'FF']
      let iLen = aColor.length
      let i = 0
      for (let r = 0; r < iLen; r++) {
        for (let g = 0; g < iLen; g++) {
          for (let b = 0; b < iLen; b++) {
            this.predefineColors.push('#' + aColor[r].toString() + aColor[g].toString() + aColor[b].toString())
            i++
          }
        }
      }
    },
    // 提交
    onSubmit () {
      let _this = this
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          let url = _this.baseUrl + (_this.activeType === 'PUT' ? 'update' : 'add')
          AxiosJsonApi(url, _this.dataObj, _this.activeType, {}).then(res => {
            _this.formatDataObj()
            if (res.desc === '操作成功') {
              // _this.tableData=[...res.data];
              _this.getAssList()
            } else {
              // alert('error')
              _this.getAssList()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
  /*
    .typt-list-container .el-form {margin-left:16px;}
  */
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
      border-radius: 2px
    }

    .el-color-predefine__color-selector:nth-child(10n+1) {
      margin-left: 5px;
      border-radius: 2px
    }

    .el-color-predefine__color-selector > div {
      border-radius: 2px
    }
  }

  .warmText {
    color: #F56C6C;
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
      border: 1px solid #F2F6FC;
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
