<template>
  <el-row class="login-container" justify="center" :align="'middle'">
    <el-card style="max-width: 480px">
      <template #header>
        <div class="card-header">
          <img :src="imgUrl" alt="" />
        </div>
      </template>
      <div class="jump-link">
        <el-link type="primary" @click="handleChange">{{
          formType ? '返回登录' : '立即注册'
        }}</el-link>
      </div>
      <!-- 表单 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        style="max-width: 600px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-form-item prop="userName">
          <el-input v-model="loginForm.userName" placeholder="用户名" prefix-icon="UserFilled" />
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input
            v-model="loginForm.passWord"
            placeholder="密码"
            prefix-icon="Lock"
            type="password"
          />
        </el-form-item>
        <el-form-item v-if="formType" prop="validCode">
          <el-input v-model="loginForm.validCode" placeholder="验证码" prefix-icon="Lock">
            <template #append>
              <span @click="countDownChange">{{ countDown.validText }}</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="submitForm(loginFormRef)">{{
            formType ? '注册' : '登录'
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
</template>

<script setup>
import { ref, reactive, computed, toRaw } from 'vue';
import { getCode, userAuthentication, login, menuPermissions } from '@/api';
import { ElMessage } from 'element-plus';
const imgUrl = new URL('../../../public/login-head.png', import.meta.url).href;
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

//切换表单（0：登录，1：注册）
const formType = ref(0);
//登录表单数据
const loginForm = reactive({
  userName: '',
  passWord: '',
  validCode: '',
});
//验证码倒计时状态
let flag = false;
//验证码倒计时
const countDown = reactive({
  validText: '获取验证码',
  time: 60,
});
//路由列表
const routerList = computed(() => store.state.menu.routerList);

//点击切换登录/注册
const handleChange = () => {
  formType.value = formType.value ? 0 : 1;
};
//验证码倒计时
const countDownChange = () => {
  //如果倒计时正在进行中，直接返回
  if (flag) return;
  //判断手机号是否正确
  const phoneReg = /^1[3456789]\d{9}$/;
  if (!phoneReg.test(loginForm.userName)) {
    ElMessage.warning('请输入正确的手机号');
    return;
  }
  const timer = setInterval(() => {
    if (countDown.time <= 0) {
      countDown.time = 60;
      countDown.validText = '获取验证码';
      flag = false;
      clearInterval(timer);
    } else {
      countDown.time--;
      countDown.validText = `${countDown.time}秒后重新获取`;
    }
  }, 1000);
  flag = true;
  //发送验证码
  getCode({ tel: loginForm.userName }).then(({ data }) => {
    if (data.code === 10000) {
      ElMessage.success('验证码发送成功');
    } else {
      ElMessage.error(data.msg);
    }
  });
};
//表单提交
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      //注册页面
      if (formType.value) {
        userAuthentication(loginForm).then(({ data }) => {
          console.log(data);
          if (data.code === 10000) {
            ElMessage.success('注册成功请登录');
            formType.value = 0;
          }
        });
      } else {
        //登录页面
        login(loginForm).then(({ data }) => {
          if (data.code === 10000) {
            ElMessage.success('登录成功');
            //将token存储到localStorage
            localStorage.setItem('pz_token', data.data.token);
            //将用户信息存储到localStorage
            localStorage.setItem('pz_userInfo', JSON.stringify(data.data.userInfo));

            menuPermissions().then(({ data }) => {
              store.commit('dynamicMenu', data.data);
              //toRaw将路由列表转换为原始对象
              toRaw(routerList.value).forEach((item) => {
                router.addRoute('main', item);
              });
              //跳转到首页
              router.push('/');
            });
          }
        });
      }
    } else {
      ElMessage.error('请填写完整信息', fields);
    }
  });
};
//自定义校验---用户名校验
const validateUser = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入用户名'));
  } else {
    const phoneReg = /^1[3456789]\d{9}$/;
    phoneReg.test(value) ? callback() : callback(new Error('请输入正确的手机号'));
  }
};
//自定义校验---密码校验
const validatePwd = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else {
    const pwdReg = /^[a-zA-Z0-9]{4,16}$/;
    pwdReg.test(value) ? callback() : callback(new Error('密码格式错误'));
  }
};
//登录表单校验规则
const rules = reactive({
  userName: [{ validator: validateUser, trigger: 'blur' }],
  passWord: [{ validator: validatePwd, trigger: 'blur' }],
});
//登录表单校验
const loginFormRef = ref();
</script>

<style scoped lang="less">
:deep(.el-card__header) {
  padding: 0;
}
.login-container {
  height: 100%;
  .card-header {
    background-color: #899fe1;
    img {
      width: 430px;
    }
  }
  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
}
</style>
