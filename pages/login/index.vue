<template>
  <div class="login">
    <image class="pic" mode="widthFix" src="/static/weikai.svg"></image>
    <div class="title">产品实名实证验证</div>

    <div class="bottom">
      <!-- <div class="agree">
        <radio
          value="1"
          :checked="isAgree"
          style="transform: scale(0.6)"
          color="#327CF9"
          @click="clickAgreeRadio"
        /><span @click="clickAgreeRadio">我已阅读并同意 CCC认证智能识别工具</span>
        <span class="xieyi" @click="gotoServiceAgreement">《用户协议》</span>
      </div> -->

      <button
        class="btn1"
        :disabled="!isReady || !isAgree || hasClick"
        @click="login"
      >
        <image
          class="icon enabled"
          mode="widthFix"
          src="/static/wechat.svg"
        ></image>
        <image
          class="icon disabled"
          mode="widthFix"
          src="/static/wechat-disabled.svg"
        ></image>
        <span>微信用户快捷登录</span>
      </button>

      <div class="btn-primary" @click="back">取消</div>
    </div>
  </div>
</template>

<script>
import { saveUserInfo, saveCode } from "@/api/login.js";
import { getCode, newGetUserInfo, oldGetUserInfo } from "./login.js";

export default {
  data() {
    return {
      hasClick: false,
      hasGetUser: false,
      isAgree: true,
      code: "",
      isNewApi: false,
      loading: false,
      isReady: false,
    };
  },
  watch: {
    loading(val) {
      if (val) {
        uni.showLoading({
          title: "正在加载",
        });
      } else {
        uni.hideLoading();
      }
    },
  },
  async onLoad() {
    this.loading = true;
    this.isNewApi = !!uni.getUserProfile;
    this.code = await getCode("weixin");
    await saveCode(this.code);
    this.isReady = true;
    this.loading = false;
  },
  created() {},
  mounted() {},
  methods: {
    async getUserInfo() {
      let userinfoRes;
      if (this.isNewApi) {
        console.log("新获取");
        userinfoRes = await newGetUserInfo();
        let { encryptedData: userInfoEncryptedData, iv } = await oldGetUserInfo(
          "weixin"
        );
        userinfoRes.userProfileEncryptedData = userinfoRes.encryptedData;
        userinfoRes.userProfileIv = userinfoRes.iv;
        userinfoRes.userInfoEncryptedData = userInfoEncryptedData;
        userinfoRes.userInfoIv = iv;
      } else {
        console.log("旧获取");
        userinfoRes = await oldGetUserInfo("weixin");
        userinfoRes.userInfoEncryptedData = userinfoRes.encryptedData;
        userinfoRes.userInfoIv = userinfoRes.iv;
      }
      return userinfoRes;
    },
    getUser() {},
    // 授权
    async login() {
      this.hasClick = true;
      // this.loading = true;
      try {
        let userinfoRes = await this.getUserInfo();
        userinfoRes.jsCode = this.code;
        const user = await saveUserInfo(userinfoRes);
        uni.setStorageSync("user", user);
        uni.setStorageSync("openId", user.openId);
        console.log("用户信息缓存成功");
        this.hasGetUser = true;
        uni.setStorageSync("jsCode", this.code);
        uni.$emit("loginStatus", true);
        uni.navigateBack();
      } catch (e) {
        uni.$emit("loginStatus", false);
        this.clearStorage();
        this.hasClick = false;
        console.log(e);
      }
      // this.loading = false;
    },
    clearStorage() {
      uni.removeStorageSync("user");
      uni.removeStorageSync("openId");
      uni.removeStorageSync("jsCode");
    },

    // 服务协议
    // gotoServiceAgreement() {
    //   uni.navigateTo({
    //     url: "/pages/serviceAgreement/index",
    //   });
    // },
    // 点击同意单选框
    // clickAgreeRadio() {
    //   this.isAgree = !this.isAgree;
    // },
    back() {
      this.hasClick = false;
      uni.navigateBack();
    },
  },
};
</script>

<style scoped lang="scss">
.login {
  height: 100%;
  background-color: white;
  text-align: center;
  .pic {
    width: 160rpx;
    margin-top: 174rpx;
  }
  .title {
    font-weight: 500;
    color: #262626;
    line-height: 56rpx;
    font-size: 44rpx;
    margin-top: 32rpx;
  }
  .sub-title {
    font-size: 28rpx;
    line-height: 40rpx;
    color: #999999;
    width: 632rpx;
    margin: 0 auto;
    margin-top: 32rpx;
    text-align: justify;
    // text-align: left;
  }
  .bottom {
    margin-top: 94rpx;
  }
  .icon {
    width: 40rpx;
    margin-right: 12rpx;
  }
  .agree {
    font-size: 28rpx;
    line-height: 40rpx;
    display: flex;
    justify-content: center;
    align-items: center;

    color: #999999;
    .xieyi {
      color: #355dee;
    }
    //   margin-top: ;
  }
  .grey {
    background-color: rgb(241, 239, 239);
    color: #8d8e8e;
  }
  .btn1,
  .btn-primary {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 700rpx;
    margin: 0 auto;
    margin-top: 32rpx;
    border-radius: 8rpx;
  }
  .btn1[aria-disabled="false"] {
    .icon {
      &.enabled {
        display: block;
      }
      &.disabled {
        display: none;
      }
    }
  }
  .btn1[aria-disabled="true"] {
    .icon {
      &.enabled {
        display: none;
      }
      &.disabled {
        display: block;
      }
    }
  }
}
</style>
