// dplayer.vue
 
<template>
  <div>
    <div id="dplayer"
         style="width:960px;height:540px;position: relative;margin-top:30px;ius: 15px;border: 4px solid #e0e0e0; border-radius: 15px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);"></div>
  </div>
</template>
 
<script>
import DPlayer from 'dplayer'
import { onMounted, reactive, ref, watch } from 'vue'
import { baseURL, getVideoByUrl, getVideoPicByUrl, getSubtitleByUrl } from '@/request/baseUrl'
import { localGet } from '../utils'
import { viewsPlus } from '@/apis/video'
export default {
  name: 'dplayer',
  props: {
    dplayerData: Object,
  },
  setup (props) {
    const info = reactive({ video: '', pic: '' });
    const dp = ref(null); // 使用ref来存储DPlayer实例  
    const videoDuration = ref(0)
    onMounted(async () => {
      //await fetchVideoBlob()
      //console.log(info.video)
      dp.value = new DPlayer({
        container: document.getElementById('dplayer'),
        autoplay: false,
        hotkey: true,
        theme: '#FADFA3',
        loop: true,
        lang: 'zh-cn',
        screenshot: true,
        hotkey: true,
        preload: 'auto',
        volume: 0.7,
        mutex: true,
        unlimited: false,
        video: {
          url: getVideoByUrl + props.dplayerData.videoUrl,// "http://localhost:9960/website/video/Movie1.mp4",
          pic: getVideoPicByUrl + props.dplayerData.coverImageUrl,
          type: 'auto',
        },
        danmaku: {
          id: props.dplayerData.videoId,//储存视频id
          api: baseURL + '/barrage/',
          token: localGet('Authorization'),
          maximum: 1000,
          bottom: '15%',
          unlimited: true,
          speedRate: 0.5,
        },
        subtitle: {
          url: getSubtitleByUrl + props.dplayerData.subtitleUrl,//props.dplayerData.subtitleUrl,
          type: 'webvtt',
          fontSize: '20px',
          bottom: '40px',
          color: '#fff'
        }
      })
      setTimeout(() => {
        videoDuration.value = dp.value.video.duration
      }, 3000)
    })
    watch(videoDuration, () => {
      setTimeout(() => {
        plusVideoView()
      }, videoDuration.value * 700);
    })
    function plusVideoView () {
      viewsPlus({
        videoId: props.dplayerData.videoId
      })
    }
    // 切换视频源事件
    function switchVideo (item) {
      dp.value.switchVideo({
        url: item.video,
        pic: item.imgUrl,
      })
    }
    // 暂停事件
    function pause () {
      dp.value.pause()
    }
    return {
      videoDuration
    }
  },
}
</script>
 
<style lang="less">
/*.dplayer-menu {
  height: 0 !important;
  width: 0 !important;
} 去除右键菜单*/
//解决弹幕显示bug
.dplayer-danmaku {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  font-size: 22px;
  color: #fff;
  .dplayer-danmaku-item {
    display: inline-block;
    pointer-events: none;
    user-select: none;
    cursor: default;
    white-space: nowrap;
    text-shadow: 0.5px 0.5px 0.5px rgba(0, 0, 0, 0.5);
    &--demo {
      position: absolute;
      visibility: hidden;
    }
  }
  .dplayer-danmaku-right {
    position: absolute;
    right: 0;
    transform: translateX(100%);
    &.dplayer-danmaku-move {
      will-change: transform;
      animation-name: danmaku;
      animation-timing-function: linear;
      animation-play-state: paused;
    }
  }
  @keyframes danmaku {
    from {
      transform: translateX(100%);
    }
  }
  .dplayer-danmaku-top,
  .dplayer-danmaku-bottom {
    position: absolute;
    width: 100%;
    text-align: center;
    visibility: hidden;
    &.dplayer-danmaku-move {
      will-change: visibility;
      animation-name: danmaku-center;
      animation-timing-function: linear;
      animation-play-state: paused;
    }
  }
  @keyframes danmaku-center {
    from {
      visibility: visible;
    }
    to {
      visibility: visible;
    }
  }
}
</style>