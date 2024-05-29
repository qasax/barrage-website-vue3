<template>
  <el-page-header title="动态"
                  icon=""
                  style="margin-bottom:30px" />
  <el-row class="mov-card-row"
          v-infinite-scroll="infiniteLoad"
          :infinite-scroll-disabled="disabled"
          infinite-scroll-distance="30"
          :infinite-scroll-immediate="false"
          v-if="videoListData.length > 0">
    <div v-for="item in videoListData"
         :key="item.videoId"
         class="card-container">
      <!-- 视频点赞 -->
      <el-card class="me-area"
               :body-style="{ padding: '16px' }">
        <div class="me-article-header">
          <a @click="view(item.actionObjectId)"
             class="me-article-title">{{ item.title }}</a>
          <span class="me-pull-right me-article-count">
            <img style="height:13px;width:13px"
                 src="@/assets/img/good.png">&nbsp;{{ item.likes }}
          </span>
          <span class="me-pull-right me-article-count">
            <el-icon>
              <View />
            </el-icon>&nbsp;{{ item.views }}
          </span>
        </div>
        <div class="me-artile-description">
          {{ item.description }}
        </div>
        <router-link :to="'/VideoDetailPage/' + item.videoId"
                     style="text-decoration: none;"
                     target="_blank">
          <div class="preimg">
            <div style="margin:auto;width:180px">
              <img style="cursor:pointer;"
                   :src="getVideoPicByUrl + item.coverImageUrl">
            </div>
          </div>
        </router-link>
        <div class="me-article-footer">
          <router-link :to="'/others/'+ item.userDetail.userId"
                       style="text-decoration: none;"
                       target="_blank">
            <span class="me-article-author">
              <i class="me-icon-author"></i>&nbsp;{{ item.userDetail.username }}
              <img :src="getAvatarByUserId + item.userDetail.userId"
                   class="me-article-author-avatar" />
            </span>
          </router-link>
          <div class="me-pull-right me-article-time">
            <span class="me-pull-right me-article-count">
              <i class="el-icon-time"></i>&nbsp;发布时间: {{ timestampToDate(item.uploadDate) }}
            </span>
          </div>
        </div>
      </el-card>
    </div>
  </el-row>
  <el-empty v-else
            :image-size="250"
            description="没有动态内容"></el-empty>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getLatelyMsg } from '@/apis/userFollow'
import { timestampToDate } from '@/utils/index'
import { getVideoPicByUrl } from '@/request/baseUrl'
import { getAvatarByUserId } from '@/request/baseUrl'
import { setReadMsg } from '@/apis/user'
export default {
  name: 'MyLatelyMsg',
  setup () {
    const videoListData = ref([])
    const max = ref(new Date().getTime())
    const offset = ref(0)
    const disabled = ref(false)
    const getVideoListData = () => {
      disabled.value = true
      getLatelyMsg({ max: max.value, offset: offset.value }).then((res) => {
        res.data.map(videodata => {
          videoListData.value.push(videodata)
        })
        offset.value = res.offset
        max.value = res.lastTime
        disabled.value = false
      })
    }

    const infiniteLoad = () => {
      getVideoListData()
    }

    onMounted(() => {
      getVideoListData()
      setReadMsg()
    })

    return {
      infiniteLoad,
      videoListData,
      timestampToDate,
      getVideoPicByUrl,
      getAvatarByUserId,
      disabled
    }
  }
}
</script>

<style>
.me-article-header {
  padding-bottom: 10px;
}

.me-article-title {
  font-weight: 600;
}

.me-article-icon {
  padding: 3px 8px;
}

.me-article-count {
  color: #a6a6a6;
  padding-left: 20px;
  font-size: 13px;
}

.me-pull-right {
  float: right;
}

.me-artile-description {
  font-size: 13px;
  line-height: 24px;
  margin-bottom: 10px;
}

.me-article-author {
  color: #a6a6a6;
  padding-right: 18px;
  font-size: 13px;
  cursor: pointer;
}

.me-article-author-img {
  width: 15px;
  height: 15px;
}

.me-article-author-avatar {
  width: 30px;
  height: 30px;
  vertical-align: text-bottom;
  border-radius: 50%;
}

.el-tag {
  margin-left: 6px;
}

.me-article-time {
  margin-top: 20px;
}

.leftimg {
  width: 100px;
  height: 90px;
  float: left;
  margin-right: 20px;
}

img {
  width: 100%;
  height: 100%;
}

.preimg {
  width: 700px;
  height: 90px;
  margin-bottom: 10px;
  display: flex;
}

.card-container {
  position: relative;
}

.card-container:hover .delete-button {
  opacity: 1;
}

.container {
  padding: 0 10px;
  box-sizing: border-box;
}

.comment {
  padding: 10px;
}

.info {
  display: flex;
  align-items: center;
}

.avatar {
  border-radius: 50%;
}

.right {
  margin-left: 10px;
}

.name {
  font-size: 16px;
  font-weight: 500;
}

.date {
  font-size: 12px;
  color: #999;
}

.content {
  font-size: 16px;
  line-height: 20px;
  padding: 10px 0;
}

.control {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #999;
}

.like {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.like.active,
.like:hover {
  color: #67c23a;
}

.iconfont {
  font-size: 14px;
  margin-right: 5px;
}

.like-num {
  margin-left: 5px;
}
</style>
