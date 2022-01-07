import React from "react";

import {useAppDispatch} from "redux/store";
import {onLoginUser} from "redux/actions";
import {getMetamaskProvider, getWalletConnect} from "@shared/web3";
import {Button} from "shared/components/common/button";
import Dialog from "shared/components/common/dialog";
//import {InputPassword} from "shared/components/common/form/input-password";
//import {InputEmail} from "shared/components/common/form/input-email";

type Values = {email?: string; password?: string; address: string};

const Login = () => {
  //const [user, loading, error] = useAuthState(auth);
  const [openForm, setOpenForm] = React.useState(false);
  const [openRegistration, setOpenRegistration] = React.useState(false);
  const dispatch = useAppDispatch();
  const connector = getWalletConnect();

  const handleMetamaskConnect = async () => {
    const web3 = await getMetamaskProvider();
    const accounts = await web3.eth.getAccounts();
    dispatch(onLoginUser({address: accounts[0]}));
  };

  const handleSubmit = async (user: Values) => {
    dispatch(onLoginUser({...user}));
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

      const {accounts, chainId} = payload.params[0];
      dispatch(onLoginUser({address: accounts[0]}));
    });
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="flex flex-col gap-4">
        <Button
          decoration="fillPrimary"
          size="medium"
          className="w-full mb-2 bg-primary text-white"
          onClick={handleMetamaskConnect}
        >
          Login with Metamask
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
        <Dialog open={openRegistration} onClose={() => setOpenRegistration(false)}>
          some dummy text
        </Dialog>
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
        <input
          value={formValues.email}
          onChange={setField("email")}
          placeholder="email"
        />
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
