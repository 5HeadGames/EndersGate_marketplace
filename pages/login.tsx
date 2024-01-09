/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useRouter } from "next/router";
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
import { useWeb3React } from "@web3-react/core";
import { useUser } from "@shared/context/useUser";
import { config, passport } from "@imtbl/sdk";

const baseConfig = {
  environment: config.Environment.SANDBOX,
  publishableKey: "pk_imapik-test-T4T232i3Ud_@jpQozNrd",
};

const passportInstance = new passport.Passport({
  baseConfig,
  clientId: "HXHIOulzVI5FUDSTVmFc0XRoyd7zFEwz",
  redirectUri: "http://localhost:3000",
  logoutMode: "silent",
  audience: "platform_api",
  scope: "openid offline_access email transact",
});

const Login = () => {
  const [loading, setLoading] = React.useState(false);
  const [isLogged, setIsLogged] = React.useState(false);
  const { login, isAuthenticated } = useMagicLink(
    store.getState()["networks"].networkId,
  );

  const { account, provider } = useWeb3React();

  const { blockchain, updateBlockchain } = useBlockchain();

  const { query } = useRouter();

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
      <div className="overflow-hidden min-h-[100vh] w-full flex flex-col items-center justify-center gap-10 py-20">
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
            "flex flex-col gap-4 relative h-auto items-center justify-center pt-10",
          )}
        >
          {loading === true ? (
            <LoadingOutlined className="text-5xl text-white" />
          ) : (
            <>
              <Button
                disabled={loading}
                decoration="line-white"
                size="medium"
                className="w-full mb-2 bg-overlay rounded-xl  text-white hover:text-overlay"
                onClick={() => handleLogin()}
              >
                {loading ? "..." : "Login with Email"}
              </Button>
              {WALLETS.map((k, i) => (
                <Button
                  disabled={loading}
                  decoration="line-white"
                  size="medium"
                  className="w-full mb-2 bg-overlay rounded-xl  text-white hover:text-overlay"
                  onClick={() => handleConnection(k.connection, k.title)}
                >
                  {loading ? "..." : "Login with " + k.title}
                </Button>
              ))}

              <Button
                disabled={loading}
                decoration="line-white"
                size="medium"
                className="w-full mb-2 bg-overlay rounded-xl  text-white hover:text-overlay"
                onClick={async () => {
                  try {
                    const provider = passportInstance.connectEvm();
                    const accounts = await provider.request({
                      method: "eth_requestAccounts",
                    });
                    localStorage.setItem("typeOfConnection", "passport");
                    localStorage.setItem(
                      "loginTime",
                      new Date().getTime().toString(),
                    );
                    updateUser({
                      ethAddress: accounts[0],
                      email: "",
                      provider: provider,
                      providerName: "passport",
                    });
                    updateBlockchain("imx");
                    console.log(accounts);
                  } catch (err) {
                    console.log(err);
                  }
                }}
              >
                {loading ? "..." : "Login with Immutable X Passport"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
