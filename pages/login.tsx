import React from "react";
import {useForm} from "react-hook-form";
import {useRouter} from "next/router";
import {useMoralis} from "react-moralis";

import {useModal} from "@shared/hooks/modal";
import {useAppDispatch} from "redux/store";
import {Button} from "shared/components/common/button";
import Dialog from "shared/components/common/dialog";
import {Typography} from "shared/components/common/typography";
import {InputPassword} from "shared/components/common/form/input-password";
import {InputEmail} from "shared/components/common/form/input-email";

type Values = {
  email?: string;
  password?: string;
  address: string;
  walletType: "metamask" | "wallet_connect";
};

const Login = () => {
  const [openForm, setOpenForm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const {Modal, isShow, show, hide} = useModal();
  const {authenticate, signup, login, enableWeb3, isAuthenticated, isWeb3Enabled} = useMoralis();

  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleMetamaskConnect = async () => {
    setLoading(true);
    try {
      await enableWeb3();
      const user = await authenticate();
    } catch (err) {
      console.log({err});
    }
    setLoading(false);
  };

  const handleWalletConnect = async () => {
    setLoading(true);
    try {
      await enableWeb3({
        provider: "walletconnect",
      });
      await authenticate({
        provider: "walletconnect",
      });
    } catch (err) {
      console.log({err});
    }
    setLoading(false);
  };

  const handleSubmit = async (user: Values) => {
    setLoading(true);
    try {
      await login(user.email, user.password);
      await handleMetamaskConnect();
    } catch (err) {
      console.log({err});
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="flex flex-col gap-4">
        <Button
          disabled={loading}
          decoration="fillPrimary"
          size="medium"
          className="w-full mb-2 bg-primary text-white"
          onClick={handleWalletConnect}
        >
          {loading ? "..." : "Login with WalletConnect"}
        </Button>
        <Button
          disabled={loading}
          decoration="fillPrimary"
          size="medium"
          className="w-full mb-2 bg-primary text-white"
          onClick={handleMetamaskConnect}
        >
          {loading ? "..." : "Login with Metamask Wallet"}
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
      <Modal isShow={Boolean(isShow)}>
        <div className="flex flex-col items-center p-6">
          <Typography type="title" className="text-purple-400/75">
            {`Install Metamask`}
          </Typography>
          <p className="text-purple-200/75">
            You must install{" "}
            <a href={"https://metamask.io/"} className="text-primary" target="_blank">
              metamask
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
  const { Modal: ModalRegister, isShow, show, hide } = useModal();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
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
            <a
              className="text-white"
              href="#"
              onClick={() => {
                show();
              }}
            >
              {" "}
              Register!{" "}
            </a>
          </span>
        </div>
      </form>
      <ModalRegister isShow={isShow}>
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
      </ModalRegister>
    </>
  );
};

export default Login;
