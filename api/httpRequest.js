import env from "./getEnv.js";
let map = {
  develop: "https://cpsmszyzgj.gdcers.com/product-report",
  trial: "https://cpsmszyzgj.gdcers.com/product-report",
};
let baseUrl = map[env] || "https://cpsmszyzgj.gdcers.com/product-report";
let http = (option) => {
  let { timeout = 60000, noHandleCode, data, method = "get", url } = option;
  return new Promise((resolve, reject) => {
    uni.request({
      url: baseUrl + url,
      timeout,
      dataType: "json",

      data,
      method: method,

      header: {},
      success: (res) => {
        let { msg, message, code, data } = res.data;
        if (!noHandleCode) {
          if (code !== 0) {
            // 如果在请求结束后uni.hideLoading调用,shoast也会消失了
            uni.hideLoading();
            uni.showToast({
              icon: "none",
              title: msg || message,
              duration: 2000,
            });
            reject(res.data);
          } else {
            resolve(data);
          }
        } else {
          resolve(res.data);
        }
      },
      fail: (res) => {
        uni.hideLoading();
        uni.showToast({
          icon: "none",
          title: "网络不给力，请稍后再试~",
          duration: 2000,
        });
        reject(res);
      },
      complete: () => {},
    });
  });
};
export { baseUrl };
export default http;
