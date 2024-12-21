/* 排序方法 */
let tableSort
export default tableSort = {
  moveUp: function (index, row, sortTableData, _this) {
    let newIndex = index - 1
    if (Number(index) === 0) {
      _this.$message({
        message: '该条数据已经位于最上面',
        type: 'warning'
      })
    } else {
      this.updateData(row, index, newIndex, sortTableData)
    }
  },
  moveDown: function (index, row, sortTableData, _this) {
    let newIndex = index + 1
    if (Number(newIndex) === sortTableData.length) {
      _this.$message({
        message: '该条数据已经位于最下面',
        type: 'warning'
      })
    } else {
      this.updateData(row, index, newIndex, sortTableData)
    }
  },
  moveTop: function (index, row, sortTableData, _this) {
    if (Number(index) === 0) {
      _this.$message({
        message: '该条数据已经位于表格最顶部',
        type: 'warning'
      })
    } else {
      this.updateData(row, index, 0, sortTableData)
    }
  },
  moveBottom: function (index, row, sortTableData, _this) {
    if (Number(index) + 1 === sortTableData.length) {
      _this.$message({
        message: '该条数据已经位于表格最底部',
        type: 'warning'
      })
    } else {
      this.updateData(row, index, sortTableData.length - 1, sortTableData)
    }
  },
  customDo: function (index, row, sortTableData, _this) {
    let _tableSort = this
    let _row = row
    let _index = index
    _this.$prompt('请输入指定位置', '指定位置', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^[1-9]\d*$/,
      inputErrorMessage: `请填写正确的位置(1-${sortTableData.length})`,
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          let value = instance.inputValue
          let newIndex = value - 1
          if (parseInt(value) > sortTableData.length) {
            _this.$message.warning(`指定位置不能超过${sortTableData.length}！`)
          } else {
            // 调用更新方法
            _tableSort.updateData(_row, _index, newIndex, sortTableData)
            // 调用更新数据方法
            // 这个地方需要规范提交新排序顺序的方法名为onSortSubmit
            // _this.onSortSubmit()
            done()
          }
        } else {
          done()
        }
      }
    }).then(({ value }) => {})
  },
  updateData: function (row, index, newIndex, sortTableData) {
    sortTableData.splice(index, 1)
    sortTableData.splice(newIndex, 0, row)
  }
}
