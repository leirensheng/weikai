const newGetUserInfo = () =>
  new Promise((resolve, reject) => {
    uni.getUserProfile({
      desc: "用以获取用户昵称、头像等",
      success: (res) => {
        resolve(res);
      },
      fail(e) {
        uni.showToast({
          icon: "none",
          title: "获取用户信息失败",
          duration: 2000,
        });
        reject(e);
      },
    });
  });

const getCode = () =>
  new Promise((resolve, reject) => {
    uni.login({
      provider: "weixin",
      success: function (loginRes) {
        if (loginRes && loginRes.code) {
          let code = loginRes.code;
          resolve(code);
        } else {
          reject(loginRes);
        }
      },
      fail: () => {
        reject("失败");
      },
    });
  });
// 获取用户信息
const oldGetUserInfo = (provider) => {
  const promise = new Promise((resolve, reject) => {
    uni.getUserInfo({
      provider,
      success: function (res) {
        console.log("获取信息成功");
        console.log(res);
        resolve(res);
      },
      fail: function () {
        uni.showToast({
          icon: "none",
          title: "获取信息失败",
        });
      },
    });
  });

  return promise;
};
export { newGetUserInfo, oldGetUserInfo,getCode };
