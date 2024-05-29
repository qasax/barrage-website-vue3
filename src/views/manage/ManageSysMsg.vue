<template>
  <div>
    <el-page-header title="系统消息管理"
                    icon="">
    </el-page-header>
    <el-button type="primary"
               @click="openMessageModal">发布新消息</el-button>
    <el-dialog v-model="dialogVisible"
               title="发布新消息">
      <el-form :model="messageForm">
        <el-form-item label="消息标题">
          <el-input v-model="messageForm.title"></el-input>
        </el-form-item>
        <el-form-item label="消息内容">
          <el-input type="textarea"
                    v-model="messageForm.content"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="publishMessage">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-table ref="tableRef"
              :data="systemMsgList"
              style="width: 100%"
              v-loading="loading"
              element-loading-text="Loading...">
      <el-table-column label="消息ID"
                       property="messageId"></el-table-column>
      <el-table-column label="消息标题"
                       property="title">
        <template #default="scope">
          <el-input v-model="scope.row.title"
                    style="width: 120px"></el-input>
        </template></el-table-column>
      <el-table-column label="内容"
                       property="content">
        <template #default="scope">
          <el-input v-model="scope.row.content"
                    style="width: 120px"></el-input>
        </template></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary"
                     @click="submitChanges(scope.row)">提交修改</el-button>
          <el-button type="danger"
                     @click="deleteMessage(scope.row)">删除</el-button>
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
import { ref } from 'vue'
import { publishSystemMsg, deleteSystemMsg } from '@/apis/website'
import { getPageSystemMsg, updateSystemMsg } from '@/apis/website'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  setup () {
    const systemMsgList = ref([])
    const dialogVisible = ref(false)
    const messageForm = ref({
      title: '',
      content: ''
    })
    const tableRef = ref(null)
    const loading = ref(false)
    const pageSize = ref(10)
    const currentPage = ref(1)
    const orderColumn = ref('timestamp')
    const sortOrder = ref('asc')
    const total = ref()
    const disabled = ref(false)
    const fetchMessages = () => {
      loading.value = true
      getPageSystemMsg({
        pageSize: pageSize.value,
        pageNo: currentPage.value,
        sortOrder: sortOrder.value,
        orderColumn: orderColumn.value
      }).then((res) => {
        systemMsgList.value = res.data.list
        currentPage.value = res.data.pageNum
        total.value = res.data.total
        disabled.value = false
        loading.value = false
      })
    }

    const openMessageModal = () => {
      messageForm.value = { title: '', content: '' }
      dialogVisible.value = true
    }

    const publishMessage = () => {
      ElMessageBox.confirm(
        '将会发布该系统消息，是否确认?',
        'Warning',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          publishSystemMsg(messageForm.value)
            .then((res) => {
              dialogVisible.value = false
              ElMessage({
                type: 'success',
                message: '发布成功',
                offset: 100
              })
            })
          window.location.reload()
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消发布',
            offset: 100
          })
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
          updateSystemMsg({
            messageId: row.messageId,
            title: row.title,
            content: row.content,
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
    const deleteMessage = (message) => {
      ElMessageBox.confirm(
        '将会删除该系统消息，是否确认?',
        'Warning',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          deleteSystemMsg({ messageId: message.messageId })
            .then((res) => {
              ElMessage({
                type: 'success',
                message: '删除成功',
                offset: 100
              })
              window.location.reload()
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
    fetchMessages()
    const handleSizeChange = (val) => {
      console.log(`${val} items per page`)
      pageSize.value = val
      fetchMessages()
    }

    const handleCurrentChange = (val) => {
      console.log(`current page: ${val}`)
      currentPage.value = val
      fetchMessages()
    }
    return {
      systemMsgList,
      dialogVisible,
      messageForm,
      loading,
      openMessageModal,
      publishMessage,
      deleteMessage,
      tableRef,
      currentPage,
      pageSize,
      total,
      handleCurrentChange,
      handleSizeChange,
      submitChanges
    }
  }
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
