<template>
  <div class="container">
    <layout-list>
      <div slot="left_btn" class="tool-bar">
        <el-button
          type="warning"
          icon="el-icon-plus"
          @click="addNote"
          size="small"
          class="btn"
          >添加
        </el-button>
      </div>
      <div slot="right_btn" class="tool-bar">
        <el-button class="btn" type="primary" @click="onColumnVisibleShow">
          列设置
        </el-button>
      </div>
      <div slot="main" class="main-list" style="overflow: auto">
        <div class="table-list" style="height: 100%">
          <el-table :data="tableList" highlight-current-row height="100%" >
            <!-- <el-table-column show-overflow-tooltip type="index" align="center" label="序号" width="60" :index="indexMethod"></el-table-column> -->
            <el-table-column show-overflow-tooltip prop="time" label="时间" align="center" width="100">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="tengtongdengji" label="疼痛评分" align="center">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="buwei" label="疼痛部位" align="center" v-if="columnCheckedList.indexOf('buwei') >= 0">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="xingzhi" label="疼痛性质" align="center" v-if="columnCheckedList.indexOf('xingzhi') >= 0">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="chengdu" label="疼痛程度" align="center" v-if="columnCheckedList.indexOf('chengdu') >= 0">
            </el-table-column>
            <el-table-column
              prop="chixushijian"
              label="持续时间"
              align="center"
              show-overflow-tooltip
              v-if="columnCheckedList.indexOf('chixushijian') >= 0"
            >
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="zhengzhuang" label="伴随症状" align="center" v-if="columnCheckedList.indexOf('zhengzhuang') >= 0">
            </el-table-column>
            <el-table-column
              prop="jiazhongyinsu"
              label="加重因素"
              align="center"
              show-overflow-tooltip
              v-if="columnCheckedList.indexOf('jiazhongyinsu') >= 0"
            >
            </el-table-column>
            <el-table-column
              prop="huanjieyinsu"
              label="缓解因素"
              align="center"
              v-if="columnCheckedList.indexOf('huanjieyinsu') >= 0"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="shuimian" label="睡眠影响" align="center" v-if="columnCheckedList.indexOf('shuimian') >= 0">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="xinli" label="心理状况" align="center" v-if="columnCheckedList.indexOf('xinli') >= 0">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="zhiliaoyicongxing"
              label="治疗依从性"
              align="center"
              v-if="columnCheckedList.indexOf('zhiliaoyicongxing') >= 0"
            >
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="hulicuoshi" label="护理措施" align="center" v-if="columnCheckedList.indexOf('hulicuoshi') >= 0">
            </el-table-column>
            <el-table-column align="center" label="药物" v-if="columnCheckedList.indexOf('yaoming') >= 0 || columnCheckedList.indexOf('jiliang') >= 0 || columnCheckedList.indexOf('tujing') >= 0">
              <el-table-column show-overflow-tooltip prop="yaoming" label="药名" align="center" v-if="columnCheckedList.indexOf('yaoming') >= 0">
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="jiliang" label="剂量" align="center" v-if="columnCheckedList.indexOf('jiliang') >= 0">
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="tujing" label="途径" align="center" v-if="columnCheckedList.indexOf('tujing') >= 0">
              </el-table-column>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="zaipinggu" label="再评估" align="center" v-if="columnCheckedList.indexOf('zaipinggu') >= 0">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="qianming" label="护士签名" align="center">
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <template>
                  <el-button @click="edit(scope.row)" type="text"
                    >编辑</el-button
                  >
                  <el-button type="textred" @click="delRecord(scope.row)"
                    >删除</el-button
                  >
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="page-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="searchParams.page"
          :page-size="searchParams.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </layout-list>
    <!-------- 列设置 start -------->
    <el-dialog title="列设置" :visible.sync="columnVisible" width="580px">
      <div style="padding-bottom: 25px">
        <p>在表单中显示列：</p>
        <el-checkbox-group v-model="columnCheckedListCopy">
          <el-checkbox
            :label="item.id"
            v-for="(item, index) in columnCheckboxList"
            :key="item.id"
            class="column-checkbox-item"
            ><span class="column-checkbox-lable">{{
              item.label
            }}</span></el-checkbox
          >
        </el-checkbox-group>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="columnVisible = false">取消</el-button>
        <el-button type="primary" @click="onColumnSettingConfirm"
          >确认</el-button
        >
      </div>
    </el-dialog>
    <!-------- 列设置 end -------->
  </div>
