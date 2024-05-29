<template>
  <div v-if="videoDetail.videoId">
    <div style="margin-top:50px">
      <el-row>
        <el-col :span="24">
          <h1>{{ videoDetail.title }}</h1>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top:10px">
      <el-row type="flex">
        <el-col :span="2"
                class="icon-col">
          <el-icon>
            <ChatLineSquare />
          </el-icon>
          <span class="icon-text">弹幕:{{ videoDetail.barrages }}</span>
        </el-col>
        <el-col :span="2"
                class="icon-col">
          <el-icon size="24"
                   class="icon">
            <View />
          </el-icon>
          <span class="icon-text">观看:{{ videoDetail.views }}</span>
        </el-col>
        <el-col :span="2"
                class="icon-col">
          <el-icon size="24"
                   class="icon">
            <ChatLineRound />
          </el-icon>
          <span class="icon-text">评论:{{ videoDetail.comments }}</span>
        </el-col>
        <el-col :span="6"
                class="icon-col">
          <el-icon size="24"
                   class="icon">
            <Upload />
          </el-icon>
          <span class="icon-text">发布时间:{{ timestampToDate(videoDetail.uploadDate) }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="main-content">
      <d-player ref="dplayer"
                :dplayerData="videoDetail" />
      <el-card class="user-info-card">
        <template #header>
          <div class="user-info">
            <router-link :to="'/others/'+ videoDetail.userDetail.userId"
                         style="text-decoration: none;"
                         target="_blank">
              <el-avatar :src="getAvatarByUserId + videoDetail.userDetail.userId"
                         class="avatar"></el-avatar>
            </router-link>
            <div class="user-details">
              <div class="username">{{ videoDetail.userDetail.username }}</div>
              <el-button :type="isFollow === 'true' ? 'success' : 'primary'"
                         @click="toggleFollow">
                {{ isFollow === 'true' ? '已关注' : '关注' }}
              </el-button>
            </div>
          </div>
        </template>
        <el-text type="primary">粉丝数:</el-text>
        <el-text>{{videoDetail.userDetail.fans}}</el-text>
        <template #footer>
          <el-text type="primary">个人签名：</el-text>
          <el-text>{{videoDetail.userDetail.signature}}</el-text>
        </template>
      </el-card>
    </div>
    <div style="margin-top:30px">
      <el-row>
        <el-col :span="4"
                class="icon-col">
          <el-icon size="36"
                   class="icon"
                   :color="likecolor"
                   @click="clickLike">
            <Plus />
          </el-icon>
          <span class="icon-text">点赞:{{ videoDetail.likes }}</span>
        </el-col>
        <el-col :span="4"
                class="icon-col">
          <el-icon size="36"
                   class="icon"
                   :color="collectColor"
                   @click="clickCollect">
            <Star />
          </el-icon>
          <span class="icon-text">收藏:{{ videoDetail.favorites }}</span>
        </el-col>
        <el-col :span="4"
                class="icon-col">
          <el-icon size="36"
                   class="icon">
            <Share />
          </el-icon>
          <span class="icon-text">分享:{{ videoDetail.shares }}</span>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="收藏"
               v-model="collectDialogVisible"
               width="30%"
               :close-on-click-modal="false">
      <el-card>
        <template #header>
          <div class="clearfix">
            <span>选择收藏夹：</span>
            <el-button type="text"
                       @click="createNewFolderDialogVisible = true">新建收藏夹</el-button>
          </div>
        </template>
        <div>
          <el-select v-model="selectedFolder"
                     placeholder="请选择收藏夹">
            <el-option v-for="c in collectionData"
                       :key="c"
                       :label="c"
                       :value="c"></el-option>
          </el-select>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="collectDialogVisible = false">取消</el-button>
            <el-button type="primary"
                       @click="confirm">确认</el-button>
          </span>
        </template>
      </el-card>

      <!-- 新建收藏夹的弹窗 -->
      <el-dialog title="新建收藏夹"
                 v-model="createNewFolderDialogVisible"
                 width="30%">
        <div>
          <el-input v-model="newFolderName"
                    placeholder="请输入新建收藏夹名称"></el-input>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="createNewFolderDialogVisible = false">取消</el-button>
            <el-button type="primary"
                       @click="createFolder">创建</el-button>
          </span>
        </template>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { isVideoLike } from '@/apis/like'
import DPlayer from './Dplayer.vue'
import { timestampToDate } from '@/utils'
import { getAvatarByUserId } from '@/request/baseUrl'
import { isFollowUser, deleteFollow, addFollow } from '@/apis/userFollow'
import { getVideoDetail } from '@/apis/video'
import { addLike, subLike } from '@/apis/like'
import { getPageCollectionByUserId, addCollectionByUserId, deleteCollectionByVideoId, isCollectVideo } from '@/apis/collection'
export default {
  name: 'VideoDetail',

  components: {
    DPlayer
  },

  props: {
    videoId: String
  },

  setup (props) {
    const store = useStore()
    const videoDetail = ref({})
    const dplayer = ref('')
    const isFollow = ref(false)
    const isCollect = ref(false)
    const isLike = ref(false)
    const likecolor = ref()
    const collectColor = ref()
    const collectDialogVisible = ref(false)
    const createNewFolderDialogVisible = ref(false)
    const selectedFolder = ref(null)
    const newFolderName = ref('')
    const collectionData = ref([])
    onMounted(() => {
      getVideoDetail({
        videoId: props.videoId
      }).then(res => {
        videoDetail.value = res.data
        isFollowUser({ followingUserId: videoDetail.value.userDetail.userId }).then((res) => {
          isFollow.value = res.data
        })
        isCollectVideo({ videoId: videoDetail.value.videoId }).then((res) => {
          isCollect.value = res.data
          if (isCollect.value == 'true') {
            collectColor.value = '#409efc'
          }
        })
        isVideoLike({ videoId: videoDetail.value.videoId }).then((res) => {
          isLike.value = res.data
          if (isLike.value == 'true') {
            likecolor.value = '#409efc'
          }
        })
      })
    })

    const toggleFollow = () => {
      ElMessage({
        message: isFollow.value === 'true' ? '取消关注' : '已关注',
        type: isFollow.value === 'true' ? 'warning' : 'success',
        duration: 2000,
        offset: 100
      })
      if (isFollow.value === 'false') {
        addFollow({ followingUserId: videoDetail.value.userDetail.userId }).then(() => {
          isFollow.value = 'true'
        })
      } else {
        deleteFollow({ followingUserId: videoDetail.value.userDetail.userId }).then(() => {
          isFollow.value = 'false'
        })
      }
    }
    const clickCollect = () => {
      if (isCollect.value === 'false') {
        getPageCollectionByUserId({
          pageSize: 1,
          pageNo: 1,
          orderColumn: "collection_name",
          sortOrder: "desc",
        }).then((res) => {
          getPageCollectionByUserId({
            pageSize: res.data.total,
            pageNo: 1,
            orderColumn: "collection_name",
            sortOrder: "desc",
          }).then((res) => {
            collectionData.value = res.data.list
            collectDialogVisible.value = true
          })
        })
      } else {
        deleteCollectionByVideoId({
          videoId: videoDetail.value.videoId
        }).then((res) => {
          isCollect.value = 'false'
          collectColor.value = ''
          videoDetail.value.favorites--
          ElMessage({
            message: '取消收藏',
            type: 'warning',
            duration: 2000,
            offset: 100
          })
        })

      }


    }
    const clickLike = () => {
      ElMessage({
        message: isLike.value === 'true' ? '取消点赞' : '已点赞',
        type: isLike.value === 'true' ? 'warning' : 'success',
        duration: 2000,
        offset: 100
      })
      if (isLike.value == 'true') {
        subLike({
          actionObject: 'video',
          actionObjectId: videoDetail.value.videoId
        }).then((res) => {
          isLike.value = 'false'
          likecolor.value = ''
          videoDetail.value.likes--
        })
      } else {
        addLike({
          actionObject: 'video',
          actionObjectId: videoDetail.value.videoId
        }).then((res) => {
          isLike.value = 'true'
          likecolor.value = '#409efc'
          videoDetail.value.likes++
        })
      }
    }
    const confirm = () => {
      // 执行收藏操作，根据选择的收藏夹或新建的收藏夹进行操作
      addCollectionByUserId({
        collectionName: selectedFolder.value,
        videoId: videoDetail.value.videoId,
      }).then(res => {
        selectedFolder.value
        collectDialogVisible.value = false;
        collectColor.value = '#409efc'
        videoDetail.value.favorites++
        isCollect.value = 'true'
        ElMessage({
          message: '收藏成功',
          type: 'success',
          duration: 2000,
          offset: 100
        })
      })

    }
    const createFolder = () => {
      // 执行新建收藏夹操作，这里可以向后端发送请求，将新建的收藏夹信息保存到数据库
      console.log('新建收藏夹：', newFolderName);
      collectionData.value.push(newFolderName.value);
      addCollectionByUserId({
        collectionName: newFolderName.value
      }).then((res) => {
      })
      selectedFolder.value = newFolderName.value; // 默认选中新建的收藏夹
      createNewFolderDialogVisible.value = false;
    }

    return {
      store,
      videoDetail,
      dplayer,
      isCollect,
      isLike,
      toggleFollow,
      getAvatarByUserId,
      timestampToDate,
      isFollow,
      likecolor,
      collectColor,
      clickCollect,
      clickLike,
      confirm,
      createFolder,
      collectDialogVisible,
      createNewFolderDialogVisible,
      selectedFolder,
      newFolderName,
      collectionData
    }
  }
}
</script>

<style scoped>
.main-content {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.user-info-card {
  width: 300px;
  height: 250px;
  margin-left: 20px;
  margin-top: 50px;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  margin-right: 20px;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.username {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.icon-col {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
}

.icon {
  margin-right: 8px;
}

.icon-text {
  font-size: 16px;
  font-weight: bold;
}
</style>
