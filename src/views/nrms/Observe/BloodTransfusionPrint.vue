<template>
  <div id="printPage">
    <div
      v-for="(pageItem, pageIndex) in pageList"
      :key="pageIndex"
      class="page-item"
    >
      <formHeader :autoHead="autoHead"></formHeader>
      <div class="header-checkbox">
        <label for="">
          <span class="label">ABO血型：</span>
          <el-checkbox-group v-model="assValue.ABOxuexing">
            <el-checkbox label="1611220411000_62574-0">A</el-checkbox>
            <el-checkbox label="1611220411000_62574-1">B</el-checkbox>
            <el-checkbox label="1611220411000_62574-3">AB</el-checkbox>
            <el-checkbox label="1611220411000_62574-2">O</el-checkbox>
          </el-checkbox-group>
        </label>
        <label for="">
          <span class="label" style="width: 80px">RH：</span>
          <el-checkbox-group v-model="assValue.RHxuexing">
            <el-checkbox label="1611220411000_54980-0">+</el-checkbox>
            <el-checkbox label="1611220411000_54980-1">-</el-checkbox>
          </el-checkbox-group>
        </label>
        <label for="">
          <span class="label" style="width: 80px">输血史：</span>
          <el-checkbox-group v-model="assValue.shuxueshi">
            <el-checkbox label="1611220411000_657-1">有</el-checkbox>
            <el-checkbox label="1611220411000_657-0">无</el-checkbox>
          </el-checkbox-group>
        </label>
      </div>
      <div class="header-checkbox">
        <label for="">
          <span class="label">输血不良反应史：</span>
          <el-checkbox-group v-model="assValue.fanyingshi">
            <el-checkbox
              label="1611220411000_34672-1"
              style="margin-right: 10px"
              >有</el-checkbox
            >
            <span style="margin-right: 10px">(</span>
            <el-checkbox label="1611220411000_69952-0">发热反应</el-checkbox>
            <el-checkbox label="1611220411000_69952-1">过敏反应</el-checkbox>
            <el-checkbox label="1611220411000_69952-2">溶血反应</el-checkbox>
            <el-checkbox
              label="1611220411000_69952-3"
              style="margin-right: 10px"
              >其他反应</el-checkbox
            >
            <span>)</span>
            <el-checkbox label="1611220411000_34672-0" style="margin-left: 10px"
              >无</el-checkbox
            >
          </el-checkbox-group>
        </label>
      </div>
      <div class="table">
        <ul>
          <li class="w-300 h-cell cell text-center bg-gray">日期</li>
          <li class="header-cell">
            <div>
              <ul>
                <li
                  class="w-60 cell text-center bg-gray"
                  :style="{ height: 15 * 32 + 'px' }"
                  style="padding: 20px"
                >
                  输血前评估
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <li
                  class="w-120 cell text-center"
                  :style="{ height: 5 * 32 + 'px' }"
                >
                  生命体征测量<br />（输血开始前60分钟内）
                </li>
                <li
                  class="w-120 cell text-center"
                  :style="{ height: 4 * 32 + 'px' }"
                >
                  输注途径
                </li>
                <li
                  class="w-120 cell text-center"
                  :style="{ height: 4 * 32 + 'px' }"
                >
                  血液种类
                </li>
                <li
                  class="w-120 cell text-center"
                  :style="{ height: 2 * 32 + 'px' }"
                >
                  床旁核对签名
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <li class="w-120 h-cell cell text-left">测量时间</li>
                <li class="w-120 h-cell cell text-left">体温（℃）</li>
                <li class="w-120 h-cell cell text-left">脉搏（次/分）</li>
                <li class="w-120 h-cell cell text-left">呼吸（次/分）</li>
                <li class="w-120 h-cell cell text-left">血压（mmHg）</li>
                <li class="w-120 h-cell cell text-left">一次性钢针</li>
                <li class="w-120 h-cell cell text-left">外周静脉留置针</li>
                <li class="w-120 h-cell cell text-left">中心静脉导管</li>
                <li class="w-120 h-cell cell text-left">其他途径</li>
                <li class="w-120 h-cell cell text-left">红细胞（U）</li>
                <li class="w-120 h-cell cell text-left" style="white-space: nowrap">血小板（治疗量）</li>
                <li class="w-120 h-cell cell text-left">血浆（ml）</li>
                <li class="w-120 h-cell cell text-left">其他种类</li>
                <li class="w-120 h-cell cell text-left">执行者</li>
                <li class="w-120 h-cell cell text-left">核对者</li>
              </ul>
            </div>
          </li>
          <li class="header-cell">
            <div>
              <ul>
                <li
                  class="w-60 cell text-center bg-gray"
                  :style="{ height: 6 * 32 + 'px' }"
                  style="padding: 20px"
                >
                  输血中检测
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <li
                  class="w-120 h-cell text-center cell"
                  style="border-right: 0"
                ></li>
                <li
                  class="w-120 cell text-center"
                  :style="{ height: 5 * 32 + 'px' }"
                  style="white-space: nowrap"
                >
                  生命体征测量<br />（输血初始15分钟）
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <li class="w-120 h-cell cell text-left">输血开始时间</li>
                <li class="w-120 h-cell cell text-left">测量时间</li>
                <li class="w-120 h-cell cell text-left">体温（℃）</li>
                <li class="w-120 h-cell cell text-left">脉搏（次/分）</li>
                <li class="w-120 h-cell cell text-left">呼吸（次/分）</li>
                <li class="w-120 h-cell cell text-left">血压（mmHg）</li>
              </ul>
            </div>
          </li>
          <li class="header-cell">
            <div>
              <ul>
                <li
                  class="w-60 cell text-center bg-gray"
                  :style="{ height: 6 * 32 + 'px' }"
                  style="padding: 20px"
                >
                  输血后评价
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <li
                  class="w-120 h-cell text-center cell"
                  style="border-right: 0"
                ></li>
                <li
                  class="w-120 cell text-center"
                  :style="{ height: 5 * 32 + 'px' }"
                  style="white-space: nowrap"
                >
                  生命体征测量<br />（输血初始15分钟）
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <li class="w-120 h-cell cell text-left">输血开始时间</li>
                <li class="w-120 h-cell cell text-left">测量时间</li>
                <li class="w-120 h-cell cell text-left">体温（℃）</li>
                <li class="w-120 h-cell cell text-left">脉搏（次/分）</li>
                <li class="w-120 h-cell cell text-left">呼吸（次/分）</li>
                <li class="w-120 h-cell cell text-left">血压（mmHg）</li>
              </ul>
            </div>
          </li>
          <li class="header-cell">
            <div>
              <ul>
                <li
                  class="cell text-center"
                  :style="{ height: 6 * 32 + 'px' }"
                  style="width: 200px; padding: 20px"
                >
                  输血不良反应观察
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <li class="w-120 h-cell cell text-left">无</li>
                <div class="header-cell">
                  <ul>
                    <li
                      class="text-center cell"
                      style="width: 30px"
                      :style="{ height: 5 * 32 + 'px' }"
                    >
                      有
                    </li>
                  </ul>
                  <ul>
                    <li class="h-cell cell text-left" style="width: 100px">
                      发生时间
                    </li>
                    <li class="h-cell cell text-left" style="width: 100px">
                      过敏反应
                    </li>
                    <li class="h-cell cell text-left" style="width: 100px">
                      发热反应
                    </li>
                    <li class="h-cell cell text-left" style="width: 100px">
                      溶血反应
                    </li>
                    <li class="h-cell cell text-left" style="width: 100px">
                      其他反应
                    </li>
                  </ul>
                </div>
              </ul>
            </div>
          </li>
          <li class="w-300 h-cell cell text-center">护士签名</li>
          <li
            class="w-300 h-cell cell text-center"
            :style="{ height: 3 * 32 + 'px' }"
          >
            输血条码
          </li>
        </ul>
        <ul v-for="(item, index) in pageItem.tableList" :key="index">
          <li class="w-125 h-cell text-center cell bg-gray">{{ getDate(pageItem.tableList[index - 1]? pageItem.tableList[index - 1].date : '' ,item.date) }}</li>
          <li class="w-125 h-cell text-center cell">
            {{ delSecond(item.time1) }}
          </li>
          <li class="w-125 h-cell text-center cell">{{ item.tiwen1 }}</li>
          <li class="w-125 h-cell text-center cell">{{ item.maibo1 }}</li>
          <li class="w-125 h-cell text-center cell">{{ item.huxi1 }}</li>
          <li class="w-125 h-cell text-center cell">{{ item.xueya1 }}</li>
          <li class="w-125 h-cell text-center cell">
            <span v-if="item.gangzhen == '是'">√</span>
            <span v-else-if="item.gangzhen == '否'"></span>
            <span v-else>{{item.gangzhen}}</span>
          </li>
          <li class="w-125 h-cell text-center cell">
            <span v-if="item.zhiliuzhen == '是'">√</span>
            <span v-else-if="item.zhiliuzhen == '否'"></span>
            <span v-else>{{item.zhiliuzhen}}</span>
          </li>
          <li class="w-125 h-cell text-center cell">
            <span v-if="item.daoguan == '是'">√</span>
            <span v-else-if="item.daoguan == '否'"></span>
            <span v-else>{{item.daoguan}}</span>
          </li>
          <li class="w-125 h-cell text-center cell">{{ item.qitatujing }}</li>
          <li class="w-125 h-cell text-center cell">{{ item.hongxibao }}</li>
          <li class="w-125 h-cell text-center cell">{{ item.xuexiaoban }}</li>
          <li class="w-125 h-cell text-center cell">{{ item.xuejiang }}</li>
          <li class="w-125 h-cell text-center cell">{{ item.qitazhonglei }}</li>
          <li class="w-125 h-cell text-center cell">{{ item.zhixingzhe }}</li>
          <li class="w-125 h-cell text-center cell">{{ item.heduizhe }}</li>
          <li class="w-125 h-cell text-center cell">
            {{ delSecond(item.shuxueshijian1) }}
          </li>
          <li class="w-125 h-cell text-center cell">
            {{ delSecond(item.time2) }}
          </li>
          <li class="w-125 h-cell text-center cell">{{ item.tiwen2 }}</li>
          <li class="w-125 h-cell text-center cell">{{ item.maibo2 }}</li>
          <li class="w-125 h-cell text-center cell">{{ item.huxi2 }}</li>
          <li class="w-125 h-cell text-center cell">{{ item.xueya2 }}</li>
          <li class="w-125 h-cell text-center cell">
            {{ delSecond(item.shuxueshijian2) }}
          </li>
          <li class="w-125 h-cell text-center cell">
            {{ delSecond(item.time3) }}
          </li>
          <li class="w-125 h-cell text-center cell">{{ item.tiwen3 }}</li>
          <li class="w-125 h-cell text-center cell">{{ item.maibo3 }}</li>
          <li class="w-125 h-cell text-center cell">{{ item.huxi3 }}</li>
          <li class="w-125 h-cell text-center cell">{{ item.xueya3 }}</li>
          <li class="w-125 h-cell text-center cell">
            <span v-if="item.wu == 'true'">√</span>
          </li>
          <li class="w-125 h-cell text-center cell">
            {{ delSecond(item.fashengshijian) }}
          </li>
          <li class="w-125 h-cell text-center cell">
            <span v-if="item.guominfanying == 'true'">√</span>
          </li>
          <li class="w-125 h-cell text-center cell">
            <span v-if="item.farefanying == 'true'">√</span>
          </li>
          <li class="w-125 h-cell text-center cell">
            <span v-if="item.rongxuefanying == 'true'">√</span>
          </li>
          <li class="w-125 h-cell text-center cell">{{ item.qitafanying }}</li>
          <li class="w-125 h-cell text-center cell">{{ item.signature }}</li>
          <li
            class="w-125 h-cell text-center cell"
            :style="{ height: 3 * 32 + 'px' }"
          ></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { ApiAssManage } from '../../../api/nrms'
