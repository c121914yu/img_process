<template>
  <div class="pix2pix">
   <readImgs
     v-if="readUrls.length>0"
     :files="files"
     :urls="readUrls"
     :index="readIndex"
     @closeRead="closeRead"
   >
   </readImgs>
   <div class="catalog">
     <h2>图像上色</h2>
     <p><a href="#1">1. 系统介绍</a></p>
     <p><a href="#2">2. 效果演示</a></p>
     <p><a href="#3">3. 在线测试</a></p>
     <p><a href="#4">4. 颜色推荐</a></p>
     <p v-if="resImgs.length>0"><a href="#5">5. 画图源码</a></p>
   </div>
   <div class="right">
     <h1>图像上色</h1>
     
     <h2 id="1">1 系统介绍</h2>
     <p class="introduct">&emsp;&emsp;科研人员绘制图像时，往往依据个人经验选择图像颜色。本功能利用图像生成算法pix2pix，为图像进行自动上色，可以为科研人员推荐合适的图像颜色。该算法的原理是利用成对的图像进行训练，然后利用输入图像生成相应的输出图像。需要注意的是，输出图像存在边缘模糊、色彩混杂的问题，本功能设计了后续步骤来解决。本功能的训练数据集为免费搜索引擎PubMed上提供的312万幅文献图像。使用方法：上传一幅你绘制好的图像或者上传一页文献并框定图像范围，选择图像颜色数量后系统将调用训练好的模型给出图像颜色的RGB值。然后，你可以输入推荐的RGB值和相应参数，系统将自动为你画出图像并给出Python代码以供参考。</p>
     
     <h2 id="2">2 效果演示</h2>
     <el-image
       class="img"
       src="../../static/img/pixtest1.jpg"
       fit="scale-down"/>
     <el-image
       class="img"
       src="../../static/img/pixtest2.jpg"
       fit="scale-down"/>
     <p class="blockquote">
       <ol>
         <li>点击选择图片选择一张图片</li>
         <li>添加颜色数（整数）</li>
         <li>点击运行等待运行结果</li>
         <li>第一步运行将获得一组rgb值及默认生成一张配色图</li>
       </ol>
     </p> 
     <el-image
       class="img"
       src="../../static/img/pixtest3.jpg"
       fit="scale-down"/>
     <p class="blockquote">
       <ol>
         <li>修改饼状图参数</li>
         <li>点击自定义生成配色图</li>
       </ol>
     </p>
     
     <h2 id="3">3 在线测试</h2>
     <div style="position: relative;">
       <loading v-if="loading"></loading>
       <div class="upfile">
         <div class="file">
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
             <p class="btn">选择图片</p>
             <input type="file" id="checkFile" @change="checkImgs">
           </label>
           <el-button class="btn" @click="clearFiles">重置</el-button>
           <el-select 
             class="btn" 
             placeholder="图片类型"
             v-model="param.modelDir">
             <el-option
               v-for="item in modelDirs"
               :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
           </el-select>
           <div class="btn">
             <p>颜色数量:</p>
             <input type="number" v-model="param.k" min="1" placeholder="颜色数量">
           </div>
           <el-button class="btn" @click="run">运行</el-button>
         </div>
       </div>
     
       <div class="rgba-param" v-if="param.rgb.length>0">
         <p class="center">
           画图参数
           <span class="remark">* rgb,data,X与Y的格式，数之间以空格隔开</span>
         </p>
         <div class="param-btns">
           <el-button class="btn" @click="addRGB">增加RGB</el-button>
           <el-button class="btn" @click="removeRGB">减少RGB</el-button>
           <el-button class="btn" @click="normal">恢复默认</el-button>
         </div>
         
         <div class="content" v-if="param.modelDir === 'curve'">
           <div
            class="curve"
            v-for="index in param.rgb.length"
            :key="index"
           >
            <div class="input">
              <div>rgb{{index}}: </div>
              <input
                type="text"
                v-model="param.rgb[index-1]"
                :placeholder="'rgb'+index"
              >
            </div>
            <div class="input">
              <div>X{{index}}: </div>
              <input
                class="input"
                type="text"
                v-model="param.curveX[index-1]"
                :placeholder="'X'+index"
              >
            </div>
            <div class="input">
              <div>Y{{index}}: </div>
              <input
                type="text"
                v-model="param.curveY[index-1]"
                :placeholder="'Y'+index"
              >
            </div>
            <div class="input">
              <div>线宽{{index}}: </div>
              <input
                type="number"
                v-model="param.curveWidth[index-1]"
                min="1"
                :placeholder="'线宽'+index"
              >
            </div>
            <div class="input">
              <div>线型{{index}}</div>
              <el-select
                class="btn" 
                placeholder="线样式"
                v-model="param.linestyle[index-1]">
                <el-option
                  v-for="item in lineStyles"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
           </div>
         </div>
         
         <div class="content">
           <div
             v-if="param.modelDir != 'curve'"
             class="input"
             v-for="index in param.rgb.length"
             :key="index"
           >
             <div>rgb{{index}}: </div>
             <input
               type="text"
               v-model="param.rgb[index-1]"
               :placeholder="'rgb'+index"
             >
           </div>
           
           <div 
             class="input"
             v-for="item in inputs"
             :key="item.param"
           >
             <div>{{item.text}}: </div>
             <input
               type="text"
               v-model="param[item.param]"
               :placeholder="item.placeholder"
             >
           </div>
         
         </div>
       </div>
       
       <div class="result" v-if="resImgs.length>0">
         <div class="img">
           <el-image
             :src="resImgs[0]"
             fit="scale-down"
             @click="read(1,0)"
           >
           </el-image>
           <span class="text center">默认</span>
         </div>
         <div class="img">
           <el-image
             v-if="resImgs[1]"
             :src="resImgs[1]"
             fit="scale-down"
             @click="read(1,1)"
           >
           </el-image>
           <div v-else style="flex: 1;"></div>
           <span class="text center run2" @click="run2(1)">点击生成自定义配色</span>
         </div>
       </div>
     </div>
     
     <h2 id="4">4 颜色推荐</h2>
     <p>&emsp;&emsp;颜色推荐表介绍：我们选取了部分高影响因子的计算机科学期刊，筛选出了一些论文中包含的折线图、柱状图和饼图。我们将这些图像进行了预处理，排除坐标、文字、图示等干扰，保留了彩色线条和图案。最终我们统计了以下七种具有代表性的颜色的RGB值，并给出了相应的参考范围，希望对你的绘图有所帮助。需要注意的是，颜色是渐变的，下表给出的范围仅供参考，并不代表该颜色的所有区间。</p>
     <table style="margin: 10px 0;">
       <thead>
         <tr>
           <th>颜色名称</th>
           <th>RGB范围</th>
           <th>实色效果</th>
         </tr>
       </thead>
       <tbody>
         <tr
          v-for="item in colorsShow"
          :key="item.name"
         >
           <td>{{item.name}}</td>
           <td>{{item.range}}</td>
           <td class="color">
             <div class="colorSquare" :style="'background-color: rgb'+item.actual"></div>
             <span>{{item.actual}}</span>
           </td>
         </tr>
       </tbody>
     </table>
     
     <h2 id="5" v-if="resImgs.length>0">5 画图源码</h2>
     <codeShow v-if="resImgs.length>0"></codeShow>
   </div>
  </div>
