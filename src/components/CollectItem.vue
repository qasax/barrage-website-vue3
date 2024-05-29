<template>
  <div v-if="collectionList.length>0 && collectionList[0].videoEntity ">
    <div v-for="item in collectionList"
         :key="item.collectionId"
         @mouseover="hovering = item.collectionId"
         @mouseleave="hovering = null"
         class="card-container">
      <el-card class="me-area"
               :body-style="{ padding: '16px' }">
        <div class="me-article-header">
          <a @click="view(item.collectionId)"
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
            <div style="margin-right:30px;width:120px">
              <img style="cursor:pointer;"
                   :src="getVideoPicByUrl + item.videoEntity.coverImageUrl">
            </div>
          </div>
        </router-link>
        <div class="me-article-footer">
          <span class="me-article-author">
            <router-link :to="'/others/'+ item.videoEntity.userDetail.userId"
                         style="text-decoration: none;"
                         target="_blank">
              <i class="me-icon-author"></i>&nbsp;{{item.videoEntity.userDetail.username}}
              <img :src="getAvatarByUserId + item.videoEntity.userDetail.userId"
                   class="me-article-author-avatar" />
            </router-link>
          </span>
          <div class="me-pull-right me-article-time">
            <span class="me-pull-right me-article-count">
              <i class="el-icon-time"></i>&nbsp;{{timestampToDate(item.videoEntity.uploadDate)}}
            </span>
          </div>
        </div>
      </el-card>
      <el-button v-if="hovering === item.collectionId"
                 @click.stop="removeCollect(item)"
                 class="delete-button"
                 type="danger"
                 size="default">
        删除收藏
      </el-button>
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
            description="没有收藏内容"></el-empty>
</template>
<script>
import { timestampToDate } from '../utils/index'
import { getPageCollectionDetail } from '@/apis/collection'
import { onMounted, ref } from 'vue'
import { getAvatarByUserId, getVideoPicByUrl } from '@/request/baseUrl'
import { deleteCollectionByVideoId } from '@/apis/collection'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
export default {
  name: "collectItem",
  props: {
    collectionName: String
  },
  setup (props) {
    const collectionList = ref([])
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const hovering = ref(null)
    const router = useRouter()
    const getDetail = () => {
      getPageCollectionDetail({
        pageSize: pageSize.value,
        pageNo: currentPage.value,
        orderColumn: "collection_date",
        sortOrder: "desc",
        collectionName: props.collectionName
      }).then((res) => {
        collectionList.value = res.data.list
        total.value = res.data.total
        currentPage.value = res.data.pageNum
      })
    }

    const removeCollect = (val) => {
      ElMessageBox.confirm(
        '将会删除该收藏，是否确认?',
        'Warning',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          deleteCollectionByVideoId({
            collectionName: val.collectionName,
            videoId: val.videoId
          }).then(res => {
            collectionList.value = collectionList.value.filter(item => item.videoId !== val.videoId)
            ElMessage({
              type: 'success',
              message: '删除成功',
              offset: 100
            })
          })

        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消删除',
            offset: 100
          })
        })
    }

    onMounted(() => {
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
      collectionList,
      timestampToDate,
      currentPage,
      pageSize,
      total,
      handleSizeChange,
      handleCurrentChange,
      getAvatarByUserId,
      getVideoPicByUrl,
      removeCollect,
      hovering,
      router
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

.delete-button {
  position: absolute;
  top: 50px;
  right: 10px;
  opacity: 0;
  transition: opacity 0.3s;
}

.card-container:hover .delete-button {
  opacity: 1;
}
</style>
