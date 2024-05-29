<template>
  <el-dialog v-model="loginDialogVisible"
             width="30%"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :before-close="handleClose">
    <div class="login-body">
      <div class="login-container">
        <div class="head">
          <div class="name">
            <div class="title">ALLFULL</div>
          </div>
        </div>
        <el-form v-if="haveAccount"
                 label-position="top"
                 :rules="rules"
                 :model="loginFormData"
                 ref="loginForm"
                 class="login-form">
          <el-form-item label="账号"
                        prop="username">
            <el-input type="text"
                      v-model.trim="loginFormData.username"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码"
                        prop="password">
            <el-input type="password"
                      v-model.trim="loginFormData.password"
                      autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary"
                       link
                       style="margin-bottom:10px"
                       @click="registerAccount">还没有账户?</el-button>
            <el-button style="width: 100%"
                       type="primary"
                       @click="submitForm">立即登录</el-button>
            <el-checkbox v-model="checked">下次自动登录</el-checkbox>
          </el-form-item>
        </el-form>

        <el-form v-else
                 label-position="top"
                 :rules="registerRules"
                 :model="registerFormData"
                 ref="registerForm"
                 class="login-form">
          <el-form-item label="账号"
                        prop="username">
            <el-input type="text"
                      v-model.trim="registerFormData.username"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码"
                        prop="password">
            <el-input type="password"
                      v-model.trim="registerFormData.password"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码"
                        prop="confirmPassword">
            <el-input type="password"
                      v-model.trim="registerFormData.confirmPassword"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱"
                        prop="email">
            <el-input type="text"
                      v-model.trim="registerFormData.email"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别"
                        prop="gender">
            <el-select v-model="registerFormData.gender"
                       placeholder="请选择">
              <el-option label="女"
                         value="Female"></el-option>
              <el-option label="男"
                         value="Male"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生日"
                        prop="birthday">
            <el-date-picker v-model="registerFormData.birthday"
                            type="date"
                            placeholder="选择日期"
                            style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       link
                       style="margin-bottom:10px"
                       @click="loginAccount">切换到登录?</el-button>
            <el-button style="width: 100%"
                       type="primary"
                       @click="submitRegisterForm">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { localSet } from '../utils'
import { login, registerNormal, validateUsername } from '../apis/login'
import { ElMessage } from 'element-plus'
export default {
  name: 'LoginDialog',
  setup () {
    const loginForm = ref(null)
    const registerForm = ref(null)
    const haveAccount = ref(true)
    const store = useStore()
    const loginDialogVisible = computed(() => store.state.videoWeb.loginDialogVisible)

    const loginFormData = ref({
      username: '',
      password: ''
    })

    const registerFormData = ref({
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      gender: '',
      birthday: ''
    })

    const checked = ref(true)

    const rules = ref({
      username: [
        { required: true, message: '账户不能为空', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '密码不能为空', trigger: 'blur' }
      ]
    })
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== registerFormData.value.password) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    }
    //判断用户名是否重复
    const validateUsernameIs = (rule, value, callback) => {
      validateUsername({
        username: registerFormData.value.username
      }).then((res) => {
        if (res.code == 'success') {
          callback();
        } else {
          callback('用户名重复');
        }
      })
    }
    const registerRules = ref({
      username: [
        { required: true, message: '账户不能为空', trigger: 'blur' },
        { validator: validateUsernameIs, trigger: 'blur' },
        { min: 6, message: '不能少于6个字符', trigger: 'blur' },
      ],
      password: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        { min: 6, message: '不能少于6个字符', trigger: 'blur' },
      ],
      confirmPassword: [
        { required: true, message: '确认密码不能为空', trigger: 'blur' },
        { min: 6, message: '不能少于6个字符', trigger: 'blur' },
        { validator: validateConfirmPassword, trigger: 'blur' }
      ],
      email: [
        { required: true, message: '邮箱不能为空', trigger: 'blur' },
        { min: 6, message: '不能少于6个字符', trigger: 'blur' },
      ],
      gender: [
        { required: true, message: '性别不能为空', trigger: 'blur' },
      ],
      birthday: [
        { required: true, message: '生日不能为空', trigger: 'change' }
      ]
    })

    const submitForm = async () => {
      // 执行登录操作
      loginForm.value.validate((valid) => {
        if (valid) {
          login({
            username: loginFormData.value.username,
            password: loginFormData.value.password
          }).then(res => {
            if (res.code == "success") {
              localSet('Authorization', res.token)
              ElMessage({
                message: "登录成功",
                type: 'success',
                offset: 100
              })
              window.location.reload()
              setTimeout(() => {
                store.commit("toggleLoginDialog")
              }, 1000);
            } else {
              ElMessage({
                message: "登陆失败，请检查用户名密码",
                type: 'warning',
                offset: 100
              })
            }
          })
        } else {
          console.log('error login!!')
          return false;
        }
      })
    }

    const submitRegisterForm = async () => {
      // 执行注册账户操作
      registerForm.value.validate((valid) => {
        if (valid) {
          registerNormal({
            username: registerFormData.value.username,
            password: registerFormData.value.password,
            email: registerFormData.value.email,
            gender: registerFormData.value.gender,
            birthday: registerFormData.value.birthday
          }).then(res => {
            if (res.code == "success") {
              localSet('Authorization', res.token)
              ElMessage({
                message: "注册成功",
                type: 'success',
                offset: 100
              })
              window.location.reload()
              setTimeout(() => {
                store.commit("toggleLoginDialog")
              }, 1000);
            } else {
              ElMessage({
                message: "注册失败",
                type: 'warning',
                offset: 100
              })
            }
          })
        } else {
          console.log('error register!!')
          return false;
        }
      })
    }

    const resetForm = () => {
      loginForm.value.resetFields();
    }

    const handleClose = () => {
      store.commit('toggleLoginDialog')
    }
    const registerAccount = () => {
      haveAccount.value = false
    }
    const loginAccount = () => {
      haveAccount.value = true
    }
    return {
      loginFormData,
      registerFormData,
      rules,
      registerRules,
      haveAccount,
      loginForm,
      registerForm,
      checked,
      submitForm,
      submitRegisterForm,
      resetForm,
      loginDialogVisible,
      store,
      handleClose,
      registerAccount,
      loginAccount
    }
  },
}
</script>

<style scoped>
.login-body {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 5px;
  background-color: #fff;
}
.login-container {
  width: 420px;
  height: 600px; /* Adjusted height to accommodate registration form */
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0px 21px 41px 0px rgba(0, 0, 0, 0.2);
}
.head {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0 20px 0;
}
.head .title {
  font-size: 28px;
  color: #409eff;
  font-weight: bold;
}
.login-form {
  width: 70%;
  margin: 0 auto;
}
</style>
<style>
.el-form--label-top .el-form-item__label {
  padding: 0;
}
.login-form .el-form-item {
  margin-bottom: 12px;
}
</style>
