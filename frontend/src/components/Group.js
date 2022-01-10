

import Search from "./Search";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import axios from "axios";

const socket = io.connect();
function Group() {
  const params = useParams();
  const [group, setGroup] = useState({});
  const [messages, setMessages] = useState([]);
  const [message,setMessage]=useState('')
  const state = useSelector((state) => {
    return { token: state.token.loginToken, user: state.user.user };
  });
  const [room, setRoom] = useState(params.id);
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
    console.log(params);
    axios
      .get(`/api/group/${params.id}`)
      .then((res) => {
        setGroup(res.data);
        socket.emit("join-room", params.id);
        console.log("Group:true", res.data,params.id);
      })
      .catch((err) => {
        console.log("group comp err", err);
        socket.emit("join-room", room);
      });
    // socket = io(ENDPOINT);
    // socket.on("message", (message) => {
    //   setMessages((messages) => [...messages, message]);
    // });
    // let room = params.id, name = state.user.userName;
    // console.log('room user',room,name)
    // socket.emit('join',{name,room},(error)=>{
    //     if(error) alert(error)
    // })
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date();
    const obj = {
      who: state.user.userName,
      what: message,
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
    if (message) {
      socket.emit("send-message",obj,room);
      setMessage("");
      setMessages([...messages, obj]);
      e.target.reset();
    } else alert("empty input");
  };
  return (
    <div>
      <h1>{group?.name}</h1>
      <button>Add new a member</button>
      <Search props={params.id} />
      <div>
      <div className="flex flex-col overflow-y-auto overflow-x-hidden h-screen-height*(4/5) px-40">
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
          <form action="" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <input type="submit" />
    </form>
      </div>
    </div>
  );
}
export default Group;
