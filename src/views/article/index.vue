<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="黑马头条"
    >
      <van-icon
        slot="left"
        name="arrow-left"
        @click="$router.back()"
      />
    </van-nav-bar>

    <div class="main-wrap">
      <!-- 加载中 -->
      <div
        class="loading-wrap"
        v-if="loading"
      >
        <van-loading
          color="#3296fa"
          vertical
        >加载中</van-loading>
      </div>

      <!-- 加载完成-文章详情 -->
      <div
        class="article-detail"
        v-else-if="article.art_id"
      >
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>

        <!-- 用户信息 -->
        <van-cell
          class="user-info"
          center
          :border="false"
        >
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div
            slot="title"
            class="user-name"
          >{{ article.aut_name }}</div>
          <div
            slot="label"
            class="publish-date"
          >
            {{ article.pubdate | relativeTime }}
          </div>
          <van-button
            v-if="!article.is_followed"
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            @click="onFollow"
            :loading="followLoading"
          >关注</van-button>
          <van-button
            v-else
            class="follow-btn"
            round
            size="small"
            @click="onFollow"
            :loading="followLoading"
          >已关注</van-button>
        </van-cell>

        <!-- 文章内容 -->
        <div
          ref="article-content"
          class="article-content"
          v-html="article.content"
        ></div>
        <van-divider>正文结束</van-divider>

        <CommentList
          :source="article.art_id"
          @onload-success="totalCommentCount = $event"
          :list=commentList
          @reply-click="onReplyClick"
        />
      </div>

      <!-- 加载失败：404 -->
      <div
        class="error-wrap"
        v-else-if="errStatus === 404"
      >
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div
        class="error-wrap"
        v-else
      >
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn">点击重试</van-button>
      </div>
    </div>

    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isPostShow = true"
      >写评论</van-button>
      <van-icon
        name="comment-o"
        :badge="totalCommentCount"
        color="#777"
      />

      <!-- <van-icon
        color="#777"
        name="good-job-o"
      /> -->
      <LikeArticle
        v-if="article.art_id"
        :is-liked="article.attitude"
        :article-id="article.art_id"
        @update-like="article.attitude = $event"
      />
      <CollectArticle
        v-if="article.art_id"
        :is-collected="article.is_collected"
        :article-id="article.art_id"
        @update-collect="article.is_collected = $event"
      />
      <van-icon
        name="share"
        color="#777777"
      ></van-icon>
    </div>
    <van-popup
      v-model="isPostShow"
      position="bottom"
    >
      <comment-post
        :target="article.art_id"
        @post-success="onPostSuccess"
      />
    </van-popup>
    <van-popup
      v-model="isReplyShow"
      position="bottom"
      style="height: 90%"
    >
      <!-- popup懒渲染的问题，通过v-if控制出现时重新渲染 -->
      <comment-reply
        :comment="currentComment"
        @close="isReplyShow = false"
        v-if="isReplyShow"
      />
    </van-popup>
  </div>
</template>

<script>
import { getArticleById } from "@/api/article.js";
import { ImagePreview } from "vant";
import { addFollow, deleteFollow } from "@/api/user.js";
import CollectArticle from "@/components/collect-article";
import LikeArticle from "@/components/like-article";
import CommentList from "@/views/article/components/comment-list.vue";
import CommentPost from "./components/comment-post.vue";
import CommentReply from "./components/comment-reply.vue";
export default {
  name: "ArticleIndex",
  components: {
    CollectArticle,
    CommentList,
    LikeArticle,
    CommentPost,
    CommentReply,
  },
  provide: function () {
    return {
      articleId: this.articleId,
    };
  },
  props: {
    articleId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      totalCommentCount: 0,
      // 存储文章数据
      article: {},
      loading: true, // 加载中的 loading
      errStatus: 0, // 失败的状态码
      followLoading: false, // loading 状态显示与否
      isPostShow: false, //发布评论弹层显示
      isReplyShow: false, //回复评论弹层显示
      commentList: [],
      currentComment: {},
    };
  },
  created() {
    this.loadArticle();
  },
  methods: {
    async loadArticle() {
      this.loading = true;
      try {
        const result = await getArticleById(this.articleId);
        this.article = result.data.data;
        // 当数据赋值给 this.article 之后，就会有数据了，但是页面还没有渲染
        // 我们需要等到页面渲染完毕之后再做事情
        setTimeout(() => {
          // 延时处理器中的代码会在页面全部渲染完毕之后执行
          this.previewImage();
        });
        console.log("article:" + this.article);
      } catch (error) {
        console.log(error);
        this.$toast.fail("加载文章失败");
        if (error.response && error.response.status === 404) {
          this.errStatus = 404;
        }
      }
      this.loading = false;
    },
    previewImage() {
      // 在这个方法中添加代码实现预览功能
      // 1. 获取文章内容正文盒子
      const articleContent = this.$refs["article-content"];
      // 2. 找到正文盒子中的图片元素
      const imgs = articleContent.querySelectorAll("img");
      // 3. 准备一个数组，用来存放所有需要预览的图片地址
      const images = [];

      // 4. 遍历所有找到的图片对象
      imgs.forEach((item, index) => {
        // 将当前图片的src路径保存到 images中
        images.push(item.src);
        // 给图片元素添加点击事件
        item.onclick = () => {
          // 做图片预览
          ImagePreview({
            images: images,
            startPosition: index,
          });
        };
      });
    },
    async onFollow() {
      this.followLoading = true;
      try {
        // 根据当前的状态进行 关注，取消关注
        if (this.article.is_followed) {
          // is_followed 为真就是已经关注了，所以需要取消关注
          await deleteFollow(this.article.aut_id);
        } else {
          // 没有关注就去添加关注
          await addFollow(this.article.aut_id);
        }
        // 上面发送了请求之后，只是修改了服务器的数据，页面中的数据还没有修改
        this.article.is_followed = !this.article.is_followed;
        this.$toast.success("关注操作成功");
      } catch (err) {
        this.$toast.fail("关注操作失败");
      }
      this.followLoading = false;
    },
    // 处理评论
    onPostSuccess(data) {
      // 关闭弹出层
      this.isPostShow = false;
      this.totalCommentCount++;
      // 将发布的内容展示到列表顶部
      this.commentList.unshift(data.new_obj);
    },
    onReplyClick(comment) {
      console.log(comment);
      // 显示评论回复弹出层
      this.currentComment = comment;
      this.isReplyShow = true;
    },
  },
};
</script>

<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
