<template>
  <div class="passport-common-style" >
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">版本更新记录</div>
    </div>
    <div v-loading="loading" style="min-height: 500px">
      <ul>
        <li class="passport-clearFix passport-versionsList" v-for="(item,index) in tableData" :key="index">
          <div class="passport-clearFix">
            <p class="passport-fl" style="color: #1e87f0">ㆍ {{item.versionName}}</p>
            <p class="passport-fr">{{item.versionTime}}</p>
          </div>
          <div class="passport-versionsContent">
            <pre>{{item.versionContent}}</pre>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { MsgShow } from '../../assets/passport/js/Message'
import { AxiosApi } from '../../api/passport/http'
export default {
  data () {
    return {
      loading: false,
      url: '/omms/web-rbac/versions',
      tableData: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    // 编辑和查看状态获取信息
    getList () {
      this.loading = true
      AxiosApi(this.url, {}, 'GET', {
        page: 1,
        size: 999
      }).then(res => {
        this.loading = false
        if (res.status === 200) {
          if (res.data) {
            this.tableData = res.data.list
          }
        } else {
          MsgShow('error', res.desc, 3000)
        }
      })
    }
  }
}
</script>
<style type="text/css" lang="scss" scoped>
  .passport-clearFix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .passport-fr {
    float: right;
  }
  .passport-fl {
    float: left;
  }
  .passport-common-style li {
    list-style: none;
  }
  .passport-common-style .pims-page-title {
    height: 50px;
    background: #f7f7f7;
    padding-left: 20px;
  }
  .passport-versionsList{
    padding: 0 50px 0 22px;
    font-size: 14px;
    p{
      line-height: 60px;
    }
  }
  .passport-versionsContent{
    margin: 10px 0;
  }
  pre{
  white-space:pre-wrap;
  word-wrap:break-word;
  letter-spacing:1.5px;
  font-size: 14px;
  line-height:42px;
  color: #333;
  font-family: Arial;
  padding-left: 35px;
}
</style>
