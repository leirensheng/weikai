import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    clipData: "",
    needRefreshAll: false,
    needRefreshLeft: false,
    needRefreshCollect: false,
    isSubscribeOk: undefined,
    hasDoneArr: [],
    form: {},
  },
  mutations: {
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
    setSubscribe(state, val) {
      state.isSubscribeOk = val;
    },
  },
  actions: {},
  getters: {
    lastUrl(state) {
      if (state.hasDoneArr.length) {
        return state.hasDoneArr.slice(-1)[0];
      }
      return "";
    },
  },
});

export default store;
