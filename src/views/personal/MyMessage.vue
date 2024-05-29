<template>
  <el-menu :default-active="activeIndex"
           class="el-menu-demo"
           mode="horizontal"
           router>
    <el-menu-item index="/personal/manageMessage/myReplyToMeMsg">回复我的</el-menu-item>
    <el-menu-item index="/personal/manageMessage/mySystemMsg">系统消息</el-menu-item>
  </el-menu>
  <router-view></router-view>
</template>

<script>
export default {

}
</script>

<style>
</style>