const express = require('express')
const app = express()

const http = require('http').createServer(app)

const PORT = process.env.PORT || 3000

const user = {};

http.listen(PORT,()=>{
    console.log(`Listerning on port ${PORT}`)
})

app.use(express.static(__dirname + "/Public"))
app.get('/',(req,res) => {
    res.sendFile(__dirname + "/index.html");
})

const io = require('socket.io')(http) //to work on which server

io.on('connection', (socket) => {
    console.log("Connected");
    socket.on('new-user-joined',name => {
        user[socket.id] = name;
        socket.broadcast.emit('user-joined',name)
    })
    socket.on('message', (msg) =>{
        //
        socket.broadcast.emit('message',msg)
    })

    socket.on('disconnect',message => {
        socket.broadcast.emit('left',user[socket.id]);
        delete user[socket.id];
    })
});