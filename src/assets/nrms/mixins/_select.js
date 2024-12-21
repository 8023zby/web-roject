/**
 * ref="select"
 */
export default {
  data () {
    return {
      select: {
        id: '',
        height: 0
      }
    }
  },
  mounted () {
    console.log('select-mounted')
    let that = this
    window.addEventListener('scroll', function (e) {
      that.scrollFunc()
    }, true)
  },
  beforeDestroy () {
    console.log('select-beforeDestroy')
    window.removeEventListener('scroll', this.scrollFunc)
  },
  destroyed () {
    console.log('select-mounted')
    window.removeEventListener('scroll', this.scrollFunc)
  },
  methods: {
    blur () {
      if (this.$refs['select-' + this.select.id][0]) {
        this.$refs['select-' + this.select.id][0].blur()
      } else if (this.$refs['select-' + this.select.id]) {
        this.$refs['select-' + this.select.id].blur()
      }
    },
    selectFocus (id) {
      this.select.id = id
    },
    scrollFunc () {
      let that = this
      let header_top = this.select.height || 140
      if (this.$refs['select-' + this.select.id] === undefined || this.$refs['select-' + this.select.id] === null || this.$refs['select-' + this.select.id] === '') {
        return false
      }
      // let ref = this.$refs['select-' + this.select.id] || null;
      $('.el-select-dropdown').each(function (e) {
        if ($(this).css('display') === 'none') {
        } else {
          let el_select_dropdown = this
          let el_select_dropdown_offset_top = el_select_dropdown.offsetTop || null
          if (el_select_dropdown_offset_top === null) {
            return false
          }
          console.log(+el_select_dropdown_offset_top)
          if (+el_select_dropdown_offset_top <= +header_top) {
            console.log('小于了')
            that.blur()
          }
        }
      })
    }
  }
}
