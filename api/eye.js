import request, { baseUrl } from "./httpRequest.js";
import env from "./getEnv.js";

export function deleteReport(id) {
  let openId = uni.getStorageSync("openId");
  return request({
    url: `/report/delReport/${openId}/${id}`,
  });
}
export function collect(id) {
  let openId = uni.getStorageSync("openId");

  return request({
    url: `/report/collectReport/${openId}/${id}/1`,
  });
}
export function noCollect(id) {
  let openId = uni.getStorageSync("openId");
  return request({
    url: `/report/collectReport/${openId}/${id}/0`,
  });
}

export function getSample() {
  return request({
    url: `/basedata/listPage/1000/1`,
  });
}

export function getHistory({ page, collected }) {
  let openId = uni.getStorageSync("openId");
  return request({
    url: `/report/listPage/${openId}/${collected}/${page}`,
  });
}

export function getDetail(id) {
  return request({
    url: `/report/getReport/${id}`,
    noHandleCode: true
  });
}

export function generate(data) {
  let openId = uni.getStorageSync("openId");
  let map={
    'develop':2,
    'trial':0,
    'release':1
  }
  return request({
    url: `/report/createReport`,
    method: "post",
    data: {
      ...data,
      openId,
      env: map[env]
    },
  });
}

export function analyse(imageBatchId) {
  return request({
    url: `/ocr/getImageText/${imageBatchId}`,
  });
}
export function getImageList(imageBatchId) {
  return request({
    url: `/ocr/getImageList/${imageBatchId}`,
  });
}


export function uploadPic(src, imageBatchId) {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: baseUrl + "/ocr/uploadImage",
      filePath: src,
      name: "file",
      formData: {
        imageBatchId,
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res);
        } else {
          uni.showToast({
            icon: "none",
            title: "上传失败",
            duration: 2000,
          });
          reject();
        }
      },
      fail: (e) => {
        uni.showToast({
          icon: "none",
          title: "上传失败",
          duration: 2000,
        });
        reject(e);
      },
    });
  });
}
