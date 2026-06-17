import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {LoginPage,SignupPage,ActivationPage} from "./Routes.js";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { server } from "./server.js";
import { useEffect } from "react";

const App = () => {
  useEffect(()=>{
    const getUser=async()=>{
      try{
        const res= await axios.get(`${server}/user/getuser`,{withCredentials:true});
        toast.success(res.data.message)
      }catch(error){
        toast.error(error.response.data.message);
      }
    }
    getUser();
  },[])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/sign-up" element={<SignupPage/>}/>
        <Route path="/activation/:activation_token" element={<ActivationPage/>}/>
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  )
}

export default App

