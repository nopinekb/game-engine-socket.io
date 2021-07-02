const express = require('express')
const app = express()
const port = 3000
const server = app.listen(process.env.PORT || port)
const io = require('socket.io')(server)

//Hello World line taken from the express website
app.get('/', function(req, res) {
  res.sendFile('index.html' , { root : __dirname});
});

app.use("/static", express.static('./static/'));

let players = [];
//The 'connection' is a reserved event name in socket.io
//For whenever a connection is established between the server and a client
io.on('connection', (socket) => {

	//Displaying a message on the terminal
    console.log('A user connected. Now ' + io.engine.clientsCount + ' players');


    socket.on('disconnect', function () {
        console.log('A user disconnected. Now ' + io.engine.clientsCount + ' players');
    });


    var count = io.engine.clientsCount;
    socket.emit('count', count);

    

    function UpdatePlayer(id,x,y){
         for (var index = 0; index < players.length; ++index) {
            if(players[index].id === id){
                players[index].x = x, players[index].y = y;
            }
        }
        socket.emit('draw', players);
        console.log(players); 
    }
    function MakePlayer(id,x,y) {      
        if (players.filter(item=> item.id == id).length == 0){
            players.push({id, x, y});
        }
    }

    function DeletePlayer(id){
        for (var index = 0; index < players.length; ++index) {
             if(players[index].id === id){
                players.splice(index,1);
            }
        }
    }

    socket.on('position', function(position) {
        UpdatePlayer(position.PlayerID,position.x,position.y);
    });

    socket.on('start', function(start) {
        MakePlayer(start.PlayerID,start.x,start.y)
    });

    socket.on('end', function(end) {
        DeletePlayer(end.PlayerID,end.x,end.y)
    });


                
            
});

