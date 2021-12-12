const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const app = express()
const userRoute = require('./routes/userRoute')
const friendRequestRoute = require('./routes/friendRoute')
const groupsRoute = require('./routes/groupRoute')

const PORT = process.env.PORT || 8888;
const connection_url = 'mongodb+srv://OwnerYasser:Atlas123@cluster0.9geix.mongodb.net/TheDatabase?retryWrites=true&w=majority'
app.use(cors())
app.use(express.json())
app.use(userRoute)
app.use(friendRequestRoute)
app.use(groupsRoute)
mongoose.connect(connection_url,
{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=>app.listen(PORT,()=>
console.log(`successfully connected with mongo \nserver listening at port ${PORT}`)))
.catch((err)=>
console.log("///////////////////\n///////////////////\nFAILED CONNECTION WITH MONGO DB, ERROR NAME IS:\n",err,"\nERROR END\n///////////////////\n///////////////////\n"))