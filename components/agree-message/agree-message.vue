<template>
  <div class="agree-message">
    <my-dialog :value="value" @input="(val) => $emit('input', val)">
      <div class="content">
        <image class="pic" mode="widthFix" src="/static/agree.png"></image>
        <div class="desc">
          <div>需要等待约<span class="time">1分钟...</span></div>
          <div class="subtext">
            生成后<span class="report">你的微信将收到消息提醒</span>
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
.agree-message {
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
      width: 530rpx;
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
