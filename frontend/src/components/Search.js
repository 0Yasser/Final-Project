import axios from "axios";
import { useState } from "react";
import "../styles/search.css";
import { useSelector } from "react-redux";
import { createAvatar } from '@dicebear/avatars'
import * as style from '@dicebear/avatars-bottts-sprites'


function Search(props) {
  const [username, setUsername] = useState("");
  const [request,setRequest] = useState(false);
  const state = useSelector((state)=>{return {user:state.user.user}})
//   useEffect(()=>{},[request])
  const handleSubmit = (e) => {
    e.preventDefault();
    setRequest(false)
    axios
      .get(`http://localhost:3001/api/user/search/${e.target[0].value}`)
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
      axios.put(`http://localhost:3001/api/group/add/${props?.props}`,{
        memberUsername:username
      })
      .then((res)=>{
          console.log(res.data,'success')
        setRequest(true)
      }).catch(()=>{
        console.log('fail')
      })
      else
      axios.post('/api/friend',{
        myUsername:state.user.userName,
        theirUsername:username
      }).then(()=>{
          console.log('success')
        setRequest(true)
      }).catch(()=>{
        console.log('fail')

      })
  }
  const svgMaker = (seed)=> createAvatar(style,{
    seed: seed,
    dataUri: true,
  })
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" />
        <input type="submit" />
      </form>
      {username ? (
        <div className="our-team">
          <div>
          <img src={svgMaker(username)} alt="avatar" className="h-11"/>
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
