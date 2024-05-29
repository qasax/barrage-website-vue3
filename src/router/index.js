import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store/index' // 导入 Vuex store

const routes = [
  {
    path: '/',
    name: 'VideoHome',
    component: () => import('@/views/VideoHome.vue')
  },
  {
    path: '/VideoDetailPage/:videoId',///VideoDetailPage/:videoDetail
    name: 'VideoDetailPage',
    component: () => import('@/views/VideoDetailPage.vue'),
    props: true,//route => ({ videoDetail: route.params.videoDetail ? JSON.parse(decodeURIComponent(route.params.videoDetail)) : {} })
  },
  {
    path: '/VideoListByType/:type',
    name: 'VideoListByType',
    component: () => import('@/views/VideoListByType.vue'),
    props: true
  },
  {
    path: '/VideoSearchPage/:keyword',
    name: 'VideoSearchPage',
    component: () => import('@/views/VideoSearchPage.vue'),
    props: true
  },
  {
    path: '/personal',
    component: () => import('@/views/personal/PersonalCenter.vue'),
    children: [
      {
        path: 'myInfo',
        name: 'myinfo',
        component: () => import('@/views/personal/MyInfo.vue')
      },
      {
        path: 'myLike',
        name: 'myLike',
        component: () => import('@/views/personal/MyLike.vue')
      },
      {
        path: 'mycollect',
        name: 'mycollect',
        component: () => import('@/views/personal/MyCollect.vue')
      },
      {
        path: 'myfan/:fanOrFollow',
        name: 'myfan',
        component: () => import('@/views/personal/MyFanAndFollow.vue'),
        props: true
      },
      {
        path: 'myfollow/:fanOrFollow',
        name: 'myfollow',
        component: () => import('@/views/personal/MyFanAndFollow.vue'),
        props: true
      },
      {
        path: 'myVideoUpload',
        name: 'myVideoUpload',
        component: () => import('@/views/personal/MyVideoUpload.vue')
      },
      {
        path: 'myLatelyMsg',
        name: 'MyLatelyMsg',
        component: () => import('@/views/personal/MyLatelyMsg.vue')
      },
      {
        path: 'manageMessage',
        name: 'ManageMessage',
        component: () => import('@/views/personal/MyMessage.vue'),
        children: [
          {
            path: 'mySystemMsg',
            name: 'MySystemMsg',
            component: () => import('@/views/personal/MySystemMsg.vue'),
          },
          {
            path: 'myReplyToMeMsg',
            name: 'MyReplyToMeMsg',
            component: () => import('@/views/personal/MyReplyToMeMsg.vue'),
          }
        ]
      },
      {
        path: 'myComment',
        name: 'MyComment',
        component: () => import('@/views/personal/MyComment.vue')
      },
      {
        path: 'myReply',
        name: 'MyReply',
        component: () => import('@/views/personal/MyReply.vue')
      },
      {
        path: 'myUploadedVideo',
        name: 'MyUploadedVideo',
        component: () => import('@/views/personal/MyUploadedVideo.vue')
      },
    ]
  },
  {
    path: '/others/:userId',
    component: () => import('@/views/others/OthersCenter.vue'),
    props: true,
    children: [
      {
        path: 'userFan/:fanOrFollow/:userId',
        name: 'UserFan',
        props: true,
        component: () => import('@/views/others/UserFanAndFollow.vue')
      },
      {
        path: 'userFollow/:fanOrFollow/:userId',
        name: 'UserFollow',
        props: true,
        component: () => import('@/views/others/UserFanAndFollow.vue')
      },
      {
        path: 'userUploadedVideo/:userId',
        name: 'UserUploadedVideo',
        props: true,
        component: () => import('@/views/others/UserUploadedVideo.vue')
      },
    ]
  },
  {
    path: '/managePage',
    name: 'ManagePage',
    component: () => import('@/views/manage/ManagePage.vue'),
    children: [
      {
        path: 'manageRole',
        name: 'ManageRole',
        component: () => import('@/views/manage/ManageRole.vue')
      },
      {
        path: 'manageUser',
        name: 'ManageUser',
        component: () => import('@/views/manage/ManageUser.vue')
      },
      {
        path: 'manageVideo',
        name: 'ManageVideo',
        component: () => import('@/views/manage/ManageVideo.vue')
      },
      {
        path: 'manageComment',
        name: 'ManageComment',
        component: () => import('@/views/manage/ManageComment.vue')
      },
      {
        path: 'manageReply',
        name: 'ManageReply',
        component: () => import('@/views/manage/ManageReply.vue')
      },
      {
        path: 'manageCarousel',
        name: 'ManageCarousel',
        component: () => import('@/views/manage/ManageCarousel.vue')
      },
      {
        path: 'manageSysMsg',
        name: 'ManageSysMsg',
        component: () => import('@/views/manage/ManageSysMsg.vue'),
      },
      {
        path: 'manageBarrage',
        name: 'ManageBarrage',
        component: () => import('@/views/manage/ManageBarrage.vue'),
      },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.afterEach((to, from) => {
  setTimeout(() => {
    console.log(store.state.videoWeb.isLogining)
    const isAuthenticated = store.state.videoWeb.isLogining; // 假设你的认证状态保存在 auth 模块的 authenticated 状态中
    if (to.path.startsWith('/personal') && !isAuthenticated) {
      // 如果用户访问了需要认证的页面但尚未认证，则重定向到登录页
      router.push('/'); // 假设你有一个登录页的路由
    } else {
      // 如果用户已认证或访问的是公共页面，则允许导航
    }
    if (to.path.startsWith('/managePage') && store.state.videoWeb.role != 'admin') {
      router.push('/');
    } else {

    }
  }, 550);
});

export default router;
