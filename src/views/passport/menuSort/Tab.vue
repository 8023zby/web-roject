<template>
  <div class="typt-list-container cls-tab">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane v-for="(item, index) in tabData" :key="index" :label="item.landingEndName" :name="item.landingEndId">
        <menu-list v-if="activeName === item.landingEndId" :landingEndId = "item.landingEndId" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MenuList from './Main'
import { AxiosApi } from '../../../api/passport/http'
import { MsgShow } from '../../../assets/passport/js/Message'

export default {
  components: {
    MenuList
  },
  data () {
    return {
      activeName: '',
      tabData: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      AxiosApi('/omms/web-rbac/authoritys/landingEnd/list', {}, 'GET').then(res => {
        if (res.status === 200) {
          this.tabData = res.data
          if (this.tabData.length === 0) {
            MsgShow('error', '无登录应用数据', 3000)
            return false
          }
          this.activeName = this.tabData[0].landingEndId
        } else {
          MsgShow('error', res.desc, 3000)
        }
      }).catch(() => {
        MsgShow('error', '获取登录应用接口异常，请联系管理员', 3000)
      })
    }
  }
}
</script>
<style lang="scss">
  .cls-tab{
    display: flex;
    flex-flow: column;
    box-sizing: border-box;
    .el-tabs{
      height: 100%;
      display: flex;
      flex-flow: column;
      box-sizing: border-box;
    }
    .el-tabs__content{
      height: 100%;
      overflow: auto;
      .el-tab-pane{
        height: 100%;
        overflow: auto;
        padding-left: 20px;
      }
    }
  }
</style>
