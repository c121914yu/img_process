<template>
  <div class="home">
		<header>
			<i class="el-icon-arrow-left"></i>
			<i class="el-icon-arrow-right"></i>
		</header>
    <div class="head">
      <h2 class="center">系统介绍</h2>
      <p>&emsp;这是一个处理科技文献图像的系统。该系统分为图像提取和自动上色两部分，功能主要利用深度学习技术实现。你可以将科技文献批量上传，系统将自动提取文献中的图像。你也可以将粗略绘制的文献图像上传并设置相应参数，系统将自动为你推荐更合适的图像颜色。</p>
    </div>
    <div class="function center first">
      <h2>图像提取</h2>
      <p>选择一篇或多篇科技文献上传，系统将调用训练好的模型识别并提取文献中包含的图像。图像将以默认的格式输出。</p>
      <router-link class="center" :to="{name:'imgExt'}">
        <el-button size="mini" class="btn">
          点击测试
        </el-button>
      </router-link>
    </div>

    <div class="function center second">
      <h2>图像上色</h2>
      <p>选择一幅你绘制好的图像或一页文献并框定图像范围，选择图像颜色数量后将获得推荐的颜色RGB值。你还可以输入推荐的RGB值和相应参数，系统将自动为你画出相应配色的图像并给出Python代码以供参考。</p>
      <router-link class="center" :to="{name:'pix2pix'}">
        <el-button size="mini" class="btn">
          点击测试
        </el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
  export default{
    mounted() {
      const head = document.querySelector('.head')
      const functions = document.querySelectorAll('.function')
      setTimeout(() => {
        head.style.opacity = 1
        functions[0].style.left = 0
        functions[0].style.opacity = 1
        functions[1].style.right = 0
        functions[1].style.opacity = 1
      })
    }
  }
</script>

<style>
.home{
  height: 100vh;
  width: 100vw;
	background-color: #FFFFFF;
  position: relative;
}

.home>header{
	width: 100%;
	height: 450px;
	background: url(../../static/background.jpg) no-repeat center center/cover;
	/* background-color: #E9E9EB; */
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.home>header i{
	margin: 0 20px;
	opacity: 0;
	width: 60px;
	height: 60px;
	line-height: 60px;
	text-align: center;
	font-size: 2em;
	background-color: #F0F0F0;
	border-radius: 50%;
	font-weight: 600;
	transition: var(--hover-speed);
	cursor: pointer;
}
.home>header i:hover{
	background-color: var(--tint-gray);
}
.home>header i:active{
	transition: none;
	transform: scale(0.9);
}
.home>header:hover i{
	opacity: 1;
}

.home .function{
  position: absolute;
  width: 48%;
  max-width: 600px;
  padding: 10px 15px;
  display: inline-block;
  align-items: center;
  transition: var(--transition-speed);
}
.home .function h2{
  color: #F4F4F4;
}
.home .function p{
  color: #FFFFFF;
}
.home .function .btn{
  font-size: 1rem;
  margin-top: 5px;
}

.home .head{
  margin: 1% auto;
  width: 60%;
  max-width: 600px;
  padding: 10px 15px;
  background-color: rgba(255,255,255,0.8);
  border-radius: 10px;
  box-shadow: var(--box-shadow1);
  transition: var(--transition-speed);
  opacity: 0;
}
.home .function.first{
  background-color: rgba(255,152,69,0.8);
  left: -48%;
  opacity: 0;
  margin-top: 1%;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
.home .function.second{
  background-color: rgba(30,148,147,0.8);
  margin-top: 8%;
  right: -48%;
  opacity: 0;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  transition-delay: .4s;
}
</style>
