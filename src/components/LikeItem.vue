<template>
  <div v-if="LikeList.length>0">
    <div v-for="item in LikeList"
         :key="item.likeId"
         class="card-container">
      <!--视频点赞-->
      <el-card class="me-area"
               v-if="item.videoEntity"
               :body-style="{ padding: '16px' }">
        <div class="me-article-header">
          <a @click="view(item.actionObjectId)"
             class="me-article-title">{{item.videoEntity.title}}</a>
          <span class="me-pull-right me-article-count">
            <el-icon>
              <Star />
            </el-icon> &nbsp;{{item.videoEntity.favorites}}
          </span>
          <span class="me-pull-right me-article-count">
            <el-icon>
              <ChatLineSquare />
            </el-icon>&nbsp;{{item.videoEntity.barrages}}
          </span>
          <span class="me-pull-right me-article-count">
            <el-icon>
              <ChatLineSquare />
            </el-icon>&nbsp;{{item.videoEntity.comments}}
          </span>
          <span class="me-pull-right me-article-count">
            <img style="height:13px;width:13px"
                 src="@/assets/img/good.png">&nbsp;{{item.videoEntity.likes}}
          </span>
          <span class="me-pull-right me-article-count">
            <el-icon>
              <View />
            </el-icon>&nbsp;{{item.videoEntity.views}}
          </span>
        </div>

        <div class="me-artile-description">
          {{item.videoEntity.description}}
        </div>
        <router-link :to="'/VideoDetailPage/'+ item.videoEntity.videoId"
                     style="text-decoration: none;"
                     target="_blank">
          <div class="preimg">
            <div style="margin:auto;width:180px">
              <img style="cursor:pointer;"
                   :src="getVideoPicByUrl + item.videoEntity.coverImageUrl">
            </div>
          </div>
        </router-link>
        <div class="me-article-footer">
          <span class="me-article-author">
            <router-link :to="'/others/'+ item.videoEntity.userDetail.userId"
                         style="text-decoration: none;color:black"
                         target="_blank">
              <i class="me-icon-author"></i>&nbsp;{{item.videoEntity.userDetail.username}}
              <img :src="getAvatarByUserId + item.videoEntity.userDetail.userId"
                   class="me-article-author-avatar" />
            </router-link>
          </span>
          <div class="me-pull-right me-article-time">
            <span class="me-pull-right me-article-count">
              <i class="el-icon-time"></i>&nbsp;点赞时间: {{timestampToDate(item.likeDate)}}
            </span>
          </div>
        </div>
      </el-card>
      <!--评论点赞-->
      <el-card class="me-area"
               v-if="item.commentEntity"
               :body-style="{ padding: '16px' }">
        <router-link :to="'/VideoDetailPage/'+ item.commentEntity.videoId"
                     style="text-decoration: none;color:black"
                     target="_blank">
          <div class="container"
               style="margin-top:50px;width:900px">
            <div class="comment">
              <router-link :to="'/others/'+ item.commentEntity.senderUserDetail.userId"
                           style="text-decoration: none;color: black;"
                           target="_blank">
                <div class="info">
                  <el-avatar class="avatar"
                             :src="getAvatarByUserId + item.commentEntity.senderUserId"
                             style="margin-top:10px"></el-avatar>
                  <div class="right">
                    <div class="name">{{ item.commentEntity.senderUserDetail.username }}</div>
                    <div class="date">{{ timestampToDate(item.commentEntity.timestamp) }}</div>
                  </div>
                </div>
              </router-link>
              <div class="content">{{ item.commentEntity.content }}</div>
              <div class="control">
                <span class="like">
                  <i class="iconfont icon-like"></i>
                  <span class="like-num">{{ item.commentEntity.likes > 0 ? item.commentEntity.likes + '人赞' : '赞' }}</span>
                </span>
              </div>
            </div>
          </div>
          <div class="me-pull-right me-article-time"
               style="margin-bottom:15px">
            <span class="me-pull-right me-article-count">
              <i class="el-icon-time"></i>&nbsp;点赞时间: {{timestampToDate(item.likeDate)}}
            </span>
          </div>
        </router-link>
      </el-card>
      <!--回复点赞-->
      <el-card class="me-area"
               v-if="item.commentRepliesEntity"
               :body-style="{ padding: '16px' }">
        <router-link :to="'/VideoDetailPage/'+ item.commentRepliesEntity.comment.videoId"
                     style="text-decoration: none;color:black"
                     target="_blank">
          <div class="container"
               style="margin-top:50px;width:900px">
            <div class="comment">
              <router-link :to="'/others/'+ item.commentRepliesEntity.fromUserId"
                           style="text-decoration: none;color: black;"
                           target="_blank">
                <div class="info">
                  <el-avatar class="avatar"
                             :src="getAvatarByUserId + item.commentRepliesEntity.fromUserId"
                             style="margin-top:10px"></el-avatar>
                  <div class="right">
                    <div class="name">{{ item.commentRepliesEntity.fromUserDetail.username }}
                      : 回复@
                      <router-link :to="'/others/'+ item.commentRepliesEntity.toUserId"
                                   style="text-decoration: none;color: black;"
                                   target="_blank">
                        {{ item.commentRepliesEntity.toUserDetail.username }}
                      </router-link>
                    </div>
                    <div class="date">{{ timestampToDate(item.commentRepliesEntity.timestamp) }}</div>
                  </div>
                </div>
              </router-link>
              <div class="content">{{ item.commentRepliesEntity.content }}</div>
              <div class="control">
                <span class="like">
                  <i class="iconfont icon-like"></i>
                  <span class="like-num">{{ item.commentRepliesEntity.likes > 0 ? item.commentRepliesEntity.likes + '人赞' : '赞' }}</span>
                </span>
              </div>
            </div>
          </div>
          <div class="me-pull-right me-article-time"
               style="margin-bottom:15px">
            <span class="me-pull-right me-article-count">
              <i class="el-icon-time"></i>&nbsp;点赞时间: {{timestampToDate(item.likeDate)}}
            </span>
          </div>
        </router-link>
      </el-card>
    </div>
    <div class="demo-pagination-block">
      <el-pagination background
                     v-model:current-page="currentPage"
                     v-model:page-size="pageSize"
                     :page-sizes="[5, 10, 15, 20]"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     style="margin-top:30px;margin-left:100px" />
    </div>
  </div>
  <el-empty v-else
            :image-size="250"
            description="没有点赞内容"></el-empty>
