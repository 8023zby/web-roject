<template>
  <div class="container">
    <el-tabs :value="activeName" @tab-click="handleClick" type="card" style="width: 100%">
      <el-tab-pane label="体温单" name="first">
        <temperature-sheet-new v-bind="$attrs" v-on="$listeners"/>
      </el-tab-pane>
      <template v-for="(item,index) in formObjList">
        <el-tab-pane :label="v.formName" :name="v.formId" style="overflow: auto" :key="v.formId" v-for="(v, i) in item.list">
          <!-- 世博血糖单样式 -->
          <blood-sugar :key="'blood1_' + i + index" v-bind="$attrs" v-on="$listeners" :formObj="v"
                       v-if="item.formType == 3 && (v.formRelationStyle == '1' || !v.formRelationStyle)"/>
          <!-- 省立血糖单样式 -->
          <blood-sugar2 :key="'blood2_' + i + index" v-bind="$attrs" v-on="$listeners" :formObj="v"
                        v-if="item.formType == 3 && v.formRelationStyle == '2'"/>
          <!-- 世博血糖单样式---新 -->
          <blood-sugar-shi-bo :key="'blood3_' + i + index" v-bind="$attrs" v-on="$listeners" :formObj="v"
                              v-if="item.formType == 3 && v.formRelationStyle == '3'" />
          <!-- 中心医院血糖单样式 -->
          <blood-sugar-zhongxinyiyuan :key="'blood4_' + i + index" v-bind="$attrs" v-on="$listeners" :formObj="v"
                              v-if="item.formType == 3 && v.formRelationStyle == '4'" />
          <!-- 通用出入量 -->
          <in-out :key="'in_' + i + index" v-bind="$attrs" v-on="$listeners" :formObj="v"
                  v-if="item.formType == 4 && (v.formRelationStyle == '1' || !v.formRelationStyle)"/>
          <!-- 省立出入量 -->
          <in-out2 :key="'out_' + i + index" v-bind="$attrs" v-on="$listeners" :formObj="v"
                   v-if="item.formType == 4 && v.formRelationStyle == '2'"/>
          <!-- 体围记录单 -->
          <body-condition :key="'condition' + i + index" :formObj="v" v-bind="$attrs" v-on="$listeners" v-if="item.formType == 9" />
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import { ApiAutoForm } from '../../../api/nrms/index'

export default {
  name: 'tabs',
  data () {
    return {
      activeName: 'first',
      formObjList: [
        {
          name: '血糖单',
          formType: '3',
          list: []
        },
        {
          name: '出入量单',
          formType: '4',
          list: []
        },
        {
          name: '体围记录单',
          formType: '9',
          list: []
        }
      ]
    }
  },
  created () {
    this.getFormDict()
  },
  components: {
    'blood-sugar': () => import('./BloodSugar/BloodSugar'),
    'blood-sugar2': () => import('./BloodSugar2/BloodSugar'),
    'blood-sugar-shi-bo': () => import('./BloodSugarShiBo/List'),
    'blood-sugar-zhongxinyiyuan': () => import('./BloodSugarZhongxinyiyuan/BloodSugar'),
    'in-out': () => import('./InOut/Main'),
    'in-out2': () => import('./InOut2/Main'),
    TemperatureSheetNew: () => import('./TemperatureSheet/TemperatureSheetNew'),
    BodyCondition: () => import('./BodyCondition/Main')
  },
  methods: {
    handleClick (tab) {
    },
    async getFormDict () {
      this.formObjList.map(async item => {
        ApiAutoForm.getFormDictByType({ formType: item.formType }).then(res => {
          if (res.data instanceof Array) {
            item.list = res.data
          } else {
            if (res.data) {
              item.list.push(res.data)
            }
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";

  .container {
    height: 100%
  }
</style>