import printJS from 'print-js'
const moment = require('moment')
const STYLE = `
ul, li {
  margin: 0;
  padding: 0;
}
.page-item {
  page-break-after:always;
}
.table {
  display: flex;
  border-top: 1px solid #000;
  border-left: 1px solid #000;
  width: fit-content;
}
.table li {
  box-sizing: border-box;
}
.table div {
  box-sizing: border-box;
}
.table span {
  box-sizing: border-box;
}
.bg-gray {
  background: #f7f7f7;
}
.w-300 {
  width: 330px;
}
.w-60 {
  width: 70px;
}
.w-120 {
  width: 130px;
}
.w-125 {
  width: 120px;
}
.h-cell {
  height: 32px;
}
.header-cell {
  display: flex;
}
.cell {
  display: flex;
  align-items: center;
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
}
.text-center {
  justify-content: center;
  text-align: center;
}
.text-left {
  justify-content: flex-start;
  padding: 0 0 0 6px;
}
.header-checkbox {
  display: flex;
  padding-left: 30px;
  margin-bottom: 12px;
}
label {
    white-space: nowrap;
}
.label {
  width: 120px;
  text-align: right;
  display: inline-block;
  margin-right: 12px;
}
.header-checkbox .el-checkbox-group {
  display: inline-block;
}
.header-checkbox .el-checkbox {
  margin-right: 24px;
}
`
export default {
  props: {
    patientId: {
      type: String,
      default: ''
    },
    autoHead: {
      type: Object,
      default: () => {
        return {
          tplId: '',
          formName: '',
          tplHtml: '<div>loading</div>',
          tplData: {}
        }
      }
    },
    assValue: {
      type: Object,
      default: () => {
        return {
          ABOxuexing: [],
          RHxuexing: [],
          shuxueshi: [],
          fanyingshi: [],
          buliangfanying2: []
        }
      }
    }
  },
  data () {
    return {
      tableList: [...new Array(6)].map((item) => []),
      searchParams: {
        assClass: '7',
        patientId: '',
        sort: {
          date: 1
        }
      },
      list: [],
      pageList: []
    }
  },
  components: {
    formHeader: () => import('../../../components/nrms/autoForm/header')
  },
  created () {
    this.getList()
  },
  methods: {
    async getList () {
      this.searchParams.patientId = this.patientId
      try {
        let res = await ApiAssManage.getList(this.searchParams)
        this.list = res.data || []
        this.pageList = [...new Array(Math.ceil((this.list.length ? this.list.length : 1) / 6))].map(
          (item, index) => {
            return {
              tableList: [...new Array(6)].map(
                (v, i) => this.list[6 * index + i] || []
              )
            }
          }
        )
      } catch (error) {}
    },
    getTable () {
      this.tableList.splice(0, this.list.length, ...this.list)
    },
    delSecond (time) {
      if (time) {
        return time.slice(0, time.lastIndexOf(':'))
      }
    },
    async print () {
      await this.getList()
      printJS({
        printable: `printPage`,
        type: 'html',
        style: STYLE,
        scanStyles: false
      })
    },
    // 如果当前日期换月了，体现全部，否则只显示日
    getDate (lastDate, nowDate) {
      if (!nowDate) {
        return ''
      }
      if (!lastDate) {
        return nowDate
      }
      let lastDateMonth = moment(lastDate).month()
      let nowDateMonth = moment(nowDate).month()
      let lastDateYear = moment(lastDate).year()
      let nowDateYear = moment(nowDate).year()
      if ((lastDateMonth == nowDateMonth) && (lastDateYear == nowDateYear)) {
        return moment(nowDate).date() < 10 ? '0' + moment(nowDate).date() : moment(nowDate).date()
      } else {
        return nowDate
      }
    }
  }
}
</script>
<style lang="scss" scoped>
ul, li {
  margin: 0;
  padding: 0;
}
.page-item {
  page-break-after:always;
}
.table {
  display: flex;
  border-top: 1px solid #000;
  border-left: 1px solid #000;
  width: fit-content;
}
.table li {
  box-sizing: border-box;
}
.table div {
  box-sizing: border-box;
}
.table span {
  box-sizing: border-box;
}
.bg-gray {
  background: #f7f7f7;
}
.w-300 {
  width: 330px;
}
.w-60 {
  width: 70px;
}
.w-120 {
  width: 130px;
}
.w-125 {
  width: 120px;
}
.h-cell {
  height: 32px;
}
.header-cell {
  display: flex;
}
.cell {
  display: flex;
  align-items: center;
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
}
.text-center {
  justify-content: center;
  text-align: center;
}
.text-left {
  justify-content: flex-start;
  padding: 0 0 0 6px;
}
.header-checkbox {
  display: flex;
  padding-left: 30px;
  margin-bottom: 12px;
  label {
    white-space: nowrap;
  }
  .label {
    width: 120px;
    text-align: right;
    display: inline-block;
    margin-right: 12px;
  }
}
/deep/ .header-checkbox .el-checkbox-group {
  display: inline-block;
}
/deep/ .header-checkbox .el-checkbox {
  margin-right: 24px;
}
</style>
