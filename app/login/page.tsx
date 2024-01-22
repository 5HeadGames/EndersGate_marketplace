/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, store } from "redux/store";
import { Button } from "shared/components/common/button";
import clsx from "clsx";
import useMagicLink from "@shared/hooks/useMagicLink";
import { WALLETS } from "@shared/utils/connection/utils";
import { LoadingOutlined } from "@ant-design/icons";
import { onGetAssets, onLogged } from "@redux/actions";
import { switchChain } from "@shared/web3";
import { useBlockchain } from "@shared/context/useBlockchain";
import { CHAIN_IDS_BY_NAME } from "@shared/utils/chains";
import { useUser } from "@shared/context/useUser";
import { useWeb3React } from "@web3-react/core";

const Login = () => {
  const [loading, setLoading] = React.useState(false);
  const [isLogged, setIsLogged] = React.useState(false);
  const { login, isAuthenticated } = useMagicLink(
    store.getState()["networks"].networkId,
  );

  const { account, provider } = useWeb3React();

  const { blockchain } = useBlockchain();

  const query = useParams();

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { updateUser } = useUser();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(updateUser);
      localStorage.setItem("typeOfConnection", "magic");
      localStorage.setItem("loginTime", new Date().getTime().toString());
      const queryAddress: any = query.redirectAddress?.toString();
      if (query.redirect === "true" && query.redirectAddress != null) {
        router.push(queryAddress !== undefined ? queryAddress : "/");
      }
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

  const handleConnection = async (connection: any, title: any) => {
    setLoading(true);
    try {
      await connection.connector.activate();
      localStorage.setItem("typeOfConnection", title);
      localStorage.setItem("loginTime", new Date().getTime().toString());
      setIsLogged(true);
    } catch (err) {
      console.log({ err });
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (account && isLogged) {
      const queryAddress: any = query?.redirectAddress?.toString();
      setTimeout(async () => {
        try {
          await switchChain(CHAIN_IDS_BY_NAME[blockchain]);
        } catch (e) {
          console.log(e.message);
        }
        updateUser({
          ethAddress: account,
          email: "",
          provider: provider?.provider,
          providerName: "web3react",
        });
        dispatch(onGetAssets({ address: account, blockchain }));
        if (query.redirect === "true" && query.redirectAddress != null) {
          router.push(queryAddress !== undefined ? queryAddress : "/");
        } else {
          router.push("/");
        }
        setLoading(false);
      }, 1000);
    }
  }, [account, isLogged]);

  return (
    <div className="min-h-screen">
      <div className="overflow-hidden relative min-h-[100vh] w-full flex flex-col items-center justify-center gap-10 py-20">
        <div className="absolute h-full overflow-hidden w-full flex items-center justify-center top-0 bottom-0 m-auto right-0 left-[-8%]">
          <img
            src="/images/community.svg"
            className={`relative  w-[120vw] min-w-[1920px] h-[101vh] opacity-25`}
            style={{ width: "150vw" }}
            alt=""
          />
        </div>
        <h1 className="font-bold text-white text-3xl relative text-center">
          JOIN THE <span className="text-red-primary font-bold">5</span>
          <span className="text-white font-bold">HEADGAMES</span> MARKETPLACE
        </h1>
        <div
          className={clsx(
            "flex flex-col gap-4 relative h-80 items-center justify-center",
          )}
        >
          {loading === true ? (
            <LoadingOutlined className="text-5xl text-white" />
          ) : (
            <>
              {WALLETS.map((k, i) => (
                <Button
                  disabled={loading}
                  decoration="line-white"
                  size="medium"
                  className="w-full mb-2 bg-overlay rounded-md  text-white hover:text-overlay"
                  onClick={() => handleConnection(k.connection, k.title)}
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
                {loading ? "..." : "Login with Email"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
