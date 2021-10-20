import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
let getStr  =(arr)=>arr.sort((a,b)=>a-b).join('')
const store = new Vuex.Store({
  state: {
    clipData: "",
    needRefreshAll: false,
    needRefreshLeft: false,
    needRefreshCollect: false,
    hasDoneArr: [],
    toCompareArr: [],
    form: {},
    isAppShowRead:true
  },
  mutations: {
    setAppShowRead(state,val){
      state.isAppShowRead = val
  },
    setClipData(state, val) {
      state.clipData = val;
    },
    setNeedRefreshAll(state, val) {
      state.needRefreshAll = val;
    },
    setNeedRefreshLeft(state, val) {
      state.needRefreshLeft = val;
    },
    setNeedRefreshCollect(state, val) {
      state.needRefreshCollect = val;
    },
    setCompareArr(state,val){
      state.toCompareArr =val
    },
    setHasDoneArr(state,val){
      state.hasDoneArr =val
    }

  },
  actions: {},
  getters: {
    isChangeArr(state){
      return getStr(state.toCompareArr)!== getStr(state.hasDoneArr)
    },
    lastUrl(state) {
      if (state.hasDoneArr.length) {
        return state.hasDoneArr.slice(-1)[0];
      }
      return "";
    },
  },
});

export default store;
