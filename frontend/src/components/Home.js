import { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../styles/search.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { createAvatar } from "@dicebear/avatars";
import * as style1 from "@dicebear/avatars-bottts-sprites";
import * as style2 from "@dicebear/avatars-identicon-sprites";
import { toggleTrigger } from "../reducers/trigger";
import { io } from "socket.io-client";

const socket = io.connect();

const reducer = (state,action) => {
  switch (action.type) {
    case 'LOAD_GROUPS':
      return {...state,groupsLoad:true}
      case 'LOAD_FRIENDS':
        return {...state,friendsLoad:true}
        case 'LOAD_REQUESTS':
          return {...state,requestsLoad:true}
          case 'UNLOAD_ALL':
            return {groupsLoad:false,friendsLoad:false,requestsLoad:false}
    default:
      return state;
  }
}
function Home() {
  const [user, setUser] = useState({
    _id: "",
    userName: "",
    email: "",
    friends: [],
  });
  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [{groupsLoad,friendsLoad,requestsLoad},dispatchLoading]=useReducer(reducer, {
    friendsLoad:false,groupsLoad:false,requestsLoad:false
  })

  const state = useSelector((state) => {
    return {
      token: state.token.loginToken,
      user: state.user.user,
      trigger: state.trigger.mainTrigger,
    };
  });
  const dispatch = useDispatch();

  socket.on("connect", () => {
    console.log("You got connected in Home");
  });
  socket.on("receive-notification", (message,room) => {
    dispatch(toggleTrigger(''))
    switch(message){
      case 'reject friend request':
      case 'accept friend request':
      case 'delete friend':
        console.log('--- recieved -(notification)- message ---',message)
        dispatch(toggleTrigger('friend'))
        break;
        default:
          break;
    }
    console.log("notification: ", message);
  });

  useEffect(() => {
    dispatchLoading({type:'UNLOAD_ALL'})
    console.log(`http://${window.location.hostname}:30asnbfjkslfba00`)
    console.log("////////////Home useeffect triggered////////////");
    setUser(state.user);
      axios
        .get(`http://localhost:3001/api/groups/all/${state.user._id}`)
        .then((res) => {
          console.log("got groups successfully", res?.data);
          setGroups(res.data);
          dispatchLoading({type:'LOAD_GROUPS'})
        })
        .catch((err) => {
          console.log("failed getting groups", err);
        });

      axios
        .get(`http://localhost:3001/api/friends/all/${state.user._id}`)
        .then((res) => {
          console.log("got friends successfully", res?.data);
          setFriends(res.data);
          dispatchLoading({type:'LOAD_FRIENDS'})
        })
        .catch((err) => {
          console.log("failed getting friends", err);
        });

      axios
        .get(`http://localhost:3001/api/friends/pending/${state.user._id}`)
        .then((res) => {
          console.log("got friends requests successfully", res?.data);
          setFriendRequests(res.data);
          dispatchLoading({type:'LOAD_REQUESTS'})
        })
        .catch((err) => {
          console.log("failed getting groups", err);
        });
    console.log("Home.js useEffect", state.user);
    socket.emit("join-room", state.user.userName);
    console.log("Home:true", state.user.userName);

  }, [state.trigger]);

  const deleteGroup = (id) => {
    dispatch(toggleTrigger(''));
    console.log("group id is", id, "\nuser id is", state.user._id);
    axios
      .put(`/api/group/${id}/`, { myID: state.user._id })
      .then((res) => {
         dispatch(toggleTrigger('group'));
      })
      .catch((err) => {
        console.log("error deleting group");
      });
  };
  const deleteFriend = (userName) => {
    axios
      .delete(`/api/friend/${userName}`,{
        headers: {
          'Authorization': `${state.token}`
        }
      })
      .then((res) => {
        console.log('deletefriend res.data',res.data)
        socket.emit("send-notification", `delete friend`, userName);
        dispatch(toggleTrigger('delete friend'))
      })
      .catch((err) => {
        console.log("error deleting group");
      });
  };

  const respondToFriendRequest = (friendUsername, response) => {
    dispatch(toggleTrigger(''));
    console.log('friendusetname',friendUsername)
    axios
      .put("/api/friend", {
        myUsername: state.user.userName,
        theirUsername: friendUsername,
        replay: response,
      })
      .then((res) => {
        console.log("dodo yeah", res);
        // dispatch(toggleTrigger("request"));
        // if(response==='accept')
        if(response==='accept')
        dispatch(toggleTrigger("accept request"));
        else 
        dispatch(toggleTrigger("reject request"));

        socket.emit("send-notification", `${response} friend request`, friendUsername);
      })
      .catch((err) => {
        console.log("dodo nah", err);
      });
  };
  const svgFriend = (seed) =>
    createAvatar(style1, {
      seed: seed,
      dataUri: true,
    });
  const svgGroup = (seed) =>
    createAvatar(style2, {
      seed: seed,
      dataUri: true,
    });
  return (
    <div>
    {friendsLoad&&groupsLoad&&requestsLoad?<div>
      
      <div className="" > Requests </div>
      <div className="flex flex-row overflow-auto">
        {friendRequests.length
          ? friendRequests?.map((e) => {
              return (
                <div
                  className="flex flex-col our-team mx-6 items-center"
                  key={e}
                >
                  <img className="w-1/4" src={svgFriend(e)} alt="pic" />

                  <div className="team-content p-0">
                    <h3 className="title">{e}</h3>
                  </div>
                  <ul className="social absolute -bottom-28 left-0 hover:bottom-0 text-white flex flex-row justify-around cursor-pointer w-full">
                    <li
                      className="hover:bg-green-700 p-1 transition-all duration-300 w-full"
                      onClick={() => respondToFriendRequest(e, "accept")}
                    >
                      Accept
                    </li>
                    <li
                      className="hover:bg-red-700 p-1 transition-all duration-300 w-full"
                      onClick={() => respondToFriendRequest(e, "reject")}
                    >
                      Reject
                    </li>
                  </ul>
                </div>
              );
            })
          : ""}
      </div>
      <div> Groups </div>
      <div className="flex flex-row overflow-auto">
        {groups.length
          ? groups?.map((e) => {
              return (
                <div className="our-team mx-6 p-4" key={e?._id}>
                  <Link to={`/Group/${e?._id}`}>
                    <div className="p-6">
                      <img src={svgGroup(e)} alt="pic" />
                    </div>
                    <div className="team-content">
                      <h3 className="title">{e?.name}</h3>
                    </div>
                  </Link>
                  <ul className="social">
                    <button onClick={() => deleteGroup(e._id)}>Delete</button>
                  </ul>
                </div>
              );
            })
          : ""}
      </div>
      <div> Friends </div>
      <div className="flex flex-row overflow-auto">
        {friends.length
          ? friends?.map((e, i) => {
              return (
                <div className="our-team mx-6" key={i}>
                  <Link to={`/Conversation/${e?.userName}`}>
                    <div>
                      <img src={svgFriend(e?.userName)} alt="pic" />
                    </div>
                    <div className="team-content">
                      <h3 className="title">{e?.userName}</h3>
                    </div>
                  </Link>
                  <ul className="social">
                    <button onClick={() => deleteFriend(e?.userName)}>Delete</button>
                  </ul>
                </div>
              );
            })
          : ""}
      </div>
    </div>:
    // <div class="lds-hourglass"></div>
    <div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    }</div>
  );
}
export default Home;
