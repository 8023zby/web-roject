<template>
    <!--护士排班-层级管理-->
    <div style="width: 100%; height: 100%;">
        <div class="typt-list-container">
            <div class="typt-list-add-div">
                <div class="action_div">
                    <el-button type="primary" size="small" @click="levelMange()">层级管理</el-button>
                    <el-button type="primary" size="small" @click="postMange()">岗位管理</el-button>
                </div>
            </div>
            <!--end-->
            <!--列表-->
            <el-table
                    :data="tableData"
                    :stripe="CONFIG.table.stripe"
                    v-loading="loading"
                    height="80%"
            >
                <el-table-column
                        v-if="false"
                        label="序号"
                        align="center"
                        type="index"
                        width="100"/>
                <el-table-column
                        align="center"
                        prop="accountName"
                        label="姓名"/>
                <el-table-column
                        align="center"
                        prop="hierarchyDescribe"
                        label="层级备注"
                        show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <level-manage :curRow="curRow"
                                      :row="scope.$index"
                                      :selectArr="selectArr"
                                      @dealSelData="dealSelData"
                                      :srcData="scope.row"
                                      :type="'text'"
                                      :dataId="'hierarchyDescribe'"/>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="hierarchyId"
                        label="层级名称"
                        show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <level-manage :dataName="'hierarchyName'"
                                      :curRow="curRow"
                                      :row="scope.$index"
                                      :selectArr="selectArr"
                                      @dealSelData="dealSelData"
                                      :selData="levelData"
                                      :srcData="scope.row"
                                      :type="'select'"
                                      :dataId="'hierarchyId'"/>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="hierarchyCoefficient"
                        label="层级系数"
                >
                    <template slot-scope="scope">
                        <level-manage :curRow="curRow"
                                      :row="scope.$index"
                                      :selectArr="selectArr"
                                      @dealSelData="dealSelData"
                                      :srcData="scope.row"
                                      :type="'number'"
                                      :dataId="'hierarchyCoefficient'"/>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="postId"
                        label="岗位名称"
                >
                    <template slot-scope="scope">
                        <level-manage :dataName="'postName'"
                                      :curRow="curRow"
                                      :row="scope.$index"
                                      :selectArr="selectArr"
                                      @dealSelData="dealSelData"
                                      :selData="postData"
                                      :srcData="scope.row"
                                      :type="'select'"
                                      :dataId="'postId'"/>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="postCoefficient"
                        label="岗位系数"
                >
                    <template slot-scope="scope">
                        <level-manage :curRow="curRow"
                                      :row="scope.$index"
                                      :selectArr="selectArr"
                                      @dealSelData="dealSelData"
                                      :srcData="scope.row"
                                      :type="'number'"
                                      :dataId="'postCoefficient'"/>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="qcCoefficient"
                        label="质控系数"
                >
                    <template slot-scope="scope">
                        <level-manage :curRow="curRow"
                                      :row="scope.$index"
                                      :selectArr="selectArr"
                                      @dealSelData="dealSelData"
                                      :srcData="scope.row"
                                      :type="'number'"
                                      :dataId="'qcCoefficient'"/>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="teachingCoefficient"
                        label="带教系数"
                >
                    <template slot-scope="scope">
                        <level-manage :curRow="curRow"
                                      :row="scope.$index"
                                      :selectArr="selectArr"
                                      @dealSelData="dealSelData"
                                      :srcData="scope.row"
                                      :type="'number'"
                                      :dataId="'teachingCoefficient'"/>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        align="center"
                        width="150">
                    <template slot-scope="scope">
                        <el-button type="text" @click="modify(scope.$index)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div v-show="selectShow" slot="footer" class="dialog-footer btnDiv">
                <el-button @click="refresh" style="width: 70px;height: 40px;border-radius: 0 !important;">取消</el-button>
                <el-button type="primary" @click="saveData"
                           style="width: 70px;height: 40px;border-radius: 0 !important;">保存
                </el-button>
            </div>
        </div>
        <!----层级管理------>
        <el-dialog class="iframe"
                   title="层级管理"
                   :visible.sync="levelVisible"
                   height="500px"
                   width="800px"
                   :close-on-click-modal="false"
                   @close="refresh">
            <level-manager style="height: 500px"/>
        </el-dialog>
        <!----岗位管理------>
        <el-dialog class="iframe"
                   title="岗位管理"
                   :visible.sync="postVisible"
                   height="500px"
                   width="800px"
                   :close-on-click-modal="false"
                   @close="refresh">
            <post-manager style="height: 500px"/>
        </el-dialog>
    </div>
</template>

<script>
import ShiftLevelStatistics from '../../../assets/hsms/mixins/ShiftLevelStatistics'
import LevelManage from '../../../components/hsms/LevelManager'
import LevelManager from '../level/Main'
import PostManager from '../post/Main'
import { GetNurseUser, GetLevel, GetPost } from '../../../api/hsms'
import config from '../../../assets/hsms/mixins/config'

export default {
  name: 'NurseLevelStatistics',
  components: {
    'level-manage': LevelManage,
    LevelManager,
    PostManager
  },
  mixins: [ShiftLevelStatistics, config],
  data () {
    return {
      levelData: [],
      curRow: '',
      levelVisible: false,
      postVisible: false,
      selectShow: false,
      postData: [],
      selectArr: '',
      modelName: '层级管理',
      userData: [],
      selectedData: [],
      formSearchData: {
        businessType: 'NURSE'
      },
      url: '/hsms/web-hs/relation'
    }
  },
  // 初始化
  created () {
    this.getUser()
    this.getLevel()
    this.getPost()
  },
  methods: {
    // 刷新
    refresh () {
      this.reloadMain()
    },
    // 修改
    modify (index) {
      this.selectShow = true
      this.curRow = index
      this.selectArr += `,${index},`
    },
    // 保存
    saveData () {
      this.saveDataDo({ data: this.selectedData }, 'add', {}, false)
    },
    // 层级管理
    levelMange () {
      this.levelVisible = true
    },
    // 岗位管理
    postMange () {
      this.postVisible = true
    },
    // 获取用户
    getUser () {
      GetNurseUser(this.formSearchData.businessType).then(res => {
        this.userData = res
        this.onSearchSubmit()
      })
    },
    // 获取层级
    getLevel () {
      GetLevel(this.formSearchData.businessType).then(res => {
        res.forEach((item, index) => {
          this.levelData.push({
            id: item.hierarchyId,
            name: item.hierarchyName
          })
        })
      })
    },
    // 获取岗位
    getPost () {
      GetPost(this.formSearchData.businessType).then(res => {
        res.forEach((item, index) => {
          this.postData.push({
            id: item.postId,
            name: item.postName
          })
        })
      })
    },
    // 处理选择数据
    dealSelData (item, index, dataId) {
      this.selectedData[index][dataId] = item || ''
    }
  }
}
</script>

<style lang="scss" scoped>
    @import "../../../assets/hsms/css/self_common";

    .btnDiv {
        text-align: center;
        margin: 20px 0;
    }

    .el-button--small {
        padding: 6px 16px !important;
        border-radius: 2px !important;
    }

    .el-input-number {
        width: 135px;
    }

    /deep/ .el-dialog__header {
        border-bottom: 1px solid #e6e6e6 !important;
    }

    /deep/ .el-dialog__body {
        padding: 0 !important;
    }
</style>
