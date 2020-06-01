<template>
  <div class="extract">
    <readImgs
      v-if="readUrls.length>0"
      :files="files"
      :urls="readUrls"
      :index="readIndex"
      @closeRead="closeRead"
    >
    </readImgs>
    <catalogue title="图像提取" :list="catalogue_list"></catalogue>
    <div class="right">
      <h1>图像提取</h1>
      
      <h2 id="1" class="title">1 系统介绍</h2>
      <p class="introduct">&emsp;&emsp;图像是科研人员阅读文献时关注的重点。为了让科研人员更快速地批量获取科技文献图像，本功能利用目标检测算法Faster-RCNN进行图像定位和识别。Faster-RCNN算法的原理是将训练数据集做好标签后输入网络进行训练，利用边框回归获得目标的精确位置。本功能的训练数据集为两万篇arXiv预印本文献。使用方法：选择一篇科技文献上传，系统将调用训练好的模型识别并提取文献中包含的图像。图像将以默认的格式输出。</p>
      
      <h2 id="2" class="title">2 效果演示</h2>
      <el-image
        class="img"
        src="../../static/img/imgExtTest1.jpg"
        fit="scale-down"/>
      <p class="blockquote">
        <ol>
          <li>点击添加图片可选择多张测试图片</li>
          <li>点击重置可恢复至初始状态</li>
          <li>点击运行等待运行结果</li>
        </ol>
      </p> 
      <el-image
        class="img"
        src="../../static/img/imgExtTest2.jpg"
        fit="scale-down"/>
      <p class="blockquote">
        <ol>
          <li>点击图片可进行大图预览</li>
          <li>大图预览状态下可以删除或裁剪当前图片</li>
        </ol>
      </p>
      
      <h2 id="3" class="title">3 在线测试</h2>
      <div>
        <div class="upfile">
          <loading v-if="loading"></loading>
          <div class="files">
            <el-image
              class="img"
              v-for="(item,index) in upurls"
              :key="index"
              :src="item"
              fit="scale-down"
              @click="read(0,index)"
             >
            </el-image>
          </div>
          <div class="btns">
            <label class="check">
              <p class="btn">添加图片</p>
              <input type="file" @change="checkImgs" multiple>
            </label>
            <el-button class="btn" @click="clearFiles">重置</el-button>
            <el-button class="btn" @click="run">运行</el-button>
          </div>
        </div>
        
        <div class="resImg" v-if="resImgs.length>0">
          <div 
            class="item"
            v-for="(item,index) in resImgs"
            :key="index"
          >
            <el-image
              class="img"
              :key="index"
              :src="item"
              fit="scale-down"/>
            <p class="label">{{resLabel[index]}}</p>
						<div class="mask">
							<i class="el-icon-view" @click="read(1,index)"></i>
							<i class="iconfont icon-seban" @click="to_pix2pix(item)"></i>
							<i class="el-icon-download" @click="downLoadImg(item)"></i>
						</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
 import loading from '../components/loading'
 import readImgs from '../components/readImgs'
 import catalogue from "../components/catalogue.vue"
 export default{
   data(){
     return{
       readIndex : 0,
       readUrls : [],
       loading : false,
			 catalogue_list: ["系统介绍","效果演示","在线测试"],
       files : [],
       upurls : [],
       resImgs : [],
       resLabel : []
     }
   },
   methods:{
     checkImgs(e){
       let reg = /image/
       this.files =  Array.from(e.target.files)
       for(let i=0;i<this.files.length;i++){
        if(!reg.test(this.files[i].type)){
          alert('文件类型错误,需选择图片')
          return
        }
        else{
          const url = window.URL.createObjectURL(this.files[i])
          this.upurls.push(url)
        }
       }
     },
     clearFiles(){
       this.files = []
       this.upurls = []
       this.resImgs = []
       this.resLabel = []
     },
     read(type,index){
       this.readIndex = index
       this.readUrls = type === 0 ? this.upurls : this.resImgs
     },
     closeRead(){
       this.readUrls = []
     },
     run(){
       if(this.files.length === 0)
         alert("未选择图片")
       else{
         this.loading = true
         let formData = new FormData()
         this.files.forEach(file => {
           formData.append('file',file)
         })
         formData.append('type','cut')
         this.$axios.post('/api/upimg',formData)
         .then(res => {
           console.log(res.data)
           if(res.data.status === 200){
             res.data.names.forEach(name => {
               const url = "http://localhost:3000/resImg/" + name
               this.resImgs.push(url)
               this.resLabel.push(this.findLabel(name))
             })
           }
           else{
             alert('模型运行错误')
           }
           this.loading = false
         })
         .catch(err => {
           this.loading = false
           console.log(err)
           alert('网络错误')
         })
       }
     },
     findLabel(text){
      const reg = new RegExp('(?<=-).+(?=[0-9])')
      return text.match(reg)[0]
     },
		 to_pix2pix(url){
			 global.color_img_url = url
			 this.$router.push({name:"pix2pix"})
		 },
		 downLoadImg(url){
			 fetch(url)
			 .then(res => res.blob())
			 .then(blob => {
				 var a = document.createElement('a')
				 var url = window.URL.createObjectURL(blob)
				 var filename = `${+(new Date())}.png`
				 a.href = url
				 a.download = filename
				 a.click()
				 window.URL.revokeObjectURL(url)
			 })
		 }
   },
   components:{
     loading,
     readImgs,
		 catalogue
   }
 }
