<template>
  <div class="history">
    <div class="top">
      <div class="title">历史报告</div>
      <div class="right" v-if="isLogin">
        <my-radio v-model="collected"></my-radio>
      </div>
    </div>
    <div class="content">
      <div v-if="!isLogin" class="no-login" @click="$toLogin">
        <div>你还没有登录，</div>
        <div>请登录后查看历史报告></div>
      </div>

      <div class="no-history" v-else-if="!loading && !history.length">
        <image class="icon" mode="widthFix" src="/static/no-data.svg"></image>
        <div class="name">{{ noReportName }}</div>
      </div>
      <div class="has-content" v-else>
        <history-search
          :data="history"
          :isShowFrame="isShowFrame"
          :noMore="noMore"
        ></history-search>
      </div>
    </div>

  </div>
</template>

<script>
import { getHistory } from "@/api/eye.js";
import { mapState, mapMutations } from "vuex";
let timer;
let startWaitTime;
export default {
  data() {
    return {
      isReachBottom: false,
      loading: false,
      history: [],
      collected: 0,
      isShowFrame: false,
      noMore: false,
      page: 1
    };
  },
  props: {
    isLogin: {
      type: Boolean,
      default: false,
    },

    isShow: {
      type: Boolean,
      default: false,
    },
    isFixedTop: {
      type: Boolean,
      default: false,
    },
    fixedTop: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    ...mapState(["needRefreshAll", "needRefreshCollect", "needRefreshLeft"]),
    noReportName() {
      return this.collected ? "暂无收藏报告" : "暂无历史报告";
    },

    needWaitAndRefresh() {
      return (
        !this.collected && this.firstPageData.some((one) => one.reportStatus === 0)
      );
    },
    firstPageData() {
      return this.history.slice(0, 10);
    },
    params() {
      return {
        collected: this.collected,
        page: this.page
      };
    },
  },
  watch: {
    needWaitAndRefresh(val) {
      if (val) {
        this.startWait();
      } else {
        this.stopWait();
      }
    },
    isReachBottom() {
      this.isReachBottom = false;
      if (this.noMore || this.loading) return;
      this.getData();
    },
    isLogin(val) {
      if (val) {
        this.refresh();
      }
    },
    collected() {
      this.refresh(true);
    },
    isShow: {
      immediate: true,
      handler(val) {
        if (val) {
          this.checkAndLoadData();
        }
      },
    },
  },
  created() {
    uni.$on("setReachBottom", () => {
      this.isReachBottom = true;
    });
    uni.$on("pullDown", async () => {
      await this.refresh();
      uni.$emit("stopPullDown");
    });
  },
  beforeDestroy() {
    uni.$off("pullDown");
    uni.$off("setReachBottom");
  },
  methods: {
    ...mapMutations([
      "setNeedRefreshAll",
      "setNeedRefreshCollect",
      "setNeedRefreshLeft",
    ]),
    startWait() {
      let waitTime = 5 * 60 * 1000
      if (!startWaitTime) {
        startWaitTime = Date.now();
      }
      timer = setTimeout(async () => {
        console.log("检查一次");
        let data = await getHistory({ ...this.params, page: 1 });
        if (timer) {
          let isWaitContinue = this.checkAndRefresh(data);

          let isTimeOk = Date.now() - startWaitTime < waitTime;
          if (isWaitContinue && isTimeOk) {
            this.startWait();
          } else {
            this.stopWait()
          }
        }
      }, 3000);
    },
    checkAndRefresh(data) {
      let total = 0;
      this.firstPageData.forEach((one, index) => {
        let newVal = data[index].reportStatus;
        let isChange = one.reportStatus !== newVal;
        if (isChange) {
          one.reportStatus = newVal;
        }
        total += newVal;
      });
      return total !== this.firstPageData.length;
    },
    stopWait() {
      clearTimeout(timer);
      timer = null;
      startWaitTime = null;
    },
    async refresh(isKeepPosition) {
      let scrollTop = isKeepPosition && this.isFixedTop ? this.fixedTop + 2 : 0;
      //  有骨架屏的时候一定能撑满
      if (scrollTop) {
        uni.pageScrollTo({
          duration: 0, // 毫秒
          scrollTop, // 位置
        });
      }

      this.isShowFrame = true;
      this.page = 1;
      this.history = [];
      this.noMore = false;
      let minDelayGetData = this.minDelay(this.getData, 350);
      await minDelayGetData();
      this.loading = false;
      this.isShowFrame = false;
    },

    minDelay(fn, minTime) {
      let sleep = (time) =>
        new Promise((resolve) => {
          setTimeout(resolve, time);
        });
      return async (...args) => {
        let start = Date.now();
        let res = await fn.call(this, ...args);
        let useTime = Date.now() - start;
        if (useTime < minTime) {
          await sleep(minTime - useTime);
          return res;
        }
        return res;
      };
    },

    checkAndLoadData() {
      if (
        this.needRefreshAll ||
        (this.needRefreshLeft && !this.collected) ||
        (this.needRefreshCollect && this.collected)
      ) {
        try {
          this.refresh();
        } catch (e) {
          console.log(e);
        }
      }
      this.setNeedRefreshAll(false);
      this.setNeedRefreshCollect(false);
      this.setNeedRefreshLeft(false);
    },

    checkIsNoMore(data) {
      this.noMore = data.length < 10;
    },
    async getData() {
      if (this.noMore || this.loading || !this.isLogin) return;
      this.loading = true;
      try {
        let data = await getHistory(this.params);
        if (data.length===10) {
          this.page++
        }
        this.checkIsNoMore(data);
        this.history.push(...data);
      } catch (e) {
        console.log(e);
      }
      this.loading = false;
    },
  },
};
</script>

<style scoped lang="scss">
.history {
  padding: 28rpx 24rpx;
  padding-top: 0;
  color: black;
  text-align: left;

  .top {
    border-bottom: 1rpx solid rgb(224, 224, 224);
    padding: 0 24rpx;
    margin: 0 -24rpx;
    position: sticky;
    top: 0;
    z-index: 2;
    background: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-weight: 400;
      font-size: 32rpx;
      color: black;
      line-height: 100rpx;
    }
  }
  .content {
    .no-login,
    .no-history {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 480rpx;
      font-size: 28rpx;
      line-height: 40rpx;
      color: black;
      font-weight: 400;
      text-align: center;
      .name {
        margin-top: 32rpx;
      }
      .icon {
        transform: translateX(10rpx);
        width: 476rpx;
      }
    }
    .has-content {
      width: 100%;
    }
  }
}
</style>
