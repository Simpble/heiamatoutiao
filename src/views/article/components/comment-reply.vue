<template>
  <div class="comment-reply">

    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon
        slot="left"
        name="cross"
        @click="$emit('close')"
      />
      <hr>
    </van-nav-bar>

    <div class="scroll-wrap">
      <!-- 当前评论项 -->
      <comment-item :comment="comment" />

      <!-- 评论的回复列表 -->
      <van-cell title="全部回复" />
      <comment-list
        :list="commentList"
        :source="comment.com_id"
        type="c"
      />
    </div>

    <!-- 发布评论 -->
    <div class="post-wrap">
      <van-button
        class="post-btn"
        size="small"
        round
        @click="isPostShow = true"
      >写评论</van-button>
    </div>

    <van-popup
      v-model="isPostShow"
      position="bottom"
    >
      <comment-post
        v-if="isPostShow"
        :target="comment.com_id"
        @post-success="onPostSuccess"
      />
    </van-popup>
  </div>
</template>

<script>
import CommentItem from "./comment-item.vue";
import CommentList from "./comment-list.vue";
import CommentPost from "./comment-post.vue";
export default {
  name: "CommentReply",
  components: {
    CommentItem,
    CommentList,
    CommentPost,
  },
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  inject: {
    articleId: {
      type: [Number, String, Object],
      default: null,
    },
  },
  data() {
    return {
      isPostShow: false,
      commentList: [],
    };
  },
  methods: {
    onPostSuccess(data) {
      // 更新回复的数量
      this.comment.reply_count++;

      // 关闭弹出层
      this.isPostShow = false;

      // 将最新回复的内容展示到列表的顶部
      this.commentList.unshift(data.new_obj);
    },
  },
};
</script>

<style scoped lang="less">
.comment-reply{
  background-color: #fff;
}
.van-nav-bar{
    position: fixed;
    top: 92px;
    width: 100%;
}
.scroll-wrap {
  position: fixed;
  top: 175px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}

.post-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .post-btn {
    width: 60%;
  }
}
</style>
