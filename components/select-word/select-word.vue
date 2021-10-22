<template>
  <div class="safe-bottom select-word-wrap">
    <div class="select-word">
      <div class="top">
        <div class="title">点击选择文字</div>
        <div class="right" @click="close">
          <div class="close"></div>
        </div>
      </div>

      <scroll-view scroll-y="true" class="content">
        <div v-for="(item, index) in data" :key="index" class="one-part">
          <span
            @click="toggleSelect(one)"
            v-for="(one, i) in item"
            :class="one.isSelected ? 'word selected' : 'word'"
            :key="i"
            >{{ one.word }}</span
          >
        </div>
      </scroll-view>

      <div class="bottom">
        <div class="btn-primary" @click="close">取消选择</div>
        <div class="btn" @click="confirm">确认</div>
      </div>
    </div>

    <!-- <div class="content">
        <div v-for="(item, index) in value" :key="index">
          <span v-for="(one,i) in item" :key="i">{{one}}</span>
        </div>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
    };
  },

  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  computed: {},
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.data = this.value.map((row) =>
        row.map((word) => ({
          word,
          isSelected: false,
        }))
      );
    },
    confirm() {
      let arr = this.data
        .reduce(
          (prev, row) => [...prev, ...row.filter((one) => one.isSelected)],
          []
        )
        .map((one) => one.word);
      let str = arr.join("");
      this.$emit("confirm", str, arr);
      this.close();
    },
    toggleSelect(one) {
      one.isSelected = !one.isSelected;
    },
    close() {
      this.$emit("close");
      this.initData();
    },
  },
};
</script>

<style scoped lang="scss">
.select-word-wrap {
  background: white;
}
.select-word {
  background-color: white;
  padding: 10rpx;
  .top {
    border-bottom: 1rpx solid #d4d4d4;
    position: relative;
    .title {
      text-align: center;
      font-size: 36rpx;
      font-weight: bold;
      line-height: 98rpx;
    }
    .right {
      position: absolute;
      right: 20rpx;
      top: 50%;
      transform: translateY(-50%);
      padding: 10rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      .close {
        display: inline-block;
        width: 35rpx;
        height: 1px;
        background: #333;
        transform: rotate(45deg);
        &:after {
          content: "";
          display: block;
          width: inherit;
          height: inherit;
          background: #333;
          transform: rotate(-90deg);
        }
      }
    }
  }
  .content {
    max-height: 50vh;
    overflow: auto;
    padding: 50rpx 0;
    width: 100%;
    word-break: break-all;

    .one-part {
      width: 85%;
      margin: 0 auto;
      .word {
        display: inline-block;
        background-color: rgb(247, 247, 247);
        font-size: 36rpx;
        line-height: 1.5em;
        // font-weight: 500;
        margin-right: 14rpx;
        margin-bottom: 22rpx;
        &.selected {
          // color: red;
          background-color: rgba(23, 240, 23, 0.2) !important;
        }
        // letter-spacing: 22rpx;
      }
    }
  }
  .bottom {
    padding: 0 14rpx;
    margin-bottom: 8rpx;
    display: flex;
    justify-content: space-between;
    .btn-primary,
    .btn {
      width: 48% !important;
      font-size: 28rpx;
      height: 80rpx;
    }
  }
}
</style>
