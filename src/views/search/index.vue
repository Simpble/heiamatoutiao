<template>
  <div class="search-container">
    <!-- 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form action="/" class="search-form">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>

    <!-- 放置子组件 -->
    <!-- 在搜索框中按下回车的时候，可以把 isResultShow 设置为真 -->
    <searchResult v-if="isResultShow" :search-text="searchText" />
    <!-- 搜索框中有搜索关键字，就显示联想建议 -->
    <searchSuggestion
    v-else-if="searchText"
    :search-text="searchText"
    @search="onSearch"/>
    <!-- 搜索框中没有 文字，就显示搜索历史记录 -->
    <searchHistory @search="onSearch" :search-histories="searchHistories" v-else />
  </div>
</template>

<script>
// 引入三个子组件
import searchHistory from '@/views/search/components/search-history.vue'
import searchResult from '@/views/search/components/search-result.vue'
import searchSuggestion from '@/views/search/components/search-suggestion.vue'
import { setItem, getItem } from '@/utils/storage.js'
export default {
  name: 'SearchIndex',
  components: {
    searchHistory,
    searchResult,
    searchSuggestion
  },
  data () {
    return {
      isResultShow: false,
      searchText: '',
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORY') || [] // 存储历史记录
    }
  },
  methods: {
    onSearch (val) {
      // 每次搜索的时候，要将关键字添加到历史记录数组
      // 如果搜索的内容在数组中已经存在，那么就删除旧的历史记录，添加一条新的历史。
      // 将 val 值作为 关键字
      this.searchText = val
      // console.log(val)
      // 0. 查找一下 searchHistories 里面是不是已经有相同的关键字了
      // 如果有，就删除掉
      const index = this.searchHistories.indexOf(val)
      if (index >= 0) {
        this.searchHistories.splice(index, 1)
      }

      // 1. 将搜索关键字添加到 数组中
      this.searchHistories.unshift(val)

      // 显示搜索结果页面
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
    }
  },
  watch: {
    searchHistories: {
      handler (value) {
        // 将数据保存到本地存储
        setItem('TOUTIAO_SEARCH_HISTORY', value)
      },
      deep: true // 深度监听
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
