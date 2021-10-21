<template>
  <div class="index">
    <div class="content-wrap">
      <div class="content">
        <div class="title">欢迎使用产品实名实证验证工具</div>
        <swiper
          class="swiper"
          :current="current"
          @change="handleChange"
          circular
          :interval="2000"
          :indicator-dots="false"
          :autoplay="autoplay"
        >
          <swiper-item v-for="(item, index) in items" :key="index">
            <div class="item">
              <image class="icon" mode="widthFix" :src="item.pic"></image>
              <div class="desc-wrap">
                <div v-html="item.desc"></div>
              </div>
            </div>
          </swiper-item>
        </swiper>

        <button class="btn" @click="toSearch">生成公示信息对比报告</button>
      </div>
    </div>
    <div class="bottom">
      <div class="title">威凯认证检测有限公司主办</div>
      <div class="subtitle">
        消费者报道杂志社有限公司·正选™数据中心提供技术支持
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      current: 0,
      autoplay: false,
      items: [
        {
          pic: "/static/index1.svg",
          desc: '<div class="pic-desc">复制<span class="hightlight">唯品会手机端</span>的商品链接</div>',
        },
        {
          pic: "/static/index2.svg",
          desc: '<div class="pic-desc">拍摄<span class="hightlight">实物产品铭牌</span>信息</div>',
        },
      ],
    };
  },
  onShow() {
    this.current = 0;
    this.autoplay = true;
  },
  onHide() {
    this.current = 0;
    this.autoplay = false;
  },
  created() {},
  mounted() {},
  methods: {
    toSearch() {
      uni.reLaunch({
        url: "/pages/search/index",
      });
    },
    handleChange(e) {
      this.current = e.detail.current;
    },
  },
};
</script>

<style scoped lang="scss">
.index {
  .content-wrap {
    height: calc(100vh - 114rpx);
    display: flex;
    flex-direction: column;
    justify-content: center;
    // align-items: center;
  }
  .content {
    .title {
      font-weight: 500;
      text-align: center;
      font-size: 40rpx;
      color: #262626;
    }
    .swiper {
      height: 620rpx;
      width: 100%;
      .item {
        .icon {
          display: block;
          width: 562rpx;
          height: 460rpx;
          margin: 0 auto;
          margin-top: 86rpx;
        }
        .desc-wrap {
          transform: translateY(-1px);
          border-top: 2rpx solid #3f3d56;
        }
      }
    }
    .btn {
      margin-top: 64rpx;
    }
  }
  .bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #999999;
    z-index: -1;
    .title {
      line-height: 40rpx;
      font-size: 28rpx;
    }
    .subtitle {
      margin-top: 8rpx;
      font-size: 24rpx;

      line-height: 34rpx;
      margin-bottom: 32rpx;
    }
  }
}
</style>
<style lang="scss">
.index {
  .pic-desc {
    line-height: 44rpx;
    font-size: 32rpx;
    color: black;
    text-align: center;
    padding-top: 30rpx;
  }
  .hightlight {
    color: #e9631a;
    font-weight: bold;
  }
}
</style>