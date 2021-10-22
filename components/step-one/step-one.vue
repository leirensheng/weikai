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
      <div class="left" :class="{ black: selectedName }">
        {{ selectedName || "选择演示样例" }}
      </div>
      <image mode="widthFix" class="icon" src="/static/right.svg"></image>
    </div>
    <my-dialog v-model="isShowDialog">
      <scroll-view class="scroll-Y" scroll-y="true">
        <div class="dialog-content safe-bottom">
          <div
            class="item"
            v-for="(item, index) in items"
            :key="index"
            @click="setValue(item)"
          >
            {{ item.productName }}
          </div>
        </div>
      </scroll-view>
    </my-dialog>
  </div>
</template>

<script>
import { getSample } from "@/api/eye.js";

export default {
  data() {
    return {
      selectedName: "",
      items: [],
      isShowDialog: false,
    };
  },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  async created() {
    uni.showLoading({
      title: "加载中",
    });
    let data = await getSample();
    this.items = data.map((one,index) => ({
      ...one,
      productLink:
        `https://detail.vip.com/detail-1710616951-6919462142443405399${index}.html`,
    })).filter(one=> one.productName);
    uni.hideLoading();
  },
  mounted() {},
  methods: {
    setValue({ productLink, productName, id }) {
      this.selectedName = productName;
      this.$emit("input", productLink);
      this.$emit("update:basedataId", id);

      this.isShowDialog = false;
    },
    clear() {
      this.selectedName = "";
      this.$emit("input", "");
      this.$emit("update:basedataId", "");
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
  .scroll-y {
    max-height: 50vh;
  }
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
    font-size: 32rpx;
    .black {
      color: black;
    }
    .icon {
      width: 28rpx;
      height: 28rpx;
    }
  }
  .dialog-content {
    max-height: 60vh;
    overflow: auto;
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
