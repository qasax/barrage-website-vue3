<template>
  <el-row class="mov-card-row"
          v-infinite-scroll="infiniteLoad"
          infinite-scroll-distance="0"
          :infinite-scroll-disabled="disabled"
          :infinite-scroll-immediate="false">
    <el-col v-for="item in videoList"
            :key="item.videoId"
            :xs="8"
            :sm="4"
            :md="4"
            class="mov-card">
      <router-link :to="'/VideoDetailPage/'+ item.videoId"
                   style="text-decoration: none;"
                   target="_blank">
        <el-card class="box-card"
                 shadow="hover"
                 :body-style="{ padding: '8px 5px' }">
          <div class="card-div">
            <img :src="getVideoPicByUrl + item.coverImageUrl"
                 style="width:270px;height:152px"
                 class="card-image" />
            <span class="card-remark">{{ item.description }}</span>
          </div>
          <div class="card-content">
            <span class="card-title">
              <el-tooltip effect="dark"
                          :content="item.title"
                          placement="bottom-end"
                          :show-after="1000">
                {{ item.title }}
              </el-tooltip>
            </span>
          </div>
        </el-card>
      </router-link>
    </el-col>
  </el-row>

  <el-backtop :right="50"
              :bottom="80" />
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { getPageVideoByType } from '@/apis/video'
import { getVideoPicByUrl } from '@/request/baseUrl'
export default {
  name: "VideoList",
  props: {
    type: String,
  },
  setup (props) {
    const store = useStore();
    const pageSize = ref(16)
    const pageNo = ref(1)
    const orderColumn = ref('upload_date')
    const sortOrder = ref('asc')
    const videoList = ref([])
    const disabled = ref(false)
    const getVideoList = () => {
      disabled.value = true
      const data = {
        pageSize: pageSize.value,
        pageNo: pageNo.value,
        orderColumn: orderColumn.value,
        sortOrder: sortOrder.value,
        type: props.type
      };
      getPageVideoByType(data).then(
        (res) => {
          res.data.list.map(video => {
            videoList.value.push(video)
          })
          pageNo.value++
          disabled.value = false
        }
      )
    };
    watch(() => props.type, () => {
      pageNo.value = 1
      videoList.value = []
      getVideoList()
    }, { immediate: true })

    const infiniteLoad = () => {
      getVideoList()
    }

    return {
      store,
      infiniteLoad,
      videoList,
      getVideoPicByUrl,
      disabled
    }
  }
};
</script>

<style scoped>
/* 移除不必要的样式 */
.search-type {
  margin-bottom: 20px;
}

.filter-title {
  margin: 5px 10px;
  font-size: 16px;
  font-weight: bold;
  line-height: 20px;
}

.filter-option {
  margin: 0 5px;
  padding: 5px 5px;
  line-height: 20px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.filter-option:hover {
  color: rgb(36, 184, 242);
}

.filter-option.active {
  background-color: rgb(36, 184, 242);
  color: white;
  border-radius: 4px;
}

.mov-card-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center; /* 居中对齐卡片 */
}

.mov-card {
  padding: 9px;
  width: 270px; /* 设置卡片宽度 */
}

.card-div {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 宽高比 */
  overflow: hidden;
  background-color: #ececec;
}

.card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-remark {
  position: absolute;
  right: 4px;
  bottom: 4px;
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 2px;
  font-size: 13px;
}

.card-content {
  padding: 0px;
}

.card-title {
  display: flex;
  align-items: center;
  margin-top: 4px;
  font-size: 15px;
  color: #777;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 80%;
}

.tips {
  font-size: smaller;
  color: #777;
  text-align: center;
  margin: 20px 0;
}
</style>

