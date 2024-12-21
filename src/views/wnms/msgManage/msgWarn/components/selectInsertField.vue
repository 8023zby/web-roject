<!--
  文件描述：选择插入字段
  创建时间：2021/6/9 13:47
  创建人：PCL
-->
<template>
  <el-dialog
    title="选择插入字段"
    :visible.sync="Dialogvisible"
    width="600px"
    :close-on-click-modal=false
    :close-on-press-escape=false
    :show-close="false"
  >
    <div class="dialog-textc">
      <div v-if="false">
        <span>请选择表：</span>
        <el-select v-model="textTable"
                   disabled
                   class="elinput-300"
                   @change="changetextTable"
                   :popper-append-to-body="false"
                   placeholder="请选择">
          <el-option v-for="item in tableList"
                     :key="item.tableName"
                     :label="item.tableNameExplain"
                     :value="item.tableName">
          </el-option>
        </el-select>
      </div>
      <div>
        <span>请选择字段：</span>
        <el-select v-model="textField"
                   class="elinput-300"
                   :popper-append-to-body="false"
                   placeholder="请选择">
          <el-option v-for="item in listTableFields"
                     :key="item.key"
                     :label="item.keyName"
                     :value="item.key">
          </el-option>
        </el-select>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">

          <el-button @click="Dialogvisible = false">取 消</el-button>
<el-button type="primary" @click="textFieldSure">确 定</el-button>
        </span>
  </el-dialog>
</template>

<script>
    // 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
    // 例如：import 《组件名称》 from '《组件路径》';
    // 例如：import uploadFile from '@/components/uploadFile/uploadFile'
    import * as msgWarnApi from '@/api/wnms//msgManage/msgWarn'
    export default {
        name: 'dialog-selectInsertField',
        // import引入的组件需要注入到对象中才能使用
        components: {},
        data() {
            // 这里存放数据
            return {
              Dialogvisible: false,
              textFields: null,
              textField: '',
              textTable: null,
              textIndex: null,
              listTableFields: null
            }
        },
        // 监听属性 类似于data概念
        computed: {},
        // 方法集合
        methods: {
          init(Obj) {
            console.log('选择插入字段弹窗', Obj)
            this.textTable = Obj.textTable
            this.textIndex = Obj.textIndex
            this.textField = ''
            if(Obj.listTableFields) this.listTableFields = JSON.parse(Obj.listTableFields)

            this.$nextTick(() => {
              this.Dialogvisible = true
            })
          },
          //根据选中的表查询字段\查询表达式
          changetextTable() {
            msgWarnApi.getlistTableFields({ table: this.textTable }).then(res => {
              if (res.status === 200) {
                if (res.data !== null) {
                  this.textFields = JSON.parse(res.data[0].fieldInfo)
                }
              }
            })
          },
          // 插入关键词
          textFieldSure() {
            if (this.textTable === '' || this.textField === '') {
              this.$message.warning('请先选择字段！')
              return
            }

            let myValue = `[$${this.textField}]`
            this.$emit('callBack', myValue, this.textIndex)
            this.Dialogvisible = false
          },
        },
        // 监控data中的数据变化
        watch: {},
        // 生命周期 - 创建完成（可以访问当前this实例）
        created() {

        },
        // 生命周期 - 挂载完成（可以访问DOM元素）
        mounted() {

        },
        beforeCreate() {
        }, // 生命周期 - 创建之前
        beforeMount() {
        }, // 生命周期 - 挂载之前
        beforeUpdate() {
        }, // 生命周期 - 更新之前
        updated() {
        }, // 生命周期 - 更新之后
        beforeDestroy() {
        }, // 生命周期 - 销毁之前
        destroyed() {
        }, // 生命周期 - 销毁完成
        activated() {
        } // 如果页面有keep-alive缓存功能，这个函数会触发
    }
</script>

<style scoped lang="scss">
    //@import url(); 引入公共css类
</style>
