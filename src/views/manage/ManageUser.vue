<template>
  <div v-if="userList.length>0">
    <el-page-header title="用户数据"
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
                       sortable="custom"
                       width="70"
                       fixed="left"></el-table-column>
      <el-table-column property="username"
                       label="用户名"
                       width="100" />
      <el-table-column property="gender"
                       label="性别"
                       width="100">
        <template #default="scope">
          <el-select v-model="scope.row.gender"
                     style="width: 70px">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column property="email"
                       label="邮箱"
                       width="200">
        <template #default="scope">
          <el-input v-model="scope.row.email"
                    style="width: 160px"></el-input>
        </template>
      </el-table-column>
      <el-table-column property="birthday"
                       label="生日"
                       width="200">
        <template #default="scope">
          <el-date-picker v-model="scope.row.birthday"
                          type="date"
                          placeholder="Pick a day"
                          style="width: 160px" />
        </template>
      </el-table-column>
      <el-table-column property="signature"
                       label="个性签名"
                       width="200">
        <template #default="scope">
          <el-input v-model="scope.row.signature"
                    style="width: 160px"></el-input>
        </template>
      </el-table-column>
      <el-table-column property="followCounts"
                       label="关注数"
                       width="180">
        <template #default="scope">
          <el-input v-model="scope.row.followCounts"
                    style="width: 120px"></el-input>
        </template>
      </el-table-column>
      <el-table-column property="fans"
                       label="粉丝数"
                       width="180">
        <template #default="scope">
          <el-input v-model="scope.row.fans"
                    style="width: 120px"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="330"
                       fixed="right">
        <template #default="scope">
          <el-button type="primary"
                     @click="submitChanges(scope.row)">提交修改</el-button>
          <el-button type="primary"
                     @click="resetPassword(scope.row)">重置密码</el-button>
          <el-button type="primary"
                     @click="removeUser(scope.row)">删除用户</el-button>
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
import { getPageUserListAdmin, updateUserInfoAdmin, deleteUserAdmin } from '@/apis/user'
import { resetPwd } from '@/apis/login'
import { onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  setup () {
    const pageSize = ref(10)
    const currentPage = ref(1)
    const orderColumn = ref('user_id')
    const sortOrder = ref('asc')
    const userList = ref([])
    const total = ref()
    const options = [{
      label: '男', value: 'Male'
    }, { label: '女', value: 'Female' }]
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
          updateUserInfoAdmin({
            userId: row.userId,
            gender: row.gender,
            email: row.email,
            birthday: row.birthday,
            signature: row.signature,
            followCounts: row.followCounts,
            fans: row.fans
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
    const resetPassword = (row) => {
      ElMessageBox.confirm(
        '用户:' + row.username + ',密码即将重置为“123456”,是否确认?',
        'Warning',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          resetPwd({
            userId: row.userId,
          }).then((res) => {
            ElMessage({
              type: 'success',
              message: '重置成功',
              offset: 100
            })
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消操作',
            offset: 100
          })
        })
    }
    const removeUser = (row) => {
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
          deleteUserAdmin({
            userId: row.userId,
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
      submitChanges,
      removeUser,
      resetPassword
    }
  }
}
</script>

<style>
</style>