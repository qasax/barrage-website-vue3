<template>
  <el-page-header title="个人简介"
                  icon=""
                  style="margin-bottom:30px" />
  <div v-if="userDetail&&userDetail.userId">
    <el-card>
      <el-descriptions class="margin-top"
                       title="简介"
                       :column="2">
        <template v-slot:extra>
          <el-button type="primary"
                     size="small"
                     @click="edit">编辑</el-button>
        </template>
        <el-descriptions-item>
          <template v-slot:label>
            <i class="el-icon-picture-outline"></i>
            头像
          </template>
          <img class="img"
               :src="getAvatarByUserId+userDetail.userId"
               alt="" />
        </el-descriptions-item>
        <el-descriptions-item>
          <template v-slot:label>
            <i class="el-icon-user"></i>
            账户名
          </template>
          {{ userDetail.userId }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template v-slot:label>
            <i class="el-icon-s-custom"></i>
            昵称
          </template>
          {{ userDetail.username }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template v-slot:label>
            <i class="el-icon-odometer"></i>
            生日
          </template>
          {{ timestampToDate(userDetail.birthday).slice(0,-8) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template v-slot:label>
            <i class="el-icon-male"></i>
            <i class="el-icon-female"></i>
            性别
          </template>
          <el-tag size="small">{{ userDetail.gender ==="Male"? "男":"女" }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template v-slot:label>
            <i class="el-icon-message"></i>
            邮箱Email
          </template>
          {{ userDetail.email }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template v-slot:label>
            <i class="el-icon-mobile-phone"></i>
            个性签名
          </template>
          {{ userDetail.signature }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
  <el-empty v-else
            :image-size="250"
            description="没有找到个人信息"></el-empty>
</template>


<script>
import { timestampToDate } from '../../utils/index'
import { getAvatarByUserId } from '@/request/baseUrl'
import { useStore } from 'vuex'
import { ref, onMounted } from 'vue'
import { getUserInfo } from '@/apis/user'
export default {
  name: "Info",
  setup () {
    const userDetail = ref({})
    const store = useStore()
    const edit = () => {
      store.commit('toggleInfoEditDialog')
    }
    onMounted(() => {
      getUserInfo().then((res) => {
        userDetail.value = res.data
      })
    })
    return {
      timestampToDate,
      userDetail,
      getAvatarByUserId,
      edit
    }
  }
};
</script>

<style scoped>
.img {
  width: 80px;
  height: 80px;
}
</style>