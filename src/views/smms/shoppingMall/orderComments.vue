<!--
  文件描述：评论查看
    主样式class：list-page-new
  创建时间：2020/4/15 16:19
  创建人：Adsmallstrator

  关于表格多选时，选中行背景色改变说明：
    选中相关行后，记录选中数据的id，在row-class-name回调方法中，设置选中行的背景色：table-SelectedRow-bgcolor
  关于主体查询方法，方法名为：executeQueryPage
  表格数据变量为：pagination.list

  基本逻辑：
   挂载完成，调用查询数据的方法：executeQueryPage()
   在公共js文件BaseQueryPageForm中，查询出数据会处理，放到变量 pagination 里面，数据显示处理都是基于这个变量进行
-->
<template>
  <div class="typt-list-main">
    <div class="typt-list-container">
      <!--查询-->
      <el-form class="typt-list-search" :inline="true" label-suffix="：">
        <!--   查询条件 -->
        <el-form-item label="评论时间">
          <el-date-picker @change="changeDate()" v-model="createTime" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="请选择" end-placeholder="请选择">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="星级">
          <el-select v-model="form.star" placeholder="星级" size="small">
            <el-option label="全部" value="null" />
            <el-option label="一星" value="1" />
            <el-option label="二星" value="2" />
            <el-option label="三星" value="3" />
            <el-option label="四星" value="4" />
            <el-option label="五星" value="5" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <!--   按钮查询 -->
          <div class="typt-search-btn">
            <el-button type="primary" @click="onSubmit" class="el-button-radius" icon="el-icon-search" size="small">搜索</el-button>
            <el-button type="text" @click="reSearch" size="small">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <!--end-->
      <hr />
      <div class="typt-list-add-div">
        <!-- 添加 ,排序 按钮  -->
      </div>
      <!--列表-->
      <!-- table -->
      <div class="main-list" style="height: 100%" v-loading="yh_loading">
        <div class="list-th">
          <el-row>
            <el-col :span="8">用户</el-col>
            <el-col :span="8">评价时间</el-col>
            <el-col :span="8">星级</el-col>
          </el-row>
        </div>
        <ul class="infinite-list" v-infinite-scroll="loadList" style="overflow: auto" v-if="showListVisible">
          <li v-for="(item, index) in listData" :key="index" class="infinite-list-item">
            <el-row>
              <el-col :span="8">
                <img src="../../../../public/static/smms/img/user.png" class="Head-portrait" />
                <span class="patientName">床旁用户</span>
              </el-col>
              <el-col :span="8">{{ dealComTime(item.commentTime) }}</el-col>
              <el-col :span="8">
                <el-rate v-if="item.evaluationSynthesis !== null" :value="item.evaluationSynthesis" disabled>
                </el-rate>
              </el-col>
            </el-row>
          </li>
        </ul>
      </div>
      <!--组件页码显示-->
      <!-- 分页码 -->
    </div>
    <!--新增房间对话框-->
    <el-dialog :title="replayTit" :visible.sync="dialogFormVisible" width="35%" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="ruleForm" :model="replayForm" :rules="rules" class="typt-add-dialog">
        <el-form-item label="回复内容:" prop="desc">
          <el-input v-model="replayForm.desc" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveReplay('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { queryEval, saveReplay } from '../../../api/smms/shopingMall/evaluation'
import dateFormat from '../../../assets/smms/utils/dateFormat'
import BaseQueryPageForm from '../common/BaseQueryPageForm'

export default {
  name: 'Evaluation',
  mixins: [BaseQueryPageForm],
  data () {
    return {
      createTime: [],
      yh_loading: false,
      showListVisible: false,
      firstLoad: true,
      evaluationSynthesis: null, // 星级
      listData: [],
      page: 1,
      size: 20,
      total: 0,
      form: {
        star: 'null', // 星数
        beginTime: '', // 开始时间
        endTime: '' // 结束时间
      },
      data: '', // 评论数据
      replayForm: {
        desc: '',
        repalyId: ''
      },
      repalyVal: '',
      replayTit: '回复',
      dialogFormVisible: false,
      rules: {
        desc: [
          {
            required: true,
            min: 0,
            max: 100,
            message: '请输入回复内容且最多不超过100个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  inject: ['routerTo'],
  mounted: function () {
    const endDate = dateFormat(new Date(), 'yyyy-MM-dd')
    const beginDate = this.nDay(-6)
    this.createTime.push(beginDate)
    this.createTime.push(endDate)
    this.isCompleteInfo(true)
  },
  methods: {

    initQueryParams(){
      this.form.beginTime = this.createTime[0]
      this.form.endTime = this.createTime[1]
    },
    changeDate () {
      if (this.createTime) {
        this.initQueryParams()
      } else {
        this.form.beginTime = ''
        this.form.endTime = ''
      }
    },
    // 判断是否需要完善店铺信息
    isCompleteInfo (t) {
      const _this = this
      let shopImg = localStorage.getItem('shopInfo.img')
      if (
        shopImg === '' ||
        shopImg === null ||
        shopImg === undefined ||
        shopImg === 'null'
      ) {
        if (t) {
          _this.isWholeInfo(res => {
            _this.isCompleteInfo(false)
          })
        } else {
          this.$alert('店铺信息缺失，请点击左侧店铺信息菜单，完善信息。', '', {
            confirmButtonText: '确定',
            callback: action => {
              this.routerTo('/shop')
            }
          })
        }
      } else {
        _this.showListVisible = true
      }
    },
    dealComTime (t) {
      if (!t || t === null) return ''
      let t2 = t.split(' ')
      return t2[0]
    },
    loadList () {
      let p = this.pagination.page + 1
      if (this.firstLoad) {
        this.listData = []
        p = this.pagination.page
        this.firstLoad = false
      } else if (p > this.pagination.pages) {
        /* this.$message({
          message: '数据已加载完毕',
          type: 'success'
        }) */
        return
      }
      this.pageChangeHandler(p)
    },
    pageChangeHandler (page) {
      this.pagination.page = page
      this.executeQueryPage()
    },
    // 查询
    onSubmit () {
      this.size = 20
      this.page = 1
      this.firstLoad = true
      if (this.pagination.pageSize) this.pagination.pageSize = 10
      if (this.pagination.page) this.pagination.page = 1
      this.loadList()
    },
    //  清空筛选条件
    reSearch () {
      this.firstLoad = true
      const endDate = dateFormat(new Date(), 'yyyy-MM-dd')
      const beginDate = this.nDay(-6)
      this.createTime = []
      this.createTime.push(beginDate)
      this.createTime.push(endDate)
      this.form.beginTime = beginDate
      this.form.endTime = endDate
      this.form.star = 'null'
      this.size = 20
      this.page = 1
      if (this.pagination.pageSize) this.pagination.pageSize = 10
      if (this.pagination.page) this.pagination.page = 1
      this.loadList()
    },
    // 获取n天之后的日期
    nDay (day) {
      const today = new Date()
      const targetDayMilliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
      today.setTime(targetDayMilliseconds)
      const tYear = today.getFullYear()
      let tMonth = today.getMonth()
      let tDate = today.getDate()
      tMonth = this.doHandleMonth(tMonth + 1)
      tDate = this.doHandleMonth(tDate)
      return tYear + '-' + tMonth + '-' + tDate
    },
    doHandleMonth (month) {
      let m = month
      if (month.toString().length === 1) {
        m = '0' + month
      }
      return m
    },
    // 查询评论
    executeQueryPage () {
      this.yh_loading = true
      let y = this.CompareBeginEndTime(this.form.beginTime, this.form.endTime)
      if (y === 'n') {
        this.yh_loading = false
        return false
      }
     this.initQueryParams()
      let params ={
        beginTime:
          this.form.beginTime === null || this.form.beginTime === ''
            ? ''
            : this.form.beginTime + ' 00:00:00',
        endTime:
          this.form.endTime === null || this.form.endTime === ''
            ? ''
            : this.form.endTime + ' 23:59:59',
        evaluationSynthesis:
          this.form.star === 'null' || this.form.star === ''
            ? null
            : Number(this.form.star),
        isPage: 1,
        size: 20,
        page: this.pagination.page ? this.pagination.page : this.page
      };
      queryEval(params).then(res => {
          this.IsSuccess(
            res,
            () => {
              this.listData.push(...res.data.list)
              this.queryResultHandler(res)
            },
            false
          )
        })
        .catch(error => {
          this.$message.error(JSON.stringify(error) + '数据获取失败')
        })
        .finally(() => {
          this.yh_loading = false
        })
    },
    // 分页方法
    handleSizeChange (val) {
      this.size = val
      this.executeQueryPage()
    },
    handleCurrentChange (val) {
      this.page = val
      this.executeQueryPage()
    },
    // 回复评价
    replay (id) {
      this.dialogFormVisible = true
      this.replayForm.desc = ''
      this.replayForm.repalyId = id
    },
    replayEdit (id, val) {
      this.dialogFormVisible = true
      this.replayForm.desc = val
      this.replayForm.repalyId = id
    },
    // 提交回复
    saveReplay (formName) {
      const _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          saveReplay({
            id: _this.replayForm.repalyId,
            shopReply: _this.replayForm.desc
          })
            .then(res => {
              if (res.status === 200) {
                this.$message({
                  message: '回复成功',
                  type: 'success'
                })
                _this.dialogFormVisible = false
                _this.executeQueryPage()
              }
            })
            .catch(error => {
              this.$message.error(JSON.stringify(error) + '数据获取失败')
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
@import "@/assets/smms/css/self_common.scss";
.main-list {
  height: 100%;
  overflow: hidden;
  .list-th {
    background-color: #f8f8f8;
    border: 1px solid #e6e6e6;
    .el-row {
      .el-col {
        padding: 10px;
        text-align: center;
        color: #4c4c4c;
      }
    }
  }
  .infinite-list {
    height: 93%;
    overflow-y: auto;

    .infinite-list-item {
      .el-row {
        padding: 10px;
        border-bottom: 1px solid #f2f2f2;
        .el-col {
          text-align: center;
          .Head-portrait {
            width: 38px;
            height: 38px;
            border-radius: 17px;
            margin-right: 10px;
          }
          .patientName {
            position: absolute;
            top: 17px;
          }
        }
        .el-col:first-child {
          text-align: left;
          padding-left: 12%;
        }
      }
    }
  }
  // hover 样式
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background: #ffffff !important;
  }

  .hover-row {
    td {
      background: #ffffff !important;
    }
    transform: translate3d(0, 0, 0);
    box-shadow: 0px 0px 6px 0px rgba(124, 124, 124, 0.3);
  }

  ul li:hover {
    transform: translate3d(0, 0, 0);
    box-shadow: 0px 0px 6px 0px rgba(124, 124, 124, 0.3);
  }
}

.el-date-editor.el-input {
  width: 185px;
}
/deep/ .el-rate__icon {
  font-size: 36px;
}
</style>
