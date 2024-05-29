<template>
  <div v-if="!IsCollectDetail">
    <el-page-header title="个人收藏"
                    icon=""
                    style="margin-bottom:30px">
    </el-page-header>
    <div class="myart1"
         v-if="collectData.length>0">
      <el-card v-for="c in collectData"
               :key="c"
               class="collect-card"
               @click="showCollectDetail(c)"
               @mouseover="hovering = c"
               @mouseleave="hovering = null"
               style="max-width: 800px;">
        <div>{{ c }}</div>
        <el-button v-show="hovering === c"
                   @click.stop="removeCollect(c)"
                   class="cancel-button"
                   type="danger"
                   size="default">
          删除收藏夹
        </el-button>
      </el-card>
      <div class="demo-pagination-block"
           v-if="collectData.length != 0">
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
    <el-empty v-if="collectData.length==0"
              :image-size="250"
              description="没有收藏内容"></el-empty>
  </div>
  <div v-if="IsCollectDetail">
    <el-page-header @back="goBack"
                    style="margin-bottom:30px">
      <template #content>
        <span class="text-large font-600 mr-3"> {{ collectionName }} </span>
      </template>
    </el-page-header>
    <collect-item :collectionName="collectionName"></collect-item>
  </div>
</template>

<script>
import CollectItem from '@/components/CollectItem.vue';
import { getPageCollectionByUserId } from '@/apis/collection'
import { onMounted, ref } from 'vue'
import { deleteCollection } from '@/apis/collection'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  components: { CollectItem },
  name: "MyCollect",
  setup () {
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref()
    const collectData = ref([])
    const IsCollectDetail = ref(false)
    const collectionName = ref()
    const hovering = ref(null)

    const getCollectData = () => {
      getPageCollectionByUserId({
        pageSize: pageSize.value,
        pageNo: currentPage.value,
        orderColumn: "collection_name",
        sortOrder: "desc",
      }).then((res) => {
        collectData.value = res.data.list
        currentPage.value = res.data.pageNum
        total.value = res.data.total
      })
    }

    const showCollectDetail = (val) => {
      collectionName.value = val
      IsCollectDetail.value = true
    }

    onMounted(() => {
      getCollectData()
    })

    const goBack = () => {
      IsCollectDetail.value = false
    }

    const handleSizeChange = (val) => {
      console.log(`${val} items per page`)
      pageSize.value = val
      getCollectData()
    }

    const handleCurrentChange = (val) => {
      console.log(`current page: ${val}`)
      currentPage.value = val
      getCollectData()
    }

    const removeCollect = (val) => {
      ElMessageBox.confirm(
        '将会删除收藏夹内全部内容，是否确认?',
        'Warning',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          deleteCollection({
            collectionName: val
          }).then(res => {
            collectData.value = collectData.value.filter(item => item !== val)
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
          })
        })
    }

    return {
      handleSizeChange,
      handleCurrentChange,
      currentPage,
      pageSize,
      collectData,
      total,
      IsCollectDetail,
      showCollectDetail,
      collectionName,
      goBack,
      hovering,
      removeCollect
    }
  }
};
</script>

<style>
.collect-card {
  position: relative;
  margin-bottom: 20px;
  cursor: pointer;
}

.cancel-button {
  position: absolute;
  top: 20px;
  right: 15px;
  opacity: 0;
  transition: opacity 0.3s;
}

.collect-card:hover .cancel-button {
  opacity: 1;
}

.myart1 {
  line-height: 30px;
}

.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}

.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
</style>
