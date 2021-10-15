import { checkLoginStatus } from "@/api/login.js";

function clearStorage(){
  uni.removeStorageSync('user')
  uni.removeStorageSync('openId')
  uni.removeStorageSync('jsCode')
}

export default async ()=>{
    let jsCode = uni.getStorageSync("jsCode")
    if(!jsCode){
      clearStorage()
      return false
    }
    try{
      await checkLoginStatus(jsCode)
      return true
    }catch(e){
      clearStorage()
      return false
    }
}