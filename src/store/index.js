// 引入 Vuex
import { createStore } from 'vuex';
//引入menu模块
import menu from './menu';
import createPersistedState from 'vuex-persistedstate';

//创建store
export default createStore({
  plugins: [
    new createPersistedState({
      key: 'pz_v3pz',
    }),
  ],
  modules: {
    menu,
  },
});
