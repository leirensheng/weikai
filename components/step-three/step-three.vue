<template>
  <div class="step-3">
    <div class="row" v-for="item in data" :key="item.id">
      <label class="label" :class="item.required && 'required'" :for="item.id"
        >{{ item.name }}：</label
      >
      <!-- <input
            :name="item.id"
            class="input"
            v-model="form[item.id]"
            placeholder="未显示"
          /> -->
      <div class="textarea-wrap">
        <textarea
          :maxlength="-1"
          auto-height
          class="textarea"
          v-model="form[item.id]"
          :name="item.id"
          :disabled="isSyncing !== 0"
          placeholder="未显示"
        />
      </div>

      <div
        v-if="imageTextSplits.length"
        class="right"
        @click="showDailog(item.id)"
      >
        <image mode="widthFix" class="icon" src="/static/down.svg" />
      </div>
    </div>

    <my-dialog v-model="dialogShow">
      <select-word
        v-if="dialogShow"
        @close="dialogShow = false"
        @confirm="setValue"
        :value="imageTextSplits"
      ></select-word>
    </my-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["form"]),
  },
  data() {
    return {
      imageTextSplits: [
        ["fds", "d", "gh"],
        ["ghj", "FDS", "FFF"],
      ],
      data: [
        {
          name: "产品名称",
          id: "productName",
        },
        {
          name: "规格型号",
          id: "specifications",
          required: true,
        },
        {
          name: "商品条码",
          id: "code",
        },
        {
          name: "企业名称1",
          id: "factory1",
        },
        {
          name: "企业名称2",
          id: "factory2",
        },
        {
          name: "执行标准",
          id: "standard",
        },
      ],
      editingId: "",
      dialogShow: false,
    };
  },
  created() {
    //多个地址

    this.data.forEach((one) => {
      this.$set(this.form, one.id, "");
    });
  },
  mounted() {},
  methods: {
    setValue(val) {
      this.form[this.editingId] = val;
    },
    showDailog(id) {
      this.editingId = id;
      this.dialogShow = true;
    },
  },
};
</script>

<style scoped lang="scss">
.step-3 {
  .row {
    position: relative;
    border-bottom: 1rpx solid #d4d4d4;
    padding: 28rpx 0;
    padding-left: 24rpx;
    display: flex;
    align-items: center;
    font-size: 32rpx;
    .label {
      margin-right: 10rpx;
      width: 220rpx;
      &.required {
        position: relative;
        &::before {
          position: absolute;
          left: -18rpx;
          content: "*";
          color: red;
          display: block;
        }
      }
    }
    :nth-child(2) {
      flex: 1;
      margin-right: 60rpx;
      line-height: 1.4;
      max-height: 140rpx;
      overflow: auto;
      .textarea {
        width: 100%;
      }
    }
    &:first-child {
      border-top: 1rpx solid #d4d4d4;
    }
    .right {
      position: absolute;
      right: 0;
      z-index: 99;
      padding: 15rpx 15rpx 15rpx 25rpx;
      .icon {
        width: 29rpx;
      }
      // height: 16rpx;
    }
  }
}
</style>
