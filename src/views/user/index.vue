<template>
  <div class="user-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="用户名"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="user-info">
      <div class="base-info">
        <van-image
          class="avatar"
          round
          fit="cover"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
        <div class="right-area">
          <div class="stats-wrap">
            <div class="stats-item">
              <span class="count">66</span>
              <span class="text">发布</span>
            </div>
            <div class="stats-item">
              <span class="count">88</span>
              <span class="text">关注</span>
            </div>
            <div class="stats-item">
              <span class="count">28</span>
              <span class="text">粉丝</span>
            </div>
            <div class="stats-item">
              <span class="count">160</span>
              <span class="text">获赞</span>
            </div>
          </div>
          <van-button class="follow-btn">关注</van-button>
        </div>
      </div>
      <!-- 基本信息 -->
      <div class="label-info">
        <div class="bio-wrap">
          <span class="label">简介：</span>
          <span class="text">这是用户简介</span>
        </div>
      </div>

      <!-- 用户文章信息 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell
          v-for="item in list"
          :key="item"
          :title="item"
        />
      </van-list>

    </div>
  </div>
</template>

<script>
import { getUserById } from "@/api/user";
import { getArticlesByUser } from '@/api/article'
export default {
  name: "UserIndex",
  components: {},
  props: {
    userId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      user: {}, // 用户信息
      list: [], // 列表数据
      loading: false, // 控制上拉加载更多的 loading
      finished: false, // 控制是否加载结束了
      page: 1, // 获取下一页数据的页码
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadUser();
  },
  mounted() {},
  methods: {
    async loadUser() {
      try {
        console.log(this.$route);
        const { data } = await getUserById(this.$route.params.userId);
        console.log("data:");
        console.log(data)
        this.user = data.data;
      } catch (err) {
        console.log(err);
        this.$toast("获取用户数据失败");
      }
    },
    async onLoad() {
      // 1. 请求获取数据
      const { data } = await getArticlesByUser(this.$route.params.userId, {
        page: this.page, // 可选的，默认是第 1 页
        per_page: 20, // 可选的，默认每页 10 条
      });

      // 2. 把数据添加到列表中
      // list []
      // data.data.results []
      // ...[1, 2, 3] 会把数组给展开，所谓的展开就是一个一个的拿出来
      const { results } = data.data;
      this.list.push(...results);

      // 3. 加载状态结束
      this.loading = false;

      // 4. 判断数据是否全部加载完毕
      if (results.length) {
        this.page++; // 更新获取下一页数据的页码
      } else {
        this.finished = true; // 没有数据了，不需要加载更多了
      }
    },
  },
};
</script>

<style scoped lang="less">
.user-container {
  .user-info {
    background-color: #fff;
    padding: 25px 32px;
    .base-info {
      display: flex;
      margin-bottom: 25px;
      .avatar {
        width: 155px;
        height: 155px;
        margin-right: 62px;
      }
    }
    .label-info {
      font-size: 25px;
      .bio-wrap {
        .label {
          color: #646263;
        }
        .text {
          color: #212121;
        }
      }
    }
  }
  .right-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    .stats-wrap {
      display: flex;
      justify-content: space-between;
      .stats-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .count {
          font-size: 26px;
          color: #0d0a10;
        }
        .text {
          font-size: 21px;
          color: #9c9b9d;
        }
      }
    }
    .follow-btn {
      width: 289px;
      height: 55px;
      line-height: 55px;
      background-color: #6bb5ff;
      color: #fff;
      border: none;
    }
  }
}
</style>