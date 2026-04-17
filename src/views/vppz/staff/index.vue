<template>
  <panel-head :route="route" />
  <div class="btns">
    <el-button icon="Plus" type="primary" size="small" @click="open(null)">新增权限</el-button>
    <!-- 确认删除弹窗 -->
    <el-popconfirm
      confirm-button-text="确定"
      cancel-button-text="取消"
      icon="InfoFilled"
      icon-color="#626AEF"
      title="确认删除选中项吗？"
      width="180"
      style="margin-left: 10px"
      @confirm="confirmEvent"
    >
      <template #reference>
        <el-button type="danger" size="small" icon="Delete">删除</el-button>
      </template>
    </el-popconfirm>
  </div>

  <!-- table列表 -->
  <el-table :data="tableData.list" style="width: 100%" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="avatar" label="头像">
      <template #default="{ row }">
        <el-image :src="row.avatar" fit="fill" style="height: 50px; width: 50px" />
      </template>
    </el-table-column>
    <el-table-column prop="sex" label="性别">
      <template #default="{ row }">
        {{ row.sex === '1' ? '男' : '女' }}
      </template>
    </el-table-column>
    <el-table-column prop="age" label="年龄" />
    <el-table-column prop="mobile" label="手机号" />
    <el-table-column prop="active" label="状态">
      <template #default="{ row }">
        <el-tag :type="row.active ? 'success' : 'danger'">{{
          row.active ? '生效' : '失效'
        }}</el-tag>
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
  <!-- 弹窗 -->
  <el-dialog v-model="dialogFormVisible" :before-close="beforeClose" title="陪护师添加" width="500">
    <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rules">
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id" />
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" placeholder="请填写昵称" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-button v-if="!form.avatar" type="primary" size="small" @click="dialogImgVisible = true"
          >上传头像</el-button
        >
        <el-image v-else :src="form.avatar" fit="fill" style="height: 100px; width: 100px" />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio value="男">男</el-radio>
          <el-radio value="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="form.age" :min="18" :max="50" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请填写手机号" />
      </el-form-item>
      <el-form-item label="状态" prop="active">
        <el-radio-group v-model="form.active">
          <el-radio :value="1">生效</el-radio>
          <el-radio :value="0">失效</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 头像上传弹窗 -->
  <el-dialog v-model="dialogImgVisible" :before-close="beforeClose" title="选择图片" width="680">
    <div class="image-list">
      <div
        v-for="(item, index) in fileList"
        :key="item.name"
        class="img-box"
        @click="selectIndex = index"
      >
        <div v-if="selectIndex === index" class="select">
          <el-icon color="#409eff;">
            <Check />
          </el-icon>
        </div>
        <el-image :src="item.url" fit="fill" style="height: 148px; width: 148px" />
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogImgVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmImage()">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { photoList, companion, companionList, deleteCompanion } from '@/api/index.js';
import { ElMessage } from 'element-plus';
import { ref, reactive, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();

//列表数据
const tableData = reactive({ list: [], total: 0 });
//选中行数据
const selectedTableData = ref([]);
//选中的行数据的回调
const handleSelectionChange = (val) => {
  selectedTableData.value = val.map((item) => ({ id: item.id }));
};
// 确认删除选中项
const confirmEvent = () => {
  if (!selectedTableData.value.length) {
    ElMessage.warning('请选择要删除的项');
    return;
  }
  // 确认删除选中项
  deleteCompanion({ id: selectedTableData.value }).then(({ data }) => {
    if (data.code === 10000) {
      ElMessage.success('删除成功');
      getListData();
    } else {
      ElMessage.error(data.msg);
    }
  });
};

const getListData = () => {
  companionList(paginationData).then(({ data }) => {
    if (data.code === 10000) {
      const { list, total } = data.data;
      tableData.list = list;
      tableData.total = total;
    }
  });
};

onMounted(() => {
  // 初始化时获取头像列表
  photoList().then(({ data }) => {
    if (data.code === 10000) {
      fileList.value = data.data;
    } else {
      console.log(data.message);
    }
    // 初始化时获取陪护师列表
    getListData();
  });
});

// 弹窗显示与隐藏状态
const dialogFormVisible = ref(false);
// 头像上传弹窗显示与隐藏状态
const dialogImgVisible = ref(false);
// 弹窗关闭时的回调函数
const beforeClose = () => {
  dialogFormVisible.value = false;
  formRef.value.resetFields();
};
//头像列表数据
const fileList = ref([]);
// 选中的头像
const selectIndex = ref(0);
// 确认选择头像
const confirmImage = () => {
  form.avatar = fileList.value[selectIndex.value].url;
  dialogImgVisible.value = false;
};
// 打开弹窗按钮或编辑按钮
const open = (rowData = {}) => {
  dialogFormVisible.value = true;
  nextTick(() => {
    //等待弹窗实例加载完成
    if (rowData) {
      Object.assign(form, rowData);
    }
  });
};

//form表单实例
const formRef = ref();
// 表单数据
const form = reactive({
  id: '',
  mobile: '',
  active: 1,
  age: 18,
  avatar: '',
  name: '',
  sex: '',
});

//表单校验规则
const rules = reactive({
  name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  avatar: [{ required: true, message: '请选择头像', trigger: 'blur' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
});
// 提交表单
const confirm = async (formEl) => {
  if (!formEl) return;
  //校验表单
  await formEl.validate((valid, fields) => {
    if (valid) {
      companion(form).then(({ data }) => {
        if (data.code === 10000) {
          ElMessage.success('添加成功');
          dialogFormVisible.value = false;
          beforeClose();
          getListData();
        } else {
          ElMessage.error(data.message);
        }
      });
    } else {
      ElMessage.error('提交失败，请填写完整信息', fields);
    }
  });
};
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
</script>

<style scoped lang="less">
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