</template>

<script>
import loading from '../components/loading'
import readImgs from '../components/readImgs'
import codeShow from '../components/codeShow.vue'
export default{
  data(){
    return{
      readIndex : 0,
      readUrls : [],
      loading : false,
      files : [],
      upurls : [],
      resImgs : [],
      modelDirs : [
        {value:'pie',label:"饼状图"},
        {value:'bar',label:"柱状图"},
        {value:'curve',label:"折线图"}
      ],
      lineStyles : [
        {value:'-',label:"实线"},
        {value:':',label:"点虚线"},
        {value:'--',label:"线虚线"},
        {value:'-.',label:"点线"},
      ],
      normalParam : {},
      param : {},
      colorsShow : [
        {name:"蓝色",range:"R:55-110 G:55-110 B:190-235",actual:"(55,55,235)"},
        {name:"红色",range:"R:185-230 G:10-70 B:10-70",actual:"(230,10,10)"},
        {name:"绿色",range:"R:50-100 G:155-220 B:50-100",actual:"(50,220,50)"},
        {name:"黄色",range:"R:190-230 G:155-220 B:10-50",actual:"(230,200,10)"},
        {name:"紫色",range:"R:190-230 G:10-80 B:190-230",actual:"(230,10,230)"},
        {name:"青色",range:"R:20-70 G:190-230 B:190-230",actual:"(70,220,220)"},
        {name:"灰色",range:"R:150-200 G:150-200 B;150-200",actual:"(170,170,170)"}
      ]
    }
  },
  methods:{
    checkImgs(e){
      if(e.target.files.length > 0){
        this.clearFiles()
        let reg = /image/
        this.files =  Array.from(e.target.files)
        for(let i=0;i<this.files.length;i++){
         if(!reg.test(this.files[i].type)){
           alert('文件类型错误,需选择图片')
           return
         }
         else{
           const url = window.URL.createObjectURL(this.files[i])
           this.upurls[0] = url
           this.$forceUpdate()
         }
        }
      }
    },
    clearFiles(){
      this.files = []
      this.upurls = []
      this.resImgs = []
      this.resLabel = []
      this.initParam('','')
    },
    read(type,index){
      this.readIndex = index
      this.readUrls = type === 0 ? this.upurls : this.resImgs
    },
    closeRead(){
      this.readUrls = []
    },
    run(){
      if(!this.files[0])
        global.message(this,'请选择图片')
      else if(this.param.modelDir === "")
        global.message(this,'请选择图片类型')
      else if(this.param.k === "")
        global.message(this,'请输入参数')
      else{
        this.initParam(this.param.modelDir,this.param.k)
        this.resImgs = []
        this.loading = true
        let formData = new FormData()
        formData.append('file',this.files[0])
        formData.append('type','pix2pix')
        formData.append('param_K',this.param.k)
        formData.append('modelDir',this.param.modelDir)
        this.$axios.post('/api/upimg',formData)
        .then(res => {
          if(res.data.status === 200){
            let Index = 0
            let dataArr = []
            let barXArr = []
            res.data.rgb.forEach((item,index) => {
              if(!(item[0]>250 && item[1]>250 && item[2]>250)){
                this.param.rgb.push(item.join(' ')) 
                dataArr.push(10)
                barXArr.push(Index)
                this.param.curveWidth.push(2)
                this.param.linestyle.push('-')
                this.param.curveX.push('1 2 3')
                this.param.curveY.push(`${Index} ${Index+1} ${Index+2}`)
                Index++
              }
            })
            this.param.data = dataArr.join(' ')
            this.param.barX = barXArr.join(' ')
            this.normalParam = JSON.stringify(this.param)
            this.run2(0)
          }
          else{
            this.loading = false
            alert("模型1运行错误")
          }
        })
        .catch(err => {
         console.log(err)
         this.loading = false
         alert('网络错误')
        })
      }
    },
    run2(index){
      if(this.judgeData()){
        this.loading = true
        this.$axios.post('/api/img_repaint',this.param)
        .then(res => {
        	if(res.data.status === 200)
            this.resImgs[index] = "http://localhost:3000/resImg/" + res.data.name
          else
            alert('模型2运行错误')
          this.$forceUpdate()
          this.loading = false
        })
        .catch(err => {
          this.loading = false
          console.log(err)
        	alert("网络错误")
        })
      }
      else
        this.loading = false
    },
    judgeData(){
    	const reg1 = /^[0-9]+$/ //判断数字
    	// 判断0-255
    	const reg2 = /^(([0-9])|([1-9][0-9])|(1[0-9][0-9])|(2[0-4][0-9])|(25[0-5])) (([0-9])|([1-9][0-9])|(1[0-9][0-9])|(2[0-4][0-9])|(25[0-5])) (([0-9])|([1-9][0-9])|(1[0-9][0-9])|(2[0-4][0-9])|(25[0-5]))$/ 
    	const reg3 = /^(([0-9]+ )*[0-9]+)$/
    	
    	for(let i=0;i<this.param.rgb.length;i++){ //判断rgb输入是否正确
    		const val = this.param.rgb[i]
    		if(!reg2.test(val)){
    			global.message(this,`rgb${i+1}输入格式有误,请注意范围:0-255,注意数字之间只有1个空格,例如50 60 40`)
    			return false
    		}
    	}
    	if(!reg1.test(this.param.brightness)){
    		global.message(this,'亮度输入错误,请输入整数')
    		return false
    	}
    	if(!reg3.test(this.param.data)){
    		global.message(this,'数据输入错误,注意数字之间只有1个空格,例如50 60 40')
    		return false
    	}
      if(this.param.data.split(' ').length != this.param.rgb.length && this.param.modelDir != "curve"){
        global.message(this,'数据长度与RGB长度不等')
        return false
      }
      if(this.param.modelDir === 'bar' && !reg3.test(this.param.barX)){
        global.message(this,'x轴刻度输入错误,注意数字之间只有1个空格,例如1 2 3')
        return false
      }
      if(this.param.modelDir === 'curve') //判断折线坐标输入是否正确
        for(let i=0;i<this.param.curveX.length;i++){
          const Xlength = this.param.curveX[i].split(' ').length
          const Ylength = this.param.curveY[i].split(' ').length
          if(Xlength != Ylength){
            global.message(this,`X${i+1}与Y${i+1}长度不一致`)
            return false
          }
          if(!reg3.test(this.param.curveX[i])){
            global.message(this,`X${i+1}输入错误,注意数字之间只有1个空格,例如1 2 3`)
            return false
          }
          if(!reg3.test(this.param.curveY[i])){
            global.message(this,`Y${i+1}输入错误,注意数字之间只有1个空格,例如1 2 3`)
            return false
          }
        }
    	return true
    },
    initParam(modelDir,k){
      this.param = {
        //公共参数
        modelDir : modelDir,
        k : k,
        rgb : [],
        data : '',
        brightness : 20,
        title_name : "example",
        edgecolor : "black",
        //饼状图参数
        labeldistance : 0.48,
        startangle : 90,
        text_fontsize : 15,
        text_color : "white",
        linewidth : 1,
        //柱状图参数
        barX : '',
        alpha : 1,
        barWidth : 0.3,
        lw : 1,
        //折线图参数
        curveX : [],
        curveY : [],
        linestyle : [],
        curveWidth : []
      }
    },
    addRGB(){
      this.param.rgb.push(this.param.rgb[0])
      
      const length = this.param.curveX.length
      this.param.curveWidth.push(2)
      this.param.linestyle.push('-')
      this.param.curveX.push('1 2 3')
      this.param.curveY.push(`${length} ${length+1} ${length+2}`)
      
      if(this.param.barX === '')
        this.param.barX = '0'
      else{
        const barX = this.param.barX.split(' ').length
        this.param.barX += ` ${barX}`
      }
      
      if(this.param.data === '')
        this.param.data = '10'
      else{
        const data = this.param.data.split(' ')[0]
        this.param.data += ` ${data}`
      }
    },
    removeRGB(){
      if(this.param.rgb.length <= 1)
        return
      this.param.rgb.pop()
      this.param.curveWidth.pop()
      this.param.linestyle.pop()
      this.param.curveX.pop()
      this.param.curveY.pop()
      
      let barXArr = this.param.barX.split(' ')
      barXArr.pop()
      console.log(barXArr)
      this.param.barX = barXArr.join(' ')
      
      let dataArr = this.param.data.split(' ')
      dataArr.pop()
      this.param.data = dataArr.join(' ')
    },
    normal(){
      this.param = JSON.parse(this.normalParam)
    }
  },
  computed:{
    inputs(){
      const common = [
        {param:'data',text:"数据",placeholder:"数据大小"},
        {param:'title_name',text:"标题",placeholder:"图片标题"},
        {param:'brightness',text:"亮度",placeholder:"图片亮度"},
        {param:'edgecolor',text:"边界颜色",placeholder:"边界颜色"},
      ]
      const pie = [
        {param:'labeldistance',text:"标心距",placeholder:"标签与原点距离"},
        {param:'startangle',text:"初始角度",placeholder:"饼图的初始角度"},
        {param:'text_fontsize',text:"标签大小",placeholder:"标签的字体大小"},
        {param:'text_color',text:"标签颜色",placeholder:"标签颜色"},
        {param:'linewidth',text:"边界宽度",placeholder:"饼图边界的宽度"},
      ]
      const bar = [
        {param:'barX',text:"x轴刻度",placeholder:"x轴刻度"},
        {param:'alpha',text:"透明度(0-1)",placeholder:"透明度(0-1)"},
        {param:'barWidth',text:"柱子宽度",placeholder:"柱子宽度"},
        {param:'lw',text:"轮廓宽度",placeholder:"柱子轮廓宽度"},
      ]
      const curve = common.slice(1)
      switch(this.param.modelDir){
        case 'pie' : return common.concat(pie)
        case 'bar' : return common.concat(bar)
        case 'curve' : return curve
        default : return []
      } 
    }
  },
  created() {
    this.initParam('','')
  },
  components:{
    loading,
    readImgs,
    codeShow
  }
}
</script>

