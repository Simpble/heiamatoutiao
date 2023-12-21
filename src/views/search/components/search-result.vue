<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error="error"
      error-text="加载失败，请点击重试"
    >
      <van-cell v-for="item in list" :key="item.art_id" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search.js'
export default {
  name: 'searchResult',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20,
      error: false
    }
  },
  methods: {
    async onLoad () {
      try {
        // 1. 发送请求
        const result = await getSearchResult({
          page: this.page, // 页码
          per_page: this.perPage, // 每页大小
          q: this.searchText // 搜索关键字
        })
        // 2. 往list里面添加数据
        this.list.push(...result.data.data.results)
        // 3. 将loading设置为false
        this.loading = false
        // 4. 根据情况判断是否要设置 finished 为 true
        if (result.data.data.results.length === 0) {
        // 没有数据的话，就将finished 为 true
          this.finished = true
        } else {
        // 还有数据的话，就将页码+1，获取下一页的数据
          this.page++
        }
      } catch (err) {
        console.log(err)
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
