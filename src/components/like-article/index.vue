<template>
  <div>
    <van-icon
      @click="onLike"
      :color=" isLiked  === 1? '#ffa500' : '' "
      :name="isLiked === 1 ?'good-job':'good-job-o'"
    />
  </div>
</template>
<script>
import { addLike, deleteLike } from "@/api/article.js";
export default {
  props: {
    isLiked: {
      type:Number,
      required: true,
    },
    articleId: {
      type: [Number, String],
      required: true,
    },
  },
  methods: {
    async onLike() {
      this.$toast.loading({
        duration: 5000, // 持续展示 toast
        message: "操作中...",
        forbidClick: true, // 是否禁止背景点击
        onClose: this.$toast.fail("加载失败")
      });

      try {
        let status = -1;
        if (this.isLiked === 1) {
          // 已点赞，取消点赞
          await deleteLike(this.articleId);
        } else {
          // 没有点赞，添加点赞
          await addLike(this.articleId);
          status = 1;
        }

        // 更新视图
        this.$emit("update-like", status);
        this.$toast.success(status === 1 ? "点赞成功" : "取消点赞");
      } catch (err) {
        console.log(err);
        this.$toast.fail("操作失败，请重试！");
      }
    },
  },
};
</script>
<style scoped>
div {
  font-size: 38px;
}
</style>
