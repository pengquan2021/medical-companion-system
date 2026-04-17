<template>
  <panel-head :route="route" />
  <div class="btns">
    <el-button icon="Plus" type="primary" size="small" @click="open(null)">新增权限</el-button>
  </div>
  <!-- 列表 -->
  <el-table :data="tableData.list" width="100%">
    <el-table-column prop="id" label="ID" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="permissionName" label="菜单权限" width="500" />
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

  <!-- 弹窗 -->
  <el-dialog v-model="dialogFormVisible" :before-close="beforeClose" title="添加权限" width="500">
    <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rules">
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请填写权限名称" />
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <el-tree
          ref="treeRef"
          v-model="form.permissions"
          style="max-width: 600px"
          :data="permissionsData"
          node-key="id"
          show-checkbox
          :default-checked-keys="defaultKeys"
          :default-expanded-keys="[4, 5]"
        />
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
import { ref, reactive, onMounted, nextTick } from 'vue';
import { userGetMenu, userSetMenu, menuList } from '@/api';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';

const route = useRoute();
console.log(route);

// 表单数据
const form = reactive({
  name: '',
  permissions: '',
  id: '',
});
//树形菜单权限数据
const permissionsData = ref([]);
//默认选中的菜单
const defaultKeys = [4, 5];
//树形菜单实例
const treeRef = ref();
//表单实例
const formRef = ref();
//获取菜单权限数据
onMounted(() => {
  userGetMenu().then(({ data }) => {
    permissionsData.value = data.data;
  });
  //获取列表数据
  getListData();
});
//请求列表数据方法
const getListData = () => {
  menuList(paginationData).then(({ data }) => {
    if (data.code === 10000) {
      const { list, total } = data.data;
      tableData.list = list;
      tableData.total = total;
    } else {
      ElMessage.error(data.msg);
    }
  });
};

//分页数据
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
// 弹窗显示与隐藏状态
const dialogFormVisible = ref(false);
// 列表数据
const tableData = reactive({
  list: [],
  total: 0,
});
// 打开弹窗
const open = (rowData = {}) => {
  dialogFormVisible.value = true;
  nextTick(() => {
    //等待树形菜单实例加载完成
    if (rowData) {
      Object.assign(form, { id: rowData.id, name: rowData.name });
      treeRef.value.setCheckedKeys(rowData.permission); //设置选中的菜单
    }
  });
};

// 弹窗关闭前的回调函数
const beforeClose = () => {
  dialogFormVisible.value = false;
  //重置表单
  formRef.value.resetFields();
  //重置树形菜单
  treeRef.value.setCheckedKeys(defaultKeys);
};

//表单提交
const confirm = async (formEl) => {
  if (!formEl) return;
  //校验表单
  await formEl.validate((valid, fields) => {
    if (valid) {
      //提交表单
      const permissions = JSON.stringify(treeRef.value.getCheckedKeys());
      userSetMenu({
        name: form.name,
        permissions: permissions,
        id: form.id,
      }).then(({ data }) => {
        if (data.code === 10000) {
          ElMessage.success('添加成功');
          beforeClose();
          //刷新列表数据
          getListData();
        } else {
          ElMessage.error(data.msg);
        }
      });
    } else {
      ElMessage.error('提交失败，请填写完整信息', fields);
    }
  });
};
//表单校验规则
const rules = reactive({
  name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
  // permissions: [{ required: true, message: '请选择权限', trigger: 'change' }],
});
</script>

<style scoped lang="less">
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>
