<template>
  <div>
    <el-page-header title="我的回复"
                    icon=""
                    style="margin-bottom:30px" />
    <div v-if="replyList.length > 0">
      <div v-for="item in replyList"
           :key="item.replyId"
           @mouseover="hovering = item.replyId"
           @mouseleave="hovering = null"
           class="reply-container">
        <el-card class="reply-card"
                 :body-style="{ padding: '20px' }">
          <router-link :to="'/VideoDetailPage/'+ item.comment.video.videoId"
                       style="text-decoration: none; color: black;"
                       target="_blank">
            <div>
              <div class="reply-header">
                <el-avatar class="avatar"
                           :src="getAvatarByUserId + item.fromUserId"
                           style="margin-top:10px"></el-avatar>
                <span class="name">{{ item.fromUserDetail.username }}
                  回复：@
                  <router-link :to="'/others/'+ item.toUserDetail.userId"
                               style="text-decoration: none;color:black"
                               target="_blank">
                    {{ item.toUserDetail.username }}
                  </router-link>
                </span>
                <div class="date">{{ timestampToDate(item.timestamp) }}</div>
              </div>
              <div class="reply-content">{{ item.content }}</div>
              <div class="reply-footer">
                <span>点赞数: {{ item.likes }}</span>
              </div>
            </div>
          </router-link>
          <el-button v-if="hovering === item.replyId"
                     type="danger"
                     @click="deleteReply(item.replyId)"
                     class="delete-button">
            删除回复
          </el-button>
        </el-card>
      </div>
      <el-pagination background
                     :page-sizes="[5, 10, 15, 20]"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="totalReplies"
                     v-model="currentPage"
                     v-model:page-size="pageSize"
                     @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"></el-pagination>
    </div>
    <el-empty v-else
              description="暂无回复"></el-empty>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getReplyByUserId, deleteReplyByUserId } from "@/apis/commentReply";
import { ElMessage, ElMessageBox } from "element-plus";
import { getAvatarByUserId } from "@/request/baseUrl";
import { timestampToDate } from "@/utils/index";

export default {
  setup () {
    const replyList = ref([]);
    const totalReplies = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(5);
    const hovering = ref(null);
    const orderColumn = ref('timestamp')
    const sortOrder = ref('desc')
    const fetchReplies = () => {
      getReplyByUserId({
        orderColumn: orderColumn.value,
        sortOrder: sortOrder.value,
        pageNo: currentPage.value,
        pageSize: pageSize.value,
      }).then((res) => {
        if (res.code === "success") {
          replyList.value = res.data.list;
          totalReplies.value = res.data.total;
        }
      });
    };

    const deleteReply = (replyId) => {
      ElMessageBox.confirm("确定要删除这条回复吗?", "Warning", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteReplyByUserId({ replyId: replyId }).then((res) => {
          if (res.code === "success") {
            ElMessage.success("回复删除成功");
            fetchReplies();
          } else {
            ElMessage.error("删除失败");
          }
        });
      }).catch(() => {
        ElMessage({
          type: "info",
          message: "取消删除",
          offset: 100,
        });
      });
    };

    onMounted(fetchReplies);

    const handleSizeChange = (val) => {
      pageSize.value = val;
      fetchReplies();
    };

    const handleCurrentChange = (val) => {
      currentPage.value = val;
      fetchReplies();
    };

    return {
      replyList,
      totalReplies,
      currentPage,
      pageSize,
      fetchReplies,
      deleteReply,
      getAvatarByUserId,
      timestampToDate,
      handleSizeChange,
      handleCurrentChange,
      hovering,
    };
  },
};
</script>

<style scoped>
.reply-container {
  margin-bottom: 20px;
  border: 1px solid #ebebeb;
  border-radius: 8px;
  position: relative;
}

.reply-header {
  display: flex;
  align-items: center;
}

.name,
.date {
  margin-left: 10px;
}

.reply-content {
  margin-top: 10px;
  font-size: 16px;
}

.reply-footer {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #999;
}

.delete-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.reply-container:hover .delete-button {
  opacity: 1;
}
</style>
