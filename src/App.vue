<template>
  <el-container>
    <el-header style="margin:0;padding:0">
      <Header></Header>
    </el-header>
    <el-main style="overflow: hidden;">
      <Main></Main>
    </el-main>

  </el-container>
</template>

<script>
import Header from './components/Header.vue'
import FooterVue from './components/Footer.vue'
import Main from './components/Main.vue'

export default {
  name: 'App',
  components: {
    Header,
    Main,
    FooterVue,
  },
  setup () {
  },
  computed: {
    key () {
      // 只要保证 key 唯一性就可以了，保证不同页面的 key 不相同
      // console.log(this.$route.fullPath);
      return this.$route.fullPath
    }
  },
}
</script>
<style scoped>
.el-header {
  position: sticky;
  top: 0;
  z-index: 9999;
}
.el-main {
  margin: 0;
  padding: 0;
}
</style>
