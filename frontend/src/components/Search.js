import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/search.css";
import Avatar from "boring-avatars";
import { useSelector } from "react-redux";
import randomColor from "randomcolor";


function Search(props) {
  const [username, setUsername] = useState("");
  const [request,setRequest] = useState(false);
  const state = useSelector((state)=>{return {user:state.user.user}})
//   useEffect(()=>{},[request])
  const handleSubmit = (e) => {
    e.preventDefault();
    setRequest(false)
    axios
      .get(`http://localhost:8888/api/user/search/${e.target[0].value}`)
      .then((res) => {
        setUsername(res.data);
        console.log("datadatadata IS", res.data);
      })
      .catch((err) => {
        console.log("error rat", err);
        setUsername("")
      });
  };

  const handleClick = () => {
      console.log('props value',props?.props,state.user)

      if(props?.props)
      axios.put(`http://localhost:8888/api/group/add/${props?.props}`,{
        memberUsername:username
      })
      .then((res)=>{
          console.log(res.data,'success')
        setRequest(true)
      }).catch(()=>{
        console.log('fail')
      })
      else
      axios.post('http://localhost:8888/api/friend',{
        myUsername:state.user.userName,
        theirUsername:username
      }).then(()=>{
          console.log('success')
        setRequest(true)
      }).catch(()=>{
        console.log('fail')

      })
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" />
        <input type="submit" />
      </form>
      {username ? (
        <div className="our-team">
          <div>
            <Avatar
              size={80}
              name="fff"
              variant="sunset"
              colors={randomColor({luminosity: 'dark',count:5})}
            />
          </div>
          <div className="team-content">
            <h3 className="title">{username}</h3>
          </div>
          <ul className="social">
              {request?
              <div>sent a request </div>:
              <button className="fa fa-facebook" aria-hidden="true" onClick={()=>handleClick()}>
              {props?.props?'Add to group':'Add as a friend'}
            </button>}
          </ul>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
export default Search;