<template>
  <el-row class="msg-card-row"
          v-infinite-scroll="infiniteLoad"
          :infinite-scroll-disabled="disabled"
          infinite-scroll-distance="30"
          :infinite-scroll-immediate="false"
          v-if="systemMsgList.length > 0">
    <div v-for="msg in systemMsgList"
         :key="msg.messageId"
         class="card-container">
      <el-card class="msg-area"
               :body-style="{ padding: '16px',width : '650px' }">
        <div class="msg-header">
          <span class="msg-title">{{ msg.title }}</span>
          <div class="me-pull-right msg-time">
            <i class="el-icon-time"></i>&nbsp;收到时间: {{ timestampToDate(msg.timestamp) }}
          </div>
        </div>
        <div class="msg-description">
          {{ msg.content }}
        </div>
      </el-card>
    </div>
  </el-row>
  <el-empty v-else
            :image-size="250"
            description="没有系统消息"></el-empty>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getSystemMsg } from '@/apis/website'
import { timestampToDate } from '@/utils/index'
import { markSystemMsgAsRead } from '@/apis/user'

export default {
  name: 'MySystemMessages',
  setup () {
    const systemMsgList = ref([])
    const max = ref(new Date().getTime())
    const offset = ref(0)
    const disabled = ref(false)

    const getSystemMsgData = () => {
      disabled.value = true
      getSystemMsg({ max: max.value, offset: offset.value }).then((res) => {
        res.data.map(messageData => {
          systemMsgList.value.push(messageData)
        })
        offset.value = res.offset
        max.value = res.lastTime
        disabled.value = false
      })
    }

    const infiniteLoad = () => {
      getSystemMsgData()
    }

    onMounted(() => {
      getSystemMsgData()
      markSystemMsgAsRead()
    })

    return {
      infiniteLoad,
      systemMsgList,
      timestampToDate,
      disabled
    }
  }
}
</script>

<style>
.msg-header {
  padding-bottom: 10px;
}

.msg-title {
  font-weight: 600;
}

.msg-time {
  color: #a6a6a6;
  font-size: 13px;
}

.msg-description {
  font-size: 13px;
  line-height: 24px;
  margin-bottom: 10px;
}

.me-pull-right {
  float: right;
}

.no-msg {
  text-align: center;
  margin-top: 50px;
  font-size: 16px;
  color: #999;
}

.card-container {
  margin-bottom: 20px;
}
</style>
