import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入vant
import Vant from 'vant'
import 'vant/lib/index.css'
// 加入移动端适配插件
import 'amfe-flexible'

// 导入全局的样式文件
import './styles/index.less'
// 引入日期处理的js文件代码
import '@/utils/dayjs.js'

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
