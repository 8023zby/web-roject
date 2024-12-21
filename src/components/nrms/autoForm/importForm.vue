<template>
  <div class="import">
    <!-------- 疼痛观察单-点击选择疼痛部位 start -------->
    <div
      v-if="element.config.importType == 'pain_position'"
      style="cursor: pointer"
    >
      <div @click="showPainPositionVisible">
        <el-tooltip v-if="element.value" class="item" effect="dark" :content="element.value" placement="top-start">
          <span style="width: 9em;text-align: center;display: -webkit-box;overflow: hidden;-webkit-box-orient: vertical;-webkit-line-clamp: 2;">{{ element.value }}</span>
        </el-tooltip>
        <span v-else class="print-hidden">点击选择疼痛部位</span>
      </div>
      <el-dialog title="疼痛部位" :visible.sync="painPositionVisible" width="1200px">
        <div class="pain-position-dialog-box">
          <el-checkbox-group v-model="painPositionChecked">
            <el-checkbox
              :label="item"
              v-for="item in painPositionCheckList"
              :key="item"
            ></el-checkbox>
          </el-checkbox-group>
          <div>
            <img src="/static/nams/img/pain.jpg" alt="">
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="painPositionCancel">取 消</el-button>
          <el-button type="primary" @click="painPositionConfirm"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
    <!-------- 疼痛观察单-点击选择疼痛部位 end -------->

    <!-------- 疼痛观察单-点击选择护理措施 start -------->
    <div v-if="element.config.importType == 'pain_measure'" style="cursor: pointer">
      <div @click="showPainMeasure">
        <el-tooltip v-if="element.value" class="item" effect="dark" :content="element.value" placement="top-start">
          <span style="width: 9em;text-align: center;display: -webkit-box;overflow: hidden;-webkit-box-orient: vertical;-webkit-line-clamp: 2;">{{ element.value }}</span>
        </el-tooltip>
        <span v-else style="color: #666" class="print-hidden">点击选择护理措施</span>
      </div>
      <el-dialog title="护理措施" :visible.sync="painMeasureVisible" width="500px">
        <div class="pain-measure-dialog-box">
          <el-checkbox-group v-model="painMeasureChecked">
            <el-checkbox
              :label="item.id"
              v-for="item in painMeasureCheckList"
              :key="item.id"
            >
              {{item.label}}
              <el-input v-if="item.isOther" v-model="painMeasureOther"></el-input>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="painMeasureCancel">取 消</el-button>
          <el-button type="primary" @click="painMeasureConfirm"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
    <!-------- 疼痛观察-点击选择护理措施 end -------->
  </div>
</template>
<script>
export default {
  name: 'importForm',
  props: ['element', 'valueData', 'data', 'isEdit'],
  data () {
    return {
      /**
      * ------------------------------------------------------------------
      * 疼痛观察-点击选择疼痛部分
      * ------------------------------------------------------------------
      */
      painPositionVisible: false,
      painPositionCheckList: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
        '25',
        '26',
        '27',
        '28',
        '29',
        '30',
        '31',
        '32',
        '33',
        '34',
        '35',
        '36',
        '37',
        '38',
        '39',
        '40',
        '41',
        '42',
        '43',
        '44',
        '45'
      ],
      painPositionChecked: [],

      /**
      * ------------------------------------------------------------------
      * 疼痛观察-点击选择护理措施
      * ------------------------------------------------------------------
      */
      painMeasureVisible: false,
      painMeasureCheckList: [
        {
          label: '1.心理护理',
          id: '1',
          isOther: false
        },
        {
          label: '2.卧床休息',
          id: '2',
          isOther: false
        },
        {
          label: '3.疼痛宣教',
          id: '3',
          isOther: false
        },
        {
          label: '4.冷敷',
          id: '4',
          isOther: false
        },
        {
          label: '5.热敷',
          id: '5',
          isOther: false
        },
        {
          label: '6.按摩',
          id: '6',
          isOther: false
        },
        {
          label: '7.其他',
          id: '7',
          isOther: true
        }
      ],
      painMeasureChecked: [],
      painMeasureOther: ''
    }
  },
  methods: {
    /**
    * ------------------------------------------------------------------
    * 疼痛观察-点击选择疼痛部分
    * ------------------------------------------------------------------
    */
    showPainPositionVisible () {
      this.painPositionChecked = this.element.value ? this.element.value.split('、') : []
      this.painPositionVisible = true
    },
    painPositionCancel () {
      this.painPositionVisible = false
    },
    painPositionConfirm () {
      if (this.painPositionChecked && this.painPositionChecked.length) {
        this.element.value = this.painPositionChecked.join('、')
      } else {
        this.element.value = ''
      }
      this.$emit('changeValue', {
        key: this.element.key,
        value: this.element.value,
        score: this.element.score
      })
      this.painPositionVisible = false
    },
    /**
    * ------------------------------------------------------------------
    * 疼痛观察-点击选择护理措施
    * ------------------------------------------------------------------
    */
    showPainMeasure () {
      if (!this.element.value) {
        this.painMeasureVisible = true
      }
      let arr = this.element.value.split(' ')
      if (arr[0]) {
        this.painMeasureChecked = arr[0].split('、')
      }
      if (arr[1]) {
        this.painMeasureOther = arr[1]
      }
      this.painMeasureVisible = true
    },
    painMeasureCancel () {
      this.painMeasureVisible = false
    },
    painMeasureConfirm () {
      if (!this.painMeasureChecked || !this.painMeasureChecked.length) {
        this.element.value = ''
        this.painMeasureVisible = false
        return
      }
      this.element.value = this.painMeasureChecked.join('、')
      if (this.painMeasureChecked.indexOf('7') >= 0 && this.painMeasureOther) {
        this.element.value += ` ${this.painMeasureOther}`
      }
      this.$emit('changeValue', {
        key: this.element.key,
        value: this.element.value,
        score: this.element.score
      })
      this.painMeasureVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
/**
* ------------------------------------------------------------------
* 疼痛观察-点击选择疼痛部位
* ------------------------------------------------------------------
*/
/deep/ .pain-position-dialog-box {
  display: flex;
  .el-checkbox {
    float: left;
  }
  .el-checkbox__label {
    width: 30px;
    margin-bottom: 20px;
  }
}

/**
* ------------------------------------------------------------------
* 疼痛观察-点击选择护理措施
* ------------------------------------------------------------------
*/
/deep/ .pain-measure-dialog-box {
  .el-checkbox {
    float: left;
  }
  .el-checkbox__label {
    width: 60px;
    margin-bottom: 20px;
    .el-input__inner {
      margin-left: 10px;
      width: 120px;
      height: 16px;
      border-top: 0;
      border-left: 0;
      border-right: 0;
      padding: 0;
    }
  }
}

/deep/ .el-dialog__footer {
  margin-top: 35px;
}
</style>
