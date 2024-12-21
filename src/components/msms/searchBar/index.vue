<template>
  <el-form :inline="true"  class="search-form" :v-model="form">
    <el-form-item :label="editType === 'ebookEdit' ? '电子书名称:':'音乐名称:'" >
       <el-input v-model="form.name" placeholder="请输入" size="small"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="search"
        class="el-button-radius"
        icon="el-icon-search"
        size="small"
      >搜索</el-button>
      <el-button type="text" class="el-button-radius" @click="reSearch" >重置</el-button>

    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: {
    editType: {
      type: String,
      default: ''
    }
  },
  components: {
  },
  data () {
    return {
      form: {
        name: ''
      },
      editIcon: require('@/assets/msms/img/icon_search.png')
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    // 搜索
    search () {
      if (this.editType === 'ebookEdit') {
        // 电子书搜索
        this.$emit('ebookSearch', this.form.name)
      } else if (this.editType === 'musicEdit') {
        // 音乐搜索
        this.$emit('musicSearch', this.form.name)
      }
    },
    // 重置搜索
    reSearch () {
      this.form.name = ''
      if (this.editType === 'ebookEdit') {
        // 电子书重置
        this.$emit('ebookSearch', 'reSearch')
      } else if (this.editType === 'musicEdit') {
        // 音乐重置
        this.$emit('musicSearch', 'reSearch')
      }
    }
  }
}
</script>
