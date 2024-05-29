<template>
  <div>
    <el-page-header title="发布视频"
                    icon=""
                    style="margin-bottom:30px" />
    <el-upload ref="upload"
               class="upload-demo"
               drag
               name="file"
               :action="uploadVideo"
               :headers="headers"
               :on-success="successHandle"
               :before-upload="beforeUploadHandle"
               :limit="1"
               accept=".mp4,.flv,.avi,.wmv,.mov,.webm,.mpeg4,.ts,.mpg,.rm,.rmvb,.mkv,.m4v">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        拖拽到这里 <em>或者 点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          支持.mp4,.flv,.avi,.wmv,.mov,.webm,.mpeg4,.ts,.mpg,.rm,.rmvb,.mkv,.m4v视频文件
        </div>
      </template>
    </el-upload>
    <div class="video-form">
      <el-form ref="videoForm"
               :model="videoFormData"
               :rules="rules"
               label-width="100px"
               class="video-form">
        <el-form-item label="视频标题"
                      prop="title">
          <el-input v-model="videoFormData.title"></el-input>
        </el-form-item>
        <el-form-item label="视频简介"
                      prop="description">
          <el-input type="textarea"
                    v-model="videoFormData.description"></el-input>
        </el-form-item>
        <el-form-item label="标签"
                      prop="tags">
          <el-input v-model="videoFormData.tags"></el-input>
        </el-form-item>
        <el-form-item label="类别"
                      prop="category">
          <el-input v-model="videoFormData.category"></el-input>
        </el-form-item>
        <el-form-item label="分区"
                      prop="type">
          <el-select v-model="videoFormData.type"
                     placeholder="请选择分区"
                     size="large"
                     style="width: 240px">
            <el-option v-for="item in type"
                       :key="item"
                       :label="item"
                       :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="validateBeforeSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script >
import { uploadVideo } from '@/request/baseUrl'
import { localGet } from '../../utils'
import { ref } from 'vue'
import { uploadVideoDetail } from '@/apis/video'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  name: 'MyVideoUpload',
  setup () {
    const headers = ref({
      'Authorization': localGet('Authorization'),
    })
    const videoForm = ref(null)
    const upload = ref(null)
    const uploading = ref(false)
    const type = ref([
      '游戏', '歌曲', '生活', '动画'
    ])
    const videoFormData = ref({
      title: '',
      description: '',
      tags: '',
      category: '',
      type: '',
      videoUrl: '',
      coverImageUrl: '',
      subtitleUrl: ''
    });
    const rules = ref({
      title: [
        { required: true, message: '请输入视频标题', trigger: 'blur' },
        { min: 3, message: '不能少于3个字符', trigger: 'blur' },
      ],
      description: [
        { required: true, message: '请输入视频描述', trigger: 'blur' },
        { min: 3, message: '不能少于3个字符', trigger: 'blur' },
      ],
      tags: [
        { required: true, message: '请输入视频标签', trigger: 'blur' },
        { min: 3, message: '不能少于3个字符', trigger: 'blur' },
      ],
      category: [
        { required: true, message: '请输入视频标题', trigger: 'blur' },
        { min: 3, message: '不能少于3个字符', trigger: 'blur' },
      ],
      type: [
        {
          required: true,
          message: '请选择分区',
          trigger: 'change',
        },
      ],
    })
    const successHandle = ((response, file, fileList) => {
      console.log(response)
      videoFormData.value.videoUrl = response.data.videoUrl
      videoFormData.value.coverImageUrl = response.data.coverImageUrl
      videoFormData.value.subtitleUrl = response.data.subtitleUrl
      uploading.value = false
    })
    const beforeUploadHandle = (file) => {
      if (uploading.value == false) {
        uploading.value = true
        return true
      } {
        ElMessage({
          message: '请不要重复上传视频',
          type: 'error',
          duration: 2000,
          offset: 100
        })
        return false
      }

    }
    const submitForm = () => {
      ElMessageBox.confirm('是否确认发布视频?', 'Confirmation', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 用户点击了确认按钮
        uploadVideoDetail(videoFormData.value)
          .then(response => {
            // 处理提交成功的响应
            ElMessage({
              message: '发布视频成功',
              type: 'success',
              duration: 2000,
              offset: 100
            })
            setTimeout(() => {
              window.location.reload
              videoFormData.value = {
                title: '',
                description: '',
                tags: '',
                category: '',
                type: '',
                videoUrl: '',
                coverImageUrl: '',
                subtitleUrl: ''
              }
            }, 500);
          })
          .catch(error => {
            // 处理提交失败的情况
            ElMessage({
              message: '发布失败',
              type: 'error',
              duration: 2000,
              offset: 100
            })
          });
      }).catch(() => {
        // 用户点击了取消按钮
        ElMessage({
          message: '取消发布',
          type: 'info',
          duration: 2000,
          offset: 100
        })
      });
    };

    const validateBeforeSubmit = () => {
      videoForm.value.validate((valid) => {
        if (valid && videoFormData.value.videoUrl != '') {//必须视频上传完成之后才能提交
          submitForm();
        } else {
          console.log('error submit!!');
          if (videoFormData.value.videoUrl == '') {
            ElMessage({
              message: '请在视频上传完成之后提交',
              type: 'info',
              duration: 2000,
              offset: 100
            })
          }
          return false;
        }
      });
    };

    return {
      uploadVideo,
      headers,
      successHandle,
      videoFormData,
      submitForm,
      rules,
      videoForm,
      type,
      validateBeforeSubmit,
      beforeUploadHandle
    }
  }
}
</script>

<style scoped>
.video-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.video-form .el-upload {
  margin-top: 10px;
}

.video-form .el-form-item__label {
  font-weight: bold;
}
</style>
