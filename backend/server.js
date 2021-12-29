const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const app = express()


const userRoute = require('./routes/userRoute')
const friendRequestRoute = require('./routes/friendRoute')
const groupsRoute = require('./routes/groupRoute')
const cookieParser = require('cookie-parser')


const PORT = process.env.PORT || 8888;
const connection_url = 'mongodb+srv://OwnerYasser:Atlas123@cluster0.9geix.mongodb.net/TheDatabase?retryWrites=true&w=majority'


app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(userRoute)
app.use(friendRequestRoute)
app.use(groupsRoute)
const http = require('http')
const { Server } = require('socket.io')
const server = http.createServer(app)
 const io = new Server(server) 

io.on('connection',(socket)=>{
  console.log('a user connected')
  socket.on('send-message',(message,room)=>{
    //socket.broadcast.emit('receive-message',message)
    socket.to(room).emit('receive-message',message)
    console.log(message)
  })
  socket.on("join-room",room=>{
    socket.join(room)
  })
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
})
io.on("reconnect", (attempt) => {
  console.log('a user reconnected')

  // ...
});
io.on("reconnect_attempt", (attempt) => {
  console.log('a user reconnect attempted')

  // ...
});

mongoose.connect(connection_url,
{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=>{server.listen(PORT,()=>
console.log(`successfully connected with socketio and mongo \nserver listening at port ${PORT}`))
// server.listen(8889,()=>
// console.log(`successfully connected with mongo \nserver listening at port 8889`))
})
.catch((err)=>
console.log("///////////////////\n///////////////////\nFAILED CONNECTION WITH MONGO DB, ERROR NAME IS:\n",err,"\nERROR END\n///////////////////\n///////////////////\n"))
