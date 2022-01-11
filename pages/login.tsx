import React from "react";
import {useForm} from "react-hook-form";
import {useRouter} from "next/router";

import {useModal} from "@shared/hooks/modal";
import {useAppDispatch, useAppSelector} from "redux/store";
import {onLoginUser, onMessage} from "redux/actions";
import {loginHarmonyWallet, getWalletConnect} from "@shared/web3";
import {Button} from "shared/components/common/button";
import Dialog from "shared/components/common/dialog";
import {Typography} from "shared/components/common/typography";
import {InputPassword} from "shared/components/common/form/input-password";
import {InputEmail} from "shared/components/common/form/input-email";

type Values = {email?: string; password?: string; address: string};

const Login = () => {
  const [openForm, setOpenForm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const {Modal, isShow, show, hide} = useModal();
  const {address} = useAppSelector((state) => state.user);
  const [connector, setConnector] = React.useState(getWalletConnect());
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleHarmonyConnect = async () => {
    const account = await loginHarmonyWallet();
    if (!account) return show();
    setLoading(true);
    await dispatch(onLoginUser({address: account.address}));
    setLoading(false);
    dispatch(onMessage("Login successful!"));
    setTimeout(dispatch, 2000, onMessage(""));
  };

  const handleSubmit = async (user: Values) => {
    setLoading(true);
    const account = await loginHarmonyWallet();
    dispatch(onLoginUser({...user, address: account.address}));
    setLoading(false);
    dispatch(onMessage("Login successful!"));
    setTimeout(dispatch, 2000, onMessage(""));
  };

  const handleQRCode = () => {
    console.log(connector);
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
      console.log(accounts);
      dispatch(onLoginUser({address: accounts[0]}));
      dispatch(onMessage("Login successful!"));
      setTimeout(dispatch, 2000, onMessage(""));
    });
  }, []);

  React.useEffect(() => {
    if (address) router.push("/dashboard");
  }, [address]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="flex flex-col gap-4">
        <Button
          disabled={loading}
          decoration="fillPrimary"
          size="medium"
          className="w-full mb-2 bg-primary text-white"
          onClick={handleHarmonyConnect}
        >
          {loading ? "..." : "Login with Harmony Wallet"}
        </Button>
        <Button
          disabled={loading}
          decoration="line-primary"
          size="medium"
          className="w-full mb-2"
          onClick={handleQRCode}
        >
          {loading ? "..." : "Login By QR Code"}
        </Button>
        {openForm ? (
          <EmailPasswordForm onSubmit={handleSubmit} loading={loading} />
        ) : (
          <Button
            disabled={loading}
            decoration="line-primary"
            size="medium"
            className="w-full mb-2"
            onClick={() => setOpenForm(true)}
          >
            {loading ? "..." : "Login with email & password"}
          </Button>
        )}
      </div>
      <Modal isShow={isShow}>
        <div className="flex flex-col items-center p-6">
          <Typography type="title" className="text-purple-400/75">
            Install Harmony Wallet
          </Typography>
          <p className="text-purple-200/75">
            You must install{" "}
            <a
              href="https://chrome.google.com/webstore/detail/harmony-chrome-extension/fnnegphlobjdpkhecapkijjdkgcjhkib"
              className="text-primary"
              target="_blank"
            >
              harmony one
            </a>{" "}
            official wallet to connect through this method
          </p>
        </div>
      </Modal>
    </div>
  );
};

interface EmailPasswordFormProps {
  onSubmit: (args: Values) => void;
  loading: boolean;
}

const EmailPasswordForm: React.FunctionComponent<EmailPasswordFormProps> = (props) => {
  const {onSubmit, loading} = props;
  const [openRegistration, setOpenRegistration] = React.useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm();

  React.useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4 flex flex-col bg-secondary rounded-md">
          <div className="mb-4 w-full">
            <InputEmail
              register={register}
              placeholder="email"
              name="email"
              error={errors.email}
            />
          </div>
          <div className="mb-4">
            <InputPassword
              register={register}
              placeholder=" password"
              error={errors.password}
              name="password"
            />
          </div>
          <Button
            decoration="fill"
            size="small"
            type="submit"
            className="w-full mb-2"
            disabled={loading}
          >
            {loading ? "..." : "Sign in"}
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
              <InputEmail
                register={register}
                placeholder="email"
                name="email"
                error={errors.email}
              />
            </div>
            <div className="mb-4">
              <InputPassword
                register={register}
                placeholder=" password"
                name="password"
                error={errors.password}
              />
            </div>
            <Button
              decoration="fill"
              size="small"
              type="submit"
              className="w-full mb-2"
              disabled={loading}
            >
              {loading ? "..." : "Register"}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default Login;
