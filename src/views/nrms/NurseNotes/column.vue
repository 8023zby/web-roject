<template>
  <!--<template v-if="signItem.show">-->
  <el-table-column :prop="signItem.signItemFieldName" align="center" v-if="signItem.hidden != 1">
    <template slot="header" slot-scope="scope">
      {{signItem.signItemShowName}}
      <br/>{{signItem.signItemUnit}}
    </template>
    <template slot-scope="scope">
      {{scope.row.extendList[signItem.signId] ? scope.row.extendList[signItem.signId]["itemValue"] : ""}}
    </template>
    <template
      v-if="signItem['signItemFieldName'] !== 'tiwen' && signItem['signItemFieldName'] !== 'tengtongdengji' && signItem['signItemFieldName'] !== 'xuetang' && signItem['signItemFieldName'] !== 'xueya'"
      v-for="item in signItem.childrenSignItem"
    >
      <column v-if="item.childrenSignItem && item.childrenSignItem.length" :key="item.signId" :signItem="item"></column>
      <el-table-column v-else :key="item.signId" :label="item.signItemShowName" :prop="item.signItemFieldName" align="center">
        <template slot-scope="scope">
          <template v-if="formCode === 'H-000010-WHJ-0024'">
            <!-- 省立表单 H-000010-WHJ-0024  -->
            <span v-if="scope.row.recordType === 1">
              <!-- 小结 -->
              {{scope.row.extendList[item.signId]  ? scope.row.extendList[item.signId]["itemValue"] : ""}}
            </span>
            <span v-else-if="scope.row.recordType === 2" style="color:#F56C6C;">
              <!-- 总结 -->
              {{scope.row.extendList[item.signId] ? scope.row.extendList[item.signId]["itemValue"] : ""}}
            </span>
            <span v-else>
              {{scope.row.extendList[item.signId] ? scope.row.extendList[item.signId]["itemValue"] : ""}}
            </span>
          </template>

          <template v-else>
            <!-- 2020-12-25 世博医院-危重记录单 如果是小结/总结 显示双横线，总结字体红色 H-000010-WHJ-0005  -->
            <span v-if="scope.row.recordType === 1" :class="{'double-line': item.signItemUnit}">
            <!-- 小结 -->
            {{scope.row.extendList[item.signId] ? scope.row.extendList[item.signId]["itemValue"] : ""}}
            </span>
            <span v-else-if="scope.row.recordType === 2" style="color: red" :class="{'double-line': item.signItemUnit}">
            <!-- 总结 -->
            {{scope.row.extendList[item.signId] ? scope.row.extendList[item.signId]["itemValue"] : ""}}
            </span>
            <span v-else>
            {{scope.row.extendList[item.signId] ? scope.row.extendList[item.signId]["itemValue"] : ""}}
            </span>
          </template>
        </template>
      </el-table-column>
    </template>
  </el-table-column>
  <!--</template>-->
</template>

<script>
export default {
  name: 'column',
  props: {
    signItem: {
      type: Object,
      required: true
    },
    // 表单code
    formCode: String
  },
  created () {

  }
}
</script>
<style lang="scss" scoped>
  .double-line {
    position: relative;
    padding-bottom: 3px;
    display: inline-block;

    &:before {
      content: " ";
      position: absolute;
      width: 100%;
      height: 0;
      border-bottom: 1px solid;
      left: 0;
      bottom: 2px;
    }
    &:after {
      content: " ";
      position: absolute;
      width: 100%;
      height: 0;
      border-bottom: 1px solid;
      left: 0;
      bottom: 0;
    }
  }
</style>
