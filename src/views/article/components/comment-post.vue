<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请发布你的评论"
      show-word-limit
    />
    <van-button
      class="post-btn"
      @click="onPost"
    >发布</van-button>
  </div>
</template>

<script>
import { addComment } from "@/api/comment.js";
export default {
  name: "CommentPost",
  data() {
    return {
      message: "",
    };
  },
  props: {
    target: {
      type: [Number, String, Object],
      required: true,
    },
  },
  methods: {
    // 发布评论
    async onPost() {
      try {
        this.$toast.loading({
          duration: 0, // 持续展示 toast
          message: "发布中...",
          forbidClick: true, // 是否禁止背景点击
        });
        const { data } = await addComment({
          target: this.target, // 评论的目标 id（评论文章即为文章id，对评论进行回复则为评论id）
          content: this.message, // 评论内容
          art_id: this.articleId === null ? null : this.articleId, // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        });
        //清空文本框内容
        this.message = "";
        //发布弹框后需要隐藏弹框
        this.$emit("post-success", data.data);
        this.$toast.success("发布成功");
        console.log(data);
      } catch (error) {
        this.$toast.fail("发布失败");
      }
    },
  },
  inject: {
    articleId: {
      type: [Number, String, Object],
      default: null,
    },
  },
};
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
