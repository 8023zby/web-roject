<template>
  <div class="container">
    <div class="type-tit">{{activeTit}}分类</div>
    <div class="type-btn-group">
      <el-button @click="addType()" type="primary">添加分类</el-button>
      <el-button @click="sortType()" type="primary">排序</el-button>
    </div>
    <!--<div-->
        <!--class="all-type-btn"-->
        <!--@click="spreadClick()"-->
        <!--:class="{'all-type-spread':!activeAllType,'all-type-close':activeAllType}">-->
      <!--全部-->
    <!--</div>-->
    <div class="all-type-btn"
         @click="spreadClick()"
         :class="{'activeHover': activeId === ''}">
      全部
    </div>
    <transition name="fade">
      <div v-if="activeAllType" style="overflow: auto">
        <div v-for="(item,index) in typeList"
             :key="index"
              class="type-List"
             :class="{'activeHover': item.id === activeId}"
             @click="getTypeId(item.id)"
        >
          <!--<div v-for="(item,index) in typeList"-->
               <!--:key="index"-->
               <!--class="type-List"-->
               <!--:class="{'activeHover': item.id === activeId}"-->
               <!--@click="getTypeId(item.id)"-->
               <!--@mouseover="typeHover(item.id)"-->
          <!--&gt;-->
          <div style="height:100%;line-height: 30px;padding-left: 10px;width: 150px;text-overflow:ellipsis;overflow: hidden;white-space: nowrap;">{{item.name}}</div>
          <div style="display: flex">
            <div v-show="item.id === activeId" style="width: 20px;height: 20px;" @click="edit(item.id,item.name)">
              <img :src="editIcon"/>
            </div>
            <div v-show="item.id === activeId" style="width: 20px;height: 20px;margin-left: 5px" @click="del(item.id)">
              <img :src="delIcon"/>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  props: {
    typeList: {
      type: Array,
      default: function () {
        return []
      }
    },
    activeTit: {
      type: String,
      default: ''
    },
    editType: {
      type: String,
      default: ''
    }
  },
  watch: {
    editType: function () {
    }
  },
  components: {
  },
  data () {
    return {
      typeArr: [
        { name: '经典音乐', id: '1' },
        { name: '流行音乐', id: '2' }
      ],
      editIcon: require('@/assets/msms/img/icon_edit.png'),
      delIcon: require('@/assets/msms/img/icon_delete.png'),
      activeId: '',
      activeAllType: true
    }
  },
  computed: {
  },
  mounted () {
    if (this.editType === 'musicEdit') {
      this.activeTit = '音乐'
    } else {
      this.activeTit = '电子书'
    }
  },
  methods: {
    // 展开分类
    spreadClick () {
      // this.activeAllType = !this.activeAllType
      // 修改为点击全部列表展示所有分类下的音乐
      this.$emit('getTypeId', '')
      this.activeId = ''
    },
    typeHover (id) {
      this.activeId = id
      this.$emit('getTypeId', id)
    },
    getTypeId (id) {
      this.activeId = id
      this.$emit('getTypeId', id)
    },
    addType () {
      // 添加分类
      this.$emit('addType', 'addEbooksType')
    },
    sortType () {
      // 添加分类
      this.$emit('sortType', 'sortbooksType')
    },
    del (id) {
      // 删除分类
      this.$emit('delType', id)
    },
    edit (id, typeContent) {
      // 编辑分类
      this.$emit('edType', id, typeContent)
    }
  }
}
</script>
<style scoped scss>
.container{
  display: flex;
  flex-direction: column;
}
img{
  width: 100%;
  height: 100%;
}
button{
  padding: 4px 8px;
  border-radius: 2px;
}
.type-tit{
  padding: 2px 6px;
  color:#1e87f0;
}
.type-btn-group{
  display: flex;
  padding: 20px 10px 10px;
  justify-content: space-between;
  border-bottom: 1px solid #cccccc;
}
.all-type-btn{
  padding: 2px 20px;
  position: relative;
}
.all-type-spread:before{
  position: absolute;
  top:10px;
  left:5px;
  content: '';
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 6px solid #1e87f0;
}
.all-type-close:before{
  position: absolute;
  top:10px;
  left:5px;
  content: '';
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 6px solid #1e87f0;
}
.type-List{
  display: flex;
  height: 30px;
  align-items: center;
  justify-content: space-between;
}
/*.type-List:hover{*/
/*  background: #f0f7fd;*/
/*  color: #1e87f0;*/
/*}*/
.activeHover{
  background: #f0f7fd;
  color: #1e87f0;
}
</style>
