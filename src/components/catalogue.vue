<template>
	<div class="catalogue">
		<h2>{{title}}</h2>
		<a 
			v-for="(item,index) in list"
			:key="index"
			:href="`#${index+1}`"
		>
			{{index+1}}. {{item}}
		</a>
	</div>
</template>

<script>
export default{
	props:{
		title: String,
		list: Array,
	}
}
</script>

<style scoped>
.catalogue{
	z-index: 9;
	position: fixed;
	top: 0;
	left: 0;
	width: 250px;
	min-height: 100vh;
	padding: 80px 20px;
	background-color: #FFFFFF;
	border-right: var(--border1);
	overflow: hidden;
	transition: var(--transition-speed);
}
.catalogue a{
	margin: 10px 0;
	padding: 10px;
	border-radius: 5px;
	display: block;
}
.catalogue a:hover{
  background-color: var(--green1);
}
.catalogue a:hover{
  color: #FFFFFF;
}
</style>
