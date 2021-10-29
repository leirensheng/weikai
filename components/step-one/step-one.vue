<template>
  <div class="step-1">
    <div class="card">
      <div class="top">
        <div class="title">我的剪贴板</div>
        <div class="right" @click="clear">
          <image class="icon" mode="widthFix" src="/static/delete.svg"></image>
          <span class="text">清空</span>
        </div>
      </div>
      <div class="textarea" v-if="value">{{ value }}</div>
      <div class="textarea no-text" v-else>请复制唯品会手机端的商品链接</div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
    };
  },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  mounted() {},
  methods: {
    clear() {
      this.$emit("input", "");
    },
  },
};
</script>

<style scoped lang="scss">
.step-1 {
  width: 100%;
  .scroll-y {
    max-height: 50vh;
  }
  .card {
    .top {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      .title {
        font-size: 32rpx;
        line-height: 44rpx;
        color: black;
      }

      .right {
        position: absolute;
        right: 24rpx;
        display: flex;
        align-items: center;
        color: #ff782e;
        font-size: 28rpx;
        line-height: 40rpx;
        font-weight: 400;
        .icon {
          width: 28rpx;
          margin-right: 8rpx;
        }
      }
    }
    .textarea {
      height: 392rpx;
      font-size: 28rpx;
      word-break: break-all;
      margin-top: 32rpx;
      width: 100%;
      line-height: 40rpx;
      overflow: hidden;
    }
    .no-text {
      color: #999999;
    }
  }

}
</style>
