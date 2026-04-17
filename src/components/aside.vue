<template>
  <el-menu
    :style="{ width: isCollapse ? '64px' : '230px' }"
    active-text-color="#0076c3"
    background-color="#545c64"
    class="aside-container"
    text-color="#fff"
    :collapse="isCollapse"
    :default-active="active"
    @open="handleOpen"
    @close="handleClose"
  >
    <h1 class="logo" title="医陪E站">
      <img
        v-if="isCollapse"
        src="../assets/image/医陪E站 logo2.png"
        alt="医陪E站logo"
        :title="logoTitle"
      />
      <span v-else> 医陪E站 </span>
    </h1>
    <TreeMenu :index="1" :menu-data="menuData" />
  </el-menu>
</template>

<script setup>
import TreeMenu from './treeMenu.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore();
// const menuData = router.options.routes[0].children;
const menuData = computed(() => store.state.menu.routerList);
const isCollapse = computed(() => store.state.menu.isCollapse);
const active = computed(() => store.state.menu.menuActive);

const handleOpen = () => {};
const handleClose = () => {};
</script>

<style lang="less" scoped>
.aside-container {
  height: 100%;
  .logo {
    font-size: 20px;
    font-weight: 400;
    color: #fff;
    text-align: center;
    margin: 20px 0 5px;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
}
</style>
