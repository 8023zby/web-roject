<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">区域配置</div>
    </div>
    <div class="regionConfig">
      <el-tree :data="dataTree" node-key="id" default-expand-all :props="defaultProps" :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button v-uni="actKey + 'add_next-' + data.locationId" v-if="hasData && node.level < levelObj.count && authorityObj['regionConfig_add']" type="text" @click="() => appendChild(node, data)">
                添加下一级
              </el-button>
              <el-button v-uni="actKey + 'edit-' + data.locationId" v-if="hasData && authorityObj['regionConfig_mod']" type="text" @click="() => edit(node,data)">
                编辑
              </el-button>
              <el-button v-uni="actKey + 'add-' + data.locationId" v-if="authorityObj['regionConfig_add']" type="text" @click="() => append(node,data)">
                添加
              </el-button>
              <el-button v-uni="actKey + 'delete-' + data.locationId" v-if="hasData&& authorityObj['regionConfig_del']" type="text" @click="() => remove(node,data)" class="el-text-danger">
                删除
              </el-button>
            </span>
          </span>
      </el-tree>
    </div>
  </div>
</template>
<script>
import { $getLocationsTree, $addLocationsTree, $editLocationsTree, $delLocationsTree, $getLocationsLevel } from '../../../api/passport/region/regionApi'
import { ResultMsg } from '../../../assets/passport/js/Message'
export default {
  inject: ['checkMoreAuthority'],
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'locationName'
      },
      dataTree: [],
      levelObj: {},
      hasData: false,
      addFlag: false,
      authorityObj: {},
      authorityArr: ['regionConfig_add', 'regionConfig_mod', 'regionConfig_del'],
      actKey: 'quyupeizhi_'
    }
  },

  mounted: function () {
    // 判断是否有动作权限
    this.getListAuthority()
    this.getLevel()
  },
  methods: {
    // 请求列表中动作权限
    getListAuthority () {
      this.authorityObj = this.checkMoreAuthority(this.authorityArr)
    },
    // 查询级别
    getLevel () {
      $getLocationsLevel({
        page: 1,
        size: 99999
      }).then(res => {
        let data = res.data.list || []
        let len = data.length
        this.levelObj['count'] = len
        data.forEach((item) => {
          this.levelObj[item.level] = item.locationName
        })
        this.queryNode()
      })
    },
    // 节点查询
    queryNode () {
      let _this = this
      $getLocationsTree({}).then(res => {
        if (res.data.list === null) {
          res.data.list = []
        }
        if (res.data.list.length > 0) {
          this.hasData = true
          _this.dataTree = res.data.list
        } else {
          this.hasData = false
          _this.dataTree = [{
            children: [],
            locationId: '',
            locationName: '区域配置',
            parentId: '',
            locationType: '',
            level: 1
          }]
        }
      }).catch(() => {
        this.$message.error('数据获取失败')
      })
    },
    // 添加本级节点
    append (node, data) {
      this.addFlag = false
      let levelName = this.levelObj[node.data.level] || '区域'
      this.$prompt(`请输入${levelName}名称：`, `添加${levelName}`, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        showClose: false,
        inputErrorMessage: `请输入正确${levelName}名称`,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            if (this.addFlag) {
              return false
            }
            this.addFlag = true
            let value = instance.inputValue
            $addLocationsTree({
              locationName: value,
              parentType: data.parentType || '',
              parentId: data.parentId || ''
            }).then(res => {
              if (res.status === 200) {
                ResultMsg(res, '添加', this.queryNode)
                done()
              } else {
                this.addFlag = false
                this.$message.error(res.desc)
              }
            }).catch(() => {
              this.addFlag = false
              this.$message.error('数据获取失败')
            })
          } else {
            done()
          }
        }
      }).then(({ value }) => {}).catch(() => {})
    },

    // 添加本级子节点
    appendChild (node, data) {
      this.addFlag = false
      let levelName = this.levelObj[parseInt(node.data.level) + 1] || '区域'
      this.$prompt(`请输入${levelName}名称：`, `添加${levelName}`, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        showClose: false,
        inputErrorMessage: `请输入正确${levelName}名称`,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            if (this.addFlag) {
              return false
            }
            this.addFlag = true
            let value = instance.inputValue
            $addLocationsTree({
              locationName: value,
              parentType: data.locationType || '',
              parentId: data.locationId || ''
            }).then(res => {
              if (res.status === 200) {
                ResultMsg(res, '添加', this.queryNode)
                done()
              } else {
                this.addFlag = false
                this.$message.error(res.desc)
              }
            }).catch(() => {
              this.addFlag = false
              this.$message.error('数据获取失败')
            })
          } else {
            done()
          }
        }
      }).then(({ value }) => {}).catch(() => {})
    },
    // 编辑节点
    edit (node, data) {
      let levelName = this.levelObj[node.data.level] || '区域'
      this.$prompt(`请输入${levelName}名称：`, `编辑${levelName}`, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputValue: node.data.locationName,
        inputPattern: /\S/,
        showClose: false,
        inputErrorMessage: `请输入正确${levelName}名称`,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            let value = instance.inputValue
            $editLocationsTree({
              locationName: value,
              locationId: data.locationId
            }).then(res => {
              if (res.status === 200) {
                ResultMsg(res, '修改', this.queryNode)
                done()
              } else {
                this.$message.error(res.desc)
              }
            }).catch(() => {
              this.$message.error('数据获取失败')
            })
          } else {
            done()
          }
        }
      }).then(({ value }) => {}).catch(() => {})
    },
    // 删除节点
    remove (node, data) {
      let levelName = this.levelObj[node.data.level] || '区域'
      this.$confirm(`是否确认删除该${levelName}?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        $delLocationsTree(node.data.locationId).then(res => {
          ResultMsg(res, '删除', this.queryNode)
        })
      }).catch(() => {

      })
    }
  }
}
</script>

<style scoped>
    .regionConfig{
        padding-top:60px;
        width:40%;
        margin-left:25%;
    }
    .custom-tree-node{
        flex:1;
        display:flex;
        align-items:center;
        justify-content:space-between;
        padding-right:8px;
    }
    .el-tree-node__content{
        height:38px;
    }
</style>
