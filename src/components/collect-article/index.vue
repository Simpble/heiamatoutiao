<template>
  <div>
    <van-icon
    @click="onCollect"
    :color=" isCollected ? '#ffa500' : '' "
    :name="isCollected?'star':'star-o'" />
  </div>
</template>
<script>
import { addCollect, deleteCollect } from '@/api/article.js'
export default {
  props: {
    isCollected: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  methods: {
    onCollect () {
      try {
        // 判断当前收藏状态，去发送不同的请求
        if (this.isCollected) {
          // 取消收藏
          deleteCollect(this.articleId)
          this.$toast.success('取消收藏')
        } else {
          // 添加收藏
          addCollect(this.articleId)
          this.$toast.success('收藏成功')
        }
        // 上面的代码是发送请求进行操作，浏览器页面中状态没有修改
        this.$emit('update-collect', !this.isCollected)
      } catch (err) {
        this.$toast.fail('操作失败')
      }
    }
  }
}
</script>
<style scoped>
div{
  font-size: 38px;
}
</style>