</template>
<script>
import { ApiAssManage } from '../../../api/nrms/index'
const columnCheckboxList = [
  {
    label: '疼痛部位',
    id: 'buwei'
  },
  {
    label: '疼痛性质',
    id: 'xingzhi'
  },
  {
    label: '疼痛程度',
    id: 'chengdu'
  },
  {
    label: '持续时间',
    id: 'chixushijian'
  },
  {
    label: '伴随症状',
    id: 'zhengzhuang'
  },
  {
    label: '加重因素',
    id: 'jiazhongyinsu'
  },
  {
    label: '缓解因素',
    id: 'huanjieyinsu'
  },
  {
    label: '睡眠影响',
    id: 'shuimian'
  },
  {
    label: '心理状况',
    id: 'xinli'
  },
  {
    label: '治疗依从性',
    id: 'zhiliaoyicongxing'
  },
  {
    label: '护理措施',
    id: 'hulicuoshi'
  },
  {
    label: '药物-药名',
    id: 'yaoming'
  },
  {
    label: '药物-剂量',
    id: 'jiliang'
  },
  {
    label: '药物-途径',
    id: 'tujing'
  },
  {
    label: '再评估',
    id: 'zaipinggu'
  }
]
export default {
  props: [
    'patient',
    'patientType',
    'printSet',
    'formStyle',
    'formName',
    'formCode'
  ],
  data () {
    return {
      /**
       * ------------------------------------------------------------------
       * 初始化设置
       * ------------------------------------------------------------------
       */
      temp: {},
      searchParams: {
        page: 1,
        size: 10,
        assClass: '5',
        sort: {
          time: 1
        }
      },
      tableList: [],
      total: 0,
      /**
       * ------------------------------------------------------------------
       * 列设置
       * ------------------------------------------------------------------
       */
      columnVisible: false, // 列设置模态框
      columnCheckboxList, // 列设置checkbox
      columnCheckedList: [
        'buwei',
        'xingzhi',
        'chengdu',
        'chixushijian',
        'zhengzhuang',
        'jiazhongyinsu',
        'huanjieyinsu',
        'shuimian',
        'xinli',
        'zhiliaoyicongxing',
        'hulicuoshi',
        'zhiliaocuoshi',
        'yaoming',
        'jiliang',
        'tujing',
        'zaipinggu'
      ], // 选中的列设置
      columnCheckedListCopy: []
    }
  },
  async mounted () {
    try {
      let columnCheckedList = localStorage.getItem('painListCheckedList')
      if (columnCheckedList) {
        this.columnCheckedList = JSON.parse(columnCheckedList)
      }
    } catch (error) {
    }
    await this.getTemplate()
    await this.getList()
  },
  components: {
    LayoutList: () => import('../../../components/nrms/layout/list.vue')
  },
  watch: {
    patient: {
      async handler (newValue, oldValue) {
        this.reset()
      }
    }
  },
  methods: {
    /**
     * ------------------------------------------------------------------
     * 初始化
     * ------------------------------------------------------------------
     */

    /**
     * @description: 获取模板列表
     * @param {*}
     * @return {*}
     */
    async getTemplate () {
      let res = await ApiAssManage.assMangerList({
        assClass: '5'
      })
      this.temp = res.data[0]
    },

    /**
     * @description: 获取列表
     * @param {*}
     * @return {*}
     */
    async getList () {
      try {
        this.searchParams.patientId = this.patient.patientId
        let res = await ApiAssManage.getList(this.searchParams)
        this.tableList = res.data.list
        this.total = res.data.total
      } catch (error) {}
    },

    /**
     * @description: 序号
     * @param {*} index
     * @return {*}
     */
    indexMethod (index) {
      return (this.searchParams.page - 1) * this.searchParams.size + index + 1
    },

    /**
     * @description: 重置操作
     * @param {*}
     * @return {*}
     */
    reset () {
      this.searchParams = {
        ...this.searchParams,
        page: 1,
        size: 10
      }
      this.getList()
    },

    /**
     * ------------------------------------------------------------------
     * 增删改
     * ------------------------------------------------------------------
     */
    /**
     * @description: 添加
     * @param {*}
     * @return {*}
     */
    async addNote () {
      this.$emit('option-changed', 'add', { temp: this.temp }, {})
    },
    async edit (row) {
      this.$emit('option-changed', 'add', { temp: this.temp, row }, {})
    },
    async delRecord (row) {
      this.$confirm('确认要进行删除吗？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(async () => {
        try {
          let res = await ApiAssManage.delete(row.ass_record_id)
        } catch (error) {
          this.$message.error(error.message)
          return
        }
        if (this.total % this.searchParams.size == 1 && this.searchParams.page > 1) {
          this.searchParams.page--
        }
        this.$message.success('删除成功！')
        await this.getList()
      })
    },
    // 处理size变化
    handleSizeChange (val) {
      this.searchParams.size = val
      this.getList()
    },
    // 分页当前页码变化
    handleCurrentChange (val) {
      this.searchParams.page = val
      this.getList()
    },

    /**
     * ------------------------------------------------------------------
     * 列设置相关
     * ------------------------------------------------------------------
     */
    onColumnVisibleShow() {
      this.columnCheckedListCopy = [...this.columnCheckedList]
      this.columnVisible = true
    },

    /**
     * @description: 列设置确认
     * @param {*}
     * @return {*}
     */
    onColumnSettingConfirm () {
      this.columnCheckedList = [...this.columnCheckedListCopy]
      localStorage.setItem(
        'painListCheckedList',
        JSON.stringify(this.columnCheckedList)
      )
      this.columnVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../assets/nrms/css/self_common";
.header {
  display: flex;
  justify-content: space-between;
  padding: 13px 20px 0;
}
.btn {
  width: 80px;
  height: 28px;
}

/**
  * ------------------------------------------------------------------
  * 列设置
  * ------------------------------------------------------------------
  */
.column-checkbox-item {
  margin-right: 60px;
  margin-top: 20px;
  &:nth-child(4n) {
    margin-right: 0;
  }
  .column-checkbox-lable {
    display: inline-block;
    width: 56px;
  }
}
</style>
