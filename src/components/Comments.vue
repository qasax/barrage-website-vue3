<!--评论模块-->
<template>
  <div>
    <div style="width:900px">
      <el-input class="gray-bg-input"
                v-model="inputComment"
                type="textarea"
                :rows="3"
                autofocus
                placeholder="写下你的评论">
      </el-input>
      <div class="btn-control"
           style="margin-top:10px">
        <el-button class="btn"
                   type="success"
                   round
                   style="float:right"
                   @click="CommentVideo">发布</el-button>
      </div>
    </div>

    <div class="container"
         style="margin-top:50px;width:900px"
         v-if="commentData.length>0">
      <ul v-infinite-scroll="infiniteLoad"
          infinite-scroll-distance="20"
          :infinite-scroll-immediate="true">
        <li class="comment"
            v-for="item in commentData"
            :key="item.commentId">
          <div class="info">
            <el-avatar class="avatar"
                       :src="item.senderUserId === store.state.videoWeb.avatarSrc?item.senderUserId:(getAvatarByUserId+item.senderUserId)"
                       style="margin-top:10px">
            </el-avatar>
            <div class="right">
              <div class="name">{{item.senderUserDetail.username}}</div>
              <div class="date">{{item.timestamp==='刚刚'?'刚刚': timestampToDate(item.timestamp)}}</div>
            </div>
          </div>
          <div class="content">{{item.content}}</div>
          <div class="control">
            <span class="like"
                  :class="{active: item.isLike}"
                  @click="likeClick(item)">
              <i class="iconfont icon-like"></i>
              <span class="like-num">{{item.likes > 0 ? item.likes + '人赞' : '赞'}}</span>
            </span>
            <span class="comment-reply"
                  @click="showCommentInput(item)">
              <i class="iconfont icon-comment"></i>
              <span>回复</span>
            </span>
          </div>
          <!-- 评论框 -->
          <div class="reply">
            <transition name="fade"
                        v-if="showReplyComment ===item">
              <div class="input-wrapper">
                <el-input class="gray-bg-input"
                          v-model="replyComent"
                          type="textarea"
                          :rows="3"
                          autofocus
                          :placeholder="placeholder">
                </el-input>
                <div class="btn-control">
                  <span class="cancel"
                        @click="cancel">取消</span>
                  <el-button class="btn"
                             type="success"
                             round
                             @click="commitComment(item)">确定</el-button>
                </div>
              </div>
            </transition>
          </div>
          <div class="reply">
            <div class="item"
                 v-for="reply in item.commentRepliesEntities"
                 :key="reply.replyId">
              <div class="reply-content">
                <el-avatar class="avatar"
                           :src=" reply.fromUserId===store.state.videoWeb.avatarSrc?reply.fromUserId:(getAvatarByUserId+reply.fromUserId)"
                           style="margin-top:10px">
                </el-avatar>
                <span class="from-name">{{reply.fromUserDetail.username}}</span><span>: </span>
                <span class="to-name">回复 @{{reply.toUserDetail.username}}</span>
                <span>{{reply.content}}</span>
              </div>
              <div class="reply-bottom">
                <span>{{reply.timestamp==='刚刚'?'刚刚': timestampToDate(reply.timestamp)}}</span>
                <div class="control">
                  <span class="like"
                        :class="{active: reply.isLike}"
                        @click="likeClick(item,reply)">
                    <i class="iconfont icon-like"></i>
                    <span class="like-num">{{reply.likes > 0 ? reply.likes + '人赞' : '赞'}}</span>
                  </span>
                </div>
                <span class="reply-text"
                      @click="showCommentInput(item, reply)">
                  <i class="iconfont icon-comment"></i>
                  <span>回复</span>
                </span>
              </div>
              <!-- 评论框 -->
              <transition name="fade"
                          v-if="showReplyComment ===reply">
                <div class="input-wrapper">
                  <el-input class="gray-bg-input"
                            v-model="replyComent"
                            type="textarea"
                            :rows="3"
                            autofocus
                            :placeholder="placeholder">
                  </el-input>
                  <div class="btn-control">
                    <span class="cancel"
                          @click="cancel">取消</span>
                    <el-button class="btn"
                               type="success"
                               round
                               @click="commitComment(item,reply)">确定</el-button>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'; // 导入 ref 函数
