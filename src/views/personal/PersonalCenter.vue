<template>
  <person-dialog />
  <div v-if="userDetail">
    <div class="PersonTop">
      <div class="PersonTop_img">
        <img :src="getAvatarByUserId+userDetail.userId" />
      </div>
      <div class="PersonTop_text">
        <div class="user_text">
          <div class="user_name">
            <span> {{ userDetail.username }} </span>
          </div>
          <div class="user_qianming">
            <span> {{ userDetail.signature }}</span>
          </div>
          <div class="user_anniu">
            <el-button class="el-icon-edit"
                       type="primary"
                       plain
                       @click="edit">编辑</el-button>
          </div>
        </div>
        <div class="user_num">
          <div style="cursor: pointer"
               @click="router.push('/personal/myfan/fan')">
            <div class="num_number">{{ userDetail.fans }}</div>
            <span class="num_text">粉丝</span>
          </div>
          <div style="cursor: pointer"
               @click="router.push('/personal/myfollow/follow')">
            <div class="num_number">{{ userDetail.followCounts }}</div>
            <span class="num_text">关注</span>
          </div>
        </div>
      </div>
    </div>

    <div class="person_body">
      <div class="person_body_left">
        <el-card class="box-card"
                 :body-style="{ padding: '0px' }">
          <template #header>
            <div class="clearfix">
              <span class="person_body_list"
                    style="border-bottom: none">个人中心</span>
            </div>
          </template>
          <el-menu router
                   mode="vertical"
                   class="el-menu-vertical-demo">
            <el-menu-item index="/personal/myInfo">
              个人简介
            </el-menu-item>
            <el-menu-item index="/personal/myLike">
              我的点赞
            </el-menu-item>
            <el-menu-item index="/personal/mycollect">
              我的收藏
            </el-menu-item>
            <el-menu-item index="/personal/myfan/fan">
              我的粉丝
            </el-menu-item>
            <el-menu-item index="/personal/myfollow/follow">
              我的关注
            </el-menu-item>
            <el-menu-item index="/personal/myVideoUpload">
              发布视频
            </el-menu-item>
            <el-menu-item index="/personal/myUploadedVideo">
              我发布的视频
            </el-menu-item>
            <el-menu-item index="/personal/myLatelyMsg">
              关注动态
            </el-menu-item>
            <el-menu-item index="/personal/manageMessage">
              我的消息
            </el-menu-item>
            <el-menu-item index="/personal/myComment">
              我的评论
            </el-menu-item>
            <el-menu-item index="/personal/myReply">
              我的回复
            </el-menu-item>
          </el-menu>
        </el-card>
      </div>
      <div class="person_body_right">
        <router-view></router-view>
      </div>
    </div>
  </div>

</template>
<script>
import PersonDialog from '@/components/PersonDialog.vue';
import { getUserInfo } from '@/apis/user'
import { onMounted, ref } from 'vue';
import { getAvatarByUserId } from '@/request/baseUrl'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
  components: { PersonDialog },
  name: "Personal",
  setup () {
    const userDetail = ref()
    const router = useRouter()
    const store = useStore()
    onMounted(() => {
      getUserInfo().then((res) => {
        userDetail.value = res.data
      })
    })
    const edit = () => {
      store.commit('toggleInfoEditDialog')
    }
    return {
      userDetail,
      getAvatarByUserId,
      router,
      edit
    }
  }
}
</script>

<style scoped>
.me-video-player {
  background-color: transparent;
  width: 100%;
  height: 100%;
  object-fit: fill;
  display: block;
  position: fixed;
  left: 0;
  z-index: 0;
  top: 0;
}
.PersonTop {
  width: 1000px;
  height: 140px;
  padding-top: 20px;
  background-color: white;
  margin-top: 30px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.PersonTop_img {
  width: 150px;
  height: 120px;
  background-color: #8c939d;
  margin-right: 24px;
  margin-left: 20px;
  overflow: hidden;
  border-radius: 20px;
}

.PersonTop_img img {
  width: 100%;
  height: 100%;
  border-radius: 20px;
}

.PersonTop_text {
  height: 120px;
  width: 880px;
  display: flex;
}

.user_text {
  width: 60%;
  height: 100%;
  line-height: 30px;
}

.user_name {
  font-weight: bold;
}
.user-v {
  margin-bottom: -5px;
}
.user-v-img {
  width: 15px;
  height: 15px;
}
.user-v-font {
  font-size: 15px;
  color: #00c3ff;
}
.user_qianming {
  font-size: 14px;
  color: #999;
}

.user_num {
  width: 40%;
  height: 100%;
  display: flex;
  align-items: center;
}

.user_num > div {
  text-align: center;
  border-right: 1px dotted #999;
  box-sizing: border-box;
  width: 80px;
  height: 40px;
  line-height: 20px;
}

.num_text {
  color: #999;
}

.num_number {
  font-size: 20px;
  color: #333;
}
.el-menu-item > span {
  font-size: 16px;
  color: #999;
}

/*下面部分样式*/
.person_body {
  width: 1000px;
  margin-top: 210px;
  display: flex;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 5px;
}

.person_body_left {
  width: 27%;
  height: 800px;
  border-radius: 5px;
  margin-right: 3%;
  text-align: center;
}

.person_body_list {
  width: 100%;
  height: 50px;
  margin-top: 25px;
  font-size: 22px;
  border-bottom: 1px solid #f0f0f0;
  background-image: -webkit-linear-gradient(
    left,
    rgb(42, 134, 141),
    #e9e625dc 20%,
    #3498db 40%,
    #e74c3c 60%,
    #09ff009a 80%,
    rgba(82, 196, 204, 0.281) 100%
  );
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-background-size: 200% 100%;
  -webkit-animation: masked-animation 4s linear infinite;
}

.el-menu-item {
  margin-top: 22px;
}

.person_body_right {
  width: 70%;
  /* height: 500px; */
  border-radius: 5px;
  background-color: white;
}

.box-card {
  height: 940px;
}

/*ui样式*/
.el-button {
  width: 84px;
}
</style>
