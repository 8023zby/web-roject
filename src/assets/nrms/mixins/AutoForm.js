import { PrintStyle } from './printStyle'
import printJS from 'print-js'
export default {
  methods: {
    /**
     * @description: 递归每一项操作
     * @param {*} fn 可以传进来一个方法，默认是递归拿到valueData
     * @return {*}
     */
    operatorFormData (fn = (item) => {
      this.valueData.push({
        key: item.key,
        type: item.type,
        value: item.value || '',
        score: item.score || 0,
        his_id: item.his_id || ''
      })
    }) {
      this.valueDataRecursion(this.data, fn)
    },
    /**
     *具体递归函数
     *
     * @param {*} data 自动表单项
     * @param {*} fn 方法
     */
    valueDataRecursion (data, fn) {
      if (!data || !data.length) return
      data.map((item) => {
        fn(item)
        if (item.config.hidden) {
          return this.valueDataRecursion(null, fn)
        }
        switch (item.type) {
          case 'grid':
            if (!item.columns || !item.columns.length) { return this.valueDataRecursion(null, fn) }
            item.columns.map((v) => {
              return this.valueDataRecursion(v.children, fn)
            })
            break
          case 'checkbox':
            if (!item.options || !item.options.length) { return this.valueDataRecursion(null, fn) }
            item.options.map((v) => {
              return this.valueDataRecursion(v.children, fn)
            })
            break
          case 'radio':
            if (!item.options || !item.options.length) { return this.valueDataRecursion(null, fn) }
            item.options.map((v) => {
              return this.valueDataRecursion(v.children, fn)
            })
            break
          case 'select':
            if (!item.options || !item.options.length) { return this.valueDataRecursion(null, fn) }
            item.options.map((v) => {
              return this.valueDataRecursion(v.children, fn)
            })
            break
          case 'table_column_loop':
            if (!item.tbody || !item.tbody.length) { return this.valueDataRecursion(null, fn) }
            item.tbody.map(tbodyItem => {
              if (!tbodyItem.columns || !tbodyItem.columns.length) { return this.valueDataRecursion(null, fn) }
              tbodyItem.columns.map(columnItem => {
                if (!columnItem.rows || !columnItem.rows.length) { return this.valueDataRecursion(null, fn) }
                columnItem.rows.map(rowItem => {
                  return this.valueDataRecursion(rowItem.children, fn)
                })
              })
            })
            break
          default:
            return this.valueDataRecursion(item.children, fn)
        }
      })
    },
    /**
     * 打印
     *
     */
    clickPrint () {
      const printStyle = PrintStyle
      let printStyleSuffix = ''
      if (this.printStyle) {
        printStyleSuffix = this.printStyle
      }
      printJS({
        printable: 'printHtml',
        type: 'html',
        style: printStyle + printStyleSuffix,
        scanStyles: false,
        printContainer: false // 纵向
      })
    },
    /**
     * 获得循环表单的
     *
     */
    getColumnsTableValueData () {
      let columnTable = {}
      this.data.map(item => {
        if (item.type == 'table_column_loop') {
          columnTable = item
        }
      })
      let valueData = [...new Array(Number(columnTable.loop))].map(item => [])
      valueData = valueData.map(item => {
        let value = []
        this.operatorFormData((v) => {
          value.push({
            key: v.key,
            type: v.type,
            value: v.value || '',
            score: v.score || 0,
            his_id: v.his_id || ''
          })
        })
        return JSON.parse(JSON.stringify(value))
      })
      this.valueData = valueData
      this.initValueData = JSON.parse(JSON.stringify(this.valueData[0]))
    },
    /**
     *特殊处理，写完自动表单后，可以用该函数修改key得到特定的key
     *
     */
    getElementsKey () {
      this.operatorFormData(item => {
        switch (item.type) {
          case 'checkbox':
            item.key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
            item.options.map((v, i) => {
              v.id = `${item.key}-${i}`
            })
            break
          case 'radio':
            item.key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
            item.options.map((v, i) => {
              v.id = `${item.key}-${i}`
            })
            break
          case 'select':
            item.key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
            item.options.map((v, i) => {
              v.id = `${item.key}-${i}`
            })
            break
          default:
            item.key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
            break
        }
      })
    },
    // 当预览的时候开始评估按钮不可用
    assessDiabled () {
      this.operatorFormData((item) => {
        switch (item.key) {
          // 手术评估单
          // 术前护理评估
          case '1600149598000_36333':
            item.config.disabled = true
            break
          case '1600148128000_25581':
            item.config.disabled = true
            break
          case '1600151730000_50889':
            item.config.disabled = true
            break
          case '1600151133000_77742':
            item.config.disabled = true
            break
          // 术后护理评估(术日)
          case '1600323611000_44304':
            item.config.disabled = true
            break
          case '1600323462000_49418':
            item.config.disabled = true
            break
          case '1600324913000_56525':
            item.config.disabled = true
            break
          case '1600324045000_44453':
            item.config.disabled = true
            break
          case '1600324977000_65294':
            item.config.disabled = true
            break
          case '1600324154000_94930':
            item.config.disabled = true
            break
          case '1600325021000_15278':
            item.config.disabled = true
            break
          case '1600324430000_38569':
            item.config.disabled = true
            break
          // 术后护理评估(1/2/3日)
          case '1600323572000_99383':
            item.config.disabled = true
            break
          case '1600323377000_82857':
            item.config.disabled = true
            break
          case '1600324646000_53507':
            item.config.disabled = true
            break
          case '1600323736000_79622':
            item.config.disabled = true
            break
          case '1600324696000_78797':
            item.config.disabled = true
            break
          case '1600323874000_5550':
            item.config.disabled = true
            break
          case '1600324746000_91666':
            item.config.disabled = true
            break
          case '1600323935000_10654':
            item.config.disabled = true
            break
          // 转入评估单
          case '1614822938000_82009':
            item.config.disabled = true
            break
          case '1614820355000_99407':
            item.config.disabled = true
            break
          case '1614820665000_34675':
            item.config.disabled = true
            break
          case '1614821457000_92918':
            item.config.disabled = true
            break
          case '1614822255000_71800':
            item.config.disabled = true
            break
          case '1614822780000_90415':
            item.config.disabled = true
            break
          case '1614826410000_29810':
            item.config.disabled = true
            break
          // 风险评估单
          // 压疮
          case '1617764922000_14354':
            item.config.disabled = true
            break
          // 非计划拔管 患者疼痛评估单 吞咽障碍评估单
          case '1617266399000_54421':
            item.config.disabled = true
            break
          // GSC评估
          case '1618207428000_91190':
            item.config.disabled = true
            break
          // 跌倒坠床
          case '1617787638000_2912':
            item.config.disabled = true
            break
          // 失禁性皮炎评估
          case '1618026429000_65445':
            item.config.disabled = true
            break
          // 自理能力评估 误吸窒息风险评估
          case '1618197789000_73787':
            item.config.disabled = true
            break
          // Ramsay镇静评估
          case '1618209723000_39987':
            item.config.disabled = true
            break
          // 泌尿系感染风险评估
          case '1618216575000_10479':
            item.config.disabled = true
            break
          // 营养风险评估
          case '1618222267000_28300':
            item.config.disabled = true
            break
          // VTE风险评估
          case '1618194424000_64274':
            item.config.disabled = true
            break

          default:
            break
        }
      })
    }
  }
}
