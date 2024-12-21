<template>
  <div class="main_patient">
    <div class="msg_title">
      <div class="right_btn">
        <el-button @click="refresh"
                   type="primary">刷新</el-button>
        <el-button v-if="lookAll===1"
                   type="primary"
                   @click="allMsg(1)">仅看未读:({{ length > 99 ? '99+' : length }})</el-button>
        <el-button type="primary"
                   v-else
                   @click="allMsg(2)">查看全部</el-button>

        <el-button type="primary"
                   @click="allConfirm">全部标记为已读</el-button>
      </div>
    </div>
    <!--滑动区域-->
    <div class="msg_content">
      <ul class="infinite-list"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="busy"
          style="overflow:auto">
        <li v-for="(item, index) in this.pagination.list"
            :key="index"
            :class="{active:index == current}">
          <div class="time">{{ fromtStr(item.pushTime )}}</div>
          <div class="title">
            <span v-if="onlyFlag != 14">
              {{type[item.viewType]}}
              <sup :class="item.isRead == 0 ? dot : ''"></sup>
            </span>
            <span v-if="onlyFlag == 14">
              留言板
              <sup :class="item.isRead == 0 ? dot : ''"></sup>
            </span>
          </div>
          <div class="content">
            <div v-if="item.viewType == 2"
                 class="content_bg flex">
              <m-audio :ref="'maudio' + index"
                       :astop="all_stop"
                       :duration="item.secondsDuration"
                       @click.native="show(item, index)"
                       :src="ListConvert(item)"></m-audio>
            </div>
            <span @click="show(item, index)"
                  v-else
                  class="content_bg flex"
                  v-html="formant(item)"></span>
          </div>
        </li>
        <p v-if="noMore && this.lookAll === 1"
           class="nomore">没有更多了</p>
      </ul>

      <div class="nomsg"
           v-if="this.pagination.list.length <=0">暂无数据</div>
    </div>
    <img-viewer ref="viewer" />
    <el-dialog title
               :visible.sync="dialogPlay"
               width="50%"
               @close="closeDialog">
      <!-- <m-video ref="refvideo" class="video_bottom" @video_close="video_close"></m-video> -->
      <m-video ref="refvideo"
               class="video_bottom"></m-video>
    </el-dialog>
  </div>
</template>

