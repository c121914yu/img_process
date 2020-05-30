<template>
  <div class="home">
		<div class="card">
			<i class="el-icon-arrow-left" @click="change_card(-1)"></i>
			
			<div class="container">
				<div 
					class="item"
					:class="currentCard === index ? 'active' : ''"
					:style="`transform: translateX(-${currentCard*100}%)`"
					v-for="(item,index) in cards"
					:key="index"
				>
					<h2>{{item.title}}</h2>
					<p>{{item.text}}</p>
				</div>
			</div>
			
			<i class="el-icon-arrow-right" @click="change_card(1)"></i>
		</div>
		
		<header>
			<h1>PICTURE PROCESSING</h1>
		</header>
		
    <div class="body">
			<div class="left">
				<div class="card blue">
					<h3>About System</h3>
					<section>这是一个处理科技文献图像的系统。该系统分为图像提取和自动上色两部分，功能主要利用深度学习技术实现。你可以将科技文献批量上传，系统将自动提取文献中的图像。你也可以将粗略绘制的文献图像上传并设置相应参数，系统将自动为你推荐更合适的图像颜色。</section>
				</div>
			</div>
			<div class="right">
				
			</div>
    </div>

  </div>
</template>

<script>
export default{
	data(){
		return{
			currentCard: 0,
			cards: [
				{
					title: "图像提取",
					text: "选择一篇或多篇科技文献上传，系统将调用训练好的模型识别并提取文献中包含的图像。图像将以默认的格式输出。",
					to_name: "imgExt"
				},
				{
					title: "图像上色",
					text: "选择一幅你绘制好的图像或一页文献并框定图像范围，选择图像颜色数量后将获得推荐的颜色RGB值。你还可以输入推荐的RGB值和相应参数，系统将自动为你画出相应配色的图像并给出Python代码以供参考。",
					to_name: "pix2pix"
				}
			]
		}
	},
	methods:{
		change_card(index){
			let temp = this.currentCard + index
			if(temp < 0)
				temp = this.cards.length - 1
			else if(temp >= this.cards.length)
				temp = 0
			this.currentCard = temp
		}
	},
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

<style scoped>
.home{
  height: 100vh;
  width: 100vw;
	background-color: #FFFFFF;
  position: relative;
}

.home>.card{
	width: 100%;
	height: 350px;
	background: url(../../static/background.jpg) no-repeat center center/cover;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.home>.card i{
	z-index: 5;
	position: absolute;
	opacity: 0;
	width: 50px;
	height: 50px;
	line-height: 50px;
	text-align: center;
	color: var(--gray);
	background-color: rgba(255,255,255,0.8);
	box-shadow: var(--box-shadow2);
	border-radius: 50%;
	font-size: 1.8em;
	font-weight: 600;
	transition: var(--hover-speed);
	cursor: pointer;
}
.home>.card i:hover{
	background-color: rgba(224,224,224,0.8);
}
.home>.card i.el-icon-arrow-left{
	left: 20px;
}
.home>.card i.el-icon-arrow-right{
	right: 20px;
}
.home>.card i:active{
	transition: none;
	transform: scale(0.9);
}
.home>.card:hover i{
	opacity: 1;
}

.home>.card .container{
	flex: 1;
	height: 100%;
	padding: 40px 15%;
	display: flex;
	overflow-x: hidden;
}
.home>.card .container .item{
	flex-shrink: 0;
	width: 100%;
	opacity: 0;
	transition: var(--transition-speed);
}
.home>.card .container .item.active{
	opacity: 1;
}
.home>.card .container .item h2{
	margin: 15px 0;
	padding: 5px 20px;
	background-color: rgba(255,255,255,0.6);
	box-shadow: var(--box-shadow2);
	border-radius: 5px;
	display: inline-block;
}
.home>.card .container .item p{
	margin: 10px 0;
	max-width: 50%;
	padding: 10px;
	background-color: rgba(255,255,255,0.8);
	box-shadow: var(--box-shadow2);
	border-radius: 5px;
}

.home>header{
	padding: 10px 0;
	border-bottom: var(--border1);
	color: var(--dark-remark);
}
.home>header h1{
	max-width: 1000px;
	margin: 0 auto;
}

.home .body{
	margin: 20px auto;
	max-width: 1000px;
	display: flex;
}
.home .body .left{
	flex: 1;
}
.home .body .left .card{
	border: 1px solid;
	border-radius: 4px;
}
.home .body .left .card h3{
	padding: 5px;
	color: #FFFFFF;
}
.home .body .left .card.blue{
	border-color: rgba(109,200,236,0.5);
}
.home .body .left .card.blue h3{
	color: rgba(109,200,236,1);
	background-color: rgba(109,200,236,0.2);
}
.home .body .left .card.green{
	border-color: rgba(90,216,166,0.5);
}
.home .body .left .card.green h3{
	color: rgba(90,216,166,1);
	background-color: rgba(90,216,166,0.2);
}

.home .body .right{
	margin-left: 10px;
	width: 250px;
	border: var(--border1);
}
</style>
