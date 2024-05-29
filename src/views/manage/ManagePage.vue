<template>
  <el-container>
    <el-aside width="200px">
      <el-menu class="el-menu-demo"
               @select="handleMenuSelect"
               router>
        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <location />
            </el-icon>
            <span>网站管理</span>
          </template>
          <el-menu-item index="/managePage/manageCarousel">走马灯管理</el-menu-item>
          <el-menu-item index="/managePage/manageSysMsg">系统消息管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon>
              <location />
            </el-icon>
            <span>数据管理</span>
          </template>
          <el-menu-item index="/managePage/manageVideo">视频数据</el-menu-item>
          <el-menu-item index="/managePage/manageBarrage">弹幕数据</el-menu-item>
          <el-menu-item index="/managePage/manageComment">评论数据</el-menu-item>
          <el-menu-item index="/managePage/manageReply">回复数据</el-menu-item>
          <el-menu-item index="/managePage/ManageUser">用户数据</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <el-icon>
              <setting />
            </el-icon>
            <span>角色管理</span>
          </template>
          <el-menu-item index="/managePage/ManageRole">用户授权</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'Main',
  data () {
    return {
      defaultActive: '1-1' // 默认选中的菜单项
    };
  },
  methods: {
    handleMenuSelect (index) {
      // 处理菜单选中事件，可以在这里进行页面跳转或其他操作
      console.log('选中的菜单项:', index);
    }
  }
};
</script>

<style scoped>
.el-menu-vertical-demo {
  width: 100%;
  min-height: 100%;
}
.el-aside {
  margin: 0;
  padding: 0;
}
.el-menu {
  margin: 0;
  padding: 0;
}
</style>
