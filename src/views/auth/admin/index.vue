<template>
  <panel-head :route="route" />
  <!-- 列表 -->
  <el-table :data="tableData.list" width="100%">
    <el-table-column prop="id" label="ID" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="permission_id" label="所属组别">
      <template #default="scope">
        {{ permissionName(scope.row.permissions_id) }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号" />
    <el-table-column prop="active" label="状态">
      <template #default="scope">
        <el-tag :type="scope.row.active ? 'success' : 'danger'">{{
          scope.row.active ? '正常' : '禁用'
        }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="create_time" label="创建时间">
      <template #default="scope">
        <div class="flex-box">
          <el-icon style="margin-right: 10px"><Clock /></el-icon>
          {{ scope.row.create_time }}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" size="small" @click="open(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination
    v-model:current-page="paginationData.pageNum"
    :page-size="paginationData.pageSize"
    size="small"
    layout="total, prev, pager, next"
    :total="tableData.total"
    style="justify-content: flex-end; margin: 10px 10px 0 0"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
  <el-dialog v-model="dialogFormVisible" :before-close="beforeClose" title="添加权限" width="500">
    <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rules">
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" disabled />
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="菜单权限" prop="permissions_id">
        <el-select v-model="form.permissions_id" placeholder="请选择菜单权限" style="width: 240px">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { authAdmin, menuSelectList, updateUser } from '@/api';
import { ElMessage } from 'element-plus';
import { ref, reactive, onMounted } from 'vue';
import dayjs from 'dayjs';
import { useRoute } from 'vue-router';

const route = useRoute();

const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});
// 分页大小改变时的回调函数
const handleSizeChange = (val) => {
  paginationData.pageSize = val;
  getListData();
};
// 分页当前页改变时的回调函数
const handleCurrentChange = (val) => {
  paginationData.pageNum = val;
  getListData();
};
//请求列表数据
const getListData = () => {
  authAdmin(paginationData).then(({ data }) => {
    const { list, total } = data.data;
    list.forEach((item) => {
      item.create_time = dayjs(item.create_time).format('YYYY-MM-DD');
    });
    tableData.list = list;
    tableData.total = total;
  });
};
onMounted(() => {
  getListData();
  //获取菜单权限下拉列表
  menuSelectList().then(({ data }) => {
    options.value = data.data;
  });
});

// 列表数据
const tableData = reactive({
  list: [],
  total: 0,
});
// 菜单权限下拉列表数据
const options = ref([]);
//根据id获取菜单权限名称
const permissionName = (id) => {
  const option = options.value.find((item) => item.id === id);
  return option ? option.name : '超级管理员';
};

// 弹窗显示与隐藏状态
const dialogFormVisible = ref(false);
// 弹窗关闭时的回调函数
const beforeClose = () => {
  dialogFormVisible.value = false;
};
// 表单数据
const form = reactive({
  name: '',
  permissions_id: '',
});
// 表单实例
const formRef = ref();

// 确认提交表单
const confirm = async (formEl) => {
  if (!formEl) return;
  // 校验表单
  await formEl.validate((valid, fields) => {
    if (valid) {
      const { name, permissions_id } = form;
      updateUser({ name, permissions_id }).then(({ data }) => {
        if (data.code === 10000) {
          ElMessage.success(data.msg);
          dialogFormVisible.value = false;
          getListData();
        } else {
          ElMessage.error(data.msg);
        }
      });
    } else {
      ElMessage.error('请填写完整信息', fields);
    }
  });
};

// 打开弹窗
const open = (rowData) => {
  Object.assign(form, {
    mobile: rowData.mobile,
    name: rowData.name,
    permissions_id: rowData.permissions_id,
  });
  dialogFormVisible.value = true;
};

// 校验规则
const rules = reactive({
  name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  permissions_id: [{ required: true, message: '请选择菜单权限', trigger: 'change' }],
});
</script>

<style scoped lang="less">
.flex-box {
  display: flex;
  align-items: center;
}
</style>
