<template>
  <el-page-header v-if="fanOrFollow==='fan'"
                  title="用户粉丝"
                  icon=""
                  style="margin-bottom:30px">
  </el-page-header>
  <el-page-header v-if="fanOrFollow==='follow'"
                  title="用户关注"
                  icon=""
                  style="margin-bottom:30px">
  </el-page-header>
  <div class="fanorfollow_box"
       v-if="fanOrFollowData.length>0">
    <div class="fanorfollow"
         v-for="item in fanOrFollowData"
         :key="item.followId">
      <router-link :to="'/others/'+ item.user.userId"
                   style="text-decoration: none;"
                   target="_blank">
        <div class="fanorfollow_left">
          <img class="fanorfollow_img"
               :src="getAvatarByUserId+item.user.userId" />
        </div>
      </router-link>
      <div class="fanorfollow_info">
        <div class="fanorfollow_info_top">
          <span style="color: #666; max-width: 180px">{{ item.user.username }}</span>
        </div>
        <div class="fanorfollow_info_bottom">
          <span>{{ item.user.signature }}</span>
        </div>
      </div>
      <div class="fanorfollow_botton">
        <el-button @click="follow(item)"
                   type="primary"
                   size="small"
                   round
                   icon="el-icon-check">{{item.isFollowUser? '已关注' : '关注'}}</el-button>
      </div>
    </div>
    <div class="demo-pagination-block"
         v-if="fanOrFollowData.length != 0">
      <el-pagination background
                     v-model:current-page="currentPage"
                     v-model:page-size="pageSize"
                     :page-sizes="[5, 10, 15, 20]"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     style="margin-top:30px;margin-left:100px" />
    </div>

  </div>

  <div>
    <el-empty v-if="fanOrFollowData.length==0"
              :image-size="250"
              description="这里什么都没有哟"></el-empty>
  </div>
</template>
 
<script>
import { onMounted, ref, watch } from 'vue';
import { useRouter } from "vue-router";
import { getUserPageFollow, getUserPageFans, isFollowUser } from '@/apis/userFollow'
import { getAvatarByUserId } from '@/request/baseUrl';
import { deleteFollow, addFollow } from '@/apis/userFollow'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  name: "UserFanAndFollow",
  props: {
    fanOrFollow: String,
    userId: String
  },
  setup (props) {
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref()
    const router = useRouter()
    const fanOrFollowData = ref([])

    const getFansOrFollow = () => {
      if (props.fanOrFollow === 'follow') {
        getUserPageFollow({
          pageSize: pageSize.value,
          pageNo: currentPage.value,
          orderColumn: "follow_date",
          sortOrder: "desc",
          userId: props.userId
        }).then((res) => {
          fanOrFollowData.value = res.data.list
          currentPage.value = res.data.pageNum
          total.value = res.data.total
          fanOrFollowData.value = res.data.list;
          fanOrFollowData.value.forEach(item => {
            item.isFollowUser = true;
          });
        })
      } else {
        getUserPageFans({
          pageSize: pageSize.value,
          pageNo: currentPage.value,
          orderColumn: "follow_date",
          sortOrder: "desc",
          userId: props.userId
        }).then(async (res) => {
          // 获取数据列表
          const data = res.data.list;
          // 为每个用户添加 isFollow 属性
          const userPromises = data.map(async (item) => {
            // 获取是否关注用户的状态
            const followRes = await isFollowUser({
              followingUserId: item.user.userId
            });
            // 返回带有 isFollow 属性的用户对象
            return {
              ...item,
              isFollowUser: followRes.data === 'true'
            };
          });
          // 等待所有的异步操作完成
          fanOrFollowData.value = await Promise.all(userPromises);
          currentPage.value = res.data.pageNum;
          total.value = res.data.total;
        }).catch((error) => {
          console.error('Error fetching page fans:', error);
        })
      }
    }
    watch(() => props.fanOrFollow, () => {
      getFansOrFollow();
    }, { immediate: true });

    const follow = (item) => {
      ElMessageBox.confirm(
        '是否' + (item.isFollowUser == true ? '取消关注用户?' : '关注用户?'),
        '消息',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'info',
        }
      )
        .then(() => {
          if (item.isFollowUser === true) {
            deleteFollow({
              followingUserId: item.user.userId
            }).then(res => {
              item.isFollowUser = !item.isFollowUser
              ElMessage({
                type: 'success',
                message: '取消关注成功',
                offset: 100
              })
            })
          } else {
            addFollow({
              followingUserId: item.user.userId
            }).then(res => {
              item.isFollowUser = !item.isFollowUser
              ElMessage({
                type: 'success',
                message: '关注成功',
                offset: 100
              })
            })
          }
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '操作取消',
          })
        })
    }
    const handleSizeChange = (val) => {
      console.log(`${val} items per page`)
      pageSize.value = val
      getFansOrFollow()
    }
    const handleCurrentChange = (val) => {
      console.log(`current page: ${val}`)
      currentPage.value = val
      getFansOrFollow()
    }
    return {
      currentPage,
      total,
      pageSize,
      fanOrFollowData,
      handleSizeChange,
      handleCurrentChange,
      getAvatarByUserId,
      follow
    }
  }
};
</script>

<style>
.fanorfollow_box :hover {
  border-width: 1px;
  border-color: deepskyblue;
}
.fanorfollow {
  padding: 15px 40px 15px 30px;
  height: 50px;
  display: flex;
  align-items: center;
  border: 1px solid #ebebeb;
}
.fanorfollow :hover {
  border-width: 1px;
  border-color: deepskyblue;
}
.fanorfollow_left {
  width: 60px;
  height: 60px;
}
.fanorfollow_img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid #ebebeb;
  vertical-align: top;
}
.fanorfollow_info {
  display: inline-block;
  margin-left: 20px;
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  overflow: hidden;
}
.fanorfollow_info_top {
  display: inline-block;
  font-size: 10;
  line-height: 14px;
  vertical-align: top;
  cursor: pointer;
}
.fanorfollow_info_top :hover {
  color: deepskyblue;
}
.fanorfollow_info_bottom {
  line-height: 20px;
  color: #999;
  margin-top: 5px;
  cursor: pointer;
}
.fanorfollow_info_bottom :hover {
  color: deepskyblue;
}
</style>