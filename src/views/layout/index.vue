<template>
  <div class="layout-container">
    <!-- 上半部分会显示不同的内容组件，所以会放一个路由占位符显示不同的组件 -->
    <router-view></router-view>
    <!-- 下半部分显示底部tabbar。 -->
    <!-- 标签导航栏 -->
    <van-tabbar class="layout-tabbar" route>
      <van-tabbar-item :to="{ name: 'home' }">
        <i slot="icon" class="toutiao toutiao-shouye"></i>
        <span class="text">首页</span>
      </van-tabbar-item>
      <van-tabbar-item :to="{ name: 'qa' }">
        <i slot="icon" class="toutiao toutiao-wenda"></i>
        <span class="text">问答</span>
      </van-tabbar-item>
      <van-tabbar-item :to="{ name: 'video' }">
        <i slot="icon" class="toutiao toutiao-shipin"></i>
        <span class="text">视频</span>
      </van-tabbar-item>
      <van-tabbar-item :to="{ name: 'my' }">
        <i slot="icon" class="toutiao toutiao-wode"></i>
        <span class="text">{{ $store.state.user ? '我的' : '未登录' }}</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  data () {
    return {
      active: 0
    }
  }
}
</script>
<style scoped lang="less">
.layout-container {
  .layout-tabbar {
    i.toutiao {
      font-size: 30px;
    }
    span.text {
      font-size: 22px;
    }
  }
}
</style>
