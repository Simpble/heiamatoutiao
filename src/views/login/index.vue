<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon slot="left" name="arrow-left" @click="$router.back()" />
    </van-nav-bar>

    <!-- 登录表单 -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        type="number"
        maxlength="11"
        :rules="userFormRules.mobile"
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号">
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        type="number"
        maxlength="6"
        :rules="userFormRules.code"
        v-model="user.code"
        name="code"
        placeholder="请输入验证码">
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <van-count-down
            @finish="isCountDownShow = false"
            v-if="isCountDownShow"
            :time="1000 * 5"
            format="ss 秒" />
          <van-button
            v-else
            native-type="button"
            @click="onSendSms"
            class="send-sms-btn"
            size="small"
            type="primary">
              发送验证码
          </van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap" style="margin: 16px;">
        <van-button class="login-btn" block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
// 导入登录函数
import { login, sendSms } from '@/api/user.js'
export default {
  name: 'Login',
  data () {
    return {
      isCountDownShow: false,
      user: {
        mobile: '',
        code: ''
      },
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      }
    }
  },
  methods: {
    async onSendSms () {
      // 验证手机号码是否正确
      try {
        // 给 van-form 添加 ref名称 loginForm
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        this.$toast.fail('手机号码未输入或格式不正确')
      }
      // 实现倒计时
      this.isCountDownShow = true
      // 真正发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast.success('发送成功')
      } catch (err) {
        // 发送验证码错误时，立刻重置 按钮
        this.isCountDownShow = false
        this.$toast.fail('发送验证码使用频繁或接口出错')
      }
    },
    // 表单提交事件
    async onSubmit (values) {
      // console.log('submit', values)
      // console.log(this.user)
      // 在发送请求的时候，显示加载中
      // 自定义加载图标
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner'
      })

      try {
        const result = await login(this.user)
        console.log(result)
        this.$toast.success('登录成功')
        this.$store.commit('setUser', result.data.data)
        // 跳转到 我的 页面
        this.$router.push('/my')
      } catch (ex) {
        // cannot read property "status" of undefined
        if (ex.response && ex.response.status === 400) {
          console.log('手机号或验证码错误')
          this.$toast.fail('手机号或验证码错误')
        } else {
          console.log('登录失败，请稍后重试', ex)
          this.$toast.fail('登录失败，请稍后重试')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 166px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
    border: 0px;
    border-radius: 46px;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}

/deep/ .van-button--primary {
  border-color: #1989fa !important;
}
</style>
