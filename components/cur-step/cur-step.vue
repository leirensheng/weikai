<template>
  <div class="cur-step">
    <div
      class="item"
      v-for="(item, index) in steps"
      :key="index"
      :class="{ active: index === value, bigger: value > index }"
    >
     <div class="pic-wrap">
      <image mode="widthFix" class="pic" :src="getPic(index)"></image>

     </div>
      <div class="name">{{ item }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      steps: ["复制商品链接", "产品铭牌拍照", "铭牌信息确认"],
    };
  },
  props: {
    value: {
      type: Number,
      default: 0,
    },
  },

  created() {},
  mounted() {},
  methods: {
    getPic(index) {
      let isActive = index === this.value;
      let bigger = this.value > index;
      let res = `/static/${index + 1}-${
        isActive ? "active" : bigger ? "black" : "grey"
      }.svg`;
      return res;
    },
  },
};
</script>

<style scoped lang="scss">
.cur-step {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 18rpx;
  .item {
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    flex: 1;
    position: relative;
    .pic-wrap{
      width: 88rpx;
      height: 88rpx;
      display:flex;
      justify-content:center;
      align-items:center;
    }
    .pic {
      width: 56rpx;
      height: 56rpx;
    }
    .name {
      font-size: 24rpx;
      line-height: 84rpx;
      color: #999;
    }
    &.active {
      .pic {
        width: 46rpx;
        width: 88rpx;
        height: 88rpx;
      }
      .name {
        color: black;
        font-size: 32rpx;
      }
    }
    &.bigger {
      .name {
        color: black;
      }
    }
    &:not(:last-child)::after{
      content: '......';
      color: #999999;
      display: block;
      position: absolute;
      top:44rpx;
      left: 100%;
      transform: translate(-50%,-50%);
    }
  }
}
</style>
