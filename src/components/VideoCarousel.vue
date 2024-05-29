<template>
  <el-carousel height="400px"
               style="margin: 0 auto; width: 90%; border-radius: 4px"
               indicator-position="outside">
    <el-carousel-item v-for="img in carouselList"
                      :key="img">
      <img :src="getCarouselImg+img"
           style="width: 100%">
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import { getCarouselFileName } from '@/apis/website'
import { getCarouselImg } from '@/request/baseUrl'
import { ref, onMounted } from 'vue'
export default {
  name: "BigImg",
  setup () {
    const carouselList = ref([])
    onMounted(() => {
      getCarouselList()
    })
    const getCarouselList = () => {
      getCarouselFileName().then((res) => {
        carouselList.value = res.data
      })
    }
    return {
      carouselList,
      getCarouselImg,
    }
  }
};
</script>

<style scoped>
.el-carousel__item:nth-child(2n) {
  background-color: white;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: white;
}
</style>