<style>
.pix2pix{
  width: 100vw;
  height: 100vh;
  position: relative;
  padding-top: 80px;
  overflow-x: hidden;
  background-color: #FFFFFF;
}

.pix2pix .catalog{
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
.pix2pix .catalog h2{
  color: var(--font-dark1);
}

.pix2pix .right{
  margin-left: 30%;
  margin-right: 5%;
  padding: 10px;
  max-width: 900px;
}
.pix2pix .right h1{
  padding-bottom: 5px;
  border-bottom: var(--border1);
}
.pix2pix .right h2{
  padding: 10px 0;
}
.pix2pix .right .introduct{
  margin: 10px;
}

.pix2pix .right .upfile{
  box-shadow: var(--box-shadow1);
  border-radius: 10px;
  display: flex;
}
.pix2pix .right .upfile .file{
  width: 80%;
  height: 250px;
  position: relative;
  text-align: center;
}
.pix2pix .right .upfile .img{
  height: 100%;
  cursor: pointer;
}
.pix2pix .right .upfile .btns{
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
.pix2pix .right .upfile .btns .btn{
  width: 90%;
  padding: 5px 0;
}
.pix2pix .right .upfile .btns .btn p{
  font-size: 0.8rem;
  color: var(--font-dark-remark);
}
.pix2pix .right .upfile .btns .btn input{
  padding: 5px 10px;
  width: 100%;
}

.pix2pix .right .upfile .btns .check{
  width: 90%;
}
.pix2pix .right .upfile .btns .check .btn{
  width: 100%;
  padding: 5px 10px;
  border: var(--border1);
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
}
.pix2pix .right .upfile .btns .check .btn:hover{
  border-color: var(--green1);
  background-color: rgba(90,216,166,0.2);
  color: var(--green2);
}
.pix2pix .right .upfile .btns .check input{
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  cursor: pointer;
  z-index: 999;
}

.pix2pix .right .rgba-param{
  margin-top: 15px;
  box-shadow: var(--box-shadow1);
  border-radius: 10px;
  padding: 10px;
  position: relative;
}
.pix2pix .right .rgba-param .remark{
  font-size: 0.8rem;
  color: var(--font-dark-remark);
}

.pix2pix .right .rgba-param .param-btns .btn{
  margin-top: 5px;
  padding: 5px 10px;
}

.pix2pix .right .rgba-param .content{
  margin: 5px 0;
  display: grid;
  grid-template-columns: repeat(2,1fr);
  grid-gap: 10px;
  text-align: center;
  position: relative;
}
.pix2pix .right .rgba-param .content .input{
  display: flex;
  align-items: center;
}
.pix2pix .right .rgba-param .content .input div{
  width: 95px;
  text-align: start;
}
.pix2pix .right .rgba-param .content .curve{
  display: flex;
  flex-direction: column;
}
.pix2pix .right .rgba-param .content .curve .input{
  margin-bottom: 10px;
}

.pix2pix .right .result{
  margin-top: 15px;
  width: 100%;
  box-shadow: var(--box-shadow1);
  border-radius: 10px;
  display: flex;
  text-align: center;
}
.pix2pix .right .result .img{
  width: 50%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pix2pix .right .result .img:first-child{
  margin-right: 5px;
}
.pix2pix .right .result span{
  bottom: 0;
  margin: 5px 0;
  cursor: default;
}
.pix2pix .right .result span.run2{
  display: inline-block;
  cursor: pointer;
  border: var(--border1);
  border-radius: 5px;
  padding: 0 10px;
}
.pix2pix .right .result span.run2:hover{
  border-color: var(--green1);
  background-color: rgba(90,216,166,0.2);
  color: var(--green2);
}

.color{
  display: flex;
  align-items: center;
}
.color .colorSquare{
  margin: 0 10px;
  width: 30px;
  height: 20px;
}

@media (max-width:900px) {
  .pix2pix .catalog{
    left: -250px;
  }
  .pix2pix .right{
    width: 90%;
    margin: 0 auto;
  }

  .pix2pix .right .rgba-param .content{
    grid-template-columns: repeat(2,1fr);
  }
}
</style>