import { timestampToDate } from '../utils/index'
import { getPageComment } from '../apis/comment'
import { getAvatarByUserId } from '@/request/baseUrl'
import { sendCommentByVideo } from '@/apis/comment'
import { replyCommentByVideo } from '@/apis/commentReply'
import { addLike, subLike, isCommentLike, isReplyLike } from '@/apis/like'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
export default {
  props: {
    videoId: String,
  },
  setup (props) {
    // 使用 ref 创建响应式变量
    const inputComment = ref('');//视频评论框
    const replyComent = ref('')//评论回复框
    const placeholder = ref('')//评论回复的placehoder
    const showReplyComment = ref()//判断是 对视频评论回复 还是 对他人对视频评论的回复进行恢复
    const commentData = ref([]);//全部评论数据
    const pageSize = ref(1)
    const pageNo = ref(1)
    const orderColumn = ref('timestamp')
    const sortOrder = ref('asc')
    const store = useStore()
    //滑动加载
    function infiniteLoad () {
      getPageComment({
        videoId: props.videoId,
        pageSize: pageSize.value,
        pageNo: pageNo.value,
        orderColumn: orderColumn.value,
        sortOrder: sortOrder.value,
      }).then(res => {
        return getCommentAndRepliesLikes(res.data.list);
      }).then(comments => {
        commentData.value.push(...comments);
        pageNo.value++;
      }).catch(error => {
        console.error("Error loading comments:", error);
      });
    }
    onMounted(() => {
      infiniteLoad()
    })
    // 获取评论和回复的点赞状态
    function getCommentAndRepliesLikes (comments) {
      const commentPromises = comments.map(
        comment => {
          const replyPromises = comment.commentRepliesEntities.map(reply => {
            return isReplyLike({ replyId: reply.replyId }).then(res => res.data === "true");
          });
          return Promise.all(replyPromises).then(likes => {
            likes.forEach((like, index) => {
              comment.commentRepliesEntities[index].isLike = like;
            });
            return isCommentLike({ commentId: comment.commentId }).then(res => res.data === "true");
          }).then(like => {
            comment.isLike = like;
            return comment;
          });
        });
      return Promise.all(commentPromises);
    }
    //给视频评论
    const CommentVideo = () => {
      if (inputComment.value.length >= 10) {
        sendCommentByVideo({
          videoId: props.videoId,
          content: inputComment.value
        }).then(() => {
          ElMessage({
            message: '评论成功！',
            type: 'success',
            offset: 100
          })
          //实时添加展示效果
          commentData.value.push(
            {
              commentId: 0,
              likes: '0',
              timestamp: '刚刚',
              content: inputComment.value,
              senderUserId: store.state.videoWeb.avatarSrc,
              senderUserDetail: {
                username: '你'
              }
            })
          inputComment.value = ''
        })
      } else {
        ElMessage({
          message: '评论不能少于10个字符！',
          type: 'warning',
          offset: 100
        })
      }
    }
    // 回复评论方法
    const commitComment = (item, reply) => {
      if (replyComent.value.length >= 10) {
        if (reply) {//判断是否为--回复视频下的评论的评论
          replyCommentByVideo({
            commentId: item.commentId,
            toUserId: reply.fromUserId,
            content: replyComent.value
          }).then(() => {
            ElMessage({
              message: '回复成功！',
              type: 'success',
              offset: 100
            })
            //实时添加展示效果
            item.commentRepliesEntities.push({
              likes: '0',
              timestamp: '刚刚',
              content: replyComent.value,
              fromUserId: store.state.videoWeb.avatarSrc,
              fromUserDetail: {
                username: '你'
              },
              toUserDetail: {
                username: reply.fromUserDetail.username
              }
            })
            showReplyComment.value = false
            replyComent.value = ''
          })
        } else {
          replyCommentByVideo({
            commentId: item.commentId,
            toUserId: item.senderUserId,
            content: replyComent.value
          }).then(() => {
            ElMessage({
              message: '评论成功！',
              type: 'success',
              offset: 100
            })
            //实时添加展示效果
            item.commentRepliesEntities.push({
              likes: '0',
              timestamp: '刚刚',
              content: replyComent.value,
              fromUserId: store.state.videoWeb.avatarSrc,
              fromUserDetail: {
                username: '你'
              },
              toUserDetail: {
                username: item.senderUserDetail.username
              }
            })
            showReplyComment.value = false
            replyComent.value = ''
          })
        }
      } else {
        ElMessage({
          message: '评论不能少于10个字符！',
          type: 'warning',
          offset: 100
        })
      }
    };

    // 显示评论输入框方法
    const showCommentInput = (item, reply) => {
      if (reply) {//是否为---回复评论下其他用户的评论
        placeholder.value = "回复  @" + reply.fromUserDetail.username + ":";
        showReplyComment.value = reply;//控制显示 回复文本框
      } else {
        placeholder.value = "回复  @" + item.senderUserDetail.username + ":";
        showReplyComment.value = item;
      }
    };

    // 点赞方法
    const likeClick = (item, reply) => {
      if (reply) {
        if (reply.isLike === true) {
          subLike({ actionObject: 'reply', actionObjectId: reply.replyId })
          reply.likes--
          reply.isLike = false
        } else {
          addLike({ actionObject: 'reply', actionObjectId: reply.replyId })
          reply.likes++
          reply.isLike = true
        }
      } else {
        if (item.isLike === true) {
          subLike({ actionObject: 'comment', actionObjectId: item.commentId })
          item.likes--
          item.isLike = false
        } else {
          addLike({ actionObject: 'comment', actionObjectId: item.commentId })
          item.likes++
          item.isLike = true
        }
      }
    };

    // 取消方法
    const cancel = () => {
      showReplyComment.value = false;
    };
    // 返回需要在模板中使用的变量和方法
    return {
      inputComment,
      replyComent,
      likeClick,
      cancel,
      commitComment,
      showCommentInput,
      timestampToDate,
      commentData,
      getAvatarByUserId,
      infiniteLoad,
      pageNo,
      CommentVideo,
      showReplyComment,
      placeholder,
      store
    };
  }
};

</script>

<style scoped lang="scss">
@import "../../public/scss/index";

.container {
  padding: 0 10px;
  box-sizing: border-box;
  .comment {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-bottom: 1px solid $border-fourth;
    .info {
      display: flex;
      align-items: center;
      .avatar {
        border-radius: 50%;
      }
      .right {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        .name {
          font-size: 16px;
          color: $text-main;
          margin-bottom: 5px;
          font-weight: 500;
        }
        .date {
          font-size: 12px;
          color: $text-minor;
        }
      }
    }
    .content {
      font-size: 16px;
      color: $text-main;
      line-height: 20px;
      padding: 10px 0;
    }
    .control {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: $text-minor;
      .like {
        display: flex;
        align-items: center;
        margin-right: 20px;
        cursor: pointer;
        &.active,
        &:hover {
          color: $color-main;
        }
        .iconfont {
          font-size: 14px;
          margin-right: 5px;
        }
      }
      .comment-reply {
        display: flex;
        align-items: center;
        cursor: pointer;
        &:hover {
          color: $text-333;
        }
        .iconfont {
          font-size: 16px;
          margin-right: 5px;
        }
      }
    }
    .reply {
      margin: 10px 0;
      border-left: 2px solid $border-first;
      .item {
        margin: 0 10px;
        padding: 10px 0;
        border-bottom: 1px dashed $border-third;
        .reply-content {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: $text-main;
          .from-name {
            color: $color-main;
          }
          .to-name {
            color: $color-main;
            margin-left: 5px;
            margin-right: 5px;
          }
        }
        .reply-bottom {
          display: flex;
          align-items: center;
          margin-top: 6px;
          font-size: 12px;
          color: $text-minor;
          .reply-text {
            display: flex;
            align-items: center;
            margin-left: 10px;
            cursor: pointer;
            &:hover {
              color: $text-333;
            }
            .icon-comment {
              margin-right: 5px;
            }
          }
        }
      }
      .write-reply {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: $text-minor;
        padding: 10px;
        cursor: pointer;
        &:hover {
          color: $text-main;
        }
        .el-icon-edit {
          margin-right: 5px;
        }
      }
      .fade-enter-active,
      fade-leave-active {
        transition: opacity 0.5s;
      }
      .fade-enter,
      .fade-leave-to {
        opacity: 0;
      }
      .input-wrapper {
        padding: 10px;
        .gray-bg-input,
        .el-input__inner {
          background-color: #67c23a;
        }
        .btn-control {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding-top: 10px;
          .cancel {
            font-size: 16px;
            color: $text-normal;
            margin-right: 20px;
            cursor: pointer;
            &:hover {
              color: $text-333;
            }
          }
          .confirm {
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>
