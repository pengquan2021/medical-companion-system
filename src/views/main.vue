<template>
  <div class="common-layout">
    <el-container>
      <Aside />
      <el-container>
        <el-header>
          <NavHeader />
        </el-header>
        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import Aside from '../components/aside.vue';
import NavHeader from '../components/navHeader.vue';
</script>

<style lang="less" scoped>
.common-layout {
  height: 100%;
  .el-container {
    height: 100%;
  }
}
</style>
