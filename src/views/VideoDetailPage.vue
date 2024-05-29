<template>
  <div style="margin-left:100px;margin-right:50px">
    <video-detail :videoId="videoId" />
    <Comments :videoId="videoId"
              style="margin-top:50px"></Comments>
    <el-backtop :right="50"
                :bottom="80" />
  </div>
</template>

<script>
// 详情页
import VideoDetail from '../components/VideoDetail.vue'
import Comments from '../components/Comments.vue'
import { ref, onMounted } from 'vue'
export default {
  name: 'VideoDetailPage',
  props: {
    videoId: String
  },
  components: {
    VideoDetail,
    Comments
  },
  setup (props) {
    const videoId = ref()
    onMounted(() => {
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 10);

    })
    return {
      videoId: props.videoId,
    }
  }
}
</script>
