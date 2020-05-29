<template>
  <div class="tailor">
    <vueCropper
      ref="cropper"
      class="cropper"
      :img="url"
      :full="true"
      :fixed="false"
      :autoCropWidth="9999"
      :autoCropHeight="9999"
      :auto-crop="true"
      :center-box="true"
    >
    </vueCropper>
    <div class="tool">
      <i class="el-icon-close" @click="cut('close')"></i>
      <i class="el-icon-check" @click="cut('cut')"></i>
    </div>
  </div>
</template>

<script>
  import { VueCropper }  from 'vue-cropper'
  export default{
    props:{
      url : String
    },
    methods:{
      cut(type){
        if(type === 'close')
          this.$emit("cutRes",'')
        else
          this.$refs.cropper.getCropBlob((data) => {
            const file = new File([data], Date.now()+".png", {type: data.type, lastModified: Date.now()});
            this.$emit("cutRes",file)
          })
      },
      base64ToBlob(data) {
        let arr = data.split(',')
        let mime = arr[0].match(/:(.*?);/)[1]
        // 去掉url的头，并转化为byte
        let bytes = window.atob(arr[1])
        // 处理异常,将ascii码小于0的转换为大于0
        let ab = new ArrayBuffer(bytes.length)
        // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
        let ia = new Uint8Array(ab)
        for (let i = 0; i < bytes.length; i++) {
          ia[i] = bytes.charCodeAt(i)
        }
        return new Blob([ab], {
          type: mime
        })
      },
    },
    components: {
      VueCropper,
    },
  }
</script>

<style scoped>
  .tailor{
    z-index: 10;
    position: absolute;
    top: 2.5%;
    left: 0;
    width: 100%;
    height: 95%;
    background-color: rgba(0,0,0,0.5);
  }
  .tailor .tool{
    z-index: 3;
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    display: flex;
    flex-direction: column;
  }
  .tailor .tool i{
    color: #F4F4F4;
    font-size: 1.5rem;
    padding: 0.5rem;
    background-color: rgba(0,0,0,0.4);
    border-radius: 50%;
    transition: .5s;
    cursor: pointer;
    margin-bottom: 10px;
  }
  .tailor .tool i:hover{
    background-color: rgba(0,0,0,0.6);
  }
</style>
