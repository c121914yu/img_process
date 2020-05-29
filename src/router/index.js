import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import home from '../pages/home.vue'
import imgExt from '../pages/imgExtract.vue'
import pix2pix from '../pages/pix2pix.vue'
import test from '../pages/test.vue'

export default new Router({
  routes: [
    {path: '/',name: 'home',component: home},
    {path: '/imgExt',name: 'imgExt',component: imgExt},
    {path: '/pix2pix',name: 'pix2pix',component: pix2pix},
    {path: '/test',name: 'test',component: test},
    {path: '*',redirect:'/'},//错误地址重新定向
  ]
})
