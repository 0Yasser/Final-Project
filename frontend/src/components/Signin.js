import axios from "axios";
import { useState } from "react";
import "../styles/signin.css";

function Signin() {
    const [username,setUsername] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

  const handleSignUp = () => {
      console.log('username,email,password',username,email,password)
      axios
      .post("http://localhost:8888/auth/signup", {
        userName: username,
        email: email,
        password: password,
      })
      .then((res) => {
        console.log("success", res.data);
        window.localStorage.setItem('chatUpToken',res.data)
      })
      .catch((err) => {
        console.log("fail", err);
      });
  }
  const handleLogin = () => {
    console.log('username,email,password',username,email,password)
    axios
    .post("http://localhost:8888/auth/login", {
      username:username, email:email, password:password,
    })
    .then((res) => {
      console.log("success", res.data);
      window.localStorage.setItem('chatUpToken',res.data)
    })
    .catch((err) => {
      console.log("fail", err);
    });
  }
  return (
    <div>
      <div className="section container   row full-height justify-content-center   col-12 text-center align-self-center py-5   section pb-5 pt-5 pt-sm-2 text-center">
        <h6 className="mb-0 pb-3">
          <span>Log In </span>
          <span>Sign Up</span>
        </h6>
        <input
          className="checkbox"
          type="checkbox"
          id="reg-log"
          name="reg-log"
        />
        <label for="reg-log"></label>
        <div className="card-3d-wrap mx-auto">
          <div className="card-3d-wrapper">
            <div className="card-front  center-wrap  section text-center">
                  <h4 className="mb-4 pb-3">Log In</h4>
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-style"
                      placeholder="Your Email or User"
                      onChange={(e)=>{setUsername(e?.target?.value);setEmail(e?.target?.value)}}
                    />
                    <i className="input-icon uil uil-at"></i>
                  </div>
                  <div className="form-group mt-2">
                    <input
                      type="password"
                      className="form-style"
                      placeholder="Your Password"
                      onChange={(e)=>{setPassword(e?.target?.value)}}
                    />
                    <i className="input-icon uil uil-lock-alt"></i>
                  </div>
                  <a href="#" className="btn mt-4" onClick={handleLogin}>
                    submit
                  </a>
                  <p className="mb-0 mt-4 text-center">
                    <a href="#0" className="link">
                      Forgot your password?
                    </a>
                  </p>
            </div>
            <div className="card-back">
              <div className="center-wrap  section text-center">
                  <h4 className="mb-4 pb-3">Sign Up</h4>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-style"
                      placeholder="Your User Name"
                      onChange={(e)=>setUsername(e?.target?.value)}
                    />
                    <i className="input-icon uil uil-user"></i>
                  </div>
                  <div className="form-group mt-2">
                    <input
                      type="email"
                      className="form-style"
                      placeholder="Your Email"
                      onChange={(e)=>setEmail(e?.target?.value)}
                    />
                    <i className="input-icon uil uil-at"></i>
                  </div>
                  <div className="form-group mt-2">
                    <input
                      type="password"
                      className="form-style"
                      placeholder="Your Password"
                      onChange={(e)=>setPassword(e?.target?.value)}
                    />
                    <i className="input-icon uil uil-lock-alt"></i>
                  </div>
                  <a href="#" className="btn mt-4" onClick={handleSignUp}>
                    submit
                  </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;