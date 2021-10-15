<template>
  <div class="history-page">
    <div class="one-history" v-for="item in dataForRender" :key="item.id">
      <history-item :item="item" :isShowFrame="isShowFrame"></history-item>
    </div>
    <div class="frame-light" v-if="isShowFrame"></div>

    <template v-if="!isShowFrame">
      <load-more v-if="!noMore"></load-more>
      <div class="no-more" v-else>没有更多了</div>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    noMore: {
      type: Boolean,
      default: false,
    },
    isShowFrame: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: [],
    },
  },

  beforeDestroy() {},
  computed: {
    dataForRender() {
      let length =  8;
      if (this.isShowFrame) {
        return Array.from({ length }, () => ({}));
      }
      return this.data;
    },
  },
  watch: {},

  onLoad() {},
  mounted() {},
  async onShow() {},

  methods: {},
};
</script>

<style scoped lang="scss">
.history-page {
  padding-top: 32rpx;
  position: relative;
  .one-history {
    margin-bottom: 32rpx;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .no-more {
    text-align: center;
    font-size: 28rpx;
  }
}
</style>
