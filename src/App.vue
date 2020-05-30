<template>
  <div id="app">
    <Nav></Nav>
    <keep-alive>
      <router-view class="view"/>
    </keep-alive>
  </div>
</template>

<script>
import Nav from './components/Nav.vue'
global.message = (that,text) => {
  that.$alert(text, {
    confirmButtonText: '确定'
  })
}
export default{
  components:{
    Nav
  }
}
</script>

<style>
@import url("../static/icon/iconfont.css");
@import url("../static/common.css");
.view{
  padding-top: 50px;
}
</style>
