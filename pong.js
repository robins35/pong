$(document).ready(function () {
	//CONSTANTS
	var FPS = 30;
	var CANVAS_WIDTH = 600;
	var CANVAS_HEIGHT = 400;
	
	var PLAYER_WIDTH = 10;
	var PLAYER_HEIGHT = 25;
	var PLAYER_XSTART = 50;
	var PLAYER_YSTART = (CANVAS_HEIGHT / 2) - (PLAYER_HEIGHT / 2);
	var PLAYER_SPEED = 6;
	var PLAYER_COLOR = "#CCCCCC";
	
	var OPPONENT_WIDTH = 10;
	var OPPONENT_HEIGHT = 25;
	var OPPONENT_XSTART = CANVAS_WIDTH - 50 - OPPONENT_WIDTH;
	var OPPONENT_YSTART = (CANVAS_HEIGHT / 2) - (OPPONENT_HEIGHT / 2);
	var OPPONENT_SPEED = 6;
	var OPPONENT_COLOR = "#CCCCCC";
	
	var BALL_WIDTH = 5;
	var BALL_HEIGHT = 5;
	var BALL_XSTART = (CANVAS_WIDTH / 2) - (BALL_WIDTH / 2);
	var BALL_YSTART = (CANVAS_HEIGHT / 2) - (BALL_HEIGHT / 2);
	var BALL_SPEED = 6;
	var BALL_COLOR = "#CCCCCC";
	
	var MIDDLE_WIDTH = 3;
	var MIDDLE_LINE_HEIGHT = 6;
	var MIDDLE_LINE_NUM = Math.ceil(CANVAS_HEIGHT / (2 * MIDDLE_LINE_HEIGHT));
	var MIDDLE_COLOR = "#CCCCCC";
	
	var PLAYER_STARTING_SCORE = 0;
	var PLAYER_SCORE_SIZE = 60;
	var PLAYER_SCORE_FONT = "bold " + PLAYER_SCORE_SIZE + "px mobilman";
	var PLAYER_SCORE_X = (CANVAS_WIDTH / 2) - (PLAYER_SCORE_SIZE * 2.5);
	var PLAYER_SCORE_Y = PLAYER_SCORE_SIZE;
	var PLAYER_SCORE_COLOR = "#CCCCCC";
	
	var OPPONENT_STARTING_SCORE = 0;
	var OPPONENT_SCORE_SIZE = 60;
	var OPPONENT_SCORE_FONT = "bold " + OPPONENT_SCORE_SIZE + "px mobilman";
	var OPPONENT_SCORE_X = (CANVAS_WIDTH / 2) + (OPPONENT_SCORE_SIZE * 1.5);
	var OPPONENT_SCORE_Y = OPPONENT_SCORE_SIZE;
	var OPPONENT_SCORE_COLOR = "#CCCCCC";
	
	var playing = true;
	var pauseFlag = true;
	var pausePressed = false;
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
	document.body.appendChild(canvas);
	
	var sounds = {
		"paddleSound": new Audio("paddle_col.wav"),
		"wallSound": new Audio("wall_col.wav"),
		"endSound": new Audio("end_set.wav")
	};
	
	var player = {
		color: PLAYER_COLOR,
		x: PLAYER_XSTART,
		y: PLAYER_YSTART,
		width: PLAYER_WIDTH,
		height: PLAYER_HEIGHT,
		speed: PLAYER_SPEED,
		draw: function() {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	};
	
	var opponent = {
		color: OPPONENT_COLOR,
		x: OPPONENT_XSTART,
		y: OPPONENT_YSTART,
		width: OPPONENT_WIDTH,
		height: OPPONENT_HEIGHT,
		speed: OPPONENT_SPEED,
		draw: function() {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	};
	
	var ball = {
		color: BALL_COLOR,
		x: BALL_XSTART,
		y: BALL_YSTART,
		width: BALL_WIDTH,
		height: BALL_HEIGHT,
		xspeed: BALL_SPEED * ((Math.floor(Math.random()*2)) ? 1 : -1),
		yspeed: 0,
		visible: false,
		draw: function() {
			if(!this.visible) return;
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	};
	
	var middleline = {
		color: MIDDLE_COLOR,
		x: (CANVAS_WIDTH / 2) - MIDDLE_WIDTH,
		width: MIDDLE_WIDTH,
		lineheight: MIDDLE_LINE_HEIGHT,
		draw: function() {
			for(var i = 0; i < MIDDLE_LINE_NUM; i++)
			{
				ctx.fillStyle = this.color;
				ctx.fillRect(this.x, i*2*this.lineheight, this.width, this.lineheight);
			}
		}
	};
	
	var playerscore = {
		x: PLAYER_SCORE_X,
		y: PLAYER_SCORE_Y,
		score: PLAYER_STARTING_SCORE,
		font: PLAYER_SCORE_FONT,
		color: PLAYER_SCORE_COLOR,
		draw: function() {
			ctx.fillStyle = this.color;
			ctx.font = this.font;
			ctx.fillText(this.score, this.x, this.y);
		}
	};
	
	var opponentscore = {
		x: OPPONENT_SCORE_X,
		y: OPPONENT_SCORE_Y,
		score: OPPONENT_STARTING_SCORE,
		font: OPPONENT_SCORE_FONT,
		color: OPPONENT_SCORE_COLOR,
		draw: function() {
			ctx.fillStyle = this.color;
			ctx.font = this.font;
			ctx.fillText(this.score, this.x, this.y);
		}
	};
	
	var keysDown = {};
	
	addEventListener("keydown", function(e) {
		keysDown[e.keyCode] = true;
		//alert(e.keyCode);
	}, false);
	
	addEventListener("keyup", function(e) {
		delete keysDown[e.keyCode];
		//alert(e.keyCode);
	}, false);
	
	function playSound(name)
	{
		sounds[name].currentTime = 0;
		sounds[name].play();
	}
	function newSet(player1_Point)
	{
		pauseFlag = true;
		player.x = PLAYER_XSTART;
		player.y = PLAYER_YSTART;
		opponent.x = OPPONENT_XSTART;
		opponent.y = OPPONENT_YSTART;
		ball.visible = false;
		ball.x = BALL_XSTART;
		ball.y = Math.floor(Math.random() * CANVAS_HEIGHT);
		ball.xspeed = BALL_SPEED * (player1_Point ? 1 : -1);
		ball.yspeed = Math.floor(Math.random() * BALL_SPEED) * ((Math.floor(Math.random()*2)) ? 1 : -1);
		playSound("endSound");
	}
	
	function endGame(playerWon)
	{
		if(playerWon) alert("PLAYER 1 WON!!!");
		else alert("PLAYER 2 WON!!!");
		pauseFlag = true;
		playing = false;
		//ctx.clearRect(player.x, player.y, player.width, player.height);
		//ctx.clearRect(opponent.x, opponent.y, opponent.width, opponent.height);
	}
	
	function collisionDetection()
	{
		if(ball.x <= (player.x + player.width) && 
		ball.y > (player.y - ball.height) && 
		ball.y < (player.y + player.height))
		{
			if(ball.x > (player.x + player.width - 3)) 
			{
				ball.xspeed = ball.xspeed * -1;
				if(87 in keysDown) ball.yspeed = ball.yspeed - player.speed;
				if(83 in keysDown) ball.yspeed = ball.yspeed + player.speed;
			}
			else if(player.x < (ball.x + ball.width))ball.yspeed = ball.yspeed * -1;
			else return;
			playSound("paddleSound");
		}
		else if((ball.x + ball.width) >= opponent.x && 
		ball.y > (opponent.y - ball.height) && 
		ball.y < (opponent.y + opponent.height)) 
		{
			if((ball.x + ball.width) < (opponent.x + 3)) 
			{
				ball.xspeed = ball.xspeed * -1;
				if(38 in keysDown) ball.yspeed = ball.yspeed - opponent.speed;
				if(40 in keysDown) ball.yspeed = ball.yspeed + opponent.speed;
			}
			else if ((opponent.x + opponent.width) > ball.x) ball.yspeed = ball.yspeed * -1;
			else return;
			playSound("paddleSound");
		}
	}
	
	function clearSc()
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
	
	function update()
	{
		if(32 in keysDown && !pausePressed) 
		{
			ball.visible = true;
			pauseFlag = !pauseFlag;
			pausePressed = true;
		}
		if(pausePressed && !(32 in keysDown)) pausePressed = false;
		if(pauseFlag) return;
		if(87 in keysDown && player.y >= 0) player.y = player.y - player.speed;
		if(83 in keysDown && (player.y + player.height) <= canvas.height) player.y = player.y + player.speed;
		if(38 in keysDown && opponent.y >= 0) opponent.y = opponent.y - opponent.speed;
		if(40 in keysDown && (opponent.y + opponent.height) <= canvas.height) opponent.y = opponent.y + opponent.speed;
		if((ball.y + ball.height) > canvas.height || ball.y < 0) 
		{
			ball.yspeed = ball.yspeed * -1;
			playSound("wallSound");
		}
		ball.y = ball.y + ball.yspeed;
		ball.x = ball.x + ball.xspeed;
		
		if((ball.x + ball.width) <= 0)
		{
			opponentscore.score++;
			newSet(false);
		}
		else if(ball.x >= canvas.width)
		{
			playerscore.score++;
			newSet(true);
		}
		collisionDetection();
		if(playerscore.score >= 11) endGame(true);
		else if(opponentscore.score >= 11) endGame(false);
	}
	
	function draw()
	{
		player.draw();
		opponent.draw();
		ball.draw();
		middleline.draw();
		playerscore.draw();
		opponentscore.draw();
	}
	
	setInterval(function() {
		if(!playing) return;
		update();
		clearSc();
		draw();
	}, 1000/FPS);
});
