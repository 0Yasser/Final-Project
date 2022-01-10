import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import axios from "axios";


const socket = io.connect();
function Conversation(props) {
  const state = useSelector((state) => {
    return { user: state.user.user };
  });
  const params = useParams();
  const [room, setRoom] = useState(params.id);
  const [messages, setMessages] = useState([]);
  const [stream,setStream] = useState(null);
  const myVideo = useRef()
  socket.on("connect", () => {
    console.log("You got connected");
  });
  socket.on("receive-message", (message,room) => {
    console.log("recieve message", message);
    setMessages([...messages, message]);
  });

  useEffect(() => {
    console.log("me and not me", state.user.userName, params.id);

    axios
      .get(
        `/api/friend/request/${state.user.userName}-_-:-_-${params.id}`,
        {
          myUsername: state.user.userName,
          theirUsername: params.id,
        }
      )
      .then((res) => {
        setRoom(res.data);
        socket.emit("join-room", res.data);
        console.log("conversation:true", res.data);
      })
      .catch(() => {
        console.log("conversation:false");
        // socket.emit("join-room", room);
      });
    // console.log("me and him1", state.user, "me and him2");

    // navigator.mediaDevices.getUserMedia({
    //     video:true,
    //     audio:true
    // }).then((currentStream)=>{
    //   setStream(currentStream);
    //   myVideo.current.srcObject = currentStream;
    // })
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    const now = new Date();
    const obj = {
      who: state.user.userName,
      what: e.target[0].value,
      when:
        now.getFullYear() +
        "-" +
        (now.getMonth() + 1) +
        "-" +
        now.getDate() +
        " " +
        now.getHours() +
        ":" +
        now.getMinutes() +
        ":" +
        now.getSeconds(),
    };
    console.log(e.target[0].value);
    // socket.emit('send-message',e.target[0].value)
    socket.emit("send-message", obj, room);
    setMessages([...messages, obj]);
    e.target.reset();
    
  };
  const handleDeleteFriend = () => {
    
  }
  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="">
        {params.id}
        {/* <button onClick={handleDeleteFriend}>Delete friend</button> */}
        </div>
        {/* <button>call</button> */}
        <div className="flex flex-col overflow-auto h-screen-height*(4/5) px-40">
      {messages.length
        ? messages.sort((e,ee)=>e.when>ee.when?ee:e).map((e, i) => {
            return (
              <div key={i} className={`${e.who===state.user.userName?'self-end':'self-start'} overflow-clip w-min px-8 mx-8 mt-3 ${e.who===state.user.userName?'bg-green-300 rounded-t-3xl rounded-bl-3xl ':'bg-gray-400 rounded-t-3xl rounded-br-3xl '}`}>
                <p>{e.who===state.user.userName?'me':e.who}</p>
                <p className="overflow-clip">{e.what}</p>
                <p className="text-xs">{e.when}</p>
              </div>
            );
          })
        : ""}</div>
      <form className="justify-self-end" onSubmit={sendMessage}>
        <input rypw="text" className="shadow appearance-none border rounded w-4/5 py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" />
        <input type="submit" className=""/>
      </form>
    </div>
  );
}
export default Conversation;