</script>

<style>
.extract{
  width: 100vw;
  height: 100vh;
  position: relative;
  padding-top: 50px;
  overflow-x: hidden;
  background-color: #FFFFFF;
}

.extract .right{
  margin-left: 30%;
  margin-right: 5%;
  padding: 10px;
  max-width: 900px;
}
.extract .right h1{
  padding-bottom: 5px;
  border-bottom: var(--border1);
}
.extract .right h2{
  padding: 10px 0;
}
.extract .right .introduct{
  margin: 10px;
}

.extract .right .upfile{
  box-shadow: 0 0 5px rgba(0,0,0,0.2);
  padding: 5px 0;
  border-radius: 10px;
  position: relative;
	overflow: hidden;
}
.extract .right .upfile .files{
  height: 200px;
  padding-bottom: 5px;
  display: flex;
  overflow-x: auto;
}
.extract .right .upfile .files .img{
  flex-shrink: 0;
  width: 32%;
  margin: 0 5px;
  cursor: pointer;
}
.extract .right .upfile .btns{
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
}
.extract .right .upfile .btns .btn{
  width: 20%;
  padding: 5px 0;
}

.extract .right .upfile .btns .check{
  width: 20%;
}
.extract .right .upfile .btns .check .btn{
  width: 100%;
  padding: 5px 10px;
  border: var(--border1);
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
}
.extract .right .upfile .btns .check .btn:hover{
  border-color: #c6e2ff;
  background-color: #ecf5ff;
  color: var(--blue);
}

.extract .right .resImg{
  box-shadow: var(--box-shadow1);
  padding: 5px;
  border-radius: 10px;
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(3,1fr);
  grid-gap: 5px;
}
.extract .right .resImg .item{
  width: 100%;
  position: relative;
	overflow: hidden;
}
.extract .right .resImg .item .img{
  width: 100%;
  z-index: 1;
}
.extract .right .resImg .label{
  position: absolute;
  z-index: 9;
  width: 100%;
  bottom: 0;
  font-size: 0.8rem;
  text-align: center;
  background-color: rgba(0,0,0,0.5);
  color: #FFFFFF;
  border-radius: 5px;
}
.extract .right .resImg .item .mask{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 0;
	background-color: rgba(0,0,0,0.2);
	z-index: 2;
	display: flex;
	align-items: center;
	justify-content: space-around;
	overflow: hidden;
	transition: var(--hover-speed);
}
.extract .right .resImg .item:hover .mask{
	height: 100%;
}
.extract .right .resImg .item .mask i{
	flex-shrink: 0;
	width: 50px;
	height: 50px;
	line-height: 50px;
	text-align: center;
	color: #FFFFFF;
	font-size: 2em;
	border-radius: 5px;
	cursor: pointer;
}
.extract .right .resImg .item .mask i:hover{
	background-color: rgba(0,0,0,0.3);
}
</style>
