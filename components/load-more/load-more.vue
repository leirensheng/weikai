<template>
  <view class="loadmore">
    <view class="loading"></view>
    <view class="loadmore-tips">{{ text }}</view>
  </view>
</template>

<script>
export default {
  props: {
    //显示文本
    text: {
      type: String,
      default: "正在加载...",
    },
  },
};
</script>

<style scoped>
.loadmore {
  width: 48%;
  margin: 1.5em auto;
  line-height: 1.5em;
  font-size: 28rpx;
  text-align: center;
}

.loadmore-tips {
  display: inline-block;
  vertical-align: middle;
}

.loading {
  display: inline-block;
  margin: 0 6px;
  vertical-align: middle;
  width: 28rpx;
  height: 28rpx;
  background: 0 0;
  border-radius: 50%;
  border: 2px solid;
  border-color: #e5e5e5 #e5e5e5 #e5e5e5 #ff782e;
  animation: rotate 0.7s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
