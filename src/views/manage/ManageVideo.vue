<template>
  <div v-if="videoList.length>0">
    <el-page-header title="用户数据"
                    icon="">
    </el-page-header>
    <el-table ref="multipleTableRef"
              :data="videoList"
              style="width: 100%"
              v-loading="loading"
              element-loading-text="Loading..."
              :element-loading-spinner="svg"
              element-loading-svg-view-box="-10, -10, 50, 50"
              element-loading-background="rgba(122, 122, 122, 0.8)"
              :default-sort="{prop: 'proctorID', order: 'ascending'}">
      <el-table-column label="视频ID"
                       property="videoId"
                       width="70"
                       fixed="left"></el-table-column>
      <el-table-column property="title"
                       label="视频标题"
                       width="170"
                       fixed="left">
        <template #default="scope">
          <el-input v-model="scope.row.title"
                    style="width: 140px"></el-input>
        </template>
      </el-table-column>
      <el-table-column property="description"
                       label="视频简介"
                       width="170">
        <template #default="scope">
          <el-input v-model="scope.row.description"
                    style="width: 140px"></el-input>
        </template>
      </el-table-column>
      <el-table-column property="uploaderUserId"
                       label="上传者用户Id"
                       width="170">
        <template #default="scope">
          <el-input disabled
                    v-model="scope.row.uploaderUserId"
                    style="width: 140px"></el-input>
        </template>
      </el-table-column>
      <el-table-column property="uploadDate"
                       label="上传时间"
                       width="170">
        <template #default="scope">
          <el-date-picker v-model="scope.row.uploadDate"
                          type="date"
                          style="width: 140px" />
        </template>
      </el-table-column>
      <el-table-column property="videoUrl"
                       label="视频url"
                       width="170">
        <template #default="scope">
          <el-input v-model="scope.row.videoUrl"
                    style="width: 120px"></el-input>
        </template>
      </el-table-column>
      <el-table-column property="subtitleUrl"
                       label="字幕url"
                       width="170">
        <template #default="scope">
          <el-input v-model="scope.row.subtitleUrl"
                    style="width: 120px"></el-input>
        </template>
      </el-table-column>
      <el-table-column property="coverImageUrl"
                       label="封面url"
                       width="170">
        <template #default="scope">
          <el-input v-model="scope.row.coverImageUrl"
                    style="width: 120px"></el-input>
        </template>
      </el-table-column>
      <el-table-column property="views"
                       label="观看量"
                       width="170">
        <template #default="scope">
          <el-input v-model="scope.row.views"
                    style="width: 120px"></el-input>
        </template>
      </el-table-column>
      <el-table-column property="comments"
                       label="评论量"
                       width="170">
        <template #default="scope">
          <el-input v-model="scope.row.comments"
                    style="width: 120px"></el-input>
        </template>
      </el-table-column>
      <el-table-column property="barrages"
                       label="弹幕量"
                       width="170">
        <template #default="scope">
          <el-input v-model="scope.row.barrages"
                    style="width: 120px"></el-input>
        </template>
      </el-table-column>
      <el-table-column property="likes"
                       label="点赞量"
                       width="170">
        <template #default="scope">
          <el-input v-model="scope.row.likes"
                    style="width: 120px"></el-input>
        </template>
      </el-table-column>
      <el-table-column property="favorites"
                       label="收藏量"
                       width="170">
        <template #default="scope">
          <el-input v-model="scope.row.favorites"
                    style="width: 120px"></el-input>
        </template>
      </el-table-column>
      <el-table-column property="shares"
                       label="分享量"
                       width="170">
        <template #default="scope">
          <el-input v-model="scope.row.shares"
                    style="width: 120px"></el-input>
        </template>
      </el-table-column>
      <el-table-column property="type"
                       label="视频类型"
                       width="170">
        <template #default="scope">
          <el-select v-model="scope.row.type"
                     style="width: 70px">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="250"
                       fixed="right">
        <template #default="scope">
          <el-button type="primary"
                     @click="submitChanges(scope.row)">提交修改</el-button>
          <el-button type="primary"
                     @click="removeVideo(scope.row)">删除视频</el-button>
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
import { getPageVideoAdmin, updateVideoInfoAdmin, deleteVideoAdmin } from '@/apis/video'
import { onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  setup () {
    const pageSize = ref(10)
    const currentPage = ref(1)
    const orderColumn = ref('video_id')
    const sortOrder = ref('asc')
    const videoList = ref([])
    const total = ref()
    const options = [
      { label: '动画', value: '动画' },
      { label: '生活', value: '生活' },
      { label: '游戏', value: '游戏' },
      { label: '歌曲', value: '歌曲' }]
    onMounted(() => {
      getVideoList()
    })
    const getVideoList = () => {
      getPageVideoAdmin({
        pageSize: pageSize.value,
        pageNo: currentPage.value,
        orderColumn: orderColumn.value,
        sortOrder: sortOrder.value,
      }).then((res) => {
        videoList.value = res.data.list
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
          updateVideoInfoAdmin({
            videoId: row.videoId,
            title: row.title,
            description: row.description,
            uploaderUserId: row.uploaderUserId,
            uploadDate: row.uploadDate,
            videoUrl: row.videoUrl,
            subtitleUrl: row.subtitleUrl,
            coverImageUrl: row.coverImageUrl,
            views: row.views,
            comments: row.comments,
            barrages: row.barrages,
            likes: row.likes,
            favorites: row.favorites,
            shares: row.shares,
            type: row.type,
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

    const removeVideo = (row) => {
      ElMessageBox.confirm(
        '将会删除该视频，是否确认?',
        'Warning',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          deleteVideoAdmin({
            videoId: row.videoId,
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
      getVideoList()
    }

    const handleCurrentChange = (val) => {
      console.log(`current page: ${val}`)
      currentPage.value = val
      getVideoList()
    }
    return {
      videoList,
      total,
      currentPage,
      pageSize,
      options,
      handleCurrentChange,
      handleSizeChange,
      submitChanges,
      removeVideo
    }
  }
}
</script>

<style>
</style>