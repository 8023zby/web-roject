<template>
  <!--<div class="box">-->
  <div class="personIn">
    <div class="basic">
      <div class="bed_no">
        <div>{{ bed_name }}</div>
      </div>
      <div class="name">
        {{ patient ? patient.patientName : " " }}
      </div>
      <div class="sex_age_inpno">
        <div>
          <!--<span>{{ patient ? patient.sex : " " }} </span>-->
          <span>{{ patient && label_data.basic.includes('sex') ? item_config.sex[patient.sex] : " " }} </span>
          <span>{{ patient && label_data.basic.includes('patientAge') ? patient.patientAge : " " }}</span>
        </div>
        <div class="inp_no">
          {{ patient && label_data.basic.includes('inpNo') ? patient.inpNo : " " }}
        </div>
      </div>
      <div
        class="nurse_level"
        :style="{
          borderTopColor:
            nurse_level && nurse_level.backgroundColor
              ? nurse_level.backgroundColor
              : '',
          borderRightColor:
            nurse_level && nurse_level.backgroundColor
              ? nurse_level.backgroundColor
              : '',
          color:
            nurse_level && nurse_level.fontColor ? nurse_level.fontColor : ''
        }"
      >
        <span>{{
          nurse_level && nurse_level.nurseLevelShort
            ? nurse_level.nurseLevelShort
            : ""
        }}</span>
      </div>
    </div>
    <!-- 基本标签 限3个 -->
    <div class="label" v-if="patient">

      <div class="line" v-if="label_data.basicTopThree[0]">
        <!--此处getColor方法适用于通用版此区域走配置项传递过来的颜色值-->
        <template>
          <div>
            <div class="title"
                 :style="{color:getFontColor(label_data.basicTopThree[0], patient_info['basic'])}"
            >{{ label_data.basicTopThree[0].labelName }}</div>
          </div>
          <div class="value" :style="{color:getFontColor(label_data.basicTopThree[0], patient_info['basic'])}">
            :<span v-html="getValueColor(label_data.basicTopThree[0], patient_info['basic'])" style="color: #333;"></span>
          </div>
        </template>
      </div>
      <div class="line line_empty" v-else>&nbsp;</div>
      <div class="line" v-if="label_data.basicTopThree[1]">
        <template>
          <div>
            <div class="title"
                 :style="{color:getFontColor(label_data.basicTopThree[1], patient_info['basic'])}"
            >{{ label_data.basicTopThree[1].labelName }}</div>
          </div>
          <div class="value" :style="{color:getFontColor(label_data.basicTopThree[1], patient_info['basic'])}">
            :<span v-html="getValueColor(label_data.basicTopThree[1], patient_info['basic'])" style="color: #333;"></span>
          </div>
        </template>
      </div>
      <div class="line line_empty" v-else>&nbsp;</div>
      <div class="line"  v-if="label_data.basicTopThree[2]">
        <template>
          <div>
            <div class="title"
                 :style="{color:getFontColor(label_data.basicTopThree[2], patient_info['basic'])}">
              {{ label_data.basicTopThree[2].labelName }}
            </div>
          </div>
          <div class="value" :style="{color:getFontColor(label_data.basicTopThree[2], patient_info['basic'])}">
            :<span v-html="getValueColor(label_data.basicTopThree[2], patient_info['basic'])" style="color: #333;"></span>
          </div>
        </template>
      </div>
      <div class="line line_empty" v-else>&nbsp;</div>
      <!--
      <div class="line">
        <div>
          <div class="title">病情</div>
        </div>
        <div class="value">
          :{{ patient ? patient.illnessStatus : " " }}
        </div>
      </div>

      <div class="line">
        <div>
          <div class="title">过敏</div>
        </div>
        <div class="value">
          :{{ patient ? patient.allergy : " " }}
        </div>
      </div>

      <div class="line">
        <div>
          <div class="title">费别</div>
        </div>
        <div class="value">
          :{{ patient ? patient.insuranceType : " " }}
        </div>
      </div>
      -->
    </div>
    <div class="add" v-else>
      <img src="../../assets/bnms/images/add.png" />
    </div>
    <!-- 护理标签 前10个 -->
    <div class="pg_label">
      <div v-if="patient">
        <template v-for="item in label_top_ten">
          <a
            class="image"
            :title="item.labelName"
            :key="item.labelId"
            :href="item.labelEvent ? item.labelEvent : 'javascript:;'"
            :target="item.labelEvent ? '_blank' : ''"
            v-if="item.labelShowType == '3'"
          >
            <ShapeSvg
              :shape="item.labelShowInfo[0]"
              :color="item.labelShowInfo[1]"
            />
          </a>
          <a
            class="image"
            :title="item.labelName"
            :key="item.labelId"
            :href="item.labelEvent ? item.labelEvent : 'javascript:;'"
            :target="item.labelEvent ? '_blank' : ''"
            v-else-if="item.labelShowType == '4'"
          >
            <img :src="item.labelShowInfo[0]" style="width: 20px; height: 20px">
          </a>
          <a
            v-else
            class="shape"
            :title="item.labelName"
            :key="item.labelId"
            :href="item.labelEvent ? item.labelEvent : 'javascript:;'"
            :target="item.labelEvent ? '_blank' : ''"
            :style="{
              backgroundColor: item.labelShowInfo[1]
                ? item.labelShowInfo[1]
                : '#ff4b76'
            }"
          >
            {{ item.labelShowType == 2 ? item.labelShowInfo[0] || "-" : "" }}
          </a>
        </template>
      </div>
    </div>
    <!-- 护理标签 后10个 -->
    <div class="yj_label">
      <div v-if="patient">
        <template v-for="item in label_next_ten">
          <a
            class="image"
            :title="item.labelName"
            :key="item.labelId"
            :href="item.labelEvent ? item.labelEvent : 'javascript:;'"
            :target="item.labelEvent ? '_blank' : ''"
            v-if="item.labelShowType == '3'"
          >
            <ShapeSvg
              :shape="item.labelShowInfo[0]"
              :color="item.labelShowInfo[1]"
            />
          </a>
          <a
            :title="item.labelName"
            class="image"
            :key="item.labelId"
            :href="item.labelEvent ? item.labelEvent : 'javascript:;'"
            :target="item.labelEvent ? '_blank' : ''"
            v-else-if="item.labelShowType == '4'"
          >
            <img :src="item.labelShowInfo[0]" style="width: 20px; height: 20px">
          </a>
          <a
            v-else
            :title="item.labelName"
            class="shape"
            :key="item.labelId"
            :href="item.labelEvent ? item.labelEvent : 'javascript:;'"
            :target="item.labelEvent ? '_blank' : ''"
            :style="{
              backgroundColor: item.labelShowInfo[1]
                ? item.labelShowInfo[1]
                : '#ff4b76'
            }"
          >
            {{ item.labelShowType == 2 ? item.labelShowInfo[0] || "-" : "" }}
          </a>
        </template>
      </div>
    </div>
  </div>
  <!--</div>-->
</template>

<script>
import item_config from '../../assets/bnms/common/item_config'

export default {
  name: 'bed_card',
  props: {
    bed_name: {
      type: String,
      required: true
    },
    patient: {
      type: Object,
      default: function () {
        return {}
      }
    },
    nurse_level: {
      type: Object,
      default: function () {
        return {}
      }
    },
    patient_info: {
      type: Object,
      default: function () {
        return {}
      }
    },
    label_data: {
      type: Object,
      required: true,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      item_config
    }
  },
  computed: {
    label_nurse () {
      let _arr = []
      for (let i = 0; i < this.label_data.nurse.length; i++) {
        let item = this.label_data.nurse[i]
        if (item.labelShowInfo && this.patient_info && this.patient_info['nurse']) {
          // if (this.bed_name == 8) debugger
          // [简称]需要处理下
          if (item.labelShowType === 2) {
            let infoArr = item.labelShowInfo[0] ? item.labelShowInfo[0].split('') : []
            let first = infoArr[0] || ''
            let second = infoArr[1] || ''
            if (!first || /[\u4e00-\u9fa5]/.test(first) || /[A-Z]/.test(first)) {
              item.labelShowInfo[0] = first
            } else {
              item.labelShowInfo[0] = first + second
            }
          }
          // 关联字段(3) 有标识 且 是true的
          if (item.dataSources === 3 && (this.patient_info['nurse'][item.labelSql])) {
            _arr.push(item)
          }
          // 关联患者  关联评估  关联脚本
          if ((item.dataSources === 1 || item.dataSources === 2 || item.dataSources === 4) && item.labelValue) {
            if (item.labelValue.split(',').includes(this.bed_name)) {
              _arr.push(item)
            }
          }
        }
      }
      return _arr
    },
    label_top_ten () {
      return this.label_nurse.slice(0, 10)
    },
    label_next_ten () {
      return this.label_nurse.slice(10, 20)
    }
  },
  created () {},
  updated () {},
  methods: {
    // 床位一览中间区域获取标签设置的字体颜色
    getFontColor (label, values) {
      if (label.labelShowInfo) {
        const val = values[label.labelSql] || ''
        const { style, item } = label.labelShowInfo ? JSON.parse(label.labelShowInfo) : {}

        if (style === 'checkbox') {
          return '#333'
        } else if (style === 'select' || style === 'radio') {
          const i = item.filter(item => item.name === val)
          return i[0] ? i[0].config.fontColor : '#333'
        } else {
          return item[0] ? item[0].config.fontColor : '#333'
        }
      } else {
        return '#333'
      }
    },
    getValueColor (label, values) {
      const val = values[label.labelSql] || ''

      if (label.labelShowInfo) {
        const { style, item } = label.labelShowInfo ? JSON.parse(label.labelShowInfo) : {}

        if (style === 'checkbox') {
          const vals = val.split(',')
          const colors = {}
          for (let i = 0; i < item.length; i++) {
            colors[item[i].name] = item[i].config
          }
          let html = []
          for (let i = 0; i < vals.length; i++) {
            const color = colors[vals[i]] ? colors[vals[i]].fontColor : '#333'
            html.push('<span style="color:' + color + '">' + vals[i] + '</span>')
          }
          return html.join('、')
        } else if (style === 'select' || style === 'radio') {
          const i = item.filter(item => item.name === val)
          const color = i[0] ? i[0].config.fontColor : '#333'
          return '<span style="color:' + color + '">' + val + '</span>'
        } else {
          const color = item[0] ? item[0].config.fontColor : '#333'
          return '<span style="color:' + color + '">' + val + '</span>'
        }
      } else {
        return val
      }
    }
  },
  components: {
    ShapeSvg: () => import('@/components/bnms/ShapeSvg')
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
@media screen and (max-width: 1280px) {
  .personIn .basic .name {
    font-size: 12px !important;
  }
  .personIn .basic .sex_age_inpno {
    font-size: 12px !important;
    margin-right: 17px !important;
  }
  .personIn .basic .bed_no > div {
    width: 40px !important;
  }
  .personIn .basic .bed_no {
    font-size: 15px !important;
  }
}

.personIn {
  background-color: #fff;
  color: #7a7a7a;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  line-height: initial;
  .basic {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    position: relative;
    .bed_no {
      font-size: 18px;
      > div {
        border-top-left-radius: 5px;
        width: 60px;
        margin-right: 5px;
        text-align: center;
        line-height: 2;
        background-color: #409eff;
        color: #fff;
        height: 36px;
        overflow: hidden;
      }
    }
    .name {
      font-size: 18px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #409eff;
      flex: 1;
    }
    .sex_age_inpno {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      margin-left: 5px;
      margin-right: 30px;
      font-size: 14px;
      color: #999999;
      width: 80px;

      .inp_no {
        color: #ffa838;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .nurse_level {
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border: 17px solid #ccc;
      border-bottom-color: transparent;
      border-left-color: transparent;
      color: #fff;
      border-top-right-radius: 5px;
      span {
        position: absolute;
        top: -14px;
        right: -14px;
      }
    }
  }
  .add {
    width: 100%;
    /*height: 124px;*/
    text-align: center;
    /*line-height: 124px;*/
    img {
      width: 50px;
      height: 50px;
    }
  }
  .pg_label,
  .yj_label {
    margin-top: 5px;
    width: 100%;
    height: 21px;
    line-height: 21px;
    > div {
      padding: 0 5px;
      overflow: hidden;
      white-space: nowrap;

      > a {
        margin-left: 4px;
        display: inline-block;
        /*overflow: hidden;*/
        &:first-child {
          margin-left: 0;
        }
      }
    }
    a.image {
      width: 20px;
      height: 21px;
      vertical-align: text-bottom;
    }
    a.shape {
      vertical-align: text-bottom;
      display: inline-block;
      overflow: hidden;
      background-color: #ff4b76;
      border-radius: 100%;
      color: #fff;
      width: 20px;
      height: 21px;
      /*padding: 2px 4.5px;*/
      cursor: pointer;
      text-decoration: none;
      /*vertical-align: top;*/
      box-sizing: content-box;
      text-align: center;
      line-height: 21px;
    }
  }
  .yj_label {
    a.shape {
    }
  }
  .label {
    width: 100%;
    > div {
      margin-top: 5px;
      display: flex;
      align-items: center;
    }
    > .line {
      position: relative;
      padding: 0 5px;
    }
    .line_empty {
      &::before {
        display: none;
      }
    }
    .title {
      width: 50px;
      text-align: justify;
      text-align-last: justify;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .value {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
