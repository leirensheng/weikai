<template>
  <div class="key-value" v-if="isReady">
    <div
      class="row"
      :class="hasBorder && 'has-border'"
      v-for="(item, index) in showConfig"
      :key="index"
      :style="{ paddingTop: rowPadding, paddingBottom: rowPadding }"
    >
      <div
        class="name"
        :style="{
          width: (item.width || 240) + 'rpx',
          color: item.lightName ? '#FF0003' : 'black',
        }"
      >
        {{ item.name }}：
      </div>
      <div
        class="value"
        :style="{
          fontWeight: valueFontWeight,
          color: item.lightName ? '#FF0003' : 'black',
        }"
      >
        <span v-html="item.formatter(data[item.id])"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isReady: false,
      configHandled: [],
    };
  },
  props: {
    valueFontWeight: {
      type: Number,
      default: 500,
    },
    noDataShowDash: {
      type: Boolean,
      default: false,
    },
    hasBorder: {
      type: Boolean,
      default: false,
    },
    valueWidth: {
      type: Number,
      default: 350,
    },
    rowPadding: {
      type: String,
      default: "32rpx",
    },
    config: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  created() {
    this.configHandled = this.config.map((one) => {
      let noText = this.noDataShowDash
        ? "-"
        : '<span class="no">未查询到</span>';
      let defaultFormatter = (val) => val || noText;
      if (one.type === "date" || one.name.indexOf("日期") !== -1) {
        defaultFormatter = (val) => (val ? this.$formatDate(val) : noText);
      }
      let parentConfig = this.$parent.config.find((_) => _.id === one.id);
      let formatter = parentConfig.formatter;

      return {
        ...one,
        formatter: formatter || defaultFormatter,
        isShow: parentConfig.isShow || this.alwayShow,
      };
    });
    this.isReady = true;
  },
  computed: {
    showConfig() {
      if (!this.isReady) return [];
      return this.configHandled.filter((one) => {
        let val = this.data[one.id];
        return one.isShow(val);
      });
    },
  },
  mounted() {},
  methods: {
    alwayShow() {
      return true;
    },
  },
};
</script>

<style scoped lang="scss">
.row {
  display: flex;
  // align-items: center;
  justify-content: space-between;
  padding: 32rpx 0;
  font-size: 28rpx;
  &.has-border {
    border-top: 2rpx solid #e8e8e8;
    &:last-child {
      border-bottom: 2rpx solid #e8e8e8;
    }
  }
  .name {
    color: black;
    line-height: 44rpx;
    font-weight: 400;
    flex-shrink: 0;
  }
  .value {
    margin-left: 28rpx;
    word-break: break-all;
    flex-shrink: 0;
    flex: 1;
    font-weight: 500;
    line-height: 1.8em;
    text-align: justify;
    line-height: 40rpx;
  }
}
</style>
<style lang="scss">
.key-value {
  .no {
    font-weight: 400;
    color: #999999;
  }
  .red {
    color: #ff2022;
    margin-top: 22rpx;
  }
}
</style>