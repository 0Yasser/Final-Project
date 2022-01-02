import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Search from "./Search";
// import io from "socket.io-client";
import queryString from "query-string";
import { useSelector } from "react-redux";
let socket;

function Group() {
  const params = useParams();
  const [group, setGroup] = useState({});
  const [messages, setMessages] = useState([]);
  const [message,setMessage]=useState('')
  const state = useSelector((state) => {
    return { token: state.token.loginToken, user: state.user.user };
  });
  const ENDPOINT = "http://localhost:8889";
  useEffect(() => {
    console.log(params);
    axios
      .get(`/api/group/${params.id}`)
      .then((res) => {
        setGroup(res.data);
      })
      .catch((err) => {
        console.log("group comp err", err);
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
    if (message) {
      socket.emit("sendMessage", { message });
      setMessage("");
    } else alert("empty input");
  };
  return (
    <div>
      <h1>{group?.name}</h1>
      <button>Add new a member</button>
      <Search props={params.id} />
      <div>
        {messages?.length
          ? messages.map((curr, i) => {
              return (
                <div key={i}>
                  {curr?.test}
                  <br />
                  {curr?.user}
                </div>
              );
            })
          : "nothing yet"}
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
