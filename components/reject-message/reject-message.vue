<template>
  <div class="reject-message">
    <my-dialog :value="value" @input="(val) => $emit('input', val)">
      <div class="content">
        <image class="pic" mode="widthFix" src="/static/reject.png"></image>
        <div class="desc">
          <div>需要等待约<span class="time">1分钟...</span></div>
          <div class="subtext">
            生成后请在<span class="report">历史报告</span>中查看
          </div>
        </div>
        <div class="confirm" @click="confirm">确定</div>
      </div>
    </my-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  created() {},
  mounted() {},
  methods: {
    confirm() {
      this.$emit("input", false);
    },
  },
};
</script>

<style scoped lang="scss">
.reject-message {
  .content {
    transform: translate(-50%, -50%);
    background: white;
    width: 640rpx;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    border-radius: 10rpx;
    .pic {
      width: 496rpx;
      position: relative;
      top: -102rpx;
    }
    .desc {
      margin-top: calc(-102rpx + 24rpx);
      font-size: 32rpx;
      text-align: center;
      .time {
        font-size: 36rpx;
        font-weight: bold;
        color: #334bc9;
      }
      .subtext {
        margin-top: 16rpx;
        font-size: 28rpx;
        .report {
          color: #334bc9;
        }
      }
    }
    .confirm {
      text-align: center;
      border-top: 1rpx solid #999999;
      margin-top: 46rpx;
      width: 100%;
      padding: 20rpx 78rpx;
      line-height: 44rpx;
      font-size: 32rpx;
    }
  }
}
</style>
