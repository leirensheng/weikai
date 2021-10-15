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
    <div class="demo" @click="openDialog">
      <div class="left" :class="{black:selectedName}">{{selectedName||'选择演示样例'}}</div>
      <image mode="widthFix" class="icon" src="/static/"></image>
    </div>
    <my-dialog v-model="isShowDialog">
      <div class="dialog-content safe-bottom ">
        <div
          class="item"
          v-for="(item, index) in items"
          :key="index"
          @click="setValue(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </my-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedName:'',
      items: [
        {
          name: "微电脑电饭煲",
          url: "http://a.url",
        },
        {
          name: "自动电饭煲",
          url: "http://b.url",
        },
        {
          name: "全智能电饭煲",
          url: "http://a.url",
        },
      ],
      isShowDialog: false,
    };
  },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  created() {},
  mounted() {},
  methods: {
    setValue({ url,name }) {
      this.selectedName = name
      this.$emit("input", url);
      this.isShowDialog = false
    },
    clear() {
      this.selectedName =''
      this.$emit("input", "");
    },
    openDialog() {
      this.isShowDialog = true;
    },
  },
};
</script>

<style scoped lang="scss">
.step-1 {
  width: 100%;
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
  .demo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 48rpx 0 28rpx 0;
    color: #999;
    border-bottom: 1rpx solid currentColor;
    .black{
      color: black;
    }
    .icon {
      width: 28rpx;
      height: 28rpx;
    }
  }
  .dialog-content {
    background: white;
    .item {
      line-height: 49rpx;
      font-size: 32rpx;
      padding: 32rpx 28rpx;
      border-bottom: 1rpx solid #e8e8e8;
    }
  }
}
</style>
