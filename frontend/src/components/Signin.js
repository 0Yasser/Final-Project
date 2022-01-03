import axios from "axios";
import { useState } from "react";
import "../styles/signin.css";

function Signin() {
    // const [username,setUsername] = useState('')
    // const [email,setEmail] = useState('')
    // const [password,setPassword] = useState('')
    const [formType,setFormType] = useState('login')
  const signupHandler = (e) => {
    e.preventDefault();

    console.log(e.target[0].value, e.target[1].value, e.target[2].value);
    axios
      .post("/auth/signup", {
        userName: e.target[0].value,
        email: e.target[1].value,
        password: e.target[2].value,
      })
      .then((res) => {
        console.log("success", res.data);
        window.localStorage.setItem('chatUpToken',res.data)
        window.location.reload()
      })
      .catch((err) => {
        console.log("fail", err.response.data);
      });
  };
  const loginHandler = (e) => {
      e.preventDefault();
      console.log(e.target[0].value, e.target[1].value);
    axios
      .post("/auth/login", {
        username: e.target[0].value,
        email: e.target[0].value,
        password: e.target[1].value,
      })
      .then((res) => {
        console.log("success", res.data);
        window.localStorage.setItem('chatUpToken',res.data)
        window.location.reload()
      })
      .catch((err) => {
        console.log("fail", err.response.data);
      });

  }

  const [animationTest,setAnimationTest]=useState(false)
  return (
    <div className="sssss">

      <form className={formType=='signup'?'':'display-none'} onSubmit={signupHandler}>
        <input type="text" placeholder="Username"></input>
        <input type="text" placeholder="Email"></input>
        <input type="password" placeholder="Password"></input>
        <input type="submit" placeholder="Submit"></input>
      </form>

      <form className={formType=='login'?'':'display-none'} onSubmit={loginHandler}>
        <input type="text" placeholder="Username or email"></input>
        <input type="password" placeholder="Password"></input>
        <input type="submit" placeholder="Submit"></input>
      </form>

      <button className={formType=='login'?'':'display-none'} onClick={()=>{setAnimationTest(true); setTimeout(() => {
        setFormType('signup')
        setTimeout(() => {
          setAnimationTest(false);
        }, 250);
      }, 250); }}>or sign up</button>
      <button className={formType=='signup'?'':'display-none'} onClick={()=>{setAnimationTest(true); setTimeout(() => {
        setFormType('login')
        setTimeout(() => {
          setAnimationTest(false);
        }, 250);
      }, 250); }}>or log in</button>
      <div className={animationTest?"cover cover-after":"cover cover-before"}></div>
    </div>

  );
}

export default Signin;
