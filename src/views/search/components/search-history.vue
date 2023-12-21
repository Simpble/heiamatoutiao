<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <span v-if="isDeleteShow" @click="clear">全部删除</span> &nbsp;
      <span v-if="isDeleteShow" @click="isDeleteShow = false">完成</span>
      <van-icon v-else name="delete" @click="isDeleteShow = true" />
    </van-cell>

    <van-cell
      :title="item"
      v-for="(item, index) in searchHistories"
      :key="index"
      @click="onSearchItemClick(item, index)"
    >
      <van-icon name="close" v-if="isDeleteShow" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'searchHistory',
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false
    }
  },
  methods: {
    clear () {
      // 清空 searchHistories 数组所有内容
      this.searchHistories.splice(0, this.searchHistories.length)
      // this.searchHistories = []
    },
    onSearchItemClick (item, index) {
      // 如果是删除状态下，做删除
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
      } else {
        // 如果是非删除状态，修改关键字，显示搜索结果
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
