<template>
    <ul class="autoform-column-tbody">
      <li v-for="(th,thIndex) in tbody" :key="thIndex" class="td" :style="{width: element.config.tdWidth}">
        <div v-for="(column,columnIndex) in th.columns" :key="columnIndex" class="column" :style="{'height':column.thHeight || 'auto'}">
          <ul class="row-ul">
            <li v-for="(row,rowIndex) in column.rows" :key="rowIndex" class="row"
              :style="{
                'border-width': element.config.borderWidth,
                'justify-content': row.config && row.config.align?row.config.align:'center',
                'padding': row.config && row.config.padding ? row.config.padding : ''
              }"
              :class="{'hiddenBorderBottom': row.hiddenBorderBottom, 'isWholeRow': row.isWholeRow}">
              <div v-if="ColIndex == 0 && row.isWholeRow" class="isWholeRowChild" :style="{width: 'calc(' + element.loop + ' * 100% + ' + (element.loop - 1) * parseFloat(element.config.borderWidth) + 'px)'}">
               <template v-for="v in row.children">
                <form-common
                  :element="v"
                  :data="data"
                  :valueData="valueData"
                  :father="element"
                  :key="v.key"
                  :isEdit="isEdit"
                  @colValueChange="colValueChange"
                  :firstLineAssTime="firstLineAssTime"
                  @changeLoopValueData="changeLoopValueData"
                ></form-common>
              </template> 
              </div>
              <template v-for="v in row.children">
                <form-common
                  :element="v"
                  :data="data"
                  :valueData="valueData"
                  :ColIndex="ColIndex"
                  v-on="$listeners"
                  :father="element"
                  :key="v.key"
                  :isEdit="isEdit"
                  :assId="assId"
                  @colValueChange="colValueChange"
                  :firstLineAssTime="firstLineAssTime"
                  @changeLoopValueData="changeLoopValueData"
                  :patient="patient"
                ></form-common>
              </template>
            </li>
          </ul>
        </div>
      </li>
    </ul>
</template>
<script>
export default {
  components: {
    FormCommon: () => import('./FormCommon.vue')
  },
  name: 'tableLoopColumn',
  props: ['element', 'valueData', 'data', 'father', 'isEdit', 'tbody', 'ColIndex', 'assId', 'firstLineAssTime','patient'],
  methods: {
    colValueChange (e) {
      this.$emit('colValueChange', e)
    },
    async changeLoopValueData (index) {
      this.$emit('changeLoopValueData', index)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./autoForm.scss";
.autoform-column-tbody {
  box-sizing: border-box;
  .td {
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
          &.isWholeRow {
            position: relative;
            .isWholeRowChild {
              position: absolute;
              height: 100%;
              top: 0;
              left: 0;
              background: #fff;
              z-index: 1;
            }
          }
        }
        .hiddenBorderBottom {
          border-bottom: 0px;
          padding-top: 1px;
        }
      }
    }
  }
}
</style>
