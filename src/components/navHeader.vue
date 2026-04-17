<template>
  <div class="nav-header">
    <div class="header-left flex">
      <el-icon class="icon" size="20" @click="store.commit('collapseMenu')"><Fold /></el-icon>
      <ul class="flex">
        <li
          v-for="(item, index) in selectMenu"
          :key="item.path"
          class="flex tab"
          :class="{ selected: item.path === route.path }"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <router-link :to="item.path" class="text flex">{{ item.name }}</router-link>
          <el-icon class="close" @click="closeTab(item, index)"><Close /></el-icon>
        </li>
      </ul>
    </div>
    <div class="header-right flex">
      <el-dropdown @command="handleClick">
        <div class="el-dropdown-link flex">
          <el-avatar :src="userInfo.avatar" />
          <p class="user-name">{{ userInfo.name }}</p>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="cancel">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const store = useStore();
const route = useRoute(); //当前的路由对象
const router = useRouter();

const selectMenu = computed(() => store.state.menu.selectMenu);
const userInfo = JSON.parse(localStorage.getItem('pz_userInfo'));

//方法
//点击下拉菜单
const handleClick = (command) => {
  if (command === 'cancel') {
    localStorage.removeItem('pz_token');
    localStorage.removeItem('pz_userInfo');
    localStorage.removeItem('pz_v3pz');
    window.location.href = window.location.origin;
  }
};
//关闭标签页
const closeTab = (item, index) => {
  store.commit('closeMenu', item);
  //删除的不是当前页
  if (item.path !== route.path) {
    return;
  }
  //删除的是当前页
  //删除的是最后一项
  if (index === selectMenu.value.length) {
    //只有一个tag
    if (!selectMenu.value.length) {
      router.push('/');
    } else {
      //多个tag
      router.push({ path: selectMenu.value[index - 1].path });
    }
  } else {
    //删除的不是最后一项
    router.push({ path: selectMenu.value[index].path });
  }
};
</script>

<style lang="less" scoped>
//flex布局
.flex {
  display: flex;
  align-items: center;
  height: 100%;
}
a {
  height: 100%;
  color: #333;
  font-size: 15px;
  text-decoration: none;
}

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding-right: 25px;
  background-color: #fff;

  .header-left {
    height: 100%;
    .tab {
      padding: 0 10px;
      height: 100%;
      .text {
        margin: 0 5px;
      }
      .close {
        visibility: hidden;
      }
      &.selected {
        background-color: #f5f5f5;
        color: #0076c3;
        a {
          color: #0076c3;
        }
        .close {
          visibility: visible;
          cursor: pointer;
          color: #333;
        }
      }
    }
    .tab:hover {
      background-color: #f5f5f5;
      .close {
        visibility: visible;
        cursor: pointer;
        color: #333;
      }
    }
    .icon {
      width: 45px;
      height: 100%;
    }
    .icon:hover {
      background-color: #f5f5f5;
      cursor: pointer;
    }
  }

  .header-right {
    height: 100%;
    .el-dropdown-link {
      height: 100%;
      .user-name {
        margin-left: 10px;
      }
    }
  }
}
</style>
