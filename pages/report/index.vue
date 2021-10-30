<template>
  <div class="report" :class="isOwner ? 'has-fixed' : 'no-fixed'">
    <div class="content">
      <div class="title">{{ data.reportTitle }}</div>
      <div class="date">{{ showDate }}</div>
      <div class="isConsistent" :style="{ borderColor, background }">
        <image mode="widthFix" class="icon" :src="src"></image>
        <div class="name">{{ isConsistentName }}</div>
      </div>

      <table>
        <thead class="thead">
          <th class="th">
            <div class="title-bg">网页展示信息</div>
          </th>
          <th class="th">
            <div class="title-bg">实物铭牌信息</div>
          </th>
        </thead>
        <tr class="tr" v-for="(item, index) in config" :key="index">
          <td class="td0">{{ item.name }}</td>
          <td class="td">
            <span v-if="loading"></span>
            <span v-else-if="basedata[item.id]">{{ basedata[item.id] }}</span>
            <span v-else class="red">缺失</span>
          </td>
          <td
            class="td"
            :class="{ center: checkIsCenter(data[item.id]) }"
            v-html="
              getShowHtml(
                data[item.id],
                basedata[item.id],
                item.isMultiple,
                item.id
              )
            "
          ></td>
        </tr>
      </table>
    </div>
    <div class="bottom" v-if="isOwner">
      <div class="left" @click="remove">
        <image class="icon" mode="widthFix" src="/static/delete.svg"></image>
        <div>删除报告</div>
      </div>
      <button class="btn" @click="toggleCollect">
        <image class="icon" mode="widthFix" :src="collectSrc"></image>
        <div>{{ collectName }}</div>
      </button>
      <button class="btn" open-type="share">
        <image class="icon" mode="widthFix" src="/static/share.svg"></image>
        <div>转发</div>
      </button>
    </div>
  </div>
</template>

<script>
import { deleteReport, collect, noCollect, getDetail } from "@/api/eye.js";
import { mapMutations } from "vuex";

let isFromUser = true;

export default {
  components: {},

  data() {
    return {
      isOk: true,
      config: [
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
        {
          name: "生产者名称",
          id: "manufacturer",
          isMultiple: true,
        },
        {
          name: "生产者地址",
          isMultiple: true,
          id: "manufacturerAddr",
        },
        {
          name: "执行标准",
          id: "standard",
          isMultiple: true,
        },
      ],
      data: {},
      isCollected: false,
      isOwner: false,
      loading: true,
    };
  },

  computed: {
    basedata() {
      return this.data.basedata || {};
    },
    isConsistentName() {
      return this.isOk
        ? "该产品网页展示信息与实物铭牌展示信息一致"
        : "该产品网页展示信息与实物铭牌展示信息存在差异";
    },
    showDate() {
      return this.$formatTime(this.data.createTime, true);
    },

    src() {
      let type = this.isOk ? "success" : "danger";
      return `/static/${type}.svg`;
    },
    borderColor() {
      return this.isOk ? "#B7EB8F" : "#FF8788";
    },
    background() {
      return this.isOk ? "#EAFFD6" : "#FFDFDF";
    },

    collectSrc() {
      return this.isCollected ? "/static/collected.svg" : "/static/collect.svg";
    },
    collectName() {
      return this.isCollected ? "取消收藏" : "收藏";
    },
  },
  async onShareAppMessage() {
    // this.setAppShowRead(false);
    return {
      title: "公示信息对比报告",
      path: "/pages/report/index?id=" + this.id,
    };
  },
  created() {},
  mounted() {},
  watch: {
    loading(val) {
      if (val) {
        uni.showLoading({
          title: "加载中",
        });
      } else {
        uni.hideLoading();
      }
    },
  },
  onUnload() {
    uni.$off("loginStatus", this.backFromLogin);
    let isChange = this.isCollected !== this.data.isCollection;
    if (isChange) {
      this.setNeedRefreshCollect(true);
    }
  },
  // onShow() {
  //   setTimeout(() => {
  //     this.setAppShowRead(true);
  //   }, 1000);
  // },
  async onLoad({ id }) {
    isFromUser = this.$getPrePath() === "pages/user/index";
    // this.setAppShowRead(false);
    uni.$on("loginStatus", this.backFromLogin);
    this.id = id;
    this.loading = true;
    let isLogin = await this.$checkLogin();
    if (!isLogin) {
      this.$toLogin();
    } else {
      await this.getDetail();
    }
  },
  methods: {
    checkIsCenter(val) {
      if (this.loading) return false;
      return val.length === 0;
    },
    checkIsLose(id, val) {
      if (val.length === 0) {
        if (this.data.basedata[id].length) {
          this.isOk = false;
        }
        return true;
      }
      return false;
    },
    getStandardHtml(val) {
      let baseStandardArr = this.data.basedata.standard.split("、\n");
      let isOnlyOne = val.length === 1;

      if (baseStandardArr.length !== val.length) {
        console.log("长度不一");
        this.isOk = false;
      }

      let arr = val
        .map(
          (one, index) => this.getMark(one, baseStandardArr[index] || "").str
        )
        .map((one, index) => {
          let isLast = index === val.length - 1;
          return `<div>${one}${isOnlyOne || isLast ? "" : "、"}</div>`;
        });

      return arr.join("").slice(0, -2);
    },
    getShowHtml(val, base, isMultiple, id) {
      if (this.loading) return "";
      if (this.checkIsLose(id, val)) {
        return `<div class="red">缺失</div>`;
      }
      let isStandard = id === "standard";
      if (isStandard) {
        return this.getStandardHtml(val);
      }
      let toCompare = isMultiple && Array.isArray(val) ? val[0] : val;
      let { str: markStr, isDifferent } = this.getMark(toCompare, base);
      let otherStr = "";
      if (isMultiple) {
        let isFirstMatch = !isDifferent;
        let arr = (val || []).slice(1);
        arr = arr.map((one) =>
          isFirstMatch
            ? `<div class="grey has-top">${one}</div>`
            : `<div class="has-top">${this.getMark(one, base).str}</div>`
        );
        otherStr = arr.join("");
      }
      return markStr + otherStr;
    },
    getMark(val, base) {
      let isDifferent = val.length !== base.length;
      let arr = String(val).split("");
      let res = arr.map((one, index) => {
        let letterDiff = !base || base[index] !== one;

        let lookAsSame = {
          "(": "（",
          ")": "）",
          "（": "(",
          "）": ")",
        };
        if (letterDiff && base) {
          Object.entries(lookAsSame).forEach((oldVal, newVal) => {
            if (base[index] === oldVal && one === newVal) {
              letterDiff = false;
            }
          });
        }

        if (letterDiff) {
          isDifferent = true;
        }
        return letterDiff ? `<span class="red">${one}</span>` : one;
      });
      if (isDifferent) {
        this.isOk = false;
        console.log("不同", val, base);
      }
      return {
        str: res.join(""),
        isDifferent,
      };
    },
    backFromLogin(val) {
      if (val) {
        this.getDetail();
      } else {
        this.loading = false;
      }
    },
    ...mapMutations([
      "setNeedRefreshAll",
      "setNeedRefreshCollect",
      // "setAppShowRead",
    ]),
    handleData(data) {
      this.sortStandard(data);
      data.basedata.standard = data.basedata.standard.join("、\n");
      let ids = ["standard", "manufacturer", "manufacturerAddr"];
      ids.forEach((id) => {
        data[id] = data[id].filter(Boolean); //去掉空的[""]
      });
    },
    sortStandard(data) {
      let standard = data.standard;
      let base = data.basedata.standard.split("、");
      let res = [];
      let standardRes = [];
      for (let one of standard) {
        let index = base.indexOf(one);
        if (index !== -1) {
          res.push(one);
          standardRes.push(base[index]);
        }
      }
      res = [...new Set([...res, ...standard])];
      standardRes = [...new Set([...standardRes, ...base])];
      data.standard = res;
      data.basedata.standard = standardRes;
    },
    async getDetail() {
      let openId = uni.getStorageSync("openId");
      if (!openId) return;
      this.loading = true;
      let { msg, data } = await getDetail(this.id);
      if (msg === "报告不存在！") {
        uni.showToast({
          icon: "none",
          title: msg,
          duration: 3000,
        });
        setTimeout(() => {
          uni.reLaunch({
            url: "/pages/index/index",
          });
        }, 3000);
        return;
      }
      this.handleData(data);

      this.data = data;
      this.isCollected = this.data.isCollection;
      this.isOwner = this.data.openId === openId;
      this.loading = false;
    },

    remove() {
      uni.showModal({
        title: "确定要删除此报告吗?",
        content: " ",
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: "删除中",
            });
            await deleteReport(this.id);
            uni.hideLoading();
            if (isFromUser) {
              this.setNeedRefreshAll(true);
              uni.navigateBack();
            } else {
              uni.reLaunch({
                url: "/pages/index/index",
              });
            }
          }
        },
      });
    },

    async toggleCollect() {
      let val = !this.isCollected;
      let title = val ? "收藏中" : "取消收藏中";
      uni.showLoading({
        title,
      });
      if (val) {
        await collect(this.id);
      } else {
        await noCollect(this.id);
      }
      this.isCollected = val;
      uni.hideLoading();
    },
  },
};
</script>

