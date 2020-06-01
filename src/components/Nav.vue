<template>
  <div class="nav" style="opacity: 1;">
    <router-link
      class="nav-item"
      :class="current === index?'active':''"
      v-for="(item,index) in navs"
      :key="index"
      :to="{name:item.to}"
    >
			<i class="iconfont" :class="item.icon"></i>
      <p v-if="item.text!=''">{{item.text}}</p>
    </router-link>
  </div>
</template>

<script>
export default{
  data(){
    return{
      navs : [
				{text:'',to:"home",icon:"icon-home"},
        {text:'图像提取',to:"imgExt",icon:"icon-tiqu"},
        {text:'图像上色',to:"pix2pix",icon:"icon-seban"}
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
        case 'imgExt' : this.current=1;break;
        case 'pix2pix' : this.current=2;break;
      }
    }
  },
  created() {
    this.routeChange()
		// window.onscroll = (e) => {
		// 	console.log(11)
		//   let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
		//   if(scrollTop > 80)
		//     document.querySelector('.nav').style.opacity = 0.5
		//   else
		//     document.querySelector('.nav').style.opacity = 1
		// }
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
  height: 50px;
	padding: 0 2em;
  background-color: #FFFFFF;
	box-shadow: var(--box-shadow1);
	/* border-bottom: 5px solid; */
	border-image: -webkit-linear-gradient(90deg,#FF3300, #00CC00, #00CCFF) 30 30;
	border-image: -moz-linear-gradient(90deg,#FF3300, #00CC00, #00CCFF) 30 30;
	border-image: linear-gradient(90deg,#FF3300, #00CC00, #00CCFF) 30 30;
  display: flex;
  align-items: center;
}

.nav .nav-item{
	height: 80%;
  margin-right: 30px;
  padding: 0 10px;
	border-bottom: 3px solid transparent;
	display: flex;
	align-items: center;
	overflow: hidden;
}
.nav .nav-item:hover{
	border-radius: 5px;
  background-color: rgba(0,0,0,0.1);
}
.nav .nav-item i{
	font-size: 1.4em;
	color: var(--gray);
}
.nav .nav-item p{
	margin-left: 5px;
	margin-top: 5px;
}
.nav .nav-item.active{
	border-color: var(--green1);
}
</style>
