<!--
  文件描述：明星医护弹窗
  创建时间：2021/4/27 9:29
  创建人：PCL
-->
<template>
  <el-dialog
    title="明星医护设置"
    :visible.sync="Dialogvisible"
    width="70%"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="star-dialog"
  >
    <div class="star-view">
      <div class="star-view-block star-view-left">
        <div class="star-view-list-title">部门列表</div>
        <div class="star-view-list">
          <el-tree
            class="depts-tree"
            :data="deptList"
            :node-key="'deptId'"
            :props="{ label: 'deptName', children: 'children' }"
            default-expand-all
            :expand-on-click-node="false"
            ref="deptsTree"
            @node-click="onStarDeptsTreeClick"
          >
          </el-tree>
        </div>
      </div>
      <div class="star-view-block star-view-center">
        <div class="star-view-list-title">医护列表</div>
        <div class="star-view-list" v-loading="healthLoading">
          <div class="star-view-empty" v-show="healthCareList.length <= 0">
            暂无数据
          </div>
          <div
            class="star-view-item"
            :class="
                onSelectStarListFind(item) != null
                  ? 'star-view-item-active-healthcare'
                  : ''
              "
            v-for="(item, index) in healthCareList"
            :key="index"
            @click="onHealthClick(item)"
          >
            {{ item.empName }}
          </div>
        </div>
      </div>
      <div class="star-view-block star-view-right">
        <div class="star-view-list-title">已选医护列表</div>
        <div class="star-view-list">
          <div
            class="star-view-empty"
            v-show="selectHealthCareList.length <= 0"
          >
            暂无数据
          </div>
          <div
            class="star-view-item"
            v-for="(item, index) in selectHealthCareList"
            :key="index"
          >
            {{ item.empName }}
            <div class="star-view-item-btns">
              <el-button
                icon="el-icon-arrow-up"
                circle
                size="mini"
                @click="onSelectStarListOrder(item, index, true)"
              ></el-button>
              <el-button
                icon="el-icon-arrow-down"
                circle
                size="mini"
                @click="onSelectStarListOrder(item, index, false)"
              ></el-button>
              <el-button
                icon="el-icon-close"
                circle
                size="mini"
                @click="onSelectStarListRemove(item)"
              ></el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="chooseContent">保存</el-button>
      </span>
  </el-dialog>
</template>

<script>
    // 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
    // 例如：import 《组件名称》 from '《组件路径》';
    // 例如：import uploadFile from '@/components/uploadFile/uploadFile'
    import * as ifmsAPI from "@/api/wnms/other";
    export default {
        name: 'StarMedical',
        // import引入的组件需要注入到对象中才能使用
        components: {},
        props: {},
        data() {
            // 这里存放数据
            return {
              //已选医护列表
              selectHealthCareList: [],
              //科室医护列表
              healthCareList: [],
              //科室医护列表加载状态
              healthLoading: false,
              Dialogvisible: false,
              deptList: []
            }
        },
        // 监听属性 类似于data概念
        computed: {},
        // 方法集合
        methods: {
          init(Obj) {
            console.log('展示选择明星医护的弹窗--', Obj)
            this.deptList = []
            this.healthCareList = []
            this.selectHealthCareList = []
            if (Obj.showinfo) {
              this.selectHealthCareList = JSON.parse(Obj.showinfo)
            }

            ifmsAPI.getDeptList().then(res => {
              if (res.status === 200) {
                this.deptList = res.data.list
                this.onStarDeptsTreeClick(this.deptList[0])

                this.$nextTick(() => {
                  this.Dialogvisible = true
                })
              }
            }).catch(e => {
              console.log(e, '请求有错误')
            })
          },
          // 取消
          cancel() {
            this.Dialogvisible = false
          },
          chooseContent() {
            if (this.selectHealthCareList.length === 0) {
              this.$message.error("未选择人员！")
              return
            }
            let arr = []
            for (let v of this.selectHealthCareList.values()) {
              arr.push({
                empId: v.empId,
                empName: v.empName
              })
            }
            this.$emit('chooseMedical', JSON.stringify(arr))
            this.selectHealthCareList = []
            this.Dialogvisible = false
          },
          //明星医护tree部门点击
          onStarDeptsTreeClick(data) {
            this.healthLoading = true;
            ifmsAPI.getHealthCareList(data.deptId).then(res => {
              if (res.status === 200) this.healthCareList = res.data
              this.healthLoading = false
            }).catch(e => {
              console.log(e, '请求有错误')
            })
          },
          //明星医护人员点击
          onHealthClick(data) {
            let res = this.onSelectStarListFind(data);
            if (!res) {
              //如果没有，则添加
              delete data.jobTypeCodes;
              delete data.jobIds;
              delete data.dataDeptIds;
              //处理null值字段，改为空字符串
              for (let k in data) {
                if (data[k] == null) data[k] = "";
              }

              //性别字段处理
              if (!data.sex) data.sex = 1;

              this.selectHealthCareList.push(data);
            } else {
              //如果已有，则删除
              this.onSelectStarListRemove(data);
            }
          },
          //明星医护已选列表中查找指定对象
          onSelectStarListFind(obj) {
            if (!obj) return null;
            for (let i = 0; i < this.selectHealthCareList.length; i++) {
              if (this.selectHealthCareList[i].empId == obj.empId) {
                return this.selectHealthCareList[i];
              }
            }
            return null;
          },
          //明星医护已选列表删除指定对象
          onSelectStarListRemove(obj) {
            let _arr = [];
            for (let i = 0; i < this.selectHealthCareList.length; i++) {
              if (this.selectHealthCareList[i].empId !== obj.empId) {
                _arr.push(this.selectHealthCareList[i]);
              }
            }
            this.selectHealthCareList = _arr;
          },
          onSelectStarListOrder(item, index, direction) {
            if (direction) {
              //向上
              if (index == 0) return;
              let _temp = this.selectHealthCareList[index];
              this.$set(
                this.selectHealthCareList,
                index,
                this.selectHealthCareList[index - 1]
              );
              this.$set(this.selectHealthCareList, index - 1, _temp);
            } else {
              //向下
              if (index >= this.selectHealthCareList.length - 1) return;
              let _temp = this.selectHealthCareList[index];
              this.$set(
                this.selectHealthCareList,
                index,
                this.selectHealthCareList[index + 1]
              );
              this.$set(this.selectHealthCareList, index + 1, _temp);
            }
          }
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
