<template>
  <layoutAside>
    <div slot="aside">
      <class-tree @changed="setFormType" />
    </div>
    <div slot="main">
      <el-tabs
        v-model="tabFormType"
        type="card"
        v-if="isTabType && name == 'list'"
        style="height: 100%"
        @tab-click="changeTab"
      >
        <el-tab-pane
          :label="EFormTypeText[item] + '管理'"
          :name="item"
          v-for="(item, index) in tabList"
          :key="index"
          style="height: 100%"
        >
          <component
            :is="name"
            :opType="opType"
            :detail="detail"
            :tabFormType="tabFormType"
            :isTabType="isTabType"
            @changed="changedRoute"
            :formPara="formPara"
          ></component>
        </el-tab-pane>
      </el-tabs>
      <component
        v-else
        :is="name"
        :opType="opType"
        :detail="detail"
        @changed="changedRoute"
        :formPara="formPara"
      ></component>
    </div>
  </layoutAside>
</template>

<script>
import list from './List'
import add from './Add'
import timeSetting from './TimeSetting'
import itemSetting from './ItemSetting'
import eventSetting from './EventSetting'
import inspect from './inspect'
import shiftReason from './shiftReason'
import list2 from '../../nams/assessManage/List.vue'
import add2 from '../../nams/assessManage/Add.vue'
import riskLevel from './riskLevel'
import ClassTree from './ClassTree'
import layoutAside from '../../../components/nrms/layout/aside'
import { EFormType, EFormTypeText } from '../../../assets/nrms/enum/formManage'
import { TabFormType } from './temperatureConfig'

export default {
  name: 'form_manage',
  data () {
    return {
      name: 'list',
      opType: 'add',
      detail: null,
      formPara: {
        formType: '', // EFormType.temperature,
        formTitle: '' // EFormTypeText[EFormType.temperature]
      },
      EFormType,
      EFormTypeText,
      formObj: {
        tpl_1: {
          typeId: EFormType.nurseNote,
          typeName: '护理记录单'
        },
        tpl_2: {
          typeId: EFormType.temperature,
          typeName: '体温单'
        },
        tpl_3: {
          typeId: EFormType.bloodSugar,
          typeName: '血糖单'
        },
        tpl_4: {
          typeId: EFormType.inOut,
          typeName: '出入量单'
        },
        tpl_5: {
          typeId: EFormType.observe,
          typeName: '观察记录单'
        },
        tpl_6: {
          typeId: EFormType.operation,
          typeName: '手术评估表单'
        },
        tpl_7: {
          typeId: EFormType.handover,
          typeName: '交接单'
        },
        tpl_9: {
          typeId: EFormType.bodyCondition,
          typeName: '体围记录单'
        },
        tpl_10: {
          typeId: EFormType.inspectNotice,
          typeName: '检查通知单'
        },
        tpl_11: {
          typeId: EFormType.intoAssess,
          typeName: '转入评估单'
        }
      },
      tabFormType: '',
      formType: ''
    }
  },
  methods: {
    changedRoute (name = 'list', opType = 'add', detail = null) {
      // this.formType = this.$route.params.formType;
      this.name = name
      this.opType = opType
      this.detail = detail
    },
    setFormType (data) {
      this.formPara.formType = data.id
      this.formPara.formTitle = data.label
      this.formType = this.formPara.formType
      this.changedRoute(data.id === 99 ? 'list2' : 'list')
      if (this.isTabType) {
        this.tabFormType = this.tabList[0]
      }
    },
    changeTab (tab, event) {
      this.tabFormType = tab.name
      this.formPara.formType = tab.name
      this.formPara.formTitle = EFormTypeText[this.formPara.formType]
    }
  },
  components: {
    list,
    add,
    timeSetting,
    itemSetting,
    eventSetting,
    inspect,
    layoutAside,
    ClassTree,
    shiftReason,
    list2,
    add2,
    riskLevel
  },
  beforeRouteEnter (to, from, next) {
    to.meta.keepAlive = true
    next()
  },
  created () {
    // this.formPara.formType = this.$route.params.formType
    // this.formPara.formTitle = this.formObj['tpl_' + this.formPara.formType].typeName
  },
  computed: {
    isTabType () {
      return !!TabFormType.get(this.formType)
    },
    tabList () {
      return TabFormType.get(this.formType)
    }
  }
}
</script>
<style scoped lang="scss">
@import "../../../assets/nrms/css/self_common";
/deep/ .el-tabs__content {
  height: calc(100% - 72px);
  overflow: auto;
}
</style>
