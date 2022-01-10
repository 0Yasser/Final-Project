import { useDispatch, useSelector } from "react-redux";
import { clearLoginToken } from "../reducers/login";
import { Link } from "react-router-dom";
import { useState, useEffect, useReducer } from "react";
import axios from "axios";
import { updateUser } from "../reducers/user";
import { createAvatar } from "@dicebear/avatars";
import * as style1 from "@dicebear/avatars-bottts-sprites";
import * as style2 from "@dicebear/avatars-identicon-sprites";

const reducer = (state,action) => {
  switch (action.type) {
    case 'LOAD_GROUPS':
      return {...state,groupsLoad:true}
      case 'LOAD_FRIENDS':
        return {...state,friendsLoad:true}
          case 'UNLOAD_ALL':
            return {groupsLoad:false,friendsLoad:false}
  
    default:
      return state;
  }
}

function Navbar() {
  const [newGroup, setNewGroup] = useState(false);
  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]);
  const state = useSelector((state) => {
    return {
      token: state.token.loginToken,
      user: state.user.user,
      trigger: state.trigger.mainTrigger,
    };
  });
  const dispatch = useDispatch();
  const [{groupsLoad,friendsLoad},dispatchLoading]=useReducer(reducer, {
    groupsLoad:false,friendsLoad:false
  })
  useEffect(() => {
    dispatchLoading({type:'UNLOAD_ALL'})
        axios
          .get(`http://localhost:3001/api/groups/all/${state.user?._id}`)
          .then((res) => {
            setGroups(res.data);
            dispatchLoading({type:'LOAD_GROUPS'})
          })
          .catch((err) => {
            console.log("failed getting groups", err);
          });

        axios
          .get(`http://localhost:3001/api/friends/all/${state.user?._id}`)
          .then((res) => {
            setFriends(res.data);
            dispatchLoading({type:'LOAD_FRIENDS'})
          })
          .catch((err) => {
            console.log("failed getting friends", err);
          });
      
  }, [state.trigger]);


  const handleSignOut = () => {
    setInterval(() => {
      dispatch(clearLoginToken(""));
    }, 1000);
    window.localStorage.removeItem("chatUpToken");
  };
  const handleCreateNewGroup = (e) => {
    e.preventDefault();
    if (e.target[0]?.value)
      axios
        .post(`/api/group/${state.user._id}`, {
          name: e.target[0].value,
        })
        .then((res) => {
          setNewGroup(!newGroup);
          console.log("successfully created a new group", res.data);
          dispatch(updateUser(state.user));
        })
        .catch(() => {
          console.log("failed at creating new group");
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
    <nav className="text-gray-400 fixed flex justify-center h-full w-1/5 top-0 left-0 bg-gradient-to-r from-gray-800 to-gray-900">
      {groupsLoad&&friendsLoad?
      <ul className="list-none p-1 overflow-auto">
        <li>
          <p>{state.user.userName}</p>
          <img
            className="h-1/4"
            src={svgFriend(state.user.userName)}
            alt="profile_avatar"
          />
        </li>
        <hr />
        <li className="p-2">
          <Link
            onClick={() => setNewGroup(false)}
            className="hover:bg-gray-500 transition-all rounded-3xl p-2"
            to="/home"
          >
            Home
          </Link>
        </li>
        <li className="p-2">
          <Link
            onClick={() => setNewGroup(false)}
            className="hover:bg-gray-500 transition-all rounded-3xl p-2"
            to="/search"
          >
            Search
          </Link>
        </li>
        <li className="p-2">
          <input
            className={`${
              newGroup ? "hidden" : ""
            } hover:bg-gray-500 transition-all rounded-3xl p-2`}
            type="submit"
            onClick={() => setNewGroup(true)}
            value="create group"
          />
          <form onSubmit={handleCreateNewGroup}>
            <input
              className={newGroup ? "" : "hidden"}
              type="text"
              placeholder="group name"
            />
            <input
              className={newGroup ? "" : "hidden"}
              type="submit"
              value="create group"
            />
          </form>
          <input
            className={newGroup ? "" : "hidden"}
            type="submit"
            onClick={() => setNewGroup(false)}
            value="cancel"
          />
        </li>
        <hr />

        {friends.length
          ? friends.map((e) => {
              return (
                <li key={e?.userName} className="p-2">
                  <Link
                    className="flex flex-row items-center gap-2 my-2 hover:bg-gray-500 hover:text-gray-900 transition-all rounded-3xl p-2"
                    to={`/Conversation/${e?.userName}`}
                  >
                    <div>
                      <img
                        src={svgFriend(e?.userName)}
                        alt="avatar"
                        className="h-11"
                      />
                      {/* <Avatar
                size={40}
                name="fff"
                variant="sunset"
                colors={randomColor({ luminosity: "random", count: 9 })}
              /> */}
                    </div>
                    <div className="">
                      <h3 className="">{e?.userName}</h3>
                    </div>
                  </Link>
                </li>
              );
            })
          : ""}
        <hr />

        {groups.length
          ? groups.map((e) => {
              return (
                <li key={e._id} className="p-2">
                  <Link
                    className="flex flex-row items-center gap-2 my-2 hover:bg-gray-500 hover:text-gray-900 transition-all rounded-3xl p-2"
                    to={`/Group/${e?._id}`}
                  >
                    <div>
                      <img
                        src={svgGroup(e?.name)}
                        alt="avatar"
                        className="h-11"
                      />
                      {/* <Avatar
                size={40}
                name="fff"
                variant="sunset"
                colors={randomColor({ luminosity: "random", count: 9 })}
              /> */}
                    </div>
                    <div className="">
                      <h3 className="">{e?.name}</h3>
                    </div>
                  </Link>
                </li>
              );
            })
          : ""}
        <li className="p-2 hover:text-red-600 hover:bg-gray-400 transition-all rounded-3xl">
          <button onClick={handleSignOut}>Sign Out</button>
        </li>
      </ul>:
          <div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>

}
    </nav>
  );
}
export default Navbar;
