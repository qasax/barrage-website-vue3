<template>
  <div v-if="replytList.length>0">
    <el-page-header title="评论数据"
                    icon="">
    </el-page-header>
    <el-table ref="multipleTableRef"
              :data="replytList"
              style="width: 100%"
              v-loading="loading"
              element-loading-text="Loading..."
              :element-loading-spinner="svg"
              element-loading-svg-view-box="-10, -10, 50, 50"
              element-loading-background="rgba(122, 122, 122, 0.8)"
              :default-sort="{prop: 'proctorID', order: 'ascending'}">
      <el-table-column label="回复Id"
                       property="replyId"
                       sortable="custom"
                       width="70"></el-table-column>
      <el-table-column property="commentId"
                       label="评论Id"
                       width="100" />
      <el-table-column property="fromUserId"
                       label="回复者Id"
                       width="100">
      </el-table-column>
      <el-table-column property="toUserId"
                       label="被回复者Id">
      </el-table-column>
      <el-table-column property="content"
                       label="评论内容">
        <template #default="scope">
          <el-input v-model="scope.row.content"
                    style="width: 140px"></el-input>
        </template>
      </el-table-column>
      <el-table-column property="timestamp"
                       label="发送时间">
        <template #default="scope">
          <el-date-picker v-model="scope.row.timestamp"
                          type="date"
                          style="width: 140px" />
        </template>
      </el-table-column>
      <el-table-column property="likes"
                       label="点赞量">
        <template #default="scope">
          <el-input v-model="scope.row.likes"
                    style="width: 140px"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="250">
        <template #default="scope">
          <el-button type="primary"
                     @click="submitChanges(scope.row)">提交修改</el-button>
          <el-button type="primary"
                     @click="removeComment(scope.row)">删除评论</el-button>
        </template>
      </el-table-column>
    </el-table>
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
</template>

<script>
import { getReplyCommentAdmin, updateReplyAdmin, deleteReplyAdmin } from '@/apis/commentReply'
import { onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  setup () {
    const pageSize = ref(10)
    const currentPage = ref(1)
    const orderColumn = ref('comment_id')
    const sortOrder = ref('asc')
    const replytList = ref([])
    const total = ref()
    const options = [{
      label: '男', value: 'Male'
    }, { label: '女', value: 'Female' }]
    onMounted(() => {
      getReplyList()
    })
    const getReplyList = () => {
      getReplyCommentAdmin({
        pageSize: pageSize.value,
        pageNo: currentPage.value,
        orderColumn: orderColumn.value,
        sortOrder: sortOrder.value,
      }).then((res) => {
        replytList.value = res.data.list
        currentPage.value = res.data.pageNum
        total.value = res.data.total
      })
    }
    const submitChanges = (row) => {
      ElMessageBox.confirm(
        '将提交修改，是否确认?',
        'Warning',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          updateReplyAdmin({
            replyId: row.replyId,
            commentId: row.commentId,
            fromUserId: row.fromUserId,
            toUserId: row.toUserId,
            content: row.content,
            timestamp: row.timestamp,
            likes: row.likes
          }).then((res) => {
            ElMessage({
              type: 'success',
              message: '修改成功',
              offset: 100
            })
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消修改',
            offset: 100
          })
        })
    }

    const removeComment = (row) => {
      ElMessageBox.confirm(
        '将会删除该用户，是否确认?',
        'Warning',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          deleteReplyAdmin({
            replyId: row.replyId,
          }).then((res) => {
            ElMessage({
              type: 'success',
              message: '删除成功',
              offset: 100
            })
            setTimeout(() => {
              window.location.reload()
            }, 600);
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
    const handleSizeChange = (val) => {
      console.log(`${val} items per page`)
      pageSize.value = val
      getReplyList()
    }

    const handleCurrentChange = (val) => {
      console.log(`current page: ${val}`)
      currentPage.value = val
      getReplyList()
    }
    return {
      replytList,
      total,
      currentPage,
      pageSize,
      options,
      handleCurrentChange,
      handleSizeChange,
      submitChanges,
      removeComment
    }
  }
}
</script>

<style>
</style>