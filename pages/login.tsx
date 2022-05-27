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
import clsx from "clsx";

type Values = {
  email?: string;
  password?: string;
  address: string;
  walletType: "metamask" | "wallet_connect";
};

const Login = () => {
  const [openForm, setOpenForm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { Modal, isShow, show, hide } = useModal();
  const { authenticate, signup, login, enableWeb3, isAuthenticated, Moralis } =
    useMoralis();

  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleMetamaskConnect = async () => {
    setLoading(true);
    try {
      await enableWeb3();
      await(window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId:
              "0x" + parseInt(process.env.NEXT_PUBLIC_CHAIN_ID).toString(16),
          },
        ],
      });
      const user = await authenticate();
    } catch (err) {
      console.log({ err });
      setLoading(false);
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
      console.log({ err });
      setLoading(false);
    }
    setLoading(false);
  };

  const handleRegister = async (user: Values) => {
    try {
      await signup(user.email, user.password, user.email);
    } catch (err) {
      console.log({ err });
    }
  };

  const handleLogin = async (user: Values) => {
    setLoading(true);
    try {
      await login(user.email, user.password);
      await handleMetamaskConnect();
    } catch (err) {
      console.log({ err });
      setLoading(false);
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
          <EmailPasswordForm
            onLogin={handleLogin}
            onRegister={handleRegister}
            loading={loading}
          />
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
            <a
              href={"https://metamask.io/"}
              className="text-primary"
              target="_blank"
            >
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
  onLogin: (args: Values) => void;
  onRegister: (args: Values) => void;
  loading: boolean;
}

const EmailPasswordForm: React.FunctionComponent<EmailPasswordFormProps> = (
  props
) => {
  const { onLogin, onRegister, loading } = props;
  const { Modal: ModalRegister, isShow, show, hide } = useModal();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [mayus, setMayus] = React.useState(false);
  const [number, setNumber] = React.useState(false);
  const [specialChar, setSpecialChar] = React.useState(false);
  const [lengthZero, setLenghtZero] = React.useState(true);

  const passwordStrength = () => {
    let passwordFilter = 0;
    if (mayus) {
      passwordFilter++;
    }
    if (number) {
      passwordFilter++;
    }
    if (specialChar) {
      passwordFilter++;
    }
    if (lengthZero) {
      return -1;
    }
    return passwordFilter;
  };

  React.useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <>
      <form onSubmit={handleSubmit(onLogin)}>
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
        <form onSubmit={handleSubmit(onRegister)}>
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
                onChangeCustom={(e: any) => {
                  const regexMayus = /[A-Z]/g;
                  if (regexMayus.test(e.target.value)) {
                    setMayus(true);
                  } else {
                    setMayus(false);
                  }
                  const regexNumber = /\d/g;
                  if (regexNumber.test(e.target.value)) {
                    setNumber(true);
                  } else {
                    setNumber(false);
                  }
                  const regexSpecialChar = /[#$/&*.]/g;
                  if (regexSpecialChar.test(e.target.value)) {
                    setSpecialChar(true);
                  } else {
                    setSpecialChar(false);
                  }
                  if (e.target.value.length === 0) {
                    setLenghtZero(true);
                  } else {
                    setLenghtZero(false);
                  }
                }}
              />
            </div>
            <div className="mb-4">
              <div className="grid grid-cols-4 gap-1">
                <div
                  className={clsx(
                    { "bg-gray-700": passwordStrength() === -1 },
                    { "bg-red-500": passwordStrength() === 0 },
                    { "bg-orange-500": passwordStrength() === 1 },
                    { "bg-yellow-500": passwordStrength() === 2 },
                    { "bg-green-500": passwordStrength() === 3 },
                    "w-full h-2 rounded-md"
                  )}
                ></div>
                <div
                  className={clsx(
                    { "bg-gray-700": passwordStrength() <= 0 },
                    { "bg-orange-500": passwordStrength() === 1 },
                    { "bg-yellow-500": passwordStrength() === 2 },
                    { "bg-green-500": passwordStrength() === 3 },
                    { "bg-green-500": passwordStrength() === 3 },
                    "w-full h-2 rounded-md"
                  )}
                ></div>
                <div
                  className={clsx(
                    { "bg-gray-700": passwordStrength() <= 1 },
                    { "bg-yellow-500": passwordStrength() === 2 },
                    { "bg-green-500": passwordStrength() === 3 },
                    "w-full h-2 rounded-md"
                  )}
                ></div>
                <div
                  className={clsx(
                    { "bg-gray-700": passwordStrength() <= 2 },
                    { "bg-green-500": passwordStrength() === 3 },
                    "w-full h-2 rounded-md"
                  )}
                ></div>
              </div>
              <Typography
                className={clsx(
                  { "text-gray-700": passwordStrength() === -1 },
                  { "text-red-500": passwordStrength() === 0 },
                  { "text-orange-500": passwordStrength() === 1 },
                  { "text-yellow-500": passwordStrength() === 2 },
                  { "text-green-500": passwordStrength() === 3 },
                  "mt-2"
                )}
                type="subTitle"
              >
                {passwordStrength() === -1
                  ? "None"
                  : passwordStrength() === 0
                  ? "Weak"
                  : passwordStrength() === 1
                  ? "Normal"
                  : passwordStrength() === 2
                  ? "Good"
                  : "Perfect"}
              </Typography>
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
