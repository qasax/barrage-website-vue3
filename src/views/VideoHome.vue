<template>
  <div style="margin: 50px">
    <video-carousel />
    <VideoLimitCard videoType="动画" />
    <VideoLimitCard videoType="生活" />
    <VideoLimitCard videoType="游戏" />
    <VideoLimitCard videoType="歌曲" />
    <el-backtop :right="50"
                :bottom="80" />
  </div>
</template>

<script>
// 首页
import VideoCarousel from '../components/VideoCarousel.vue'
import VideoLimitCard from '../components/VideoLimitCard.vue'

export default {
  name: 'VideoHome',
  components: {
    VideoLimitCard,
    VideoCarousel
  }
}
</script>
