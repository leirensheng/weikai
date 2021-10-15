import request from "./httpRequest.js";

/**
 * 保存session_key
 */
export function saveCode(jscode) {
  return request({url:`/login/saveSessionKey/${jscode}`});
}

export function checkLoginStatus(jscode) {
  return request({ url: `/login/checkLoginStatus/${jscode}` });
}



/**
 * 解密并保存用户信息
 */
export function saveUserInfo(data) {
  return request({url:`/login/saveUserInfo`, method:'POST', data});
}

/**
 * 绑定手机号码
 */
export function savePhone(data) {
  return request({
	  url:'/login/savePhone',
	  method:'POST',
	  data
  });
}
