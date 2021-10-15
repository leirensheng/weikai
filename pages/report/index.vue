<template>
  <div class="report" :class="isOwner ? 'has-fixed' : 'no-fixed'">
    <div class="fixed-tab" :class="isFixedTop ? 'show' : null">
      <my-tab :tabs="tabs" v-model="tab"></my-tab>
    </div>
    <div class="bottom" v-if="isOwner">
      <div class="left" @click="remove">
        <image class="icon" mode="widthFix" src="/static/delete.svg"></image>
        <div>删除报告</div>
      </div>
      <button class="btn1" @click="toggleCollect">
        <image class="icon" mode="widthFix" :src="collectSrc"></image>
        <div>{{ collectName }}</div>
      </button>
      <button class="btn1" open-type="share">
        <image class="icon" mode="widthFix" src="/static/share.svg"></image>
        <div>转发</div>
      </button>
    </div>
    <scroll-view
      class="scroll-Y"
      :scroll-top="scrollTop"
      scroll-y="true"
      @scroll="scroll"
    >
      <div class="main">
        <div class="left">
          <div>合规性</div>
          <div>报告</div>
        </div>
        <div class="right">
          <div class="title">{{ data.productName }}</div>
          <div class="subtitle">
            <div class="date">{{ $formatTime(data.createDate, true) }}</div>
            <div v-if="platformName">商品来源：{{ platformName }}</div>
          </div>
        </div>
      </div>

      <my-tab :tabs="tabs" v-model="tab" class="my-tab"></my-tab>

      <div class="content">
        <legal v-if="tab === 0" :data="legalData"></legal>
        <quality v-if="tab === 1" :data="qualityData"></quality>
        <consume v-if="tab === 2"></consume>
        <certificate v-if="tab === 3" :data="certificateData"></certificate>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import { deleteReport, collect, noCollect, getDetail } from "@/api/eye.js";
import { mapMutations } from "vuex";
import Tabs from "../../components/tabs/tabs.vue";
import TabPane from "../../components/tabs/tabPane.vue";

let isFromUser = true;

export default {
  components: {
    Tabs,
    TabPane,
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  data() {
    return {
      scrollTop: 0,
      oldScrollTop: 0,
      contentHeightArr: null,
      fixedTop: 100,
      scrollTop: 0,
      data: {},
      isCollected: false,
      tab: 0,
      isOwner: false,
      loading: false,
    };
  },

  computed: {
    tabs() {
      let arr = [
        {
          name: "合规性评价",
        },
        {
          name: "质量性评价",
        },
        {
          name: "消费指南",
        },
        {
          name: "认证证书",
        },
      ];
      return this.hasCertificate ? arr : arr.slice(0, -1);
    },
    isFixedTop() {
      return this.oldScrollTop >= this.fixedTop;
    },
    legalData() {
      return this.data.compliance || {};
    },
    hasCertificate() {
      return !!this.certificateData.certificateNo;
    },
    certificateData() {
      let obj = this.data.certificate || {};
      if (obj.grade) {
        obj.grade = obj.grade.replace("级", "");
      }
      return obj;
    },
    qualityData() {
      return {
        product: this.data.producerQuantity || [],
        category: this.data.categoryQuantity || [],
        negative: this.data.negative,
        positive: this.data.positive,
        commentKeyWord: this.data.commentKeyWord,
        commentFinished: !!this.data.commentFinished,
      };
    },
    collectSrc() {
      return this.isCollected ? "/static/collected.svg" : "/static/collect.svg";
    },
    collectName() {
      return this.isCollected ? "取消收藏" : "收藏";
    },

    platformName() {
      let map = {
        JD: "京东",
        TM: "天猫",
        TB: "淘宝",
        PDD: "拼多多",
      };
      return map[this.data.platform];
    },
  },
  async onShareAppMessage() {
    this.setAppShowRead(false);
    return {
      title: "报告详情",
      path: "/pages/report/index?id=" + this.id,
    };
  },
  created() {},
  mounted() {},
  watch: {
    loading(val) {
      if (val) {
        uni.showLoading({
          title: "加载中",
        });
      } else {
        uni.hideLoading();
      }
    },
    tab(val) {
      if (this.isFixedTop) {
        this.scrollTop = this.oldScrollTop;
        this.$nextTick(() => {
          this.scrollTop = this.fixedTop;
        });
      }
      if (val === 1 && !this.data.commentFinished) {
        this.refreshComment();
      }
    },
  },
  onUnload() {
    uni.$off("loginStatus", this.backFromLogin);
    this.tab = 0
    let isChange = this.isCollected !== this.data.collected;
    if (isChange) {
      this.setNeedRefreshCollect(true);
    }
  },
  onShow() {
    setTimeout(() => {
      this.setAppShowRead(true);
    }, 1000);
  },
  async onLoad({ id }) {
    isFromUser = this.$getPrePath() === "pages/user/index";
    this.setAppShowRead(false);
    uni.$on("loginStatus", this.backFromLogin);
    this.id = id;
    this.loading = true;
    let isLogin = await this.$checkLogin();
    if (!isLogin) {
      this.loading = false;
      this.$toLogin();
    } else {
      await this.getDetail();
    }
  },
  methods: {
    scroll(e) {
      this.oldScrollTop = e.detail.scrollTop;
    },
    async getFixedTop() {
      this.fixedTop = await this.$getDomInfo(".report .main", false, "height");
    },
    backFromLogin(val) {
      if (val) {
        this.getDetail();
      }
    },
    ...mapMutations([
      "setNeedRefreshAll",
      "setNeedRefreshCollect",
      "setAppShowRead",
    ]),

    async getDetail() {
      let openId = uni.getStorageSync("openId");
      if (!openId) return;
      this.loading = true;
      this.data = await getDetail(this.id);
      this.isCollected = this.data.collected;
      this.isOwner = this.data.openId === openId;

      setTimeout(() => {
        this.getFixedTop();
      }, 200);
      this.loading = false;
    },
    async refreshComment() {
      await this.$sleep(2000);
      // 销毁前手动设置为0
      if (this.tab === 1) {
        let data = await getDetail(this.id);
        if (!data.commentFinished) {
          await this.refreshComment();
        } else {
          let { negative, positive, commentKeyWord, commentFinished } = data;
          this.data.negative = negative;
          this.data.positive = positive;
          this.data.commentKeyWord = commentKeyWord;
          this.data.commentFinished = commentFinished;
        }
      }
    },
    remove() {
      uni.showModal({
        title: "确定要删除此报告吗?",
        content: " ",
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: "删除中",
            });
            await deleteReport(this.id);
            uni.hideLoading();
            if (isFromUser) {
              this.setNeedRefreshAll(true);
              uni.navigateBack();
            } else {
              uni.reLaunch({
                url: "/pages/index/index",
              });
            }
          }
        },
      });
    },

    async toggleCollect() {
      let val = !this.isCollected;
      let title = val ? "收藏中" : "取消收藏中";
      uni.showLoading({
        title,
      });
      if (val) {
        await collect(this.id);
      } else {
        await noCollect(this.id);
      }
      this.isCollected = val;
      uni.hideLoading();
    },
  },
};
</script>

<style scoped lang="scss">
.report {
  height: 100vh;
  &.has-fixed {
    @include fixed-bottom(100rpx);
  }
  &.no-fixed {
    @include fixed-bottom(0rpx);
  }
  .scroll-Y {
    height: 100%;
  }
  .fixed-tab {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 5;
    transform: translateY(-100%);
    opacity: 0;
    &.show {
      opacity: 1;
      transform: translateY(0%);
    }
  }
  .main {
    padding: 56rpx 26rpx 46rpx 48rpx;
    display: flex;
    .left {
      flex-shrink: 0;
      width: 164rpx;
      height: 164rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      line-height: 56rpx;
      font-size: 40rpx;
      font-weight: 500;
      color: white;

      background: linear-gradient(180deg, #0060ff 0%, #004dcd 100%);
    }
    .right {
      margin-left: 34rpx;
      .title {
        color: black;
        font-size: 32rpx;
        text-align: justify;
        margin-bottom: 24rpx;
        line-height: 44rpx;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
      }
      .subtitle {
        line-height: 40rpx;
        font-size: 28rpx;
        color: #999999;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
  .content {
    padding: 48rpx 24rpx;
    min-height: calc(100vh - 98rpx - 100rpx - constant(safe-area-inset-bottom));
    min-height: calc(100vh - 98rpx - 100rpx - env(safe-area-inset-bottom));
  }
  .bottom {
    padding: 14rpx 24rpx 0 24rpx;
    z-index: 8;
    @include fixed-bottom(14rpx);
    box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.15);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
    .left {
      font-size: 24rpx;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      line-height: 34rpx;
      color: #004dcd;
      width: 150rpx;
      .icon {
        width: 36rpx;
      }
    }

    .btn1 {
      width: 256rpx;
      margin: 0;
      .icon {
        margin-right: 12rpx;
        width: 32rpx;
      }
    }
  }
}
</style>

<style lang="scss">
</style>