<template>
  <div class="search-suggestion">
    <van-cell
    icon="search"
    v-for="(item,index) in suggestions"
    :key="index"
    @click="$emit('search', item)"
    >
      <div slot="title" v-html="highlight(item)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search.js'
// debounce 可以用来进行防抖处理
// npm i lodash
import { debounce } from 'lodash'

export default {
  name: 'searchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: []
    }
  },
  methods: {
    highlight (text) {
      if (!text) {
        return '没有更多数据了'
      }

      // this.searchText 就是关键字，联想建议中会包含关键字
      const highlightStr = `<span style="color:red">${this.searchText}</span>`
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlightStr)
    }
  },
  watch: {
    // 侦听搜索关键字的变化，来进行关键字联想建议
    searchText: {
      handler: debounce(async function (val) {
        // console.log(val)
        const result = await getSearchSuggestions(val)
        this.suggestions = result.data.data.options
      }, 500),
      // 立即触发侦听器
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
</style>
