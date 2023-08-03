/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useRouter } from "next/router";

import { useAppDispatch, store } from "redux/store";
import { Button } from "shared/components/common/button";
import clsx from "clsx";
import useMagicLink from "@shared/hooks/useMagicLink";
import { WALLETS } from "@shared/utils/connection/utils";
import { LoadingOutlined } from "@ant-design/icons";
import { onLogged } from "@redux/actions";
import { switchChain } from "@shared/web3";
import { useBlockchain } from "@shared/context/useBlockchain";
import { CHAIN_IDS_BY_NAME } from "@shared/components/chains";

const Login = () => {
  const [loading, setLoading] = React.useState(false);
  const { login, isAuthenticated } = useMagicLink(
    store.getState()["networks"].networkId,
  );

  const { blockchain } = useBlockchain();

  const { query } = useRouter();

  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(dispatch);
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
      dispatch(onLogged({ isLogged: true }));

      const queryAddress: any = query?.redirectAddress?.toString();
      setTimeout(async () => {
        try {
          await switchChain(CHAIN_IDS_BY_NAME[blockchain]);
        } catch (e) {
          console.log(e.message);
        }
        if (query.redirect === "true" && query.redirectAddress != null) {
          router.push(queryAddress !== undefined ? queryAddress : "/");
        }
        setLoading(false);
      }, 5000);
    } catch (err) {
      console.log({ err });
      setLoading(false);
    }
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
