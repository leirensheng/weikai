<template>
  <div class="step-2">
    <div class="card" :class="{ empty: !lastUrl }">
      <div class="no-pic" v-if="!lastUrl" @click="toCamera">
        <image class="pic" mode="widthFix" src="/static/camera.svg"></image>
        <div class="name">拍照/上传照片</div>
      </div>

      <div class="has-content" v-else>
        <div
          class="item"
          :class="{ preview: previewIndex === index }"
          v-for="(item, index) in hasDoneArr"
          :key="index"
          @click="preview(index)"
        >
          <image mode="aspectFit" class="pic" :src="item"></image>
          <div
            v-if="previewIndex !== index"
            class="close-icon-wrap"
            @click.stop="removeOne(index)"
          >
            <div class="close-icon"></div>
          </div>
        </div>
        <div class="add" v-if="hasDoneArr.length < 6" @click="toCamera">
          <div class="close-icon"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      previewIndex: -1,
    };
  },
  created() {},
  computed: {
    lastUrl() {
      if (this.hasDoneArr) {
        return this.hasDoneArr.slice(-1)[0];
      }
      return "";
    },
    ...mapState(["hasDoneArr"]),
  },
  mounted() {},
  methods: {
    preview(i) {
      if (this.previewIndex === -1) {
        this.previewIndex = i;
      } else {
        this.previewIndex = -1;
      }
    },
    toCamera() {
      this.$toPage("camera");
    },
    removeOne(index) {
      this.hasDoneArr.splice(index, 1);
    },
  },
};
</script>

<style scoped lang="scss">
.step-2 {
  .card {
    min-height: 330rpx;
    padding: 0;
    &.empty {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .no-pic {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .pic {
        width: 74rpx;
        height: 66rpx;
      }
      .name {
        font-size: 32rpx;
        line-height: 44rpx;
        margin-top: 24rpx;
        color: #e87c3a;
      }
    }
    .has-content {
      display: flex;
      flex-wrap: wrap;
      padding: 8rpx 16rpx 32rpx 16rpx;
      .close-icon {
        display: inline-block;
        width: 27rpx;
        height: 2rpx;
        background: #333;
        transform: rotate(45deg);
        &:after {
          content: "";
          display: block;
          width: 27rpx;
          height: 2rpx;
          background: #333;
          transform: rotate(-90deg);
        }
      }
      .item {
        margin-top: 50rpx;
        width: 180rpx;
        height: 240rpx;
        position: relative;
        margin-right: 44rpx;

        border-radius: 4rpx;
        background: #e8e8e8;
        // transition: all 0.4s;

        &:nth-child(3n) {
          margin-right: 0;
        }

        &.preview {
          z-index: 8;
          width: 100vw;
          height: 100vh;
          position: fixed;
          z-index: 101;
          margin-top: 0;
          top: 0;
          left: 0;
          background: rgb(0, 0, 0);
          .pic {
            width: 100vw;
            height: 100vh;
          }
          // position: fixed;
          // z-index: 8;
          // top:0;
          // left:0;
          // height: 100vh;
          // width: 100vw;
        }
        .pic {
          transition: all 0.3s ease-in-out;
          width: 100%;
          height: 240rpx;
        }
        .close-icon-wrap {
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(50%, -50%);

          box-shadow: 0px 0px 8rpx 0px rgba(0, 0, 0, 0.15);
          width: 48rpx;
          height: 48rpx;
          border-radius: 50%;
          background: white;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .add {
        margin-top: 50rpx;

        width: 180rpx;
        height: 240rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4rpx;

        border: 2rpx solid #d9d9d9;
        .close-icon {
          transform: rotate(0deg);
          width: 72rpx;
          height: 6rpx;

          background: #ff782e;
          &:after {
            background: inherit;

            width: inherit;
            height: inherit;
          }
        }
      }
    }
  }
}
</style>
