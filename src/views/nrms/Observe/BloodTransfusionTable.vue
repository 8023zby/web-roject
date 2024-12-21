<template>
  <div class="table">
    <ul>
      <li class="w-300 h-cell cell text-center bg-gray">日期</li>
      <li class="header-cell">
        <div>
          <ul>
            <li class="w-60 cell text-center bg-gray" :style="{height: 15 * 46 + 'px'}" style="padding: 20px">输血前评估</li>
          </ul>
        </div>
        <div>
          <ul>
            <li class="w-120 cell text-center" :style="{height: 5 * 46 + 'px'}">
              生命体征测量<br/>（输血开始前60分钟内）
            </li>
            <li class="w-120 cell text-center" :style="{height: 4 * 46 + 'px'}">
              输注途径
            </li>
            <li class="w-120 cell text-center" :style="{height: 4 * 46 + 'px'}">
              血液种类
            </li>
            <li class="w-120 cell text-center" :style="{height: 2 * 46 + 'px'}">
              床旁核对签名
            </li>
          </ul>
        </div>
        <div>
          <ul>
            <li class="w-120 h-cell cell text-left">
              测量时间
            </li>
            <li class="w-120 h-cell cell text-left">
              体温（℃）
            </li>
            <li class="w-120 h-cell cell text-left">
              脉搏（次/分）
            </li>
            <li class="w-120 h-cell cell text-left">
              呼吸（次/分）
            </li>
            <li class="w-120 h-cell cell text-left">
              血压（mmHg）
            </li>
            <li class="w-120 h-cell cell text-left">
              一次性钢针
            </li>
            <li class="w-120 h-cell cell text-left">
              外周静脉留置针
            </li>
            <li class="w-120 h-cell cell text-left">
              中心静脉导管
            </li>
            <li class="w-120 h-cell cell text-left">其他途径</li>
            <li class="w-120 h-cell cell text-left">红细胞（U）</li>
            <li class="w-120 h-cell cell text-left">血小板（治疗量）</li>
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
            <li class="w-60 cell text-center bg-gray" :style="{height: 6 * 46 + 'px'}" style="padding: 20px">输血中检测</li>
          </ul>
        </div>
        <div>
          <ul>
            <li class="w-120 h-cell text-center cell" style="border-right: 0"></li>
            <li class="w-120 cell text-center" :style="{height: 5 * 46 + 'px'}" style="white-space: nowrap;">
              生命体征测量<br/>（输血初始15分钟）
            </li>
          </ul>
        </div>
        <div>
          <ul>
            <li class="w-120 h-cell cell text-left">
              输血开始时间
            </li>
            <li class="w-120 h-cell cell text-left">
              测量时间
            </li>
            <li class="w-120 h-cell cell text-left">
              体温（℃）
            </li>
            <li class="w-120 h-cell cell text-left">
              脉搏（次/分）
            </li>
            <li class="w-120 h-cell cell text-left">
              呼吸（次/分）
            </li>
            <li class="w-120 h-cell cell text-left">
              血压（mmHg）
            </li>
          </ul>
        </div>
      </li>
      <li class="header-cell">
        <div>
          <ul>
            <li class="w-60 cell text-center bg-gray" :style="{height: 6 * 46 + 'px'}" style="padding: 20px">输血后评价</li>
          </ul>
        </div>
        <div>
          <ul>
            <li class="w-120 h-cell text-center cell" style="border-right: 0"></li>
            <li class="w-120 cell text-center" :style="{height: 5 * 46 + 'px'}" style="white-space: nowrap;">
              生命体征测量<br/>（输血初始15分钟）
            </li>
          </ul>
        </div>
        <div>
          <ul>
            <li class="w-120 h-cell cell text-left">
              输血开始时间
            </li>
            <li class="w-120 h-cell cell text-left">
              测量时间
            </li>
            <li class="w-120 h-cell cell text-left">
              体温（℃）
            </li>
            <li class="w-120 h-cell cell text-left">
              脉搏（次/分）
            </li>
            <li class="w-120 h-cell cell text-left">
              呼吸（次/分）
            </li>
            <li class="w-120 h-cell cell text-left">
              血压（mmHg）
            </li>
          </ul>
        </div>
      </li>
      <li class="header-cell">
        <div>
          <ul>
            <li class="cell text-center" :style="{height: 6 * 46 + 'px'}" style="width: 180px;padding: 20px">输血不良反应观察</li>
          </ul>
        </div>
        <div>
          <ul>
            <li class="w-120 h-cell cell text-left">
              无
            </li>
            <div class="header-cell">
              <ul>
                <li class="text-center cell" style="width: 30px" :style="{height: 5 * 46 + 'px'}">
                  有
                </li>
              </ul>
              <ul>
                <li class="h-cell cell text-left" style="width: 90px">
                  发生时间
                </li>
                <li class="h-cell cell text-left" style="width: 90px">
                  过敏反应
                </li>
                <li class="h-cell cell text-left" style="width: 90px">
                  发热反应
                </li>
                <li class="h-cell cell text-left" style="width: 90px">
                  溶血反应
                </li>
                <li class="h-cell cell text-left" style="width: 90px">
                  其他反应
                </li>
              </ul>
            </div>
          </ul>
        </div>
      </li>
      <li class="w-300 h-cell cell text-center" style="border-bottom: none">护士签名</li>
      <li class="w-300 h-cell cell text-center last-row" style="border-top: 1px solid #E6E6E6">操作</li>
    </ul>
    <ul v-for="(item,index) in tableList" :key="index">
      <li class="w-125 h-cell text-center cell bg-gray">{{getDate(tableList[index - 1]? tableList[index - 1].date : '' ,item.date)}}</li>
      <li class="w-125 h-cell text-center cell">{{delSecond(item.time1)}}</li>
      <li class="w-125 h-cell text-center cell">{{item.tiwen1}}</li>
      <li class="w-125 h-cell text-center cell">{{item.maibo1}}</li>
      <li class="w-125 h-cell text-center cell">{{item.huxi1}}</li>
      <li class="w-125 h-cell text-center cell">{{item.xueya1}}</li>
      <li class="w-125 h-cell text-center cell">
        <i v-if="item.gangzhen == '是'" class="el-icon-check"></i>
        <span v-else-if="item.gangzhen == '否'"></span>
        <span v-else>{{item.gangzhen}}</span>
      </li>
      <li class="w-125 h-cell text-center cell">
        <i v-if="item.zhiliuzhen == '是'" class="el-icon-check"></i>
        <span v-else-if="item.zhiliuzhen == '否'"></span>
        <span v-else>{{item.zhiliuzhen}}</span>
      </li>
      <li class="w-125 h-cell text-center cell">
        <i v-if="item.daoguan == '是'" class="el-icon-check"></i>
        <span v-else-if="item.daoguan == '否'"></span>
        <span v-else>{{item.daoguan}}</span>
      </li>
      <li class="w-125 h-cell text-center cell">{{item.qitatujing}}</li>
      <li class="w-125 h-cell text-center cell">{{item.hongxibao}}</li>
      <li class="w-125 h-cell text-center cell">{{item.xuexiaoban}}</li>
      <li class="w-125 h-cell text-center cell">{{item.xuejiang}}</li>
      <li class="w-125 h-cell text-center cell">{{item.qitazhonglei}}</li>
      <li class="w-125 h-cell text-center cell">{{item.zhixingzhe}}</li>
      <li class="w-125 h-cell text-center cell">{{item.heduizhe}}</li>
      <li class="w-125 h-cell text-center cell">{{delSecond(item.shuxueshijian1)}}</li>
      <li class="w-125 h-cell text-center cell">{{delSecond(item.time2)}}</li>
      <li class="w-125 h-cell text-center cell">{{item.tiwen2}}</li>
      <li class="w-125 h-cell text-center cell">{{item.maibo2}}</li>
      <li class="w-125 h-cell text-center cell">{{item.huxi2}}</li>
      <li class="w-125 h-cell text-center cell">{{item.xueya2}}</li>
      <li class="w-125 h-cell text-center cell">{{delSecond(item.shuxueshijian2)}}</li>
      <li class="w-125 h-cell text-center cell">{{delSecond(item.time3)}}</li>
      <li class="w-125 h-cell text-center cell">{{item.tiwen3}}</li>
      <li class="w-125 h-cell text-center cell">{{item.maibo3}}</li>
      <li class="w-125 h-cell text-center cell">{{item.huxi3}}</li>
      <li class="w-125 h-cell text-center cell">{{item.xueya3}}</li>
      <li class="w-125 h-cell text-center cell">
        <i v-if="item.wu == 'true'" class="el-icon-check"></i>
      </li>
      <li class="w-125 h-cell text-center cell">{{delSecond(item.fashengshijian)}}</li>
      <li class="w-125 h-cell text-center cell">
        <i v-if="item.guominfanying == 'true'" class="el-icon-check"></i>
      </li>
      <li class="w-125 h-cell text-center cell">
        <i v-if="item.farefanying == 'true'" class="el-icon-check"></i>
      </li>
      <li class="w-125 h-cell text-center cell">
        <i v-if="item.rongxuefanying == 'true'" class="el-icon-check"></i>
      </li>
      <li class="w-125 h-cell text-center cell">{{item.qitafanying}}</li>
      <li class="w-125 h-cell text-center cell" style="border-bottom: 0">{{item.signature}}</li>
      <li class="w-125 h-cell text-center cell last-row" style="border-top: 1px solid #E6E6E6">
        <div v-if="item.ass_record_id">
          <el-button
            @click="edit(item)"
            type="text"
            >编辑</el-button
          >
          <el-button
            type="textred"
            @click="delRecord(item)"
            >删除</el-button
          >
        </div>
      </li>
    </ul>
    <div class="shadow">

    </div>
  </div>
