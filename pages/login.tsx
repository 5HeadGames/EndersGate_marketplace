import React from "react";
import {useForm} from "react-hook-form";

import {useAppDispatch} from "redux/store";
import {onLoginUser} from "redux/actions";
import {getMetamaskProvider, getWalletConnect} from "@shared/web3";
import {Button} from "shared/components/common/button";
import Dialog from "shared/components/common/dialog";
import {Typography} from "shared/components/common/typography";
import {InputPassword} from "shared/components/common/form/input-password";
import {InputEmail} from "shared/components/common/form/input-email";

type Values = {email?: string; password?: string; address: string};

const Login = () => {
  //const [user, loading, error] = useAuthState(auth);
  const [openForm, setOpenForm] = React.useState(false);
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
      </div>
    </div>
  );
};

interface EmailPasswordFormProps {
  onSubmit: (args: Values) => void;
}

const EmailPasswordForm: React.FunctionComponent<EmailPasswordFormProps> = (props) => {
  const {onSubmit} = props;
  const [openRegistration, setOpenRegistration] = React.useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4 flex flex-col bg-secondary rounded-md">
          <div className="mb-4 w-full">
            <InputEmail register={register} placeholder="email" name="email" />
          </div>
          <div className="mb-4">
            <InputPassword register={register} placeholder=" password" name="password" />
          </div>
          <Button decoration="fill" size="small" type="submit" className="w-full mb-2">
            Sign in
          </Button>
          <span className="text-primary text-xs">
            You dont have an account?{" "}
            <a className="text-white" href="#" onClick={() => setOpenRegistration(true)}>
              {" "}
              Register!{" "}
            </a>
          </span>
        </div>
      </form>
      <Dialog open={openRegistration} onClose={() => setOpenRegistration(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography type="title" className="text-center text-primary">
            {" "}
            Register{" "}
          </Typography>
          <div className="p-4 flex flex-col bg-secondary rounded-md">
            <div className="mb-4 w-full">
              <InputEmail register={register} placeholder="email" name="email" />
            </div>
            <div className="mb-4">
              <InputPassword register={register} placeholder=" password" name="password" />
            </div>
            <Button decoration="fill" size="small" type="submit" className="w-full mb-2">
              Register
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default Login;
