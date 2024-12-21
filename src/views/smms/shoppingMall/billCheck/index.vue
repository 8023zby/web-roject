<template>
  <div class="typt-list-main">
    <transition name="fade" mode="out-in">
      <keep-alive>
        <component
          :is="currentView"
          :row-details="rowDetails"
          @billDetails="changePage"
          @backList="backList"
        />
      </keep-alive>
    </transition>
  </div>
</template>
<script>
import BillTable from './billTable'
import BillDetails from './billDetails'
export default {
  name: '',
  components: {
    BillTable,
    BillDetails
  },
  data () {
    return {
      currentView: 'BillTable',
      rowDetails: {},
      arr: []
    }
  },
  mounted: function () {
  },
  methods: {
    changePage (index, row) {
      this.rowDetails = row
      this.currentView = BillDetails
    },
    backList () {
      this.currentView = BillTable
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-row {
  padding: 20px 0 0 20px;
}
</style>
