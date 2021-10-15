<script>
export default {
  onLaunch: function () {
    console.log("App Launch");
  },
  async onShow() {},
  methods: {},
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="scss">
page {
  height: 100%;
  background-color: #fff;
}
/*每个页面公共css */
view,
text,
span,
div {
  box-sizing: border-box;
  font-family: 微软雅黑;
  font-weight: 400;
}
.safe-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.card {
  box-shadow: 0px 0px 20rpx 0px rgba(0, 0, 0, 0.15);
  border-radius: 10rpx;
  padding: 40rpx 24rpx;
}
.btn {
  border-radius: 50rpx;
  height: 88rpx;
  width: 560rpx;
  color: white;

  background: linear-gradient(180deg, #ff782e 0%, #d65209 100%);
  font-size: 36rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  &[aria-disabled="true"] {
    background: linear-gradient(180deg, #bdc2cb 0%, #999faa 100%);
    color: white !important;
  }
  &:hover {
    background-color: #cc4d08;
  }
  &:after {
    border: none;
  }
}

.btn1 {
  border-radius: 4px;

  background: #e65a0f;
  height: 80rpx;
  font-size: 32rpx;
  width: 100%;
  // width: 702rpx;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: #c94c08;
  }
  &:after {
    border: none;
  }
}
.btn-primary {
  width: 100%;
  border-radius: 50rpx;
  border: 1px solid #ff6e00;
  color: #ff6e00;
  height: 80rpx;
  font-size: 32rpx;
  // width: 702rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.sticky {
  position: sticky;
  top: 0;
  z-index: 33;
}
.hight-title {
  font-size: 32rpx;
  line-height: 44rpx;
  color: rgba(0, 0, 0, 0.85);
  padding-left: 28rpx;
  font-weight: 500;
  position: relative;
  &:before {
    display: block;
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    height: 80%;
    transform: translateY(-50%);
    width: 12rpx;
    background: #004dcd;
  }
}
.frame-light {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(
    130deg,
    rgba(255, 255, 255, 0) 48%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0) 52%
  );
  background-size: 200% 100%;
  background-position-x: -50%;
  animation: 1.5s loading linear infinite;
}
@keyframes loading {
  to {
    background-position-x: -250%;
  }
}
.no-data {
  padding: 64rpx 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .icon {
    transform: translateX(5%);
    width: 384rpx;
    height: 150rpx;
  }
  .desc {
    width: 368rpx;
    font-size: 28rpx;
    line-height: 40rpx;
    margin-top: 32rpx;
    text-align: center;
  }
}
.title-bg {
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translate(-50%);
  font-size: 28rpx;
  &::before {
    z-index: -1;
    position: absolute;
    bottom: 0;
    left: -24rpx;
    right: -24rpx;
    top: 50%;
    content: "";
    display: block;
    background: #d9e7ff;
  }
}
</style>
