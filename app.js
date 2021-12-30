const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", "views");

app.use("/", (req, res, next) => {
    return res.render("chatPage")
})

io.on('connection', (socket) => {
    console.log("client connected", socket.id);

    socket.on('disconnect', () => {
        console.log("client disconnected", socket.id);
    })

    socket.on('leave-room', (room) => {
        if (socket.rooms.has(room)) {
            socket.to(room).emit("disconnected-from-room", `${socket.id} left the room ${room}`);
            io.to(socket.id).emit('disconnected-from-room',`Disconnected from room ${room}`)
            socket.leave(room);
        }else{
            io.to(socket.id).emit("disconnected-from-room", `Already Disconnecred from room ${room}`)
        }

    })

    socket.on('message-to-server', (message) => {
        if (message.room) {
            socket.to(message.room).emit("message-to-client", { name: socket.id, msg: message.msg })
        } else {
            socket.broadcast.emit("message-to-client", { name: socket.id, msg: message.msg });
        }
    })

    socket.on('connect-to-room', (room) => {
        socket.join(room);
        io.to(socket.id).emit('connected-to-room', `Connected to Room ${room}`);
        socket.to(room).emit('connected-to-room', `${socket.id} joined in room ${room}`)
    })
})






server.listen(3000, () => {
    console.log('Server Started');
})