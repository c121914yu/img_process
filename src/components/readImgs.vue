<template>
  <div class="read">
    <tailor v-if="cutImg" :url="cutUrl" @cutRes="cutRes">
    </tailor>
    <el-image
      class="img"
      v-for="(url,index) in urls"
      :class="currentIndex === index ? 'current':''"
      :key="index"
      :src="url"
      fit="scale-down"
      @mousedown="mousedown"
      @mousewheel="mousewheel"
     >
    </el-image>
    <div class="icon">
      <i class="el-icon-back back" @click="back"></i>
      <i class="el-icon-right next" @click="next"></i>
    </div>
    <div class="tool">
      <i class="el-icon-close" @click="close"></i>
      <i class="el-icon-scissors" @click="cut"></i>
      <i class="el-icon-delete" @click="remove"></i>
    </div>
  </div>
</template>

<script>
  import tailor from './tailor.vue'
  var x,y,l,t,Dom
  var scale = 1
  var move = false
  export default{
    data(){
      return{
        cutImg : false,
        cutUrl : '',
        currentIndex : 0,
      }
    },
    props:{
      urls : Array,
      files : Array,
      index : Number
    },
    methods:{
      next(){
        if(this.currentIndex === this.urls.length-1)
          this.currentIndex = 0
        else
          this.currentIndex++
        this.init()
      },
      back(){
        if(this.currentIndex === 0)
          this.currentIndex = this.urls.length-1
        else
          this.currentIndex--
        this.init()
      },
      close(){
        this.$emit('closeRead',this.files,this.urls)
      },
      cut(){
        this.cutUrl = this.urls[this.currentIndex]
        this.cutImg = true
      },
      remove(){
        this.urls.splice(this.currentIndex,1)
        this.files.splice(this.currentIndex,1)
        this.back()
        if(this.urls.length === 0)
          this.close()
        else
          this.init()
      },
      cutRes(file){
        if(file != ''){
          this.urls[this.currentIndex] = window.URL.createObjectURL(file)
          this.files[this.currentIndex] = file
        }
        this.cutImg = false
      },
      init(){
        if(this.urls.length === 1){
          document.querySelector('.read .icon .back').style.display = "none"
          document.querySelector('.read .icon .next').style.display = "none"
        }
        if(Dom){
          scale = 1
          Dom.style.transform = `scale(${scale})`
          Dom.style.left = 'auto'
          Dom.style.top = 'auto'
        }
      },
      mousedown(e){
        Dom = document.querySelector('.current');
        Dom.style.transition = '0s'
        Dom.style.cursor = 'move'
        e.preventDefault()
        //算出鼠标相对元素的位置
        x = e.clientX
        y = e.clientY
        l = Dom.offsetLeft
        t = Dom.offsetTop
        move = true
        document.onmousemove = (e) => {
          if(!move)
            return
          const nx = e.clientX
          const ny = e.clientY
          const nl = nx - (x-l) + 'px'
          const nt = ny - (y-t) + 'px'
          Dom.style.left = nl
          Dom.style.top = nt
        }
        document.onmouseup = () => {
          move = false
          if(Dom){
            Dom.style.transition = '0.5s'
            Dom.style.cursor = 'default'
          }
        }
      },
      mousewheel(e){
        e.preventDefault()
        Dom = document.querySelector('.current');
        const wheelDelta = e.wheelDelta
        if(wheelDelta < 0)//缩小
          scale *= 0.8
        else
          scale *= 1.2
        Dom.style.transform = `scale(${scale})`
      }
    },
    created() {
      this.currentIndex = this.index
      this.urls = this.urls
    },
    mounted() {
      setTimeout(()=>{
        document.querySelector('.read').style.opacity = 1
        this.init()
      })
    },
    components:{
      tailor
    }
  }
</script>

<style scoped>
.read{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 999;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: .5s;
}
.read .img{
  position: absolute;
  width: 100%;
  height: 100%;
  max-width: 80vw;
  max-height: 95vh;
  opacity: 0;
  transition: .5s;
  user-select: none;
  z-index: 1;
}
.read .img.current{
  z-index: 2;
  opacity: 1;
  transform: scale(1);
}
.read .icon{
  z-index: 3;
  position: absolute;
  width: 97%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.read .icon i{
  color: #F4F4F4;
  font-size: 1.5rem;
  padding: 0.5rem;
  border: 1px solid #FFFFFF;
  border-radius: 50%;
  cursor: pointer;
  transition: .5s;
}
.read .icon i:hover{
  background-color: rgba(0,0,0,0.4);
  border-color: rgba(0,0,0,0.4);
}

.read .tool{
  z-index: 3;
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-direction: column;
}
.read .tool i{
  color: #F4F4F4;
  font-size: 1.5rem;
  padding: 0.5rem;
  background-color: rgba(0,0,0,0.4);
  border-radius: 50%;
  transition: .5s;
  cursor: pointer;
  margin-bottom: 10px;
}
.read .tool i:hover{
  background-color: rgba(0,0,0,0.6);
}
</style>
