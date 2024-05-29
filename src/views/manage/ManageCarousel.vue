<template>
  <div>
    <el-page-header title="走马灯管理"
                    icon="">
    </el-page-header>
    <el-upload v-model:file-list="carouselList"
               :action="uploadCarousel"
               list-type="picture-card"
               :headers="headers"
               :on-preview="handlePictureCardPreview"
               :on-remove="handleRemove">
      <el-icon>
        <Plus />
      </el-icon>
    </el-upload>

    <el-dialog v-model="dialogVisible"
               style="width:800px;height:450px">
      <img :src="dialogImageUrl"
           alt="预览"
           style="width:640px;height:360px;margin:auto" />
    </el-dialog>
  </div>
</template>

<script>
import { getCarouselFileName, deleteCarousel } from '@/apis/website'
import { uploadCarousel, getCarouselImg } from '@/request/baseUrl'
import { onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { localGet } from '@/utils/index'
export default {
  setup () {
    const carouselList = ref([])
    const headers = ref({
      'Authorization': localGet('Authorization'),
    })
    const dialogImageUrl = ref('')
    const dialogVisible = ref(false)
    onMounted(() => {
      getCarouselList()
    })
    const getCarouselList = () => {
      getCarouselFileName().then((res) => {
        res.data.map(carousel => {
          carouselList.value.push({
            name: carousel,
            url: getCarouselImg + carousel,
          })
        })
      })
    }
    const handlePictureCardPreview = (uploadFile) => {
      dialogImageUrl.value = uploadFile.url
      dialogVisible.value = true
    }


    const handleRemove = (uploadFile) => {
      ElMessageBox.confirm(
        '将删除图片，是否确认?',
        'Warning',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          deleteCarousel({
            carouseFileName: uploadFile.name,
          }).then((res) => {
            ElMessage({
              type: 'success',
              message: '删除成功',
              offset: 100
            })
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
    return {
      carouselList,
      uploadCarousel,
      headers,
      handlePictureCardPreview,
      handleRemove,
      dialogVisible,
      dialogImageUrl
    }
  }
}
</script>

<style>
</style>