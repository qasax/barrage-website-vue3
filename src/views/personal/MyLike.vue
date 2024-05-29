<template>
  <el-page-header title="我的点赞"
                  icon=""
                  style="margin-bottom:30px" />
  <div>
    <el-menu :default-active="activeIndex"
             class="el-menu-demo"
             mode="horizontal">
      <el-menu-item index="1"
                    @click="handleButtonClick('video')">视频点赞</el-menu-item>
      <el-menu-item index="2"
                    @click="handleButtonClick('comment')">评论点赞</el-menu-item>
      <el-menu-item index="3"
                    @click="handleButtonClick('reply')">回复点赞</el-menu-item>
    </el-menu>
    <like-item :LikeName='type'></like-item>
  </div>
</template>

<script>
import LikeItem from '@/components/LikeItem.vue'
import { ref } from 'vue'
export default {
  components: { LikeItem },
  name: 'MyLike',
  component: {
    LikeItem
  },
  setup () {
    const type = ref('video')
    const handleButtonClick = (val) => {
      type.value = val
    }
    return {
      handleButtonClick,
      type
    }
  }
}
</script>
<style>
</style>