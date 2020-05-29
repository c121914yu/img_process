<template>
  <div class="nav">
		<router-link
			class="nav-item"
			to="/"
		>
			<i class="el-icon-s-home"></i>
		</router-link>
    <router-link
      class="nav-item"
      :class="current === index?'active':''"
      v-for="(item,index) in navs"
      :key="index"
      :to="{name:item.to}"
    >
			<i :class="item.icon"></i>
      <p>{{item.text}}</p>
    </router-link>
  </div>
</template>

<script>
export default{
  data(){
    return{
      navs : [
        {text:'图像提取',to:"imgExt",icon:"el-icon-s-home"},
        {text:'图像上色',to:"pix2pix",icon:"el-icon-s-home"}
      ],
      current : 0,
    }
  },
  watch:{
    '$route' : 'routeChange',
  },
  methods:{
    routeChange(){
      this.current = -1
      switch(this.$route.name){
        case 'home' : this.current=0;break;
        case 'imgExt' : this.current=1;break;
        case 'pix2pix' : this.current=2;break;
      }
    }
  },
  mounted() {
    this.routeChange()
  }
}
</script>

<style scoped>
.nav{
  z-index: 10;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
	padding: 0 2em;
  background-color: #101010;
  box-shadow: var(--box-shadow1);
	border-bottom: 5px solid;
	border-image: -webkit-linear-gradient(90deg,#FF3300, #00CC00, #00CCFF) 30 30;
	border-image: -moz-linear-gradient(90deg,#FF3300, #00CC00, #00CCFF) 30 30;
	border-image: linear-gradient(90deg,#FF3300, #00CC00, #00CCFF) 30 30;
  display: flex;
  align-items: center;
}
.nav *{
	color: #F4F4F4;
}

.nav .nav-item{
	height: 80%;
  margin-right: 30px;
  padding: 0 10px;
	border-bottom: 2px solid transparent;
	border-radius: 5px;
	display: flex;
	align-items: center;
}
.nav .nav-item:hover{
  background-color: rgba(255,255,255,0.2);
}
/* .nav .nav-item.active{
  color: var(--green2);
  border-bottom: 2px solid var(--green2);
} */
.nav .nav-item i{
	font-size: 2em;
}
.nav .nav-item p{
	margin-top: 5px;
	margin-left: 5px;
}
</style>