<style scoped lang="scss">
.report {
  // height: 100vh;
  &.has-fixed {
    @include fixed-bottom(100rpx);
  }
  &.no-fixed {
    @include fixed-bottom(0rpx);
  }
  .content {
    padding: 50rpx 24rpx 48rpx 24rpx;
  }
  .title {
    text-align: center;
    color: black;
    line-height: 50rpx;
    font-size: 36rpx;
    font-weight: 500;
  }
  .date {
    text-align: center;
    margin-top: 16rpx;
    font-size: 28rpx;
    line-height: 40rpx;
    color: #999999;
    text-align: center;
  }
  .isConsistent {
    padding: 32rpx;
    margin-top: 48rpx;
    border-radius: 4rpx;
    display: flex;
    border: 2rpx solid;
    .icon {
      margin-top: 5rpx;
      width: 36rpx;
      height: 36rpx;
      flex-shrink: 0;
      margin-right: 16rpx;
    }
    .name {
      font-weight: 500;
      font-size: 24rpx;
      line-height: 48rpx;
    }
  }

  $width: 200rpx;

  .thead {
    display: flex;
    justify-content: flex-end;
    padding: 38rpx 0;
    .th {
      width: calc((100% - #{$width}) * 0.5);
      transform: translateX(-10%);
    }
  }
  .tr {
    &:nth-child(2) {
      border-top: 2rpx solid #e8e8e8;
    }
    border-bottom: 2rpx solid #e8e8e8;
    display: flex;
    padding: 29rpx 0;
    .td0 {
      line-height: 34rpx;
      font-weight: 400;
      font-size: 24rpx;
      color: black;
      width: $width;
    }
    .td {
      word-break: break-all;
      width: calc((100% - #{$width}) * 0.5);
      padding: 0 10rpx;
      font-size: 24rpx;
      color: black;
      font-weight: 500;
      line-height: 34rpx;
      &.center {
        display: flex;
        align-items: center;
      }
    }
  }
  .bottom {
    padding: 14rpx 24rpx 0 24rpx;
    z-index: 8;
    @include fixed-bottom(14rpx);
    box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.15);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
    .left {
      font-size: 24rpx;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      line-height: 34rpx;
      color: #ff782e;
      width: 150rpx;
      .icon {
        width: 36rpx;
      }
    }

    .btn {
      width: 256rpx;
      margin: 0;
      height: 72rpx;

      font-size: 28rpx;
      .icon {
        margin-right: 12rpx;
        width: 36rpx;
      }
    }
  }
}
</style>

<style lang="scss">
.red {
  color: red;
}
.grey {
  color: #999999;
}
.has-top {
  margin-top: 16rpx;
}
</style>