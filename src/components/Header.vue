<template>
  <el-menu background-color="#FFFFFF"
           text-color="#303133"
           :router="true"
           mode="horizontal"
           :ellipsis="true"
           style="margin:0;padding:0">
    <el-menu-item index="/"
                  style="font-size:larger; color:#409EFF;">ALLFULL</el-menu-item>
    <el-menu-item index="/VideoListByType/动画">动画</el-menu-item>
    <el-menu-item index="/VideoListByType/生活">生活</el-menu-item>
    <el-menu-item index="/VideoListByType/歌曲">歌曲</el-menu-item>
    <el-menu-item index="/VideoListByType/游戏">游戏</el-menu-item>
    <el-input v-model="input"
              placeholder="Search"
              @keyup.enter="searchChange"
              :suffix-icon="Search"
              style="width:400px;height:40px;margin:10px" />
    <div v-if="isLogining">
      <div @mouseenter="showCard = true"
           @mouseleave="showCard = false">
        <el-avatar class="avatar"
                   :src="avatarSrc"
                   @click.stop="router.push('/personal')"
                   style="margin-top:10px">
        </el-avatar>
        <el-card v-show="showCard"
                 shadow="hover"
                 class="card"
                 style="max-width: 480px;">
          <!-- 卡片内容 -->
          <template #header>
            <div class="card-header">
              <el-text>用户名: {{ userDetail.username }}</el-text>
            </div>
          </template>

          <div class="card-content">
            <!-- 用户名称 -->
            <div class="user-name">
              <el-text>LV{{ userDetail.userLevel }}</el-text>
            </div>
            <!-- 关注和粉丝 -->
            <div class="user-stats">
              <el-text>关注: {{ userDetail.followCounts }} </el-text>
              <el-text style="margin-left:10px">粉丝: {{ userDetail.fans}}</el-text>
            </div>
            <!-- 菜单 -->
            <div class="user-menu">
              <el-menu>
                <el-menu-item index="1"
                              @click="router.push('/personal')">个人主页</el-menu-item>
                <el-menu-item index="2"
                              @click="router.push('/personal/myLatelyMsg')">动态<el-text type="danger"
                           v-if="messages!='noMsg'">未读:{{messages}}</el-text></el-menu-item>
                <el-menu-item index="3"
                              @click="router.push('/personal/mycollect')">收藏</el-menu-item>
              </el-menu>
            </div>
          </div>

          <template #footer>
            <el-menu>
              <el-menu-item index="1"
                            @click="loginOut">退出登录</el-menu-item>
            </el-menu>
          </template>
        </el-card>
      </div>
    </div>
    <div v-else>
      <div>
        <el-avatar class="avatar"
                   :src="require('@/assets/login.png')"
                   @click.stop="openLoginDialog"
                   style="margin-top:10px">
        </el-avatar>
      </div>
    </div>
    <el-sub-menu index="/personal/manageMessage"
                 v-if="isLogining">
      <template #title>消息</template>
      <el-menu-item index="/personal/manageMessage/myReplyToMeMsg">回复我的消息<el-text type="danger"
                 v-if="replyToMeMsg!='0'">未读:{{replyToMeMsg}}</el-text></el-menu-item>
      <el-menu-item index="/personal/manageMessage/mySystemMsg">系统消息<el-text type="danger"
                 v-if="sysMsg!='0'">未读:{{sysMsg}}</el-text></el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/managePage"
                  v-if="role=='admin'">后台管理</el-menu-item>
  </el-menu>
</template>
<script>
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { localRemove, localGet } from '../utils'
import { ref, watch } from 'vue'
import { getAvatar } from '../apis/user'
import { onMounted } from 'vue'
import { getUserInfo, getUnReadMsg, getUnreadSystemMsgCount, getReplyToMeMsgCount } from '@/apis/user'
import { logout } from '@/apis/login'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  emits: ['mouseleave', 'mouseenter'],
  setup () {
    const store = useStore()
    const router = useRouter()
    const input = ref('')
    const isLogining = ref(store.state.videoWeb.isLogining)
    const role = ref(store.state.videoWeb.role)
    const user = ref({})
    const showCard = ref(false)
    const userDetail = ref({})
    const avatarSrc = ref(null)
    const messages = ref('noMsg')
    const replyToMeMsg = ref('noMsg')
    const sysMsg = ref('noMsg')
    const openLoginDialog = () => {
      store.commit('toggleLoginDialog')
    }

    onMounted(() => {
      getAvatar().then(response => {
        const blob = new Blob([response], { type: 'image/jpg' })
        avatarSrc.value = URL.createObjectURL(blob)
        store.commit('toggleAvatarSrc', avatarSrc.value)
      }).catch(error => {
        console.error('获取头像失败：', error)
      })
      getUserInfo().then((res) => {
        //获取token是否失效，如果失效，跳转到主页并删除本地token，需要用户登录
        if (res.code == -1) {//说明token失效
          if (localGet('Authorization') != '') {//如果token未被删除，说明用户是在token失效后第一次访问，需要移除token
            localRemove('Authorization')
            router.push('/')
          } else {//没有token，说明是游客访问
          }

        } else {
          store.commit('toggleIsLogining')
          store.commit('toggleRole', res.data.role)
          userDetail.value = res.data
        }
      })
      getUnReadMsg().then((res) => {
        if (res.data === 'noMsg') {
          messages.value = res.data
        } else {
          messages.value = res.data
        }
      })
      getUnreadSystemMsgCount().then((res) => {
        if (res.data === 'noMsg') {
          sysMsg.value = res.data
        } else {
          sysMsg.value = res.data
        }
      })
      getReplyToMeMsgCount().then((res) => {
        if (res.data === 'noMsg') {
          replyToMeMsg.value = res.data
        } else {
          replyToMeMsg.value = res.data
        }
      })
    })

    const loginOut = () => {
      showCard.value = false
      ElMessageBox.confirm(
        '即将退出登录，是否确认?',
        'Warning',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        logout().then(() => {
          ElMessage({
            type: 'success',
            message: '退出成功',
            offset: 100
          })
          localRemove('Authorization')
          router.push('/')
          setTimeout(() => {
            window.location.reload()
          }, 100);

        })
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '取消操作',
          offset: 100
        })
      })
    }



    const searchChange = () => {
      router.push('/VideoSearchPage/' + input.value)
    }

    watch(() => store.state.videoWeb.isLogining, (newVal) => {
      isLogining.value = newVal
    })

    watch(() => store.state.videoWeb.role, (newVal) => {
      role.value = newVal
    })
    watch(isLogining, (newVal) => {
      if (!newVal) {
        showCard.value = false
      }
    })

    return {
      Search,
      router,
      input,
      store,
      isLogining,
      user,
      loginOut,
      openLoginDialog,
      searchChange,
      showCard,
      avatarSrc,
      userDetail,
      router,
      messages,
      role,
      sysMsg,
      replyToMeMsg
    }
  }
}

</script>
<style scoped>
.avatar {
  margin: 15px 11px;
  cursor: pointer;
}

.card {
  position: absolute;
  top: 100%;
  left: 58%;
  transform: translateX(-50%);
  z-index: 999;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.card-content {
  text-align: center;
}

.user-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  font-size: 16px;
  margin-bottom: 10px;
}

.user-menu {
  margin-top: 20px;
}

.el-menu-item {
  cursor: pointer;
  margin-bottom: 10px;
}

.el-menu-item:hover {
  background-color: #f5f5f5;
}
</style>