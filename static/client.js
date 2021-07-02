//Establishing a connection with the server on port 5500y
//const socket = io('http://localhost:3000');
const socket = io.connect('https://socket-game2.herokuapp.com', {secure: true});

var canvas = document.getElementById("canvas");

var ctx = canvas.getContext("2d");
var counter = document.getElementById('counter');
var positionHTML = document.getElementById('position');
var startBtn = document.getElementById('start');
var x = 100, y = 100;
var LoopSpeed = 10;
var PlayerID = Math.floor(Math.random() * 1000000);
var counterPlayers = 0;


function PlayerControl() {
	var LEFT=37, UP=38, RIGHT=39, DOWN=40;
	var dirs = {[LEFT]:0, [UP]:0, [RIGHT]:0, [DOWN]:0};
	var SPEED = 5;

	$(document).keydown(function (e) {
		dirs[e.keyCode] = 1;


	})

	$(document).keyup(function (e) {
		dirs[e.keyCode] = 0;
		
	})
	  
	setInterval(function () {

	x -= dirs[LEFT] * SPEED;
	x += dirs[RIGHT] * SPEED;
	y -= dirs[UP] * SPEED;
	y += dirs[DOWN] * SPEED;

	}, LoopSpeed)
};


	
socket.on('draw', function(players){
	
	ctx.clearRect(0,0, 800,800);
	for (var index = 0; index < players.length; ++index) {

		ctx.fillRect(players[index].x,players[index].y, 10, 10);

		ctx.fill();
		positionHTML.innerHTML = JSON.stringify(players);
	}

});



function positionUpdate() {
	const position = {
		PlayerID: PlayerID,
		x: x,
		y: y
	};
	socket.emit('position', position);
	setTimeout(positionUpdate, LoopSpeed);
}

socket.on('count', function(count) {
    counter.innerHTML = "online: " + count;
    counterPlayers = count;
});

startBtn.addEventListener('click', () => {
	const start = {
		PlayerID: PlayerID,
		x: x,
		y: y
	};
    socket.emit('start', start);
    startBtn.remove();
})
window.onbeforeunload = function() {
	const end = {
		PlayerID: PlayerID,
		x: x,
		y: y
	};
    socket.emit('end', end);
};


positionUpdate();
PlayerControl();

