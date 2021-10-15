const accountInfo = wx.getAccountInfoSync();
var env = ""
//当手机处于低版本的情况下,直接将地址写成开发版的
if (!accountInfo.miniProgram.envVersion) {
  env = 'release'
} else {
  env = accountInfo.miniProgram.envVersion
}
export default env;