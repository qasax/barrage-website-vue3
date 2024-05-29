<template>
  <div>
    <div v-if="userDetail">
      <el-dialog title="修改个人信息"
                 v-model="infoEditDialogVisible"
                 width="60%"
                 :before-close="handleClose">
        <el-form :model="form"
                 :rules="rules"
                 ref="form"
                 label-width="150px">
          <div class="updateinfo">
            <div class="left">
              <el-form-item label="头像"
                            prop="avatar">
                <img style="width:150px;height:110px"
                     :src="getAvatarByUserId + userDetail.userId"
                     :key="imgReload">
                <el-upload class="avatar-uploader"
                           :headers="headers"
                           :action="uploadAvatar"
                           :show-file-list="false"
                           :on-success="handleAvatarSuccess"
                           :before-upload="beforeAvatarUpload">
                  <el-button type="primary">上传新头像</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="昵称"
                            prop="nickname">
                <el-input v-model="userDetail.username"></el-input>
              </el-form-item>
              <el-form-item label="性别"
                            prop="sex">
                <el-switch v-model="userDetail.gender"
                           active-color="#13ce66"
                           inactive-color="#ff4949"
                           active-text="男"
                           inactive-text="女"
                           active-value="Male"
                           inactive-value="Female">
                </el-switch>
              </el-form-item>
              <el-form-item label="邮箱"
                            prop="email">
                <el-input v-model="userDetail.email"></el-input>
              </el-form-item>
            </div>
            <div class="right">
              <el-form-item label="用户编号"
                            prop="id">
                <el-input v-model="userDetail.userId"
                          disabled></el-input>
              </el-form-item>
              <el-form-item label="生日"
                            prop="id">
                <el-date-picker v-model="userDetail.birthday"
                                type="date"
                                placeholder="Pick a date"
                                style="width: 100%" />
              </el-form-item>
              <el-form-item label="个性签名"
                            prop="design">
                <el-input v-model="userDetail.signature"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <template v-slot:footer>
          <span class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary"
                       @click="submit">提 交</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { watch, computed, ref } from 'vue'
import { getAvatarByUserId } from '@/request/baseUrl'
import { getUserInfo, updateUserInfo } from '@/apis/user'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { localGet } from '../utils'
import { uploadAvatar } from '@/request/baseUrl'
export default {
  name: "PersonalDia",
  setup () {
    const store = useStore()
    const router = useRouter()
    const infoEditDialogVisible = computed(() => store.state.videoWeb.infoEditDialogVisible)
    const userDetail = ref()
    const headers = ref({
      'Authorization': localGet('Authorization'),
    })
    const imgReload = ref(1)
    const form = ref({
      avatar: "",
      password: "",
      nickname: "",
      age: Number,
      email: "",
      mobilePhoneNumber: "",
      sex: Number,
      id: Number,
      account: "",
      area: "",
      hobby: "",
      work: "",
      design: "",
    })
    const rules = ref({
      nickname: [
        { required: true, message: "昵称不能为空", trigger: "blur" },
      ],
      password: [
        { required: true, message: "账号密码不能为空", trigger: "blur" },
      ],
    })

    watch(infoEditDialogVisible, (val) => {
      if (val === true) {
        getUserInfo().then((res) => {
          console.log('查询用户信息')
          userDetail.value = res.data
        })
      }
    })

    const handleAvatarSuccess = (response, file) => {
      if (response.code === 'success') {
        ElMessage({
          message: '头像上传成功！',
          type: 'success',
          offset: 100
        })
        imgReload.value++
      } else {
        ElMessage({
          message: '头像上传失败，请重试！',
          type: 'error',
          offset: 100
        })
      }
    }

    const beforeAvatarUpload = (file) => {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt1G = file.size / 1024 / 1024 < 100
      console.log("上传前")
      if (!isJPG && !isPNG) {
        ElMessage({
          message: "上传头像图片只能是 JPG 或 PNG 格式!",
          type: 'error',
          offset: 100
        })

      }
      if (!isLt1G) {
        ElMessage({

        })
        ElMessage({
          message: "上传头像图片大小不能超过 100MB!",
          type: 'error',
          offset: 100
        })
      }
      return (isJPG || isPNG) && isLt1G
    }

    const submit = () => {
      updateUserInfo({
        email: userDetail.value.email,
        gender: userDetail.value.gender,
        birthday: userDetail.value.birthday,
        signature: userDetail.value.signature,
        avatar: userDetail.value.avatar // Ensure avatar is updated
      }).then((res) => {
        if (res.code === 'success') {
          store.commit('toggleInfoEditDialog')
          ElMessage({
            message: '提交修改成功！',
            type: 'success',
            offset: 100
          })
          router.go(0)
        } else {
          ElMessage({
            message: '修改失败，检查网络是否通常！',
            type: 'error',
            offset: 100
          })
        }
      })
    }

    const handleClose = () => {
      store.commit('toggleInfoEditDialog')
    }

    return {
      infoEditDialogVisible,
      form,
      rules,
      submit,
      handleClose,
      userDetail,
      getAvatarByUserId,
      handleAvatarSuccess,
      beforeAvatarUpload,
      headers,
      uploadAvatar,
      imgReload
    }
  },
}
</script>

<style scoped>
.updateinfo {
  height: 350px;
  overflow: auto;
}
.left {
  float: left;
}
.right {
  overflow: hidden;
}
.avatar-uploader .el-upload {
  display: inline-block;
}
.avatar-uploader .el-upload input[type="file"] {
  display: none;
}
</style>
