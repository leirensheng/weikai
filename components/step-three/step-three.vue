<template>
  <div class="step-3">
    <div class="row" v-for="item in config" :key="item.id">
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
          v-if="isReady"
          :maxlength="-1"
          auto-height
          :cursor-spacing="35"
          class="textarea"
          v-model="form[item.id]"
          :name="item.id"
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
    imageTextSplits() {
      return this.result.imageTextSplits || [];
    },
    config() {
      let addrs = this.transformConfig("manufacturerAddrs", "企业地址");
      let factures = this.transformConfig("manufacturers", "企业名称");
      return [
        {
          name: "产品名称",
          id: "productName",
        },
        {
          name: "规格型号",
          id: "specifications",
        },
        {
          name: "商品条码",
          id: "productCode",
        },
        ...factures,
        ...addrs,
        {
          name: "执行标准",
          id: "standard",
        },
      ];
    },
  },
  watch: {
    result: {
      deep: true,
      handler(val) {
        this.$nextTick(() => {
          this.config.forEach((one) => {
            let value = val[one.id];
            let reg = /(manufacturers|manufacturerAddrs)(\d)/;
            let [_, key, index] = one.id.match(reg) || [];
            if (_) {
              value = val[key][index];
            } else if (one.id === "standard") {
              value = val.standards.join("、\n");
            }
            this.$set(this.form, one.id, value);
            this.isReady = true;
          });
        });
      },
    },
  },
  props: {
    result: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isReady: false,
      editingId: "",
      dialogShow: false,
    };
  },

  mounted() {},
  methods: {
    transformConfig(key, name) {
      let length = this.result[key] ? this.result[key].length || 1 : 1;
      let onlyOne = length === 1;
      return Array.from({ length }, (one, index) => ({
        name: onlyOne ? name : `${name + (index + 1)}`,
        id: `${key + index}`,
      }));
    },
    setValue(val, arr) {
      let value = this.editingId === "standard" ? arr.join("、\n") : val;
      this.form[this.editingId] = value;
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
      // max-height: 140rpx;
      // overflow: auto;
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
    }
  }
}
</style>
