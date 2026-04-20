<template>
  <panel-head :route="route" />

  <!-- 搜索表单 -->
  <div class="form">
    <el-form :model="searchForm" inline>
      <el-form-item prop="out_trade_no">
        <el-input v-model="searchForm.out_trade_no" placeholder="请输入订单号" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 列表 -->
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column label="订单号" prop="out_trade_no" width="150" fixed="left" />
    <el-table-column label="就诊医院" prop="hospital_name" />
    <el-table-column label="陪诊服务" prop="service_name" />
    <el-table-column label="陪护师头像">
      <template #default="scope">
        <el-image :src="scope.row.companion.avatar" fit="fill" style="height: 50px; width: 50px" />
      </template>
    </el-table-column>
    <el-table-column label="陪护师手机号" prop="companion.mobile" width="120" />
    <el-table-column label="总价" prop="price" />
    <el-table-column label="已付" prop="paidPrice" />
    <el-table-column label="下单时间" width="120">
      <template #default="scope">
        {{ dayjs(scope.row.order_start_time).format('YYYY-MM-DD') }}</template
      >
    </el-table-column>
    <el-table-column label="订单状态">
      <template #default="scope">
        <el-tag :type="statusMap(scope.row.trade_state)">
          {{ scope.row.trade_state }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="接单状态" prop="service_state" />
    <el-table-column label="联系人手机号" prop="tel" width="120" />
    <el-table-column label="操作" width="100" fixed="right">
      <template #default="scope">
        <!-- 确认删除弹窗 -->
        <el-popconfirm
          v-if="scope.row.trade_state === '待服务'"
          confirm-button-text="确定"
          cancel-button-text="取消"
          icon="InfoFilled"
          icon-color="#626AEF"
          title="是否确认完成?"
          width="180"
          style="margin-left: 10px"
          @confirm="confirmEvent(scope.row.out_trade_no)"
        >
          <template #reference>
            <el-button type="primary" size="small">服务完成</el-button>
          </template>
        </el-popconfirm>
        <el-button v-else type="primary" size="small" disabled>暂无服务</el-button>
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
</template>

<script setup>
import { adminOrder, updateOrder } from '@/api';
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';
const route = useRoute();

//列表数据
const tableData = reactive({
  list: [],
  total: 0,
});
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

const getListData = (params = {}) => {
  adminOrder({ ...paginationData, ...params }).then(({ data }) => {
    if (data.code === 10000) {
      const { list, total } = data.data;
      tableData.list = list;
      tableData.total = total;
    }
  });
};

onMounted(() => {
  getListData();
});
// 搜索表单数据
const searchForm = reactive({
  out_trade_no: '',
});
// 搜索表单提交
const onSubmit = () => {
  getListData(searchForm);
};

const statusMap = (key) => {
  const obj = {
    已取消: 'info',
    待支付: 'warning',
    已完成: 'success',
  };
  return obj[key] || 'primary';
};

const confirmEvent = (id) => {
  updateOrder({ id: id }).then(({ data }) => {
    if (data.code === 10000) {
      ElMessage.success('服务完成');
      getListData();
    } else {
      ElMessage.error(data.message);
    }
  });
};
</script>

<style scoped lang="less">
.form {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>
