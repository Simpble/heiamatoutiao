<template>
  <div class="my-container">
    <!-- 未登录头部 -->
    <div
      v-if="!$store.state.user"
      class="header not-login"
    >
      <div
        class="login-btn"
        @click="$router.push('/login')"
      >
        <img
          class="mobile-img"
          src="~@/assets/mobile.png"
          alt
        />
        <span class="text">登录 / 注册</span>
      </div>
    </div>

    <!-- 已登录头部 -->
    <!-- 已登录区域布局 -->
    <div
      v-else
      class="header user-info"
    >
      <div class="base-info">
        <div class="left">
          <van-image
            class="avatar"
            :src="userInfo.photo"
            round
            fit="cover"
          />
          <span class="name">{{userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button
            size="mini"
            round
            to="/user/profile"
          >编辑资料</van-button>
        </div>
      </div>

      <!-- 个人中心关注、粉丝等区域 -->
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{userInfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.like_count}}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>

    <!-- 宫格导航 -->
    <!-- 宫格导航 -->
    <van-grid
      class="grid-nav mb-9"
      :column-num="2"
      clickable
    >
      <van-grid-item class="grid-item">
        <i
          slot="icon"
          class="toutiao toutiao-shoucang"
        ></i>
        <span
          slot="text"
          class="text"
        >收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i
          slot="icon"
          class="toutiao toutiao-lishi"
        ></i>
        <span
          slot="text"
          class="text"
        >历史</span>
      </van-grid-item>
    </van-grid>

    <van-cell
      title="消息通知"
      is-link
    />
    <van-cell
      class="mb-9"
      title="小智同学"
      is-link
    />
    <van-cell
      class="logout-cell"
      clickable
      title="退出登录"
      @click="logout"
      v-if="$store.state.token"
    />
  </div>
</template>

<script>
import { getUserInfo } from "@/api/user.js";
import { getArticlesByUser } from "@/api/article";
export default {
  created() {
    this.loadUserInfo();
  },
  name: "MyIndex",
  data() {
    return {
      userInfo: {},
    };
  },
  methods: {
    async loadUserInfo() {
      const result = await getUserInfo();
      this.userInfo = result.data.data;
      console.log("userinfo");
      console.log(this.userInfo);
    },
    logout() {
      this.$dialog
        .confirm({
          message: "请问是否要退出？",
        })
        .then(() => {
          // 点击确认走 .then
          this.$store.commit("setUser", null);
        });
    },
  },
};
</script>

<style scoped lang="less">
.my-container {
  .header {
    height: 361px;
    background: url("~@/assets/banner.png");
    background-size: cover;
  }

  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }

  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          border: 4px solid #fff;
          margin-right: 23px;
        }
        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .data-stats {
      display: flex;
      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }

  .grid-nav {
    .grid-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }

  .logout-cell {
    text-align: center;
    color: #d86262;
  }

  .mb-9 {
    margin-bottom: 9px;
  }
}
</style>
