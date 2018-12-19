var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;

var RADIUS = 8;

var MARGIN_TOP = 30;
var MARGIN_LEFT = 60;

//const endTime = new Date(2018,7,18,18,47,52);//设置截止时间
// var endTime = new Date();
// endTime.setTime(endTime.getTime() + 3600*1000);倒计时一个小时
var curShowTimeSeconds = 0//初始化剩余秒数

var balls = [];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];

window.onload = function(){

	WINDOW_WIDTH = document.body.clientWidth;
	WINDOW_HEIGHT = document.body.clientHeight;
	MARGIN_LEFT = Math.round(WINDOW_WIDTH/10);
	RADIUS = Math.round(WINDOW_WIDTH*4/5/108)-1;
	MARGIN_TOP = Math.round(WINDOW_HEIGHT/5);//自适应

	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	
	canvas.width = WINDOW_WIDTH;
	canvas.height = WINDOW_HEIGHT;
	curShowTimeSeconds = getCurShowTimeSeconds();//获取剩余秒数函数

	setInterval(
		function(){
			render(context);
			update();			
		},50);//50ms刷新一次
}

function getCurShowTimeSeconds(){
	
	var curTime = new Date()//获取当前时间
	// var ret = endTime.getTime()-curTime.getTime()//计算剩余毫秒数
	// ret = Math.round(ret/1000)//转化剩余秒数并取整
	var ret = curTime.getHours()*3600 + curTime.getMinutes()*60 + curTime.getSeconds();
	// return ret>=0?ret:0//如果ret大于等于0则取ret，否则返回0
	return ret
}

function update(){

	var nextShowTimeSeconds = getCurShowTimeSeconds(); 

	var nextHours = parseInt(nextShowTimeSeconds/3600);
	var nextMinutes = parseInt((nextShowTimeSeconds-nextHours*3600)/60);
	var nextSeconds = nextShowTimeSeconds%60;

	var curHours = parseInt(curShowTimeSeconds/3600);
	var curMinutes = parseInt((curShowTimeSeconds-curHours*3600)/60);
	var curSeconds = curShowTimeSeconds%60;

	if (nextSeconds!=curSeconds) {
		if (parseInt(curHours/10)!=parseInt(nextHours/10)) {
			addBalls(MARGIN_LEFT+0, MARGIN_TOP, parseInt(curHours/10));
		}
		if (parseInt(curHours%10)!=parseInt(nextHours%10)) {
			addBalls(MARGIN_LEFT+15*(RADIUS+1), MARGIN_TOP, parseInt(curHours%10));
		}//在小时上生成小球

		if (parseInt(curMinutes/10)!=parseInt(nextMinutes/10)) {
			addBalls(MARGIN_LEFT+39*(RADIUS+1), MARGIN_TOP, parseInt(curMinutes/10));
		}
		if (parseInt(curMinutes%10)!=parseInt(nextMinutes%10)) {
			addBalls(MARGIN_LEFT+54*(RADIUS+1), MARGIN_TOP, parseInt(curMinutes%10));
		}//在分钟上生成小球

		if (parseInt(curSeconds/10)!=parseInt(nextSeconds/10)) {
			addBalls(MARGIN_LEFT+78*(RADIUS+1), MARGIN_TOP, parseInt(curSeconds/10));
		}
		if (parseInt(curSeconds%10)!=parseInt(nextSeconds%10)) {
			addBalls(MARGIN_LEFT+93*(RADIUS+1), MARGIN_TOP, parseInt(curSeconds%10));
		}//在秒钟上生成小球

		curShowTimeSeconds = nextShowTimeSeconds
	}

	updateBalls();

	console.log(balls.length);
}

function updateBalls(){

	for (var i = 0; i<balls.length; i++){
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;

		if (balls[i].y>=WINDOW_HEIGHT-RADIUS) {
            balls[i].y = WINDOW_HEIGHT-RADIUS;
			balls[i].vy = -balls[i].vy*0.75;
		};
		if (balls[i].x>=WINDOW_WIDTH-RADIUS) {
            balls[i].x = WINDOW_WIDTH-RADIUS-RADIUS;
			balls[i].vx = -balls[i].vx*0.75;
		}//保证小球触壁反弹
	}

	var cnt = 0
	for (var i = 0; i < balls.length; i++) {
		if (balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH) {
			balls[cnt++] = balls[i]
		}
	}

	while(balls.length > Math.min(1000,cnt)){//在cnt和600之间取最大值
		balls.pop();
	}
}

function addBalls(x,y,num){

	for (var i = 0; i<digit[num].length; i++){
		for (var j = 0; j<digit[num][i].length; j++){
			if (digit[num][i][j] == 1){
				var aBall = {
					x:x+j*2*(RADIUS+1)+(RADIUS+1),
					y:y+i*2*(RADIUS+1)+(RADIUS+1),
					g:1.5+Math.random(),//小球的重力加速度为1.5~2.5
					vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,//小球在水平方向的速度为-4或4
					vy:-5,
					color:colors[Math.floor(Math.random()*colors.length)]//随机设置小球颜色
				}
			balls.push(aBall)
			}
		}
	}
}

function render(context){

	context.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);//防止变化过程中前一次与后一次的画面重叠

	var hours = parseInt(curShowTimeSeconds/3600);
	var minutes = parseInt((curShowTimeSeconds-hours*3600)/60);
	var seconds = curShowTimeSeconds%60

	renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hours/10),context)
	renderDigit(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(hours%10),context)
	renderDigit(MARGIN_LEFT+30*(RADIUS+1),MARGIN_TOP,10,context)//绘制小时

	renderDigit(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(minutes/10),context)
	renderDigit(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(minutes%10),context)
	renderDigit(MARGIN_LEFT+69*(RADIUS+1),MARGIN_TOP,10,context)//绘制分钟

	renderDigit(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(seconds/10),context)
	renderDigit(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(seconds%10),context)//绘制秒

	for (var i = 0; i < balls.length; i++) {
		context.fillStyle = balls[i].color;//填充颜色
		
		context.beginPath();
		context.arc(balls[i].x, balls[i].y, RADIUS, 0, 2*Math.PI);
		context.closePath();

		context.fill();

	}
}

function renderDigit(x,y,num,context){

		context.fillStyle = "rgb(0,102,153)";
		for (var i = 0; i<digit[num].length; i++){//遍历digit.js数组的数字（0~9）的第i行
			for (var j = 0; j<digit[num][i].length; j++){//遍历digit.js数组的数字（0~9）的第i行的第j个点
				if (digit[num][i][j] == 1) {
					context.beginPath()
					context.arc(x+j*2*(RADIUS+1)+(RADIUS+1), y+i*2*(RADIUS+1)+(RADIUS+1), RADIUS, 0, 2*Math.PI)
					context.closePath()
					context.fill()
				}
			}
		}
	}