let id = "TR3Q5RXXxr0jl_9pX6BJacyDuAWxyV9KGkdH399vjNs";

export default {
  data() {
    return {
      isClose: false,
    };
  },
  created() {
    this.checkSubscribe();
  },
  methods: {
    checkSubscribe() {
      wx.getSetting({
        withSubscriptions: true,
        success: (res) => {
          console.log(res.subscriptionsSetting);
          let { itemSettings, mainSwitch } = res.subscriptionsSetting;
          if (!mainSwitch || (itemSettings && itemSettings[id] === "reject")) {
            this.isClose = true;
          }
          // console.log(res.subscriptionsSetting);
        },
      });
    },
    subscribe() {
      return new Promise((resolve, reject) => {
        if (!wx.requestSubscribeMessage) {
          wx.showModal({
            title: "提示",
            content: "请更新您的微信版本，来获取订阅消息功能",
            duration: 2000,
          });
          setTimeout(() => {
            reject();
          }, 2000);
          return;
        } else if (this.isClose) {
          uni.showToast({
            icon: "none",
            title: "订阅消息开关已关闭, 开启后才可订阅",
            duration: 2000,
          });
          setTimeout(() => {
            reject();
          }, 2000);
          return;
        }

        wx.requestSubscribeMessage({
          tmplIds: [id],
          success: (res) => {
            if (res[id] === "reject") {
              reject();
            } else {
              resolve();
            }
          },
          fail: (err) => {
            uni.showToast({
              icon: "none",
              title: err.errMsg,
              duration: 2000,
            });
            console.log("err", err);
            reject();
          },
        });
      });
    },
  },
};
