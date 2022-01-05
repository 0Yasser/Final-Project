import axios from "axios";
import { useState } from "react";

function Signin() {
  const [username,setUsername] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [usernameFAILURE,setUsernameFAILURE] = useState('')
  const [emailFAILURE,setEmailFAILURE] = useState('')
  const [passwordFAILURE,setPasswordFAILURE] = useState('')
  const [formType, setFormType] = useState("login");

  const signupHandler = () => {

    console.log('signup handler2',username, email, password);
    // axios
    //   .post("/auth/signup", {
    //     userName: e.target[0].value,
    //     email: e.target[1].value,
    //     password: e.target[2].value,
    //   })
    //   .then((res) => {
    //     console.log("success", res.data);
    //     window.localStorage.setItem("chatUpToken", res.data);
    //     window.location.reload();
    //   })
    //   .catch((err) => {
    //     console.log("fail", err.response.data);
    //   });
  };
  const loginHandler = () => {
    console.log('login handler2',username, email, password);
    setEmailFAILURE('')
            setUsernameFAILURE('')
            setPasswordFAILURE('')
    axios
      .post("/auth/login", {
        username,
        email,
        password
      })
      .then((res) => {
        console.log("success", res.data);
        window.localStorage.setItem("chatUpToken", res.data);
        window.location.reload();
      })
      .catch((err) => {
        console.log("fail", err.response.data);
        switch (err.response.data) {
          case 'incorrect username or email':
            setEmailFAILURE('incorrect username or email')
            setUsernameFAILURE('incorrect username or email')
            break;
          case 'incorrect password':
            setPasswordFAILURE('incorrect password')
            break;
          default:
            setEmailFAILURE('network error')
            setUsernameFAILURE('network error')
            setPasswordFAILURE('network error')
            break;
        }
      });
  };
  const handleSwitching = () => {
    setAnimationTest(true);
    setTimeout(() => {
      formType==='signup'?setFormType("login"):setFormType("signup");
      setTimeout(() => {
        setAnimationTest(false);
      }, 200);
    }, 200);
  }
  const [animationTest, setAnimationTest] = useState(false);
  return (
    // <div className="shadow shadow-red-700 relative w-6/12 h-3/6 p-9 bg-red-700">

    //   <form className={formType=='signup'?'':'hidden'} onSubmit={signupHandler}>
    //     <input type="text" placeholder="Username"></input>
    //     <input type="text" placeholder="Email"></input>
    //     <input type="password" placeholder="Password"></input>
    //     <input type="submit" placeholder="Submit"></input>
    //   </form>

    //   <form className={formType=='login'?'':'hidden'} onSubmit={loginHandler}>
    //     <input type="text" placeholder="Username or email"></input>
    //     <input type="password" placeholder="Password"></input>
    //     <input type="submit" placeholder="Submit"></input>
    //   </form>

    //   <button className={formType=='login'?'':'hidden'} onClick={()=>{setAnimationTest(true); setTimeout(() => {
    //     setFormType('signup')
    //     setTimeout(() => {
    //       setAnimationTest(false);
    //     }, 250);
    //   }, 250); }}>or sign up</button>
    //   <button className={formType=='signup'?'':'hidden'} onClick={()=>{setAnimationTest(true); setTimeout(() => {
    //     setFormType('login')
    //     setTimeout(() => {
    //       setAnimationTest(false);
    //     }, 250);
    //   }, 250); }}>or log in</button>
    //   <div className={animationTest?"cover cover-after":"cover cover-before"}></div>
    // </div>
    <div className={`h-96 w-2/4 relative overflow-hidden`}>
      
      <form
        className={`h-full bg-white shadow-md rounded-md px-8 pt-6 pb-8 transition ease-in-out duration-300 ${formType==='login'?'flex flex-col justify-between':''}`}
        onSubmit={(e)=>e.preventDefault()}
      >
        <div>
        <div className="mb-4 flex flex-col items-start">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {formType==='login'?'Username or Email':'Username'}
          </label>
          <input
            className={`shadow appearance-none border ${usernameFAILURE?"border-red-500":''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            type="text"
            onChange={(e)=>{
              if(formType==='login'){
                setUsername(e.target.value)
                setEmail(e.target.value)
              }else{
                setUsername(e.target.value)
              }}}
            placeholder={formType==='login'?'Username or Email':'Username'}
          />
          <p className={`text-red-500 text-xs italic ${usernameFAILURE?"":'hidden'}`}>
            {usernameFAILURE}
          </p>
        </div>
        <div className={`${formType==='login'?'hidden':''} mb-4 flex flex-col items-start`}>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            className={`shadow appearance-none border ${emailFAILURE?"border-red-500":''} rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
            type="text"
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="Email"
          />
          <p className={`text-red-500 text-xs italic ${emailFAILURE?"":'hidden'}`}>
            {emailFAILURE}
          </p>
        </div>
        <div className="mb-6 flex flex-col items-start">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            className={`shadow appearance-none border ${passwordFAILURE?"border-red-500":''} rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
            type="password"
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="************"
          />
          <p className={`text-red-500 text-xs italic ${passwordFAILURE?"":'hidden'}`}>
            {passwordFAILURE}
          </p>
        </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={()=>formType==='login'?loginHandler():signupHandler()}
          >
            {formType==='login'?'Log in':'Sign Up'}
          </button>
          <button
            className=" inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            onClick={() => handleSwitching()}
          >
            {formType==='signup'?'or Log-in':'or Sign-up'}
          </button>
        </div>
      </form>
      <div className={`absolute block bg-red-200 top-1/2 right-1/2 z-10 ${animationTest?'':'hidden'}`}>{formType}</div>
      <div className={`absolute block bg-pink-800 ease-in-out duration-700 rounded-md ${animationTest?'top-0 left-0 w-double h-double':'bottom-0 right-0 w-0 h-0'}`}></div>
    </div>
  );
}

export default Signin;
