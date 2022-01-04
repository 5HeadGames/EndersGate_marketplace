import Empty from "@shared/components/Empty/empty";
import React from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const registerUser = async ()=>{
    //const auth = getAuth();
    //try{

    //const useCredential = await createUserWithEmailAndPassword(auth, 'rcontreraspimentel@gmail.com', 'r8112965')
    //console.log({useCredential})
    //}catch(err){
      //console.log({err:err})
    //}

  }

  React.useEffect(()=>{
    registerUser()
  },[])

  return <Empty />;
};

export default Login;
