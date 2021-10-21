<template>
  <div class="history-item" @click="toDetail">
    <div class="status-pic">
      <image class="pic" mode="widthFix" :src="src" v-if="src"></image>
      <div class="desc" v-if="!isShowFrame">{{ desc }}</div>
    </div>

    <div class="wrap"  :class="isShowFrame && 'hidden'">
      <div class="title">{{ item.productName }}</div>

      <div class="bottom">
        <div class="date">{{ $formatTime(item.createTime, true) }}</div>
        <div class="left-time" v-if="isIng">
          <image class="pic" mode="widthFix" src="/static/clock.svg"></image>
          <div>约1分钟</div>
        </div>
      </div>
    </div>

    <!-- 骨架 -->
    <div class="wrap frame frame-light" :class="!isShowFrame && 'hidden'">
      <div class="title">
        <div class="line"></div>
        <!-- <div class="line"></div> -->
      </div>

      <div class="bottom">
        <div class="date">{{ fackDate }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fackDate: "2021-01-01 19:50",
    };
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    isShowFrame: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isIng() {
      return this.item.reportStatus === 0;
    },
    src() {
      let name = this.isShowFrame ? "defaultStatus" : this.isIng ? "ing" : "ed";

      return "/static/" + name + ".svg";
    },
    desc() {
      return this.isIng ? "生成中" : "已生成";
    },
  },
  created() {},
  mounted() {},
  methods: {
    toDetail() {
      if (this.item.reportStatus === 0) return;
      uni.navigateTo({
        url: "/pages/report/index?id=" + this.item.id,
      });
    },

    getStatus(status) {
      let map = {
        0: "需要花费1分钟生成...",
        1: "报告已生成",
      };
      return map[status] || "";
    },
  },
};
</script>

<style scoped lang="scss">
.history-item {
  box-shadow: 0px 0px 12rpx 0px rgba(0, 0, 0, 0.15);
  padding: 74rpx 24rpx 32rpx 32rpx;
  border-radius: 16rpx;
  position: relative;
  .status-pic {
    position: absolute;
    height: 48rpx;
    left: 32rpx;
    top: 0rpx;
    transform: translateY(-12.5%);
    .pic {
      width: 132rpx;
      height: 48rpx;
    }
    .desc {
      font-weight: 400;
      color: #ffffff;
      line-height: 34rpx;
      white-space: nowrap;
      font-size: 24rpx;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(calc(-50% - 8.8rpx), -50%);
    }
  }
  .wrap {
    .title {
      font-size: 28rpx;
      line-height: 40rpx;
      display: -webkit-box;
      word-break: break-all;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    .bottom {
      margin-top: 16rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .date {
        font-size: 24rpx;
        line-height: 34rpx;
        color: #999999;
      }
      .left-time {
        font-size: 24rpx;
        font-weight: 400;
        color: #ff5a00;
        // line-height: 34rpx;
        display: flex;
        align-items: center;
        .pic {
          margin-right: 8rpx;
          width: 28rpx;
          height: 28rpx;
        }
      }
    }
  }
  .hidden {
    display: none;
  }
  .frame {
    line-height: 1;
    $grey: #ededed;
    color: $grey;
    position: relative;
    .title {
      line-height: 1;
      .line {
        background: $grey;
        margin: 6rpx 0;
        height: 28rpx;
        // &:first-child {
        //   margin-bottom: 12rpx;
        // }
      }
    }
    .bottom {
      .date {
        background: $grey;
        color: $grey;
        height: 24rpx;
        margin: 5rpx 0;
        line-height: 1;
      }
    }
  }
}
</style>
