import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "boring-avatars";
import randomColor from "randomcolor";
import "../styles/search.css";
import axios from "axios";
import updateUser from '../reducers/user'
import { Link } from "react-router-dom";

function Home() {
  const [user, setUser] = useState({
    _id: "",
    userName: "",
    email: "",
    friends: []
  });
  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]);


  const state = useSelector((state) => {
    return { token: state.token.loginToken, user: state.user.user };
  });
  const dispatch = useDispatch();

  useEffect(() => {
    setUser(state.user);

    axios.get(`/api/groups/all/${state.user._id}`)
      .then((res) => { console.log('got groups successfully',res);setGroups(res.data); })
      .catch((err) => { console.log('failed getting groups',err) });
      
      axios.get(`/api/friends/all/${state.user._id}`)
      .then((res) => { console.log('got friends successfully',res);setFriends(res.data); })
      .catch((err) => { console.log('failed getting friends',err) });

    console.log("useEffect useSelector Home.js", state.user);
  }, [state.user]);

  const deleteGroup = (id) => {
      console.log('group id is',id,'\nuser id is',state.user._id)
      axios.put(`/api/group/${id}/`,{myID:state.user._id})
      .then((res)=>{dispatch(updateUser(res.data))})
      .catch((err)=>{console.log('error deleting group')})
  }
  const deleteFriend = (id) => {

  }
  return (
    <div>
      <pre>  My Groups  </pre>
      {groups.length? groups?.map((e) => {
        return (
          <div  className="our-team" key={e?._id}>
              <Link to={`/Group/${e?._id}`}>
            <div>
              <Avatar
                size={80}
                name="fff"
                variant="sunset"
                colors={randomColor({ luminosity: "random", count: 9 })}
              />
            </div>
            <div className="team-content">
              <h3 className="title">{e?.name}</h3>
            </div></Link>
            <ul className="social">
              <button onClick={()=>deleteGroup(e._id)}>Delete</button>
            </ul>
          </div>
        );
      }):""}
      <pre>  My Friends  </pre>
      {friends.length? friends?.map((e,i) => {
        return (
          <div className="our-team" key={i}>
              <Link to={`/Conversation/${e?.userName}`}>
            <div>
              <Avatar
                size={80}
                name="fff"
                variant="sunset"
                colors={randomColor({ luminosity: "random", count: 9 })}
              />
            </div>
            <div className="team-content">
              <h3 className="title">{e?.userName}</h3>
            </div></Link>
            <ul className="social">
              <button onClick={()=>deleteFriend(e._id)}>Delete</button>
            </ul>
          </div>
        );
      }):""}
    </div>
  );
}
export default Home;
