<template>
  <section ref="print">
    <div style="text-align: center;">
      宣教记录
    </div>
    <div>
      <label style="padding-left:30px">姓名：</label><span>刘润杰</span>
      <label style="padding-left:30px">性别：</label><span>刘润杰</span>
      <label style="padding-left:30px">年龄：</label><span>刘润杰</span>
      <label style="padding-left:30px">床号：</label><span>刘润杰</span>
      <label style="padding-left:30px">科室：</label><span>刘润杰</span>
      <label style="padding-left:30px">住院号：</label><span>刘润杰</span>
    </div>
    <table style="width: 100%;
                  border-collapse: collapse;
                  margin: 0 auto;
                  text-align: center;">
      <tr>
        <th>宣教类型</th>
        <th>计划宣教时间</th>
        <th>宣教内容</th>
        <th>宣教对象</th>
        <th>宣教方式</th>
        <th>创建者</th>
        <th>更新时间</th>
        <th>效果评价</th>
        <th>评价者</th>
        <th>评价时间</th>
      </tr>
      <tr  v-for="(item,index) in printData" :key="index">
        <td>{{item.eduType}}</td>
        <td>{{item.eduType}}</td>
        <td>{{item.eduName}}</td>
        <td>{{item.eduTarget}}</td>
        <td>{{item.eduWay}}</td>
        <td>{{item.createUser}}</td>
        <td>{{item.createTime}}</td>
        <td>{{item.commentMessage}}</td>
        <td>{{item.commentUser}}</td>
        <td>{{item.commentTime}}</td>
      </tr>
    </table>
  </section>
</template>
<script>
export default {
  name: '',
  components: {},
  mixins: [],
  props: {
    printData: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {}
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>

</style>
