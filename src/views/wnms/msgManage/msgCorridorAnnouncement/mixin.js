import tableSort from '@/components/wnms/tableSort/tableSort.js'
export default {
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    moveUp (index, row) {
      tableSort.moveUp(index, row, this.tableSortData, this)
    },
    // 下移
    moveDown (index, row) {
      tableSort.moveDown(index, row, this.tableSortData, this)
    },
    // 置顶
    moveTop (index, row) {
      tableSort.moveTop(index, row, this.tableSortData, this)
    },
    // 置底
    moveBottom (index, row) {
      tableSort.moveBottom(index, row, this.tableSortData, this)
    },
    // 指定位置
    customDo (index, row) {
      tableSort.customDo(index, row, this.tableSortData, this)
    },
  }
}
