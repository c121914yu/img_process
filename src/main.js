import Vue from 'vue'
import App from './App'
import router from './router'
Vue.config.productionTip = false

import axios from 'axios'
Vue.prototype.$axios = axios//全局使用axios

//引用代码高亮插件
import hljs from 'highlight.js'
import 'highlight.js/styles/solarized-light.css'
Vue.directive('highlight',function (el) {
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block)=>{
    hljs.highlightBlock(block)
  })
})

import{
  Button,
  Image,
  Icon,
  MessageBox,
  Select,
  Option
} from 'element-ui'
Vue
  .use(Button)
  .use(Image)
  .use(Icon)
  .use(Select)
  .use(Option)

Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
