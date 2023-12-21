<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isreFreshLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-duration="1500">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <ArticleItem v-for="item in list" :key="item.art_id" :article="item" />
        <!-- <van-cell v-for="item in list" :key="item.art_id" :title="item.title" /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticleList } from '@/api/article.js'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      finished: false,
      list: [],
      timestamp: new Date(),
      error: false,
      isreFreshLoading: false,
      refreshSuccessText: '刷新成功'
    }
  },
  methods: {
    async onLoad () {
      try {
        // 1. 请求数据
        const result = await getArticleList({
          channel_id: this.channel.id,
          timestamp: this.timestamp
        })
        // 记录当前请求的时间戳
        this.timestamp = result.data.data.pre_timestamp
        // 2. 将请求的数据添加到list里面
        this.list.push(...result.data.data.results)
        // 3. 设置loading变量为false(加载结束了，可以进行下一次加载了)
        this.loading = false
        // 4. 根据情况判断是否还有数据，如果没有数据了就设置 finished 为true
        if (result.data.data.results.length === 0) {
          this.finished = true
        }
      } catch (err) {
        // 如果代码执行到了catch当中，肯定是出错
        this.error = true
        // 要将loading变量设置为false，否则会一直显示 加载中....
        this.loading = false
      }
    },
    async onRefresh () {
      try {
        // 请求获取数据
        // 1. 请求获取数据
        const { data } = await getArticleList({
          channel_id: this.channel.id, // 频道 id
          timestamp: Date.now() // 下拉刷新，每次请求获取最新数据，所以传递当前最新时间
        })

        // 2. 将数据追加到列表的顶部
        const { results } = data.data
        // unshift方法会将数据添加到所有数据的前面
        this.list.unshift(...results)

        // 3. 关闭下拉刷新的 loading 状态
        this.isreFreshLoading = false

        // 4. 更新下拉刷新成功提示的文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (error) {
        this.refreshSuccessText = '刷新失败'
        this.isreFreshLoading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
