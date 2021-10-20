import Vue from "vue";
import App from "./App";
import store from "./store";
import checkLogin from "@/utils/checkLogin.js";
Vue.config.productionTip = false;
Vue.prototype.$checkLogin = checkLogin;
Vue.prototype.$store = store;
Vue.prototype.$formatDate = (val) => {
  if (!val) return "";
  let date = val;
  if (typeof val !== "object") {
    date = new Date(val);
  }
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let year = date.getFullYear();
  month = getFullNumber(month);
  day = getFullNumber(day);
  return `${year}-${month}-${day}`;
};

function getFullNumber(val) {
  return val <= 9 ? `0${val}` : val;
}
Vue.prototype.$sleep = (time = 500) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};
Vue.prototype.$formatTime = (val, noSecond) => {
  if (!val) return "";
  let date = val;
  if (typeof val !== "object") {
    date = new Date(val);
  }
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let year = date.getFullYear();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  month = getFullNumber(month);
  day = getFullNumber(day);
  hour = getFullNumber(hour);
  minute = getFullNumber(minute);
  second = getFullNumber(second);

  let str = `${year}-${month}-${day} ${hour}:${minute}`;
  return noSecond ? str : str + `:${second}`;
};

Vue.prototype.$toLogin = () => {
  uni.navigateTo({ url: "/pages/login/index" });
};
Vue.prototype.$toPage = (page) => {
  uni.navigateTo({ url: `/pages/${page}/index` });
};
Vue.prototype.$getPrePath = () => {
  let pages = getCurrentPages(); //页面对象
  let prePage = pages.slice(-2)[0];
  return prePage && prePage.route;
};

Vue.prototype.$getClip = () => {
  return new Promise((resolve) => {
    uni.getClipboardData({
      success: (res) => {
        resolve(res.data);
      },
    });
  });
};
Vue.prototype.$getId = () => Math.random().toString(36).substr(3, 8);

Vue.prototype.$isUrl = (val) => val.indexOf("http") !== -1;
App.mpType = "app";

Vue.prototype.$getDomsInfo = function (selector, noLimit, property) {
  return new Promise((resolve) => {
    let query = uni.createSelectorQuery();
    if (!noLimit) {
      query = query.in(this);
    }
    query
      .selectAll(selector)
      .boundingClientRect((result) => {
        if (result) {
          resolve(property ? result.map((one) => one[property]) : result);
        }
      })
      .exec();
  });
};


Vue.prototype.$getDomInfo = function (selector, noLimit, property) {
  return new Promise((resolve) => {
    let query = uni.createSelectorQuery();
    if (!noLimit) {
      query = query.in(this);
    }
    query
      .select(selector)
      .boundingClientRect((result) => {
        if (result) {
          resolve(property ? result[property] : result);
        }
      })
      .exec();
  });
};

const app = new Vue({
  ...App,
});
app.$mount();
