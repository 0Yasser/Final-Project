
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Signin from './components/Signin';
import Home from './components/Home';
import {useEffect } from 'react';
import Navbar from './components/Navbar';
// import Footer from './components/Footer';
import Conversation from './components/Conversation';
import Group from './components/Group';
import Profile from './components/Profile';
import Search from './components/Search';
import axios from 'axios';
import { useDispatch , useSelector } from 'react-redux';
import { updateUser } from './reducers/user';
import { toggleTrigger } from './reducers/trigger';
import { io } from "socket.io-client";


function App() {
  const state = useSelector((state)=>{return {token:state.token.loginToken,trigger:state.trigger.mainTrigger,user:state.user.user}})
  const dispatch = useDispatch();


  useEffect(()=>{
    const socket = io.connect();
    


    console.log('------App useeffect triggered-------');
    axios
      .get(`http://localhost:3001/api/user/myDetails/${state?.token}`)
      .then((res) => {
        dispatch(
          updateUser({
            _id: res.data?._id,
            userName: res.data?.userName,
            email: res.data?.email,
            friends: res.data?.friends,
            groups: res.data?.groups,
          })
        )
      dispatch(toggleTrigger(''))
      }).catch(()=>{
          console.log('error at APP.JS')
        })
  },[state.token])
  return (
    <Router>
      
    <div className="text-center">

      {state.token?<Navbar/>:''}
      <header className={`bg-gradient-to-tr from-red-200 to-purple-200 min-h-screen flex flex-col items-center justify-center ${state.token?'ml-1/5':''}`}>

        <Routes>
          <Route exact path="/" element={state.token?<Home/>:<Signin/>}/>
          <Route path="/signin" element={state.token?<Navigate to="/home"/>:<Signin/>}/>
          <Route path="/home" element={state.token?<Home/>:<Navigate to="/signin"/>}/>
          <Route path="/home/:id" element={state.token?<Home/>:<Navigate to="/signin"/>}/>
          <Route path="/conversation/:id" element={state.token?<Conversation/>:<Navigate to="/signin"/>}/>
          <Route path="/group/:id" element={state.token?<Group/>:<Navigate to="/signin"/>}/>
          <Route path="/myprofile" element={state.token?<Profile/>:<Navigate to="/signin"/>}/>
          <Route path="/conversation/profile/:id" element={state.token?<Profile/>:<Navigate to="/signin"/>}/>
          <Route path="/group/profile/:id" element={state.token?<Profile/>:<Navigate to="/signin"/>}/>
          <Route path="/search" element={state.token?<Search/>:<Navigate to="/signin"/>}/>
          <Route path='*' element={<Navigate to="/"/>}/>
        </Routes>
        {/* {state?.token?<Footer/>:"'"} */}
      </header>
    </div>
    </Router>
  );
}
export default App;

