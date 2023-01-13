import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import { useModal } from "@shared/hooks/modal";
import { useAppDispatch, store } from "redux/store";
import { Button } from "shared/components/common/button";
import Dialog from "shared/components/common/dialog";
import { Typography } from "shared/components/common/typography";
import { InputPassword } from "shared/components/common/form/input-password";
import { InputEmail } from "shared/components/common/form/input-email";
import clsx from "clsx";
import useMagicLink from "@shared/hooks/useMagicLink";
import { WALLETS } from "@shared/utils/connection/utils";
import { LoadingOutlined } from "@ant-design/icons";
import { onUpdateUser } from "@redux/actions";
import { useWeb3React } from "@web3-react/core";

type Values = {
  email?: string;
  password?: string;
  address: string;
  walletType: "metamask" | "wallet_connect";
};

const Login = () => {
  const [loading, setLoading] = React.useState(false);
  const { login, isAuthenticated, magic } = useMagicLink(
    store.getState()["networks"].networkId,
  );

  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(dispatch);
      router.push("/");
    } catch (err) {
      console.log({ err });
      setLoading(false);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (isAuthenticated) router.push("/");
  }, [isAuthenticated]);

  const handleConnection = async (connection) => {
    setLoading(true);
    try {
      await connection.connector.activate();

      router.push("/");
    } catch (err) {
      console.log({ err });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-[100vw] h-screen overflow-hidden">
      <div className="max-w-[100vw] overflow-hidden h-[100vh] w-full flex flex-col items-center justify-center gap-10">
        <div className="absolute h-full overflow-hidden w-full flex items-center justify-center">
          <img
            src="/images/community.svg"
            className={`relative xl:min-w-[120vw] min-w-[1920px] min-h-[101vh] w-full top-0 right-0 left-[-8%] mx-auto opacity-25`}
            alt=""
          />
        </div>
        <h1 className="font-bold text-white text-3xl relative text-center">
          JOIN TO <span className="text-red-primary font-bold">5</span>
          <span className="text-white font-bold">HEADGAMES</span> MARKETPLACE
        </h1>
        <div
          className={clsx(
            "flex flex-col gap-4 relative h-80 items-center justify-center",
          )}
        >
          {loading == true ? (
            <LoadingOutlined className="text-5xl text-white" />
          ) : (
            <>
              {WALLETS.map((k, i) => (
                <Button
                  disabled={loading}
                  decoration="line-white"
                  size="medium"
                  className="w-full mb-2 bg-overlay rounded-md  text-white hover:text-overlay"
                  onClick={() => handleConnection(k.connection)}
                >
                  {loading ? "..." : "Login with " + k.title}
                </Button>
              ))}
              <Button
                disabled={loading}
                decoration="line-white"
                size="medium"
                className="w-full mb-2 bg-overlay rounded-md  text-white hover:text-overlay"
                onClick={() => handleLogin()}
              >
                {loading ? "..." : "Login with Magic Link"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

interface EmailPasswordFormProps {
  onLogin: (args: Values) => void;
  onRegister: (args: Values) => void;
  loading: boolean;
}

const EmailPasswordForm: React.FunctionComponent<EmailPasswordFormProps> = (
  props,
) => {
  const { onLogin, onRegister, loading } = props;
  const { Modal: ModalRegister, isShow, show, hide } = useModal();
  const {
    register,
    handleSubmit,
    watch,
    reset,
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
        <div className="p-4 flex flex-col bg-secondary rounded-xl">
          <div className="mb-4 w-full">
            <InputEmail
              register={register}
              placeholder="Email"
              name="email"
              classNameContainer="rounded-xl"
              reset={reset}
              error={errors.email}
            />
          </div>
          <div className="mb-4">
            <InputPassword
              register={register}
              placeholder="Password"
              error={errors.password}
              reset={reset}
              classNameContainer="rounded-xl"
              name="password"
            />
          </div>
          <Button
            decoration="line-white"
            size="small"
            type="submit"
            className="w-full mb-2 text-white hover:text-overlay rounded-xl"
            disabled={loading}
          >
            {loading ? <LoadingOutlined /> : "Sign in"}
          </Button>
          <span className="text-primary text-xs">
            You dont have an account?{" "}
            <a
              className="text-red-primary"
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
      <ModalRegister isShow={isShow} withoutX>
        <form onSubmit={handleSubmit(onRegister)}>
          <div className="p-4 flex flex-col gap-4 bg-secondary items-center rounded-md w-96">
            <Typography
              type="title"
              className="text-center text-primary font-bold"
            >
              {" "}
              REGISTER TO <span className="text-red-primary font-bold">5</span>
              <span className="text-white font-bold">HEADGAMES</span>
            </Typography>
            <div className="w-full">
              <InputEmail
                register={register}
                placeholder="Email"
                name="email"
                reset={reset}
                classNameContainer="rounded-xl"
                error={errors.email}
              />
            </div>
            <div className="w-full">
              <InputPassword
                register={register}
                placeholder="Password"
                name="password"
                error={errors.password}
                classNameContainer="rounded-xl"
                reset={reset}
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
            <div className="w-full">
              <div className="grid grid-cols-4 gap-1">
                <div
                  className={clsx(
                    { "bg-gray-700": passwordStrength() === -1 },
                    { "bg-red-primary": passwordStrength() === 0 },
                    { "bg-orange-500": passwordStrength() === 1 },
                    { "bg-yellow-500": passwordStrength() === 2 },
                    { "bg-green-500": passwordStrength() === 3 },
                    "w-full h-2 rounded-md",
                  )}
                ></div>
                <div
                  className={clsx(
                    { "bg-gray-700": passwordStrength() <= 0 },
                    { "bg-orange-500": passwordStrength() === 1 },
                    { "bg-yellow-500": passwordStrength() === 2 },
                    { "bg-green-500": passwordStrength() === 3 },
                    { "bg-green-500": passwordStrength() === 3 },
                    "w-full h-2 rounded-md",
                  )}
                ></div>
                <div
                  className={clsx(
                    { "bg-gray-700": passwordStrength() <= 1 },
                    { "bg-yellow-500": passwordStrength() === 2 },
                    { "bg-green-500": passwordStrength() === 3 },
                    "w-full h-2 rounded-md",
                  )}
                ></div>
                <div
                  className={clsx(
                    { "bg-gray-700": passwordStrength() <= 2 },
                    { "bg-green-500": passwordStrength() === 3 },
                    "w-full h-2 rounded-md",
                  )}
                ></div>
              </div>
              <Typography
                className={clsx(
                  { "text-gray-700": passwordStrength() === -1 },
                  { "text-red-primary": passwordStrength() === 0 },
                  { "text-orange-500": passwordStrength() === 1 },
                  { "text-yellow-500": passwordStrength() === 2 },
                  { "text-green-500": passwordStrength() === 3 },
                  "mt-2",
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
              className="md:w-48 w-32 font-bold md:text-lg text-md py-[6px] rounded-lg text-overlay !bg-green-button hover:!bg-secondary hover:!text-green-button hover:!border-green-button"
              disabled={loading}
            >
              <p className="font-bold">
                {loading ? <LoadingOutlined /> : "REGISTER"}
              </p>
            </Button>
          </div>
        </form>
      </ModalRegister>
    </>
  );
};

export default Login;
