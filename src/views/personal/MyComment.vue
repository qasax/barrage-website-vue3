<template>
  <div>
    <el-page-header title="我的评论"
                    icon=""
                    style="margin-bottom:30px" />
    <div v-if="commentList.length > 0">
      <div v-for="item in commentList"
           :key="item.commentId"
           @mouseover="hovering = item.commentId"
           @mouseleave="hovering = null"
           class="comment-container">
        <el-card class="comment-card"
                 :body-style="{ padding: '20px' }">
          <router-link :to="'/VideoDetailPage/'+ item.video.videoId"
                       style="text-decoration: none;"
                       target="_blank">
            <div>
              <el-avatar class="avatar"
                         :src="getAvatarByUserId + item.senderUserId"
                         style="margin-top:10px"></el-avatar>
              <div class="name">{{ item.senderUserDetail.username }}</div>
              <div class="date">{{ timestampToDate(item.timestamp) }}</div>
              <div class="comment-content">{{ item.content }}</div>
              <div class="comment-footer">
                <span>点赞数: {{ item.likes }}</span>
              </div>
            </div>
          </router-link>
          <el-button type="danger"
                     @click="deleteComment(item.commentId)"
                     v-show="hovering === item.commentId"
                     class="delete-button">
            删除评论
          </el-button>
        </el-card>
      </div>
      <el-pagination background
                     :page-sizes="[5, 10, 15, 20]"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="totalComments"
                     v-model="currentPage"
                     v-model:page-size="pageSize"
                     @current-change="handleCurrentChange"
                     @size-change="handleSizeChange">
      </el-pagination>
    </div>

    <el-empty v-else
              description="暂无评论"></el-empty>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getCommentByUserId, deleteCommentByUserId } from "@/apis/comment";
import { ElMessage, ElMessageBox } from 'element-plus';
import { getAvatarByUserId } from '@/request/baseUrl';
import { timestampToDate } from '@/utils/index';

export default {
  setup () {
    const commentList = ref([]);
    const totalComments = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(5);
    const hovering = ref(null);
    const orderColumn = ref('timestamp')
    const sortOrder = ref('desc')
    const fetchComments = () => {
      getCommentByUserId({
        orderColumn: orderColumn.value,
        sortOrder: sortOrder.value,
        pageNo: currentPage.value,
        pageSize: pageSize.value
      }).then((res) => {
        if (res.code === "success") {
          commentList.value = res.data.list;
          totalComments.value = res.data.total;
        }
      });
    };

    const deleteComment = (commentId) => {
      ElMessageBox.confirm(
        '确定要删除这条评论吗?',
        'Warning',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        deleteCommentByUserId({ commentId: commentId }).then((res) => {
          if (res.code === "success") {
            ElMessage.success("评论删除成功");
            fetchComments();
          } else {
            ElMessage.error("删除失败");
          }
        });
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
          offset: 100
        });
      });
    };

    onMounted(fetchComments);

    const handleSizeChange = (val) => {
      pageSize.value = val;
      fetchComments();
    };

    const handleCurrentChange = (val) => {
      currentPage.value = val;
      fetchComments();
    };

    return {
      commentList,
      totalComments,
      currentPage,
      pageSize,
      fetchComments,
      deleteComment,
      getAvatarByUserId,
      timestampToDate,
      handleSizeChange,
      handleCurrentChange,
      hovering,
    };
  }
};
</script>

<style scoped>
.comment-container {
  margin-bottom: 30px;
  border: 1px solid #ebebeb;
  border-radius: 8px;
  transition: box-shadow 0.3s;
}

.comment-container:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.avatar {
  float: left;
  margin-right: 15px;
}

.name {
  font-weight: 600;
  color: #333;
}

.date {
  font-size: 14px;
  color: #999;
  margin-bottom: 8px;
}

.comment-content {
  font-size: 15px;
  margin-bottom: 15px;
  color: #666;
  overflow-wrap: break-word;
}

.comment-footer {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #999;
}

.delete-button {
  float: right;
  margin-top: 5px;
}

.el-card {
  padding: 20px;
}

.el-pagination {
  text-align: center; /* Center the pagination */
  margin-top: 20px;
}

.el-empty {
  margin-top: 50px; /* Give some space above the empty state */
}
</style>
