<template>
  <div class="codeShow">
		<i class="iconfont icon-fuzhi" @click="copy"></i>
    <div v-highlight>
      <pre>
        <code class="python language-python">
          {{code}}
        </code>
      </pre>
    </div>
  </div>
</template>

<script>
export default{
	data(){
		return{
		  code :
	`
	import matplotlib.pyplot as plt
	import os
	import cv2
	import argparse

	parser = argparse.ArgumentParser()
	parser.add_argument("--param", help="param")
	param = eval(parser.parse_args().param)

	parser.add_argument("--output_dir", default="./resImgs", help="output path")
	parser.add_argument("--rgb", default=param["rgb"], help="颜色，逗号隔开")
	parser.add_argument("--brightness", type=float, default=param["brightness"], help="选择亮度")
	parser.add_argument("--data", default=param["data"], help="数据(用空格隔开)")
	parser.add_argument("--chart_type", default=param["modelDir"], choices=["pie", "bar", "curve"], help="图表类型")
	parser.add_argument("--title_name", default=param["title_name"], help="饼图标题")
	parser.add_argument("--edgecolor", default=param["edgecolor"], help="边界颜色")
	# 饼图参数
	parser.add_argument("--labels", default=param["data"], help="饼图上的标签")
	parser.add_argument("--labeldistance", type=float, default=param["labeldistance"], help="标签和圆心的距离")
	parser.add_argument("--startangle", type=float, default=param["startangle"], help="饼图的初始角度")
	parser.add_argument("--text_fontsize", type=float, default=param["text_fontsize"], help="标签的字体")
	parser.add_argument("--text_color", default=param["text_color"], help="标签颜色")
	parser.add_argument("--linewidth", default=param["linewidth"], help="饼图边界的宽度")
	# 柱状图参数
	parser.add_argument("--x", default=param["barX"], help="x轴刻度")
	parser.add_argument("--alpha", type=float, default=param["alpha"], help="透明度(0-1)")
	parser.add_argument("--width", type=float, default=param["barWidth"], help="柱子宽度")
	parser.add_argument("--lw", type=float, default=param["lw"], help="柱子轮廓宽度")
	# 折线图参数
	parser.add_argument("--x_data", default=param["curveX"], help="x轴坐标")
	parser.add_argument("--y_data", default=param["curveY"], help="y轴坐标")
	parser.add_argument("--curve_linestyle", default=param["linestyle"], choices=["--", "-.", "-", ":"], help="线形")
	parser.add_argument("--curve_linewidth", type=float, default=param['curveWidth'], help="线条粗细")
	a = parser.parse_args()

	def RGB_to_Hex(tmp):
			rgb = tmp.split(' ')  # 将RGB格式划分开来
			strs = '#'

			for i in rgb:
					num = int(i)  # 将str转int
					# 将R、G、B分别转化为16进制拼接转换并大写
					strs += str(hex(num))[-2:].replace('x', '0').upper()

			return strs

	def brightness_control(path,b):
			image = cv2.imread(path) # 根据路径读取一张图片
			cv2.imshow("BGR", image) # 显示图片


			# 转化图片到HSV色彩空间
			dst = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
			# image2 = cv2.cvtColor(dst,cv2.COLOR_HSV2BGR)
			H, S, V = cv2.split(dst)
			h = V.shape[0]
			w = V.shape[1]
			for i in range(0, h):
					for j in range(0, w):
							if V[i,j] <= 200 :
									V[i,j] = V[i,j] + b

			merged = cv2.merge([H,S,V])

			image2 = cv2.cvtColor(merged,cv2.COLOR_HSV2BGR)
			return image2

	def image_write():
			img_dir = a.output_dir
			if not os.path.exists(img_dir):
					os.makedirs(img_dir)
			img_path = img_dir + '/' + param["resName"]
			# 第一次保存图像

			plt.savefig(img_path)

			image = brightness_control(img_path, a.brightness)
			# 调整完亮度后第二次保存图像，覆盖第一次保存的图像
			cv2.imwrite(img_path, image)
	# 绘制图像
	def main():
			if a.chart_type == 'pie':
					data = a.data.split(' ')
					# RGB颜色转为16进制表示
					color_hex_list = []
					color_list = a.rgb.split(',')
					for each in color_list:
							color_hex = RGB_to_Hex(each)
							color_hex_list.append(color_hex)

					colors = color_hex_list
					# colors = ['#F5FBF5','#C22A64','#87A2E8']

					plt.axes(aspect='equal')
					plt.pie(x=data,
									colors=colors,
									labels=a.labels.split(' '),
									labeldistance=a.labeldistance,
									startangle=a.startangle,
									textprops={'fontsize':a.text_fontsize,'color':a.text_color},
									wedgeprops={'linewidth': a.linewidth, 'edgecolor': a.edgecolor}
									)


					plt.title(a.title_name)

					image_write()

			if a.chart_type == 'bar':
					data = a.data.split(' ')
					# RGB颜色转为16进制表示
					color_hex_list = []
					color_list = a.rgb.split(',')
					for each in color_list:
							color_hex = RGB_to_Hex(each)
							color_hex_list.append(color_hex)

					colors = color_hex_list
					datas = []
					for each in data:
							each = int(each)
							datas.append(each)

					x = []
					for each in a.x.split(' '):
							each = int(each)
							x.append(each)

					plt.title(a.title_name, fontsize=20)  # 标题，并设定字号大小
					plt.xlabel(u'x', fontsize=14)  # x轴
					plt.ylabel(u'y', fontsize=14)  # y轴

					plt.bar(x=x,
									height=datas,
									color=colors,
									alpha=a.alpha,
									width=a.width,
									edgecolor=a.edgecolor,
									lw=a.lw,)

					image_write()

			if a.chart_type == 'curve':
					color_hex_list = []
					color_list = a.rgb.split(',')
					for each in color_list:
							color_hex = RGB_to_Hex(each)
							color_hex_list.append(color_hex)
			
					colors = color_hex_list
					x_data = a.x_data.split(',')
					y_data = a.y_data.split(',')
			
			
					for i in range(len(x_data)):#画出每一条折线
							x_data_curve = x_data[i].split(' ')#x轴数据
							y_data_curve = [int(y) for y in y_data[i].split(' ')]#y轴数据
			
							plt.plot(x_data_curve,
											 y_data_curve,
											 color=colors[i],
											 linewidth=float(a.curve_linewidth[i]),
											 linestyle=a.curve_linestyle[i])
			
							plt.title(a.title_name)
			
					image_write()

	main()
		`
		}
	},
	methods:{
		copy(){
			let textarea = document.createElement('textarea') //创建textarea元素
			textarea.value = this.code //将文本赋值给textarea
			document.body.appendChild(textarea) //添加到body中
			textarea.select() //选择文本
			document.execCommand('copy') //复制
			textarea.remove() //移除textarea
			global.message(this,"复制成功")
		}
	}
}
</script>

<style>
.codeShow{
  width: 100%;
  max-height: 300px;
	position: relative;
}
.codeShow i{
	position: absolute;
	top: 30px ;
	right: 10px;
	font-size: 1.6em;
	cursor: pointer;
}
.codeShow i:hover{
	color: var(--blue);
}
.codeShow pre{
 font-family: monospace;
} 
.codeShow code{
	padding: 0;
	background-color: rgba(90,216,166,0.05);
	border-radius: 5px;
	box-shadow: var(--box-shadow2);
}
</style>