</template>
<script>
import { timestampToDate } from '../utils/index'
import { onMounted, ref, watch } from 'vue'
import { getAvatarByUserId, getVideoPicByUrl } from '@/request/baseUrl'
import { getPageCommentLike, getPageReplyLike, getPageVideoLike } from '@/apis/like'
export default {
  name: "LikeItem",
  props: {
    LikeName: String
  },
  setup (props) {
    const LikeList = ref([])
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const hovering = ref(null)
    const getDetail = () => {
      if (props.LikeName === 'video') {
        getPageVideoLike({
          pageSize: pageSize.value,
          pageNo: currentPage.value,
          orderColumn: 'like_date',
          sortOrder: 'desc',
        }).then(res => {
          total.value = res.data.total
          currentPage.value = res.data.pageNum
          LikeList.value = res.data.list
        })
      }
      if (props.LikeName === 'comment') {
        getPageCommentLike({
          pageSize: pageSize.value,
          pageNo: currentPage.value,
          orderColumn: 'like_date',
          sortOrder: 'desc',
        }).then(res => {
          total.value = res.data.total
          currentPage.value = res.data.pageNum
          LikeList.value = res.data.list
        })
      }
      if (props.LikeName === 'reply') {
        getPageReplyLike({
          pageSize: pageSize.value,
          pageNo: currentPage.value,
          orderColumn: 'like_date',
          sortOrder: 'desc',
        }).then(res => {
          total.value = res.data.total
          currentPage.value = res.data.pageNum
          LikeList.value = res.data.list
        })
      }
    }
    onMounted(() => {
      getDetail()
    })
    watch(() => props.LikeName, () => {
      getDetail()
    })
    const handleSizeChange = (val) => {
      pageSize.value = val
      getDetail()
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
      getDetail()
    }

    return {
      timestampToDate,
      currentPage,
      pageSize,
      total,
      handleSizeChange,
      handleCurrentChange,
      getAvatarByUserId,
      getVideoPicByUrl,
      hovering,
      LikeList
    }
  }
}
</script>
<style scoped>
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
