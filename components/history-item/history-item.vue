<template>
  <div class="history-item">
    <div class="wrap" @click="toDetail" :class="isShowFrame && 'hidden'">
      <image class="left" mode="widthFix" :src="src" v-if="src"></image>
      <div class="right">
        <div class="name">{{ item.productName }}</div>
        <div class="bottom">
          <div class="date">{{ $formatTime(item.createDate, true) }}</div>
          <div class="status" :class="item.genStatus === 0 && 'light'">
            {{ getStatus(item.genStatus) }}
          </div>
        </div>
      </div>
    </div>
    <!-- 骨架 -->
    <div class="wrap frame frame-light" :class="!isShowFrame && 'hidden'">
      <div class="left"></div>
      <div class="right">
        <div class="name">{{ fackName }}</div>
        <div class="name">{{ fackName }}</div>
        <div class="bottom">
          <div class="date">{{ fackDate }}</div>
          <div class="status">
            {{ fackStatus }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fackName: "占位",
      fackStatus: "需要花费1分钟生成",
      fackDate: "2021-01-01 19:50:50",
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
    src() {
      if (!this.item.platform) return "";
      return "/static/" + this.item.platform + ".png";
    },
  },
  created() {},
  mounted() {},
  methods: {
    toDetail() {
      if (this.item.genStatus === 0) return;
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
  padding: 32rpx 24rpx 32rpx 16rpx;
  border-radius: 10rpx;
  .wrap {
    display: flex;
  }
  .hidden {
    display: none;
  }
  .frame {
    line-height: 1;
    $grey: #ededed;
    color: $grey;
    position: relative;
    .left {
      background: $grey;
      height: 84rpx;
      border-radius: 8px;
    }
    .right {
      .name {
        height: 28rpx;
        margin: 12rpx 0;
        color: $grey;
        background: $grey;
        &:first-child {
          margin-top: 6rpx;
        }
        &:nth-child(2) {
          margin-bottom: 22rpx;
        }
      }

      .bottom {
        .date,
        .status {
          line-height: 1;
          height: 28rpx;
          margin: 6rpx 0;
          color: $grey;
          background: $grey;
        }
      }
    }
  }
  .left {
    height: 84rpx;
    margin-top: 6rpx;
    flex-shrink: 0;
    width: 84rpx;
    margin-right: 16rpx;
  }
  .right {
    flex: 1;
    font-size: 28rpx;
    line-height: 40rpx;
    .name {
      color: black;
      font-weight: 500;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #999999;
      margin-top: 16rpx;
      .status.light {
        color: rgb(59, 85, 226);
      }
    }
  }
}
</style>
