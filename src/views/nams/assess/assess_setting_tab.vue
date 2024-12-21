<template>
  <div class="container">
    <div class="right">
      <el-tabs type="card"
               v-model="activeName"
               @tab-click="handleClickTab">
        <template v-for="item in assData">
          <el-tab-pane :label="item.assName"
                       :key="item.assId"
                       :name="item.assId">
            <level-list v-if="item.assId === activeName && flag"
                        v-on="$listeners"
                        @option-changeds="optionChangeHandlers"
                        :params="paraData"/>
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { AxiosApi } from '../../../api/nams/http/index'
import showLevel from './assess_setting_list.vue'

export default {
  data () {
    return {
      activeName: '',
      assData: [],
      deptId: JSON.parse(localStorage.getItem('deptInfo')).deptId || '',
      paraData: {},
      flag: true
    }
  },
  props: ['assessDetail'],
  provide () {
    return {
      // tabRefresh: this.reload
    }
  },
  watch: {
    assessDetail: {
      handler (newval, oldval) {
      },
      immediate: true
    }
  },
  mounted () {
    this.getData()
  },
  created () {

  },
  updated () {
    let that = this
    that.$nextTick(function () {
      if (that.assessDetail.assId) {
        that.reload(this.assessDetail.assId)
      }
    })
  },
  methods: {
    optionChangeHandlers (optionType = 'Tab', assessDetail = {}) {
      this.$emit('option-changed', optionType, assessDetail)
    },
    getData () {
      let _this = this
      AxiosApi('/nams/web-na/ass-dict/query?isMenu=0&deptId=' + _this.deptId, {}, 'GET', {}).then(res => {
        if (res.desc === '操作成功') {
          _this.assData = res.data
          if (_this.assData.length > 0) {
            let obj = _this.assData[0]
            _this.activeName = obj.assId
            _this.formatParaData(obj)
          }
        } else {
          _this.assData = []
        }
      })
    },
    formatParaData (_o) {
      let obj = _o
      this.paraData = {
        assId: obj.assId,
        assName: obj.assName,
        isLoop: obj.haveRacordRate,
        assRate: obj.assRate
      }
    },
    handleClickTab (tab) {
      for (let tmp of this.assData) {
        if (tmp.assId === tab.name) {
          this.formatParaData(tmp)
        }
      }
    },
    reload (act) {
      if (act === '' || act === undefined || act === null) {
        return false
      }
      let that = this
      that.flag = false
      that.$nextTick(function () {
        that.$emit('clear-changed')
        that.activeName = act
        that.flag = true
      })
    }
  },
  components: {
    'level-list': showLevel
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  .container {
    height: 100%;
    width: 100%;
  }

  /deep/ .el-tabs--card .el-tabs__header {
    padding-top: 15px !important;
  }

  /deep/ .el-tabs__header {
    margin-bottom: 0 !important;
  }

  /*
    .container /deep/ .el-tabs__nav-wrap {
      padding-left: 20px;
    }

    .container /deep/ .el-tabs {
      height: 100%;
      position: relative;
    }
    .container /deep/ .el-tabs__content {
      position: absolute;
      top: 55px;
      left: 0;
      right: 0;
      bottom: 0;
      > div {
        height: 100%;
      }
    }
  */
</style>