</template>
<script>
import { months } from 'moment'
const moment = require('moment')
export default {
  props: ['list'],
  data () {
    return {
      tableList: [...new Array(6)].map(item => [])
    }
  },
  watch: {
    list: {
      handler (newValue, oldValue) {
        this.getTable()
      }
    }
  },
  created () {
    this.getTable()
  },
  methods: {
    getTable () {
      this.tableList = [...new Array(6)].map(item => [])
      this.tableList.splice(0, this.list.length, ...this.list)
    },
    delSecond (time) {
      if (time) {
        return time.slice(0, time.lastIndexOf(':'))
      }
    },
    edit (row) {
      this.$emit('edit', row)
    },
    delRecord (row) {
      this.$emit('del', row)
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
.table {
  display: flex;
  border: 1px solid #E6E6E6;
  width: fit-content;
  overflow: auto;
  height: 100%;
  max-width: 100%;
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
}
.bg-gray {
  background: #F7F7F7;
}
.w-300 {
  width: 300px;
}
.w-60 {
  width: 60px;
}
.w-120 {
  width: 120px;
}
.w-125 {
  width: 125px;
}
.h-cell {
  height: 46px;
}
.header-cell {
  display: flex;
}
.cell {
  display: flex;
  align-items: center;
  border-right: 1px solid #E6E6E6;
  border-bottom: 1px solid #E6E6E6;
}
.text-center {
  justify-content: center;
  text-align: center;
}
.text-left {
  justify-content: flex-start;
  padding: 0 0 0 6px;
}
.last-row {
  position: sticky;
  bottom: 0;
  background: #fff;
}
.shadow {
  width: 100%;
  position: sticky;
  bottom: 10px;
  height: 20px;
  margin-bottom: -32px;
  box-shadow: 0 -10px 10px -10px rgba(0, 0, 0, 0.3);
}

</style>
