import React from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {getAuth, signInWithEmailAndPassword, signOut} from "firebase/auth";
import {getDatabase, ref, set} from "firebase/database";

import {Button} from "shared/components/common/button";
import firebase from "shared/firebase";
import Empty from "@shared/components/Empty/empty";

const auth = getAuth(firebase);
const db = getDatabase();

const Login = () => {
  const [user, loading, error] = useAuthState(auth);
  console.log({user, loading, error});

  React.useEffect(() => {}, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div>
        <Button decoration="fill" size="medium" className='w-full mb-2'>
          Login with Ronin Wallet
        </Button>
        <Button decoration="line-primary" size="medium" className='w-full mb-2'>
          Login By QR Code
        </Button>
        <Button decoration="line-primary" size="medium" className='w-full mb-2'>
          Login with email & password
        </Button>
      </div>
    </div>
  );
};

export default Login;
