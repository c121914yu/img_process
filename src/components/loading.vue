<template>
  <div class="load">
    <div class="loding">
    	<span></span>
    	<span></span>
    	<span></span>
    </div>
  </div>

</template>

<script>
</script>

<style>
.load{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
  z-index: 98;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loding{
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loding span{
  display: block;
  background-color: purple;
  width: 0;
  height: 0;
  border-radius: 50%;
  margin: 0 8px;
  animation: bounce 0.6s infinite alternate;
  transform: translateY(0);
}
.loding span:nth-child(2){
  background-color: palevioletred;
  animation-delay: 0.2s;
}
.loding span:nth-child(3){
  animation-delay: 0.4s;
}

@keyframes bounce{
  to{
    width: 16px;
    height: 16px;
    transform: translateY(-16px);
  }
}
</style>
