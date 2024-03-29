<template>
  <div class="search">
    <cur-step v-model="curStep"></cur-step>
    <step-one v-model="url" v-show="curStep === 0"></step-one>
    <step-two v-model="hasDoneArr" v-show="curStep === 1"></step-two>
    <step-three :result="result" v-show="curStep === 2"></step-three>

    <div class="bottom">
      <button class="btn-primary" @click="prev" v-if="curStep !== 0">
        上一步
      </button>
      <button
        class="btn"
        :disabled="isDisabled"
        @click="next"
        v-if="curStep !== 2"
      >
        下一步
      </button>
      <button v-else class="btn" :disabled="isDisableReport" @click="generate">
        生成报告
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import subscribeMixin from "./subscribe";
import { generate, uploadPic, analyse } from "@/api/eye.js";

export default {
  mixins: [subscribeMixin],
  computed: {
    isChangeUrl() {
      return this.url !== this.oldUrl;
    },
    isDisableReport() {
      return (
        Object.values(this.form).filter(Boolean).length === 0 || this.loading
      );
    },
    ...mapState(["hasDoneArr", "form"]),
    ...mapGetters(["lastUrl", "isChangeArr"]),
    isDisabled() {
      if (this.curStep === 0) {
        return this.url.length === 0;
      } else if (this.curStep === 1) {
        return this.lastUrl === "" || this.loading;
      }
    },
  },

  async onShow() {
    this.checkSubscribe();
    this.setTitle();
    this.isLogin = await this.$checkLogin();

    if (this.curStep === 0) {
      let clipData = await this.$getClip();
      if (this.$isUrl(clipData)) {
        this.url = clipData;
      }
    }
  },
  watch: {
    curStep: {
      immediate: true,
      handler() {
        this.setTitle();
      },
    },
  },
  data() {
    return {
      isError: false,
      url: "",
      oldUrl: "",
      batchId: "",
      loading: false,
      curStep: 0,
      result: {},
      isLogin: false,
    };
  },
  onLoad() {
    uni.$on("loginStatus", this.setLoginStatus);
  },
  onUnload() {
    this.reset();
    uni.$off("loginStatus", this.setLoginStatus);
  },
  mounted() {},
  methods: {
    ...mapMutations([
      "setNeedRefreshLeft",
      "setSubscribe",
      "setCompareArr",
      "setHasDoneArr",
    ]),
    setLoginStatus(val) {
      this.isLogin = val;
    },
    toReport() {
      uni.reLaunch({
        url: "/pages/user/index",
      });
    },
    getForm() {
      let val = JSON.parse(JSON.stringify(this.form));
      val.standards = val.standard.split(/、\n|、/).map((one) => one.trim());
      delete val.standard;
      Object.keys(val).forEach((key) => {
        let reg = /(manufacturers|manufacturerAddrs)(\d)/;
        let [_, realKey, index] = key.match(reg) || [];

        if (_) {
          if (!val[realKey]) val[realKey] = [];
          val[realKey][index] = String(val[key]).trim();
          delete val[key];
        } else if (!Array.isArray(val[key])) {
          val[key] = String(val[key]).trim();
        }
      });
      console.log(val);
      return val;
    },
    async generate() {
      if (!this.isLogin) {
        this.$toLogin();
        return;
      }
      let weChatNotify = 0;
      this.loading = true;
      try {
        await this.subscribe();
        weChatNotify = 1;
      } catch (e) {
        weChatNotify = 0;
      }
      uni.showLoading({
        title: "生成中",
      });
      let val = this.getForm();
      await generate({
        ...val,
        isSub: weChatNotify,
        imageBatchId: this.batchId,
        productUrl: this.url,
      });
      this.setNeedRefreshLeft(true);
      uni.hideLoading();
      this.loading = false;
      this.toReport();
      this.reset();
    },
    reset() {
      this.setHasDoneArr([]);
      this.setCompareArr([]);
      this.url = "";
      this.batchId = "";
      this.loading = false;
      this.curStep = "";
      this.result = {};
      this.isLogin = false;
    },
    setTitle() {
      let map = {
        0: "复制商品链接",
        1: "产品实物拍照",
        2: "产品信息确认",
      };
      uni.setNavigationBarTitle({
        title: map[this.curStep],
      });
    },
    async next() {
      if (this.curStep === 1 && (this.isChangeArr || this.isError)) {
        await this.uploadAndAnalyse();
      } else if (this.curStep === 0) {
        if (this.isChangeUrl) {
          this.setHasDoneArr([]);
          this.setCompareArr([]);
        }
        this.oldUrl = this.url;
      }
      this.curStep++;
    },
    async uploadAndAnalyse() {
      let batchId = this.$getId();
      this.batchId = batchId;
      uni.showLoading({
        title: "图片识别中",
      });
      this.loading = true;
      try {
        await this.upload(batchId);
        await this.analyse(batchId);
        this.isError = false;
      } catch (e) {
        this.isError = true;
        throw new Error(e);
      } finally {
        this.loading = false;
        uni.hideLoading();
      }
    },
    async analyse(batchId) {
      this.result = await analyse(batchId);
    },

    async upload(batchId) {
      let promises = this.hasDoneArr.map((one) => uploadPic(one, batchId));
      await Promise.all(promises);

      this.setCompareArr([...this.hasDoneArr]);
    },
    prev() {
      this.curStep--;
    },
  },
};
</script>

<style scoped lang="scss">
.search {
  padding: 48rpx 24rpx;
  @include fixed-bottom(148rpx);

  .bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    @include fixed-bottom(10rpx);
    padding-top: 10rpx;
    background: white;
    z-index: 100;
    .btn,
    .btn-primary {
      height: 80rpx;
      font-size: 28rpx;
      width: 340rpx;
      flex-grow: 0;
      flex-shrink: 0;
      justify-content: center;
      margin: 0;
      &:only-child {
        width: 640rpx;
      }
    }
    .btn-primary {
      &:first-child {
        margin-right: 22rpx;
      }
    }
  }
}
</style>
