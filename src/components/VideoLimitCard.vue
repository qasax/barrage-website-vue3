<template>
  <div class="home-card"
       v-show="contentshow">
    <el-row style="margin: 15px 0 0 0">
      <span class="home-card-type">{{videoType}}</span>
      <router-link :to="'/VideoListByType/'+videoType"
                   class="home-card-type"
                   style="text-decoration: none; color:black;">
        &nbsp; 更多>
      </router-link>
    </el-row>

    <!-- <el-divider style="margin: 0;"/> -->
    <el-row alignment="flex-start">
      <el-col v-for="o in videoList"
              :key="o.videoId"
              :xs="8"
              :sm="4"
              :md="4"
              style="padding: 9px;">
        <router-link :to="'/VideoDetailPage/'+o.videoId"
                     style="text-decoration: none;"
                     target="_blank"><!--encodeURIComponent(JSON.stringify(o)) -->
          <el-card class="box-card"
                   @click="selectMovie"
                   shadow="hover"
                   :body-style="{ padding: '8px 5px' }">
            <div class="card-div">
              <img :src="getVideoPicByUrl + o.coverImageUrl"
                   class="card-image"
                   style="width:270px;height:152px">
              <span class="card-remark">{{ o.description }}</span>
            </div>

            <div style="padding: 0px;">

              <span style="line-height: 26px; font-size: 15px; color:#777; display: flex; margin-top: 4px; text-overflow: ellipsis; overflow: hidden; width: 80%; white-space: nowrap;">
                <el-tooltip class="box-item"
                            effect="dark"
                            :content="o.title"
                            placement="bottom-end"
                            :show-after="1000">
                  {{ o.title }}
                </el-tooltip>
              </span>
              <!-- <div class="bottom">
            <p style="font-size:smaller; color:#777; margin: 4px 0">{{ o.vod_remarks }}</p>
          </div> -->
            </div>

          </el-card>
        </router-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 有限展示视频卡片列表
import { getPageVideoByType } from '../apis/video'
import { useStore } from 'vuex'
import { ref, onMounted } from 'vue';
import { getVideoPicByUrl } from '@/request/baseUrl';
export default {
  name: "VideoLimitCard",
  components: {
  },
  props: ['videoType'],
  setup (props) {
    const store = useStore();
    const page = ref(1);
    const contentshow = ref(true);
    const videoList = ref([]);
    const videoType = props.videoType
    const selectMovie = (h) => {
      console.log(h);
    };

    const getVideoList = () => {
      const data = {
        pageSize: 8,
        pageNo: 1,
        orderColumn: 'upload_date',
        sortOrder: 'asc',
        type: props.videoType
      };

      getPageVideoByType(data).then(
        (res) => {
          videoList.value = res.data.list
        }
      ).catch(
        () => {
          contentshow.value = false;
        }
      );
    };

    onMounted(() => {
      getVideoList();
    });

    return {
      store,
      page,
      contentshow,
      videoList,
      selectMovie,
      getVideoList,
      videoType,
      getVideoPicByUrl
    };
  }
};
</script>


<style>
span.home-card-type {
  float: left;
  margin: 10px;
  font-size: 20px;
  font-weight: bold;
  line-height: 20px;
}

.home-card-type {
  float: left;
  margin: 10px;
  line-height: 20px;
}

a.home-card-type:hover {
  color: rgb(36, 184, 242) !important;
}
</style>
