<template>
  <div v-if="userList.length>0">
    <el-page-header title="用户授权"
                    icon="">
    </el-page-header>
    <el-table ref="multipleTableRef"
              :data="userList"
              style="width: 100%"
              v-loading="loading"
              element-loading-text="Loading..."
              :element-loading-spinner="svg"
              element-loading-svg-view-box="-10, -10, 50, 50"
              element-loading-background="rgba(122, 122, 122, 0.8)"
              :default-sort="{prop: 'proctorID', order: 'ascending'}">
      <el-table-column label="用户ID"
                       property="userId"
                       sortable="custom"></el-table-column>
      <el-table-column property="username"
                       label="用户名" />
      <el-table-column property="role"
                       label="用户角色">
        <template #default="scope">
          <el-select v-model="scope.row.role"
                     style="width: 240px"
                     @change="handleRoleChange(scope.row, scope.row.role)">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
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
import { getPageUserListAdmin, setUserRoleAdmin } from '@/apis/user'
import { onMounted, ref, watch } from 'vue'
export default {
  setup () {
    const pageSize = ref(10)
    const currentPage = ref(1)
    const orderColumn = ref('user_id')
    const sortOrder = ref('asc')
    const userList = ref([])
    const total = ref()
    const options = [{
      label: '管理员', value: 'admin'
    }, { label: '用户', value: 'user' }]
    onMounted(() => {
      getUserList()
    })
    watch(userList)
    const getUserList = () => {
      getPageUserListAdmin({
        pageSize: pageSize.value,
        pageNo: currentPage.value,
        orderColumn: orderColumn.value,
        sortOrder: sortOrder.value,
      }).then((res) => {
        userList.value = res.data.list
        currentPage.value = res.data.pageNum
        total.value = res.data.total
      })
    }
    const handleRoleChange = (val1, val2) => {
      setUserRoleAdmin({
        userId: val1.userId,
        role: val2
      })
    }
    const handleSizeChange = (val) => {
      console.log(`${val} items per page`)
      pageSize.value = val
      getUserList()
    }

    const handleCurrentChange = (val) => {
      console.log(`current page: ${val}`)
      currentPage.value = val
      getUserList()
    }
    return {
      userList,
      total,
      currentPage,
      pageSize,
      options,
      handleCurrentChange,
      handleSizeChange,
      handleRoleChange
    }
  }
}
</script>

<style>
</style>