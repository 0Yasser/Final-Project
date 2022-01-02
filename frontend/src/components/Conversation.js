import { useEffect, useReducer, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
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
        socket.emit("join-room", room);
      });
    console.log("me and him1", state.user, "me and him2");

    // navigator.mediaDevices.getUserMedia({
    //     video:true,
    //     audio:true
    // }).then((stream)=>{mine=stream})
    // const addVideoStream = (video,stream)=>{
    //     video.srcObject = stream;
    // }
  }, []);

  const doSomething = (e) => {
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
    obj.who = "me";
    setMessages([...messages, obj]);
  };
  const handleDeleteFriend = () => {
    
  }
  return (
    <div>
      <div>
        {'from: '+state.user.userName+'\n with: '+params.id}
        <button onClick={handleDeleteFriend}>Delete friend</button>
        </div>
        <button>call</button>
      {messages.length
        ? messages.map((e, i) => {
            return (
              <div key={i}>
                <p>{e.who}</p>
                <p>{e.what}</p>
                <p>{e.when}</p>
              </div>
            );
          })
        : ""}
      <form onSubmit={doSomething}>
        <input type="text" />
        <input type="submit" />
      </form>
    </div>
  );
}
export default Conversation;
