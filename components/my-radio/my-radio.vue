<template>
  <div class="my-radio">
    <div
      class="item"
      v-for="(item, index) in options"
      :key="index"
      @click="change(item.id)"
    >
      <div class="name" :class="{active:index===value}">{{ item.name }}</div>
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

    &:last-child .name {
      padding-right: 0;
      border-right: none;
    }
    .name {
      border-right: 2rpx solid #999;
      padding: 0 32rpx;
      font-weight: 400;
      font-size: 28rpx;
      color: #000000;
      line-height: 1;
      &.active{
        
color: #FF782E;
      }
    }
  }
}
</style>
