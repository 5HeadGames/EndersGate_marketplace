import React from "react";
import {/*useAuthState,*/ useSignInWithEmailAndPassword} from "react-firebase-hooks/auth";
import {getAuth/*, signInWithEmailAndPassword, signOut*/} from "firebase/auth";
import {getDatabase/*, ref, set*/} from "firebase/database";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

import {getWeb3ModalProvider} from "@shared/web3";
import {Button} from "shared/components/common/button";
//import {InputEmail} from "shared/components/common/form/input-email";
//import {InputPassword} from "shared/components/common/form/input-password";
import firebase from "shared/firebase";

const auth = getAuth(firebase);
// const db = getDatabase();
const connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org", // Required
  qrcodeModal: QRCodeModal,
});


type Values = {email?: string; password?: string; address: string};

const Login = () => {
  //const [user, loading, error] = useAuthState(auth);
  const [openForm, setOpenForm] = React.useState(false);
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const handleModalConnect = async () => {
    const web3 = await getWeb3ModalProvider()
  };

  const handleSubmit = async (user: Values) => {
    if (user.email && user.password) signInWithEmailAndPassword(user.email, user.password);
  };

  const handleQRCode = () => {
    if (!connector.connected) {
      // create new session
      connector.createSession();
    }
  };

  React.useEffect(() => {
    connector.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }

      // Get provided accounts and chainId
      const {accounts, chainId} = payload.params[0];
      console.log({accounts, chainId});
    });
  }, []);

  console.log({user, loading, error});

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="flex flex-col gap-4">
        <Button
          decoration="fillPrimary"
          size="medium"
          className="w-full mb-2 bg-primary text-white"
          onClick={handleModalConnect}
        >
          Login with Ronin Wallet
        </Button>
        <Button
          decoration="line-primary"
          size="medium"
          className="w-full mb-2"
          onClick={handleQRCode}
        >
          Login By QR Code
        </Button>
        {openForm ? (
          <EmailPasswordForm onSubmit={handleSubmit} />
        ) : (
          <Button
            decoration="line-primary"
            size="medium"
            className="w-full mb-2"
            onClick={() => setOpenForm(true)}
          >
            Login with email & password
          </Button>
        )}
      </div>
    </div>
  );
};

interface EmailPasswordFormProps {
  onSubmit: (args: Values) => void;
}

const EmailPasswordForm: React.FunctionComponent<EmailPasswordFormProps> = (props) => {
  const {onSubmit} = props;
  const [formValues, setFormValues] = React.useState<Values>({
    email: "",
    password: "",
    address: "",
  });

  const setField = (field: keyof Values) => (e: React.ChangeEvent<any>) => {
    setFormValues((prev) => ({...prev, [field]: e.target.value}));
  };

  return (
    <div className="p-20 flex flex-col">
      <div className="mb-4 w-full">
        <input value={formValues.email} onChange={setField("email")} placeholder="email" />
      </div>
      <div className="mb-4">
        <input
          value={formValues.password}
          onChange={setField("password")}
          placeholder="password"
        />
      </div>
      <Button
        decoration="fill"
        size="small"
        className="w-full mb-2"
        onClick={() => onSubmit(formValues)}
      >
        Sign in
      </Button>
    </div>
  );
};

export default Login;
