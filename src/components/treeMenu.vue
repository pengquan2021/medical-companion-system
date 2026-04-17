<template>
  <template v-for="(item, index) in menuData">
    <!-- 无子级 -->
    <el-menu-item
      v-if="!item.children || item.children.length == 0"
      :key="`${props.index}-${index}`"
      :index="`${props.index}-${item.meta.id}`"
      @click="handleClick(item, `${props.index}-${item.meta.id}`)"
    >
      <el-icon size="20"><component :is="item.meta.icon" /></el-icon>
      <span>{{ item.meta.name }}</span>
    </el-menu-item>
    <!-- 有子级 -->
    <el-sub-menu
      v-else
      :key="`${props.index}-${item.meta.id}`"
      :index="`${props.index}-${item.meta.id}`"
    >
      <template #title>
        <el-icon size="20"><component :is="item.meta.icon" /></el-icon>
        <span>{{ item.meta.name }}</span>
      </template>
      <TreeMenu :index="`${props.index}-${item.meta.id}`" :menu-data="item.children" />
    </el-sub-menu>
  </template>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const props = defineProps(['menuData', 'index']);
const router = useRouter();
const store = useStore();

const handleClick = (item, active) => {
  store.commit('addMenu', item.meta);
  store.commit('updatetMenuActive', active);
  router.push(item.meta.path);
};
</script>
<style lang="less" scoped></style>
