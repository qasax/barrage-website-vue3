<template>
  <div v-if="BarrageList.length>0">
    <el-page-header title="弹幕数据"
                    icon="">
    </el-page-header>
    <el-table ref="multipleTableRef"
              :data="BarrageList"
              style="width: 100%"
              v-loading="loading"
              element-loading-text="Loading..."
              :element-loading-spinner="svg"
              element-loading-svg-view-box="-10, -10, 50, 50"
              element-loading-background="rgba(122, 122, 122, 0.8)"
              :default-sort="{prop: 'proctorID', order: 'ascending'}">
      <el-table-column label="弹幕ID"
                       property="barrageId"
                       sortable="custom"
                       width="70"
                       fixed="left"></el-table-column>
      <el-table-column property="videoId"
                       label="视频ID"
                       width="100" />
      <el-table-column property="time"
                       label="时间戳"
                       width="100">
      </el-table-column>
      <el-table-column property="type"
                       label="弹幕类型"
                       width="200">
        <template #default="scope">
          <el-select v-model="scope.row.type"
                     style="width: 120px">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column property="userId"
                       label="用户ID"
                       width="200">
      </el-table-column>
      <el-table-column property="text"
                       label="弹幕内容"
                       width="200">
        <template #default="scope">
          <el-input v-model="scope.row.text"
                    style="width: 160px"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="330"
                       fixed="right">
        <template #default="scope">
          <el-button type="primary"
                     @click="submitChanges(scope.row)">提交修改</el-button>
          <el-button type="primary"
                     @click="removeBarrage(scope.row)">删除弹幕</el-button>
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
import { getPageBarrageAdmin, updateBarrage, deleteBarrage } from '@/apis/barrage'
import { onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  setup () {
    const pageSize = ref(10)
    const currentPage = ref(1)
    const orderColumn = ref('barrage_id')
    const sortOrder = ref('asc')
    const BarrageList = ref([])
    const total = ref()
    const options = [{
      label: '顶部弹幕', value: 1
    }, { label: '底部弹幕', value: 2 }, {
      label: '滚动弹幕', value: 0
    }]
    onMounted(() => {
      getBarrageList()
    })
    const getBarrageList = () => {
      getPageBarrageAdmin({
        pageSize: pageSize.value,
        pageNo: currentPage.value,
        orderColumn: orderColumn.value,
        sortOrder: sortOrder.value,
      }).then((res) => {
        BarrageList.value = res.data.list
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
          updateBarrage({
            barrageId: row.barrageId,
            videoId: row.videoId,
            time: row.time,
            type: row.type,
            color: row.color,
            userId: row.userId,
            text: row.text
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
    const removeBarrage = (row) => {
      ElMessageBox.confirm(
        '将会删除该弹幕，是否确认?',
        'Warning',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          deleteBarrage({
            barrageId: row.barrageId,
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
      getBarrageList()
    }

    const handleCurrentChange = (val) => {
      console.log(`current page: ${val}`)
      currentPage.value = val
      getBarrageList()
    }
    return {
      BarrageList,
      total,
      currentPage,
      pageSize,
      handleCurrentChange,
      handleSizeChange,
      submitChanges,
      removeBarrage,
      options
    }
  }
}
</script>

<style>
</style>