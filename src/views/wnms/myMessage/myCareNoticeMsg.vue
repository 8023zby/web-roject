<template>
  <div class="main_patient">
    <div class="msg_title">
      <div class="right_btn">
        <el-button @click="refresh" type="primary">刷新
        </el-button>
        <el-button v-if="lookAll===1" type="primary" @click="allMsg(1)">仅看未读:({{ length > 99 ? '99+' : length }})
        </el-button>
        <el-button type="primary" v-else @click="allMsg(2)">查看全部
        </el-button>

        <el-button type="primary" @click="allConfirm">全部标记为已读
        </el-button>
      </div>
    </div>
    <!--滑动区域-->
    <div class="msg_content">
      <ul class="infinite-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" style="overflow:auto">
        <li v-for="(item, index) in this.pagination.list" :key="index" :class="{active:index == current}">
          <div class="time">{{ fromtStr(item.pushTime )}}</div>
          <div class="content">
            <span @click="show(item, index)" class="content_bg flex" v-html="item.content"></span>
            <sup :class="item.isRead == 0 ? dot : ''">
            </sup>
          </div>
        </li>
        <p v-if="noMore && this.lookAll === 1" class="nomore">没有更多了</p>
      </ul>

      <div class="nomsg" v-if="this.pagination.list.length <=0">暂无数据
      </div>
    </div>

  </div>
</template>

<script>
import * as api from '@/api/wnms/msgManage/patientMsg';
import { deepMerge } from '@/assets/wnms/utils';
import BaseQueryPageForm from '../common/BaseQueryPageForm';
import { selectDeptInfo, getUser } from '@/assets/wnms/utils/common';
import Bus from "../../../assets/wnms/utils/self";
import mixin from './mixin';

export default {
  name: 'listNews',
  mixins: [BaseQueryPageForm, mixin],
  props: ['onlyFlag'],
  components: {},
  data () {
    const serach = this.initQueryCriteria();
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
      notReadCount: 0,
      mescroll: null,
      search: serach,
      array: [], // 数据列表
      pageSize: 20,
      page: {
        size: 20,
        pageindex: 1
      },
    };
  },
  mounted () {
    // 监控web消息
    Bus.$on('webmsg', (res) => {
      this.refresh();
    });
    this.getNoRead(0);
  },
  methods: {

    /* 日期格式化 */
    fromtStr (str) {
      if (str)
        return str.substr(0, 16);
      else return '-';
    },

    /* 查询条件 */
    initQueryCriteria (form = {}) {
      return deepMerge(form, {
        // deptId: selectDeptInfo(),
        onlyFlag: this.onlyFlag,
        referenceId: getUser(),
        referenceType: 'USER',
        isRead: '',
        msgType: "医护公告",
        onlyFlag: 'MANUAL-NOTICE'
        // size: this.page.size,
        // page: this.page.pageindex
      });
    },

    /* 点击方法 */
    show (item, index) {
      this.msgRead(item);
    },

    /*  点击查看设置为已读，并更新 isRead */
    msgRead (item) {
      if (item.isRead === 1) return;
      const params = {
        messageIdList: [],
        referenceType: 'USER', //业务类型
        referenceId: getUser() //患者id
      };
      params.messageIdList.push(item.messageId);
      api.markRead(params).then((res) => {
        if (res.status === 200) {
          // 设置已读
          item.isRead = 1;
          this.loadMore();
          this.getNoRead(0);
          this.getNumBer(getUser(), 2);
          console.log("成功，" + res.data);
        } else {
          console.log("失败了" + res.data);
        }
      });
    },

    /* 查看全部信息false 未读  true 全部*/
    allMsg (T) {
      this.pagination.list = [];
      this.page.size = 20;
      this.page.pageindex = 1;

      if (T === 1) {
        this.lookAll = 2;
        this.search.isRead = 0;
        this.loadMore();
      } else {
        this.lookAll = 1;
        this.search.isRead = '';
        this.loadMore();
      }
      if (this.length > 0) this.getNumBer(getUser(), 2);
    },

    // 0未读消息，1已读
    getNoRead (isRead) {
      let searchs;
      deepMerge(searchs = {}, {
        deptId: selectDeptInfo(),
        referenceId: this.search.referenceId,
        referenceType: this.search.referenceType,
        msgType: "医护公告",
        isRead: isRead,
        onlyFlag: 'MANUAL-NOTICE'

      });
      api.getInfo(searchs).then((res) => {
        if (this.stateDetect(res)) {
          this.length = 0;
          this.length = res.data.length;
          // this.lookAll = 2
        }
      });
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
        let params = this.search;
        params.deptId = selectDeptInfo();
        api.markAllRead(this.search).then((res) => {
          if (this.stateDetect(res)) {
            if (this.lookAll == 1) {
              this.allMsg(2);
            } else {
              this.allMsg(1);
            }

            this.getNoRead(0);
            // 更新左侧菜单消息数量
            this.getNumBer(getUser(), 2);
          }
        });
      });
    },

    // 滚动获取数据
    loadMore () {
      console.log("loadMore");
      this.busy = true;
      let self = this;
      this.search.size = this.page.size;
      this.search.page = this.page.pageindex;
      let params = self.createQueryParams(false);
      params.deptId = selectDeptInfo();
      params.referenceType = "USER";
      params.referenceId = this.search.referenceId;
      params.msgType = "医护公告";
      params.onlyFlag = "MANUAL-NOTICE";

      api.getInfo(params).then((res) => {
        if (self.stateDetect(res)) {
          if (res.data.list.length <= 0) return;
          this.noMore = false;
          if (self.page.pageindex > res.data.pages) {
            this.noMore = true;
            return false;
          }
          self.pagination.list = self.pagination.list.concat(res.data.list);
          self.page.pageindex++;
        }
      }).catch(error => {
        console.log("失败了", error);
      });
      self.busy = false;
    },

    // 刷新
    refresh () {
      this.pagination.list = [];
      this.page.pageindex = 1;
      // 全部
      this.loadMore();
      this.getNoRead(0);
    }
  }
}
</script>

<style lang="scss" scoped>
  .dot {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: red;
    display: inline-block;
    vertical-align: super;
    position: absolute;
    right: 10px;
    top: 5px;
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
          font-size: 18px;
          position: relative;
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
