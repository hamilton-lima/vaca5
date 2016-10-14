// game.js

var width = 320;
var height = 240;
var c = document.getElementById('c');

var ctx = c.getContext('2d');
c.width = width;
c.height = height;

var clear = function(){
  ctx.fillStyle = '#d0e7f9';
  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.closePath();
  ctx.fill();
};

var howManyCircles = 20, circles = [];

for (var i = 0; i < howManyCircles; i++) 
  circles.push([Math.random() * width, Math.random() * height, 
  	Math.random() * 100, Math.random() / 2]);

var DrawCircles = function(){
  for (var i = 0; i < howManyCircles; i++) {
    ctx.fillStyle = 'rgba(255, 255, 255, ' + circles[i][3] + ')';
//white color with transparency in rgba
    ctx.beginPath();
    ctx.arc(circles[i][0], circles[i][1], circles[i][2], 0, Math.PI * 2, true);
//arc(x, y, radius, startAngle, endAngle, anticlockwise)
//circle has always PI*2 end angle
    ctx.closePath();
    ctx.fill();
  }
};

var MoveCircles = function(deltaY){
  for (var i = 0; i < howManyCircles; i++) {
    if (circles[i][1] - circles[i][2] > height) {
//the circle is under the screen so we change
//informations about it 
      circles[i][0] = Math.random() * width;
      circles[i][2] = Math.random() * 100;
      circles[i][1] = 0 - circles[i][2];
      circles[i][3] = Math.random() / 2;
    } else {
//move circle deltaY pixels down
      circles[i][1] += deltaY;
    }
  }
};

var frameCounter = 0;
var lastFPS = 0;

var FPSCounter = function(){
	lastFPS = frameCounter;
	frameCounter = 0;
	setTimeout(FPSCounter, 1000);
}

var GameLoop = function(){
	frameCounter ++;
  	clear();
  	MoveCircles(5);
  	DrawCircles();
  
  	ctx.strokeText( lastFPS + " FPS", 20, 30);
  	gLoop = setTimeout(GameLoop, 1000 / 50);
}

GameLoop();
setTimeout(FPSCounter, 1000);