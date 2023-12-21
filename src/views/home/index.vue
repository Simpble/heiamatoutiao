<template>
  <div class="home-container">
    <!-- 顶部导航栏组件 -->
    <van-nav-bar class="page-nav-bar">
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        @click="$router.push('/search')"
        >搜索</van-button
      >
    </van-nav-bar>

    <!-- 频道 -->
    <!-- 频道列表 -->
    <van-tabs class="channel-tabs" v-model="active" swipeable animated>
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
        <!-- 使用文章列表组件 -->
        <ArticleList :channel="item" />
      </van-tab>
      <!-- 汉堡按钮 -->
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburger-btn" @click="show">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>

    <!-- 频道弹层 -->
    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <ChannelEdit :my-channels="channels" :active-index="active" @update-active="onUpdateActive"/>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user.js'
import ArticleList from '@/views/home/components/article-list.vue'
import ChannelEdit from '@/views/home/components/channel-edit.vue'
import { getItem } from '@/utils/storage.js'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      active: 0,
      channels: [],
      isChannelEditShow: false
    }
  },
  created () {
    this.loadUserChannels()
  },
  methods: {
    async loadUserChannels () {
      // 根据用户是否登录进行区分
      if (this.$store.state.user) {
        // 如果已登录，就发送请求获取频道数据
        // 发送请求获取频道数据
        const result = await getUserChannels()
        console.log(result)
        this.channels = result.data.data.channels
      } else {
        // 如果没有登录，就应该获取本地存储中的数据进行频道展示
        let channels = getItem('TOUTIAO_CHANNELS')
        if (!channels) {
          // 如果本地存储没有数据，还是要发送请求获取默认的频道
          const result = await getUserChannels()
          channels = result.data.data.channels
        }
        // 将频道保存到data中
        this.channels = channels
      }
    },
    show () {
      this.isChannelEditShow = true
    },
    onUpdateActive (index, show) {
      // 将用户点击的频道索引赋值当前的频道索引
      this.active = index
      // 根据show参数决定是否关闭弹层
      this.isChannelEditShow = show
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }

  /deep/ .channel-tabs {
    .van-tabs__wrap {
      height: 82px;
    }

    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777777;
    }

    .van-tab--active {
      color: #333333;
    }

    .van-tabs__nav {
      padding-bottom: 0;
    }

    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }
  }

  .hamburger-btn {
    position: fixed;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 66px;
    height: 82px;
    background-color: #fff;
    opacity: 0.902;

    i.toutiao {
      font-size: 33px;
    }
  }
  .placeholder {
    flex-shrink: 0;
    width: 66px;
    height: 82px;
  }
}
</style>
