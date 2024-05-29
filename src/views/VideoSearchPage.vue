<template>
  <video-search-list :keyword="keyword" />
</template>

<script>
import { ref, watch } from 'vue'
import VideoSearchList from '@/components/VideoSearchList.vue'
export default {
  name: 'VideoSearchPage',
  props: {
    keyword: String
  },
  components: {
    VideoSearchList
  },
  setup (props) {
    const keyword = ref(null)
    watch(() => props.keyword, () => {
      keyword.value = props.keyword
    }, { immediate: true })

    return {
      keyword
    }
  }
}
</script>

<style>
</style>