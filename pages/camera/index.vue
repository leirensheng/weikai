<template>
  <view class="scan-page">
    <div class="back" :style="{ top: top + 'px', height: height + 'px' }">
      <image
        class="back-icon"
        mode="widthFix"
        src="/static/back2.svg"
        @click="back"
      ></image>
    </div>
    <div class="scan">
      <camera
        device-position="back"
        flash="auto"
        @error="error"
        class="camera"
      ></camera>

      <image
        mode="widthFix"
        :src="curPreview"
        class="preview"
        :class="{ show: isShowPreview }"
      ></image>

      <div class="bottom">
        <div class="local" @click="chooseOne">
          <image class="pic" mode="widthFix" src="/static/camera2.svg"></image>
          <span class="name">相册</span>
        </div>
        <image
          class="pic-btn"
          mode="widthFix"
          src="/static/shot.svg"
          @click="takeOne"
        ></image>

        <div
          class="has-done"
          @click="back"
          :style="{ visibility: lastUrl ? 'visible' : 'hidden' }"
        >
          <div class="pic-wrap">
            <image mode="widthFix" class="pic" :src="lastUrl"></image>
          </div>
          <div class="text">完成</div>
          <div class="num">{{ hasDoneArr.length }}</div>
        </div>
      </div>
    </div>
  </view>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      isDisabled: false,
      top: "",
      curPreview: "",
      height: "",
      data: {},
      isShowPreview: false,
    };
  },
  computed: {
    ...mapGetters(["lastUrl"]),
    ...mapState(["hasDoneArr"]),
  },
  onLoad() {
    let { height, top } = uni.getMenuButtonBoundingClientRect();
    this.height = height;
    this.top = top;
  },
  methods: {
    back() {
      uni.navigateBack();
    },
    async takeOne() {
      if (this.isDisabled) {
        return;
      }
      if (this.hasDoneArr.length >= 6) {
        uni.showToast({
          icon: "none",
          title: "最多只能选择6张图片",
          duration: 2000,
        });
        return;
      }
      this.isDisabled = true;
      let url = await this.takePhoto();
      this.isShowPreview = true;
      this.curPreview = url;

      setTimeout(() => {
        this.curPreview = "";
        this.isShowPreview = false;
        this.hasDoneArr.push(url);
        this.isDisabled = false;
      }, 500);
    },
    async chooseOne() {
      if (this.isDisabled) {
        return;
      }
      let urlArr = await this.chooseImage();
      this.hasDoneArr.push(...urlArr);
      this.back()
    },

    takePhoto() {
      return new Promise((resolve, reject) => {
        const ctx = uni.createCameraContext();
        ctx.takePhoto({
          quality: "high",
          success: (res) => {
            resolve(res.tempImagePath);
          },
          fail: (e) => {
            uni.showToast({
              icon: "none",
              title: "相机调用失败",
              duration: 2000,
            });
            reject(e);
          },
        });
      });
    },

    chooseImage() {
      return new Promise((resolve, reject) => {
        uni.chooseImage({
          count: 6 - this.hasDoneArr.length,
          sizeType: ["original", "compressed"],
          sourceType: ["album"], //这要注意，camera掉拍照，album是打开手机相册
          success: (res) => {
            resolve(res.tempFilePaths);
          },
          fail: (e) => {
            reject(e);
          },
        });
      });
    },
    error(e) {
      uni.showToast({
        icon: "none",
        title: "请打开摄像头权限，再重新进入本页面",
        duration: 4000,
      });
      console.log(e.detail);
    },
  },
};
</script>

<style scoped lang="scss">
.scan-page {
  position: relative;
  .back {
    position: absolute;
    background: transparent;
    width: 150rpx;
    z-index: 4;
    display: flex;
    justify-content: center;
    align-items: center;
    .back-icon {
      z-index: 5;
      width: 25px;
    }
  }

  height: 100%;
  .scan {
    height: 100%;
    .camera {
      height: 100%;
      width: 100%;
    }
    .preview {
      visibility: hidden;
      width: 100%;
      height: 100%;
      z-index: 3;
      transform-origin: 90% 90%;
      position: fixed;
      top: 0;
      left: 0;
      opacity: 1;
      &.show {
        visibility: visible;
        animation: smaller 0.5s ease-in-out;
        @keyframes smaller {
          to {
            transform: scale(0);
            opacity: 0;
          }
        }
      }
    }
    .bottom {
      color: white;
      position: fixed;
      bottom: 0;
      right: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: space-around;
      z-index: 4;

      @include fixed-bottom(54rpx);
      .desc {
        font-weight: bold;
        font-size: 32rpx;
        margin-bottom: 34rpx;
      }
      .pic-btn {
        width: 144rpx;
      }
      .local {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        width: 108rpx;
        height: 108rpx;

        background-color: rgba(161, 161, 161, 0.95);
        .pic {
          width: 45rpx;
        }
        .name {
          margin-top: 2px;
          font-size: 24rpx;
        }
      }

      .has-done {
        width: 108rpx;
        height: 108rpx;
        border: 2rpx solid #ff782e;
        position: relative;
        border-radius: 6rpx;
        .pic-wrap {
          width: 100%;
          height: 100%;
          overflow: hidden;
          .pic {
            width: 100%;
            height: 100%;
          }
        }
        .text {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 54rpx;
          color: white;
          background: #ff782e;
          font-size: 24rpx;
          line-height: 54rpx;
          text-align: center;
        }
        .num {
          background: #ff782e;
          border-radius: 50%;
          color: white;
          width: 40rpx;
          height: 40rpx;
          line-height: 40rpx;
          font-size: 24rpx;
          text-align: center;
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(50%, -50%);
        }
      }
    }
  }
}
</style>
