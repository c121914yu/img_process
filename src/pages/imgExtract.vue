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
    <div class="catalog">
      <h2>图像提取</h2>
      <p class="navs"><a href="#1">系统介绍</a></p>
      <p class="navs"><a href="#2">效果演示</a></p>
      <p class="navs"><a href="#3">在线测试</a></p>
    </div>
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
              <input type="file" id="checkFile" @change="checkImgs" multiple>
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
            @click="read(1,index)"
          >
            <el-image
              class="img"
              :key="index"
              :src="item"
              fit="scale-down"/>
            <p class="label">{{resLabel[index]}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
 import loading from '../components/loading'
 import readImgs from '../components/readImgs'
 export default{
   data(){
     return{
       readIndex : 0,
       readUrls : [],
       loading : false,
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
     getTitle(){//监听当前属于哪个标题
       const titles = document.querySelectorAll(".catalog .title")
       const dom = document.querySelector('.catalog .navs').children
       console.log(titles)
       let current = 0
       for(let i=0;i<titles.length;i++){
         const top = titles[i].getBoundingClientRect().top
         if(top > -5){
           current = i
           break
         }
       }
       for(let i=0;i<titles.length;i++)
         dom[i].classList.remove('current')
       dom[current].classList.add('current')
     },
   },
   mounted() {
     window.addEventListener("scroll",this.getTitle);
   },
   components:{
     loading,
     readImgs
   }
 }
</script>

<style>
.extract{
  width: 100vw;
  height: 100vh;
  position: relative;
  padding-top: 80px;
  overflow-x: hidden;
  background-color: #FFFFFF;
}

.extract .catalog{
  z-index: 9;
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  min-height: 100vh;
  padding: 90px 10px;
  background-color: #FFFFFF;
  border-right: var(--border1);
  overflow: hidden;
  transition: var(--transition-speed);
}
.extract .catalog h2{
  color: var(--font-dark1);
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
  box-shadow: var(--box-shadow1);
  padding: 5px 0;
  border-radius: 10px;
  position: relative;
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
  border-color: var(--green1);
  background-color: rgba(90,216,166,0.2);
  color: var(--green2);
  
}
.extract .right .upfile .btns .check input{
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  cursor: pointer;
  z-index: 999;
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
  cursor: pointer;
  position: relative;
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

@media (max-width:900px) {
  .extract .catalog{
    left: -250px;
  }
  .extract .right{
    width: 90%;
    margin: 0 auto;
  }
}
</style>
