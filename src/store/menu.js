//定义menu仓库
const localData = localStorage.getItem('pz_v3pz');

const state = localData
  ? localData.menu
  : {
      isCollapse: false, //菜单是否折叠
      selectMenu: [], //选中的菜单
      routerList: [], //路由列表
      menuActive: '1-1', //默认选中的菜单
    };

const mutations = {
  //改变菜单折叠状态
  collapseMenu(state) {
    state.isCollapse = !state.isCollapse;
  },
  //选中菜单
  addMenu(state, payload) {
    //判断是否存在
    const index = state.selectMenu.findIndex((item) => item.path === payload.path);
    if (index === -1) {
      state.selectMenu.push(payload);
    }
  },
  //关闭菜单
  closeMenu(state, payload) {
    const index = state.selectMenu.findIndex((item) => item.path === payload.path);
    state.selectMenu.splice(index, 1);
  },
  /*
  动态路由实现逻辑：
  登录成功 → 调用 menuPermissions() 接口获取当前用户有权限访问的菜单/路由树（后端返回的 data.data 是一个路由配置数组）。
  提交 mutation → store.commit('dynamicMenu', data.data)，将原始路由配置交给 Vuex 处理。
  动态挂载组件 → 在 dynamicMenu mutation 中，使用 Vite 的 import.meta.glob 批量导入组件文件，然后递归遍历路由树，根据约定路径为每个路由节点动态绑定对应的 .vue 组件。
  存储到 state → 处理完成的完整路由配置数组存入 state.routerList，后续可由路由守卫或主路由文件取出，通过 router.addRoute() 动态添加到 Vue Router 实例中。
  */
  //动态添加菜单
  dynamicMenu(state, payload) {
    //通过glob导入文件
    // 动态导入 views 目录下两层深度的所有 .vue 文件
    const modules = import.meta.glob('../views/**/**/*.vue');
    console.log(modules);
    function routerSet(router) {
      router.forEach((route) => {
        //判断是否有子路由,没有则拼接路由数据
        if (!route.children) {
          const url = `../views${route.meta.path}/index.vue`;
          //拿到获取的vue组件
          route.component = modules[url];
        } else {
          //有子菜单,递归调用函数
          routerSet(route.children);
        }
      });
    }
    routerSet(payload);
    //将路由列表赋值给state.routerList
    state.routerList = payload;
  },
  //设置选中的菜单
  updatetMenuActive(state, payload) {
    state.menuActive = payload;
  },
};

export default {
  state,
  mutations,
};
