import { useEffect, useReducer, useState } from "react";
import { io } from "socket.io-client";
const socket = io.connect()
function Conversation(props) {
    const [messages,setMessages]=useState([])
    socket.on('connect',()=>{
        console.log('You got connected')
    })
    socket.on('receive-message',message=>{
        console.log('recieve message',message)
        setMessages([...messages,message])
    })
  useEffect(() => {
    
    
      let mine
      navigator.mediaDevices.getUserMedia({
          video:true,
          audio:true
      }).then((stream)=>{mine=stream})
      const addVideoStream = (video,stream)=>{
          video.srcObject = stream;
      }
    
  }, []);

const doSomething = (e) => {
    e.preventDefault()
    console.log(e.target[0].value)
    socket.emit('send-message',e.target[0].value)
    setMessages([...messages,e.target[0].value])
}
  return (
    <div>
      <div>Conversation</div>
      <form onSubmit={doSomething}>
          <input type="text"/>
          <input type="submit"/>
      </form>
      {messages.map(e=>{
          return(
              <div>
                  <p>{e}</p>
              </div>
          )
      })}
      
    </div>
  );
}
export default Conversation;
