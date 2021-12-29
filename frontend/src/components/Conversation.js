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
  socket.on("receive-message", (message) => {
    console.log("recieve message", message);
    setMessages([...messages, message]);
  });

  useEffect(() => {
    console.log("me and not me", state.user.userName, params.id);

    axios
      .get(
        `http://localhost:8888/api/friend/request/${state.user.userName}-_-:-_-${params.id}`,
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
    console.log(e.target[0].value);
    // socket.emit('send-message',e.target[0].value)
    socket.emit("send-message", e.target[0].value, room);
    setMessages([...messages, e.target[0].value]);
  };
  return (
    <div>
      <div>Conversation</div>

      {messages.length
        ? messages.map((e) => {
            return (
              <div>
                <p>{e}</p>
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