<script>
  import * as api from '@/api/wnms/msgManage/patientMsg'
  import { deepMerge } from '@/assets/wnms/utils'
  import BaseQueryPageForm from '../../common/BaseQueryPageForm'
  import { selectDeptInfo, getUser } from '@/assets/wnms/utils/common'
  import ImgViewer from "@/components/wnms/viewer/imgViewer"
  import Mvideo from '@/components/wnms/yhVideo/video'
  import Maudio from "@/components/wnms/yhVideo/audio"
  import Bus from "../../../../assets/wnms/utils/self"
  import mixin from './mixin'

  export default {
    name: 'listNews',
    mixins: [BaseQueryPageForm, mixin],
    props: ['onlyFlag'],
    components: {
      ImgViewer,
      "m-video": Mvideo,
      "m-audio": Maudio
    },
    data () {
      const serach = this.initQueryCriteria()
      return {

        dot: "dot",
        lookAll: 1, //1 全部  2 未读
        busy: false,

        isnetxPage: true, //是否加载
        noMore: false,
        all_stop: false,
        dialogPlay: false,
        current: null, // 当前点击的行
        length: 0,
        mescroll: null,
        search: serach,
        array: [], // 数据列表
        pageSize: 20,
        page: {
          size: 20,
          pageindex: 1
        },
        eventTypeList: [
          { id: 1, name: '患者信息' },
          { id: 2, name: '服务信息' },
          { id: 3, name: '医嘱信息' },
          { id: 4, name: '体征信息' },
          { id: 5, name: '临床报告' },
          { id: 6, name: '护理评估' },
          { id: 7, name: '健康宣教' },
          { id: 8, name: '交接记录' },
          { id: 9, name: '手术安排' },
          { id: 0, name: '其他信息' },
          { id: 14, name: '留言板' }
        ], //消息类型字典
        type: {
          0: "消息标题",
          2: "语音消息",
          3: "视频消息",
          1: "图片消息",
          4: "手术安排提醒"
        }
      }
    },
    mounted () {
      // 监控web消息
      Bus.$on('webmsg', (res) => {
        this.refresh()
      })

      this.getNoRead(0)
    },
    methods: {

      formant (item) {
        let obj = {
          0: item.content || '',
          1: `您收到一张图片消息,请<p style="color: #546beb">点击查看</p>`,
          2: 'yinpin',
          3: `您收到一段视频消息,请 <p style="color: #546beb">点击查看</p>`
        }
        return obj[item.viewType]
      },

      /* 日期格式化 */
      fromtStr (str) {
        return str.substr(0, 16)
      },

      /* 查询条件 */
      initQueryCriteria (form = {}) {
        return deepMerge(form, {
          // deptId: selectDeptInfo(),

          onlyFlag: this.onlyFlag,
          referenceId: getUser(),
          referenceType: 'USER',
          isRead: ''
          // size: this.page.size,
          // page: this.page.pageindex

        })
      },

      /*  获取音视频 url */
      ListConvert (item) {
        let data = ''
        if (item.msgResource === "AUTO-MSG") {
          data = item.content
        } else {
          const str = JSON.parse(item.content) || ''
          data = str.url || ''
        }
        return data || ''
      },

      closeDialog () {
        this.dialogPlay = false
        this.$refs.refvideo.close_btn()
      },

      /* 点击方法 */
      show (item, index) {
        // 文字 如果是自动提醒 则

        if (item.viewType === "0") {
          if (item.msgResource === "AUTO-MSG" && item.url) {
            this.$router.push(item.url)
          }
        } else if (item.viewType === "1") {
          // 图片
          this.qrcode = []
          this.qrcode.push(this.ListConvert(item))
          this.$refs.viewer.show(this.qrcode)
        } else if (item.viewType === "2") {
          // 音乐播放
          this.pagination.list.map((item, i) => {
            if (i === index) return
            if (item.viewType === '2') {
              this.$refs['maudio' + i][0].closeAudio()
            }
          })
          var a = "maudio" + index
          this.$refs[a][0].handlePlay(!this.all_stop)
        } else if (item.viewType === "3") {
          console.log("我是视频==========" + item.content)
          this.dialogPlay = true
          this.$nextTick(() => {
            this.$refs.refvideo.preview(item.content)
          })
        } else if (item.viewType === "4") {
        }
        this.msgRead(item)
      },

      /*  点击查看设置为已读，并更新 isRead */
      msgRead (item) {
        if (item.isRead === 1) return
        const params = {
          messageIdList: [],
          referenceType: 'USER', //业务类型
          referenceId: getUser() //患者id
        }
        params.messageIdList.push(item.messageId)
        api.markRead(params).then((res) => {
          if (res.status === 200) {
            // 设置已读
            item.isRead = 1
            this.getNoRead(0)
            this.loadMore()
            this.getNumBer(getUser(), 2)
            console.log("成功，" + res.data)
          } else {
            console.log("失败了" + res.data)
          }
        })
      },

      /* 查看全部信息false 未读  true 全部*/
      allMsg (T) {
        this.pagination.list = []
        this.page.size = 20
        this.page.pageindex = 1

        if (T === 1) {
          this.lookAll = 2
          this.search.isRead = 0
        } else {
          this.lookAll = 1
          this.search.isRead = ''
        }
        if (this.length > 0) this.getNumBer(getUser(), 2)
        this.loadMore()
      },

      // 0未读消息，1已读
      getNoRead (isRead) {
        let searchs
        deepMerge(searchs = {}, {
          deptId: selectDeptInfo(),
          referenceId: this.search.referenceId,
          referenceType: this.search.referenceType,
          isRead: isRead,
          onlyFlag: this.search.onlyFlag

        })
        api.getInfo(searchs).then((res) => {
          if (this.stateDetect(res)) {
            this.length = 0
            this.length = res.data.length
            // this.lookAll = 2
          }
        })
      },

      // 设置全部已读
      allConfirm () {
        this.$confirm('确定要进行全部标记为已读操作吗?', '全部标记为已读', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showClose: false,
          type: 'warning'
        }).then(() => {
          // 设置已读后台还未添加状态
          let params = this.search
          params.deptId = selectDeptInfo()
          api.markAllRead(this.search).then((res) => {
            if (this.stateDetect(res)) {
              if (this.lookAll == 1) {
                this.allMsg(2)
              } else {
                this.allMsg(1)
              }

              this.getNoRead(0)
              // 更新左侧菜单消息数量
              this.getNumBer(getUser(), 2)
            }
          })
        })
      },

      // 滚动获取数据
      loadMore () {
        this.busy = true
        let self = this
        this.search.size = this.page.size
        this.search.page = this.page.pageindex
        let params = self.createQueryParams(false)
        params.deptId = selectDeptInfo()
        api.getInfo(params).then((res) => {
          if (self.stateDetect(res)) {
            if (res.data.list.length <= 0) return
            this.noMore = false
            if (self.page.pageindex > res.data.pages) {
              this.noMore = true
              return false
            }
            self.pagination.list = self.pagination.list.concat(res.data.list)
            self.page.pageindex++
          }
        }).catch(error => {
          console.log("失败了", error)
        })
        self.busy = false
      },

      // 刷新
      refresh () {
        this.pagination.list = []
        this.page.pageindex = 1
        if (this.lookAll === 1) {
          // 全部
          this.loadMore()
          this.getNoRead(0)
        } else {
          this.loadMore()
        }
      }
    }
  }
</script>

<style  lang="scss" scoped>
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: red;
    display: inline-block;
    vertical-align: super;
  }
  .nomore {
    color: red;
    text-align: center;
    margin-bottom: 2rem;
  }

  .main_patient {
    height: 100%;
    width: 100%;
    overflow: hidden;
    .msg_title {
      width: 100%;
      height: 8%;
      border-bottom: 1px solid #efefef;
      .right_btn {
        margin: 1rem;
        height: 50px;
        float: right;
      }
    }
    .msg_content {
      height: 92%;
      width: 100%;
      overflow: hidden;
      .infinite-list {
        height: 96%;
        .title {
          margin-top: 0.6vh;
          font-size: 14px;
          color: #1e87f0;
          text-align: center;
        }
        .time {
          font-size: 18px;
          color: #666666;
          border-radius: 2px;
          border: none;
          background: #f5f5f5;
          width: 13rem;
          height: 35px;
          text-align: center;
          line-height: 35px;
          margin: 0 auto;
        }
        .content {
          margin: 1.5vh 0.5vw 3.5vh 0.5vw;
          background: #f4f4f4;
          min-height: 50px;
          line-height: 50px;
          padding-left: 1vw;
          color: #333333;
          font-size: 14px;
          .content_bg {
            cursor: pointer;
          }
        }
      }
    }
  }
  .flex {
    display: flex;
    align-items: center;
    min-height: 50px;
  }

  .status-point {
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: red;
    position: absolute;
    right: 0.5vw;
  }

  /*以fixed的方式固定mescroll的高度*/
  .nomsg {
    font-size: 22px;
    color: #ccc;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 53%;
  }

  .el-button-radius {
    margin-left: 20px;
    border-bottom: 1px solid #efefef;
  }
</style>
