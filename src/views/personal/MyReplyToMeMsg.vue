<template>
  <el-row class="msg-card-row"
          v-infinite-scroll="infiniteLoad"
          :infinite-scroll-disabled="disabled"
          infinite-scroll-distance="30"
          :infinite-scroll-immediate="false"
          v-if="replyToMeMsgList.length > 0">
    <div v-for="msg in replyToMeMsgList"
         :key="msg.messageId"
         class="card-container">
      <router-link :to="'/VideoDetailPage/'+ msg.comment.videoId"
                   style="text-decoration: none;color:black"
                   target="_blank">
        <el-card class="msg-area"
                 :body-style="{ padding: '16px',width : '650px' }">
          <div class="msg-header">
            <router-link :to="'/others/'+ msg.fromUserDetail.userId"
                         style="text-decoration: none;color: black;"
                         target="_blank">
              <el-avatar class="avatar"
                         :src="getAvatarByUserId + msg.fromUserId"
                         style="margin-top:10px"></el-avatar>
              <div class="name">{{ msg.fromUserDetail.username }}
                : 回复@
                <router-link :to="'/others/'+ msg.toUserDetail.userId"
                             style="text-decoration: none;color: black;"
                             target="_blank">{{ msg.toUserDetail.username }}
                </router-link>
              </div>
            </router-link>
            <div class="me-pull-right msg-time">
              <i class="el-icon-time"></i>&nbsp;收到时间: {{ timestampToDate(msg.timestamp) }}
            </div>
          </div>
          <div class="msg-description">
            {{ msg.content }}
          </div>
        </el-card>
      </router-link>
    </div>
  </el-row>
  <el-empty v-else
            :image-size="250"
            description="没有回复我的消息"></el-empty>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getReplyToMeMsg } from '@/apis/commentReply'
import { timestampToDate } from '@/utils/index'
import { markReplyToMeAsRead } from '@/apis/user'
import { getAvatarByUserId } from '@/request/baseUrl'
import { useRouter } from 'vue-router'
export default {
  name: 'MySystemMessages',
  setup () {
    const replyToMeMsgList = ref([])
    const max = ref(new Date().getTime())
    const offset = ref(0)
    const disabled = ref(false)
    const router = useRouter()
    const getReplyToMeMsgData = () => {
      disabled.value = true
      getReplyToMeMsg({ max: max.value, offset: offset.value }).then((res) => {
        res.data.map(messageData => {
          replyToMeMsgList.value.push(messageData)
        })
        offset.value = res.offset
        max.value = res.lastTime
        disabled.value = false
      })
    }

    const infiniteLoad = () => {
      getReplyToMeMsgData()
    }

    onMounted(() => {
      getReplyToMeMsgData()
      markReplyToMeAsRead()
    })

    return {
      infiniteLoad,
      replyToMeMsgList,
      timestampToDate,
      disabled,
      getAvatarByUserId,
      router
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
