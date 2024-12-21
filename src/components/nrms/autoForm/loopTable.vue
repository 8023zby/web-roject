<template>
  <div :ref="'loopTable' + element.key" :style="{'border-left-width':  element.config.borderWidth, 'border-top-width': isFirstTable ? element.config.borderWidth : '0'}" class="autoform-column-table">
    <ul class="thead">
      <li v-for="(th,thIndex) in element.thead" :key="thIndex" class="th" :style="{width: element.config.thWidth}">
        <div v-for="(column,columnIndex) in th.columns" :key="columnIndex" class="column">
          <ul class="row-ul">
            <li v-for="(row,rowIndex) in column.rows" :key="rowIndex" :data-columnNum="row.columnNumber ? row.columnNumber : 1" class="row"
                :style="{'border-width': element.config.borderWidth,'text-align': element.config.thAlign,'height':row.thHeight || 'auto'}"
                :class="row.hiddenBorderBottom ? 'hiddenBorderBottom' : ''">
              {{row.text}}
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <div class="tbody-box" :ref="'loopTableColumn' + element.key">
      <div v-for="(item, index) in element.tbodyList" :key="index" class="tbodyItem">
        <table-loop-column
          v-if="loopUpdate" 
          @colValueChange="colValueChange" 
          :element="element" 
          :firstLineAssTime="firstLineAssTime" 
          :tbody="item" 
          :assId="assId" 
          :valueData="valueData[index]" 
          :data="data" 
          :ColIndex="index" 
          @changeLoopValueData="changeLoopValueData"
          :patient="patient"></table-loop-column>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    TableLoopColumn: () => import('./tableLoopColumn')
  },
  props: ['element', 'valueData', 'data', 'father', 'isEdit', 'assId', 'firstLineAssTime', 'loopUpdate','patient'],
  watch: {
    'element': {
      handler (val) {
        if (this.isChangeTbodyList) {
          return
        }
        this.isChangeTbodyList = true
        val.tbodyList = [...new Array(Number(val.loop))].map(item => JSON.parse(JSON.stringify(val.tbody)))
      },
      immediate: true
    }
  },
  data () {
    return {
      isChangeTbodyList: false,
      theadColumnList: []
    }
  },
  computed: {
    // 获取是否是第一个表格，如果是则在表格加上边框和左边框
    isFirstTable () {
      let index = this.data.findIndex(item => item.key == this.element.key)
      if (this.data[index - 1] && this.data[index - 1].type == 'grid') {
        // 如果上一个类型是grid
        if (this.data[index - 1].config.borderWidth == 0 || this.data[index - 1].config.borderWidth == '0' || this.data[index - 1].config.borderWidth == '0px') return true
        // 并且上一个没有border
        return false
      } else if (this.data[index - 1] && this.data[index - 1].type == 'table_column_loop') {
        // 如果上一个是否是循环表格
        return false
      } else {
        // 其他类型则有上边框和左边框
        return true
      }
    }
  },
  methods: {
    getThHeight (index, rowIndex, columnNumber = 1) {
      let tdIndex = 0
      if (index > 0) {
        // 之前的column数累加
        let list = this.theadColumnList.slice(0, index)
        tdIndex = list.reduce((prev, next) => prev + next)
      }
      let columnHeight = 0
      for (let i = 0; i < columnNumber; i++) {
        let td = this.$refs[`loopTableColumn${this.element.key}`].querySelector('.tbodyItem').querySelectorAll('li.td')[tdIndex + rowIndex + i]
        if (td) {
          columnHeight += td.clientHeight
        }
      }
      // resolve(columnHeight)
      let height = columnHeight
      // let height = await new Promise(resolve => {
      //   setTimeout(() => {
      //     let columnHeight = 0
      //     for (let i = 0; i < columnNumber; i++) {
      //       let td = this.$refs[`loopTableColumn${this.element.key}`].querySelector('.tbodyItem').querySelectorAll('li.td')[tdIndex + i]
      //       if (td) {
      //         columnHeight += td.clientHeight
      //       }
      //     }
      //     resolve(columnHeight)
      //   })
      // })
      return height
    },
    getAllThHeight () {
      let theadColumnList = []
      this.element.thead.map(item => {
        let columnNum = 1
        item.columns.map(columnItem => {
          let rowNum = columnItem.rows.reduce((prev, cur) => {
            return prev + (cur.columnNumber ? cur.columnNumber : 1)
          }, 0)
          if (rowNum > columnNum) {
            columnNum = rowNum
          }
        })
        theadColumnList.push(columnNum)
      })
      this.theadColumnList = theadColumnList
      if (!this.$refs[`loopTable${this.element.key}`]) {
        return
      }
      let thList = this.$refs[`loopTable${this.element.key}`].querySelectorAll('.thead li.th')
      for (let thIndex = 0; thIndex < thList.length; thIndex++) {
        const th = thList[thIndex]
        let rowUlList = th.querySelectorAll('.row-ul')
        for (let rowUlIndex = 0; rowUlIndex < rowUlList.length; rowUlIndex++) {
          const rowUlItem = rowUlList[rowUlIndex]
          let rowList = rowUlItem.querySelectorAll('.row')
          let rowColumn = 0
          for (let rowIndex = 0; rowIndex < rowList.length; rowIndex++) {
            const row = rowList[rowIndex]
            let height = this.getThHeight(thIndex, rowColumn, parseInt(row.dataset.columnnum))
            rowColumn += parseInt(row.dataset.columnnum)
            row.style.height = height - parseInt(this.element.config.borderWidth) + 'px'
          }
        }
        // let rowList = th.querySelectorAll('.row')
        // for (let rowIndex = 0; rowIndex < rowList.length; rowIndex++) {
        //   const row = rowList[rowIndex]
        //   let height = this.getThHeight(thIndex, parseInt(row.dataset.columnnum))
        //   row.style.height = height - parseInt(this.element.config.borderWidth) + 'px'
        // }
      }
    },
    colValueChange (e) {
      this.$emit('colValueChange', e)
    },
    async changeLoopValueData (index) {
      this.$emit('changeLoopValueData', index)
    }
  },
  async mounted () {
    const Timer = setInterval(() => {
      this.getAllThHeight()
    }, 500)
    setTimeout(() => {
      this.$emit('tableLoading')
    }, 600)
    setTimeout(() => {
      clearInterval(Timer)
    }, 3000)
  }
}
</script>
<style lang="scss" scoped>
@import "/autoForm.scss";
.autoform-column-table {
  border-top-color: #ccc;
  border-top-style: solid;
  border-left-color: #ccc;
  border-left-style: solid;
  display: flex;
}
.autoform-column-table .thead {
  .th {
    display: flex;
    .column {
      width: 100%;
      .row-ul {
        height: 100%;
        display: flex;
        flex-direction: column;
        .row {
          border-bottom-color: #ccc;
          border-bottom-style: solid;
          border-right-color: #ccc;
          border-right-style: solid;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
        }
        .hiddenBorderBottom {
          border-bottom: 0px;
          padding-top: 1px;
        }
      }
    }
  }
}
.autoform-column-table .tbody-box {
  display: flex;
}
</style>
