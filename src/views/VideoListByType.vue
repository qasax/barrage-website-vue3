<template>
  <div v-if="type">
    <video-list :type="type"></video-list>
  </div>
</template>

<script>
import VideoList from '@/components/VideoList.vue'
import { watch, ref } from 'vue'
export default {
  components: { VideoList },
  name: 'VideoListByType',
  component: {
    VideoList
  },
  props: {
    type: String
  },
  setup (props) {
    const type = ref(null)
    watch(() => props.type, () => {
      type.value = props.type
    }, { immediate: true })
    return {
      type
    }
  }
}
</script>

<style>
</style>