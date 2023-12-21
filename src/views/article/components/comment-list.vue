<template>
  <div class="comment-list">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check='false'
      @load="onLoad"
      :error.sync="error"
      error-text="出错了，联系管理员"
    >
      <comment-item
        @reply-click="$emit('reply-click', $event)"
        v-for="(item, index) in list"
        :key="index"
        :comment="item"
      />
    </van-list>
  </div>
</template>
<script>
import { getComments } from "@/api/comment.js";
import CommentItem from "./comment-item.vue";
export default {
  name: "CommentList",
  components: {
    CommentItem,
  },
  props: {
    // source 可以是文章的id，也可以是评论的id
    source: {
      type: [Number, String, Object],
      required: true,
    },
    list: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      validator(value) {
        return ["a", "c"].includes(value);
      },
      default: "a",
    },
  },
  data() {
    return {
      loading: false,
      finished: false,
      error: false,
      offset: null,
      limit: 10,
    };
  },
  created() {
    this.loading = true
    this.onLoad();
  },
  methods: {
    async onLoad() {
      try {
        // 1. 请求数据
        const { data } = await getComments({
          type: this.type, // a 是获取评论，  c获取回复
          source: this.source.toString(), // 获取评论时传递文章id，获取回复时传递评论id
          offset: this.offset,
          limit: this.limit,
        });
        console.log(data);
        // 通过子传父，将评论总数量交给 文章详情页面
        this.$emit("onload-success", data.data.total_count);
        // 2. 将数据添加到list中
        this.list.push(...data.data.results);

        // 3. 将 loading 设置为false
        this.loading = false;

        // 4. 判断是否还有数据
        if (data.data.results.length) {
          // 还有数据
          this.offset = data.data.last_id;
        } else {
          // 没有数据
          this.finished = true;
        }
      } catch (err) {
        this.error = true;
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>
