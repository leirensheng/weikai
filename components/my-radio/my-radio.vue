<template>
  <div class="my-radio">
    <div
      class="item"
      v-for="(item, index) in options"
      :key="index"
      @click="change(item.id)"
    >
      <div class="icon" :class="item.id === value && 'active'"></div>
      <div class="name">{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {},
  props: {
    value: {
      type: Number,
      default: 0,
    },
    options: {
      type: Array,
      default: () => [
        {
          name: "全部",
          id: 0,
        },
        {
          name: "已收藏",
          id: 1,
        },
      ],
    },
  },
  mounted() {},
  methods: {
    change(id) {
      this.$emit("input", id);
    },
  },
};
</script>

<style scoped lang="scss">
.my-radio {
  display: flex;
  align-items: center;
  .item {
    height: 100rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 32rpx;
    &:last-child {
      margin-right: 0;
    }
    .icon {
      border-radius: 50%;
      width: 28rpx;
      height: 28rpx;
      border: 2rpx solid black;
      &.active {
        border-color: #0059ec;
        position: relative;
        &::before {
          display: block;
          content: "";
          position: absolute;
          width: 16rpx;
          height: 16rpx;
          left: 50%;
          top: 50%;
          border-radius: 50%;
          background: #0059ec;
          transform: translate(-50%, -50%);
        }
      }
    }
    .name {
      margin-left: 6rpx;
      font-weight: 400;
      font-size: 28rpx;
      color: #000000;
      line-height: 40rpx;
    }
  }
}
</style>
