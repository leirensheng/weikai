
import request from "./httpRequest.js";


export function deleteReport(id) {
  let openId = uni.getStorageSync("openId");
  return request({
    url: `/report/delete`,
    method:'delete',
    data:{
      id,
      openId
    }
  });
}
export function collect(id) {
  let openId = uni.getStorageSync("openId");

  return request({
    url: `/report/collect`,
    method:'put',
    data:{
      openId,
      id
    }
  });
}
export function noCollect(id) {
  let openId = uni.getStorageSync("openId");
  return request({
    url: `/report/cancelCollect`,
    method:'delete',
    data:{
      openId,
      id
    }
  });
}

  
export function getHistory(data) {
  let openId = uni.getStorageSync("openId");
  return request({
    url: `/report/list`,
    data:{
      ...data,
      openId
    }
  });
}


export function getDetail(id) {
  let openId = uni.getStorageSync("openId");
  return request({
    url: `/report/get`,    
    method:'post',
    data:{
      id,
      openId
    }  
  });
}





export function generate(data) {
  let openId = uni.getStorageSync("openId");

  return request({
    url: `/report/generate`,
    method:'post',
    data:{
      ...data,
      openId
    }    
  });
}

export function uploadPic(src) {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: baseUrl + "/identify/getImageText",
      fileType: "image",
      filePath: src,
      name: "file",
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