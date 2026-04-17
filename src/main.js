import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import * as Icons from '@element-plus/icons-vue';
import store from './store'; //引入store
import PanelHead from './components/panelHeader.vue';

//刷新后的动态路由添加
const localData = localStorage.getItem('pz_v3pz');
if (localData) {
  store.commit('dynamicMenu', JSON.parse(localData).menu.routerList);
  store.state.menu.routerList.forEach((item) => {
    router.addRoute('main', item);
  });
}

//前置路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('pz_token');
  if (!token && to.path !== '/login') {
    next('/login');
  } else if (token && to.path === '/login') {
    next('/');
  } else {
    next();
  }
});

const app = createApp(App);
//全局注入PanelHead组件
app.component('PanelHead', PanelHead);
app.use(router);
app.use(ElementPlus);
app.use(store);
// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(Icons)) {
  app.component(key, component);
}
app.mount('#app');
