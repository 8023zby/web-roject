<template>
  <div class="table-panel">
  </div>
</template>
<script>
export default {
  props: {
    labelName: {
      type: String,
      default: ''
    },
    typeList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style scoped scss>
.edit-panel{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
