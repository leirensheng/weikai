<template>
  <div class="search">
    <cur-step v-model="curStep"></cur-step>
    <step-one v-model="url" v-show="curStep === 0"></step-one>
    <step-two v-model="hasDoneArr" v-show="curStep === 1"></step-two>
    <step-three v-show="curStep === 2"></step-three>

    <div class="bottom">
      <div class="btn-primary" @click="prev" v-if="curStep !== 0">上一步</div>
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
import { generate } from "@/api/eye.js";

export default {
  mixins: [subscribeMixin],
  computed: {
    isDisableReport() {
      return Object.values(this.form).filter(Boolean).length === 0||this.hasGenerate;
    },
    ...mapState(["hasDoneArr", "form"]),
    ...mapGetters(["lastUrl"]),
    isDisabled() {
      if (this.curStep === 0) {
        return this.url.length === 0;
      } else if (this.curStep === 1) {
        return this.lastUrl === "";
      }
    },
  },
  created() {
    console.log("create");
  },
  onShow() {
    this.checkSubscribe();
    this.setTitle();
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
      url: "",
      loading: false,
      curStep: 0,
      hasGenerate:false
    };
  },
  mounted() {},
  methods: {
    ...mapMutations(["setNeedRefreshLeft", "setSubscribe"]),

    toReport(isSubscribeOk) {
      this.hasGenerate = true;
      this.setSubscribe(isSubscribeOk);
      uni.switchTab({
        url: "/pages/user/index",
      });
    },
    async generate() {
      let weChatNotify = false;
      this.loading = true;
      try {
        await this.subscribe();
        weChatNotify = true;
      } catch (e) {
        weChatNotify = false;
      }
      uni.showLoading({
        title: "生成中",
      });
      await generate({
        ...this.form,
        weChatNotify,
      });
      this.setNeedRefreshLeft(true);
      uni.hideLoading();
      this.loading = false;
      this.toReport(weChatNotify);
    },
    setTitle() {
      let map = {
        0: "复制商品链接",
        1: "产品名牌拍照",
        2: "铭牌信息确认",
      };
      uni.setNavigationBarTitle({
        title: map[this.curStep],
      });
    },
    next() {
      this.curStep++;
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
  .bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    @include fixed-bottom(10rpx);

    // @min fixed-bottom
    .btn,
    .btn-primary {
      margin: 0 22rpx;
      flex: 1;
      // margin-bottom: 48rpx;
    }
  }
}
</style>
