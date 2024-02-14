/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, store } from "redux/store";
import { Button } from "shared/components/common/button";
import clsx from "clsx";
import useMagicLink from "@shared/hooks/useMagicLink";
import { WALLETS } from "@shared/utils/connection/utils";
import { LoadingOutlined } from "@ant-design/icons";
import { onGetAssets, onLogged } from "@redux/actions";
import { loginIMXPassport, switchChain } from "@shared/web3";
import { useBlockchain } from "@shared/context/useBlockchain";
import { CHAIN_IDS_BY_NAME } from "@shared/utils/chains";
import { useUser } from "@shared/context/useUser";
import { useWeb3React } from "@web3-react/core";
import { XIcon } from "@heroicons/react/solid";
import { toast } from "react-hot-toast";

const LoginModal = ({ hide }) => {
  const [loading, setLoading] = React.useState({
    value: false,
    walletLoading: "",
  });
  const [isLogged, setIsLogged] = React.useState(false);
  const { login, isAuthenticated } = useMagicLink(
    store.getState()["networks"].networkId,
  );

  const { account, provider } = useWeb3React();

  const router = useRouter();

  const { blockchain, updateBlockchain } = useBlockchain();

  const dispatch = useAppDispatch();
  const { updateUser } = useUser();

  const handleLogin = async () => {
    setLoading({ value: true, walletLoading: "magic" });
    try {
      const logged = await login(updateUser);
      console.log(logged);
      if (logged) {
        localStorage.setItem("typeOfConnection", "magic");
        localStorage.setItem("loginTime", new Date().getTime().toString());
        hide();
      } else {
        localStorage.removeItem("typeOfConnection");
        localStorage.removeItem("loginTime");
        localStorage.removeItem("chain");
      }
    } catch (err) {
      console.log({ err });
      setLoading({ value: false, walletLoading: "" });
      toast.error(
        "There was an error in your authentication, please try again",
      );
    }
    setLoading({ value: false, walletLoading: "" });
  };

  const handleConnection = async (connection: any, title: any) => {
    setLoading({ value: true, walletLoading: title });
    try {
      await connection.connector.activate();
      localStorage.setItem("typeOfConnection", title);
      localStorage.setItem("loginTime", new Date().getTime().toString());
      setIsLogged(true);
    } catch (err) {
      console.log({ err });
      setLoading({ value: false, walletLoading: "" });
      toast.error(
        "There was an error in your authentication, please try again",
      );
    }
  };

  React.useEffect(() => {
    if (account && isLogged) {
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
        setLoading({ value: false, walletLoading: "" });
        hide();
      }, 1000);
    }
  }, [account, isLogged]);

  return (
    <div className="flex flex-col gap-4 bg-overlay rounded-xl border border-overlay-border relative shadow-inner mt-24 md:w-[500px] w-[300px]">
      <div className="text-center text-2xl font-bold text-white py-3 border-b border-overlay-border px-4 relative">
        Login to the 5HG <br /> Marketplace
        <XIcon
          onClick={hide}
          className="w-6 h-6 cursor-pointer text-overlay-border absolute top-0 bottom-0 my-auto right-2"
        ></XIcon>
      </div>
      <div className="text-center text-lg font-[600] text-white pb-2 border-b border-overlay-border px-4">
        Don’t have a Web3 Wallet? Create one by choosing a secure method below.
      </div>
      <div
        className={clsx(
          "flex flex-col gap-4 relative items-center justify-center px-4 pb-6",
        )}
      >
        <>
          {WALLETS.map((k, i) => (
            <Button
              disabled={loading.value}
              decoration="fillPrimaryDisabled"
              size="medium"
              className="w-full mb-2 rounded-md text-white !font-bold text-xl !py-2 !px-2"
              onClick={() => handleConnection(k.connection, k.title)}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex gap-2">
                  <div className="w-10 h-8 flex items-center justify-center">
                    <img src={k.src} className="h-8" alt="" />
                  </div>
                  {k.title}
                </div>
                {loading.value && loading.walletLoading == k.title ? (
                  <LoadingOutlined className="text-lg text-overlay-border" />
                ) : k.title.toLowerCase() == "metamask" ? (
                  <p className="text-overlay-border text-[16px]">POPULAR</p>
                ) : (
                  ""
                )}
              </div>
            </Button>
          ))}
          <Button
            disabled={loading.value}
            decoration="fillPrimaryDisabled"
            size="medium"
            className="w-full mb-2 rounded-md text-white !font-bold text-xl !py-2 !px-2"
            onClick={() => handleLogin()}
          >
            <div className="flex justify-between w-full">
              <div className="flex gap-2">
                <div className="w-10 h-8 flex items-center justify-center">
                  <img src={"/icons/magic.svg"} className="h-8" alt="" />
                </div>
                Email Login (Magic Link)
              </div>
              {loading.value && loading.walletLoading == "magic" ? (
                <LoadingOutlined className="text-lg text-overlay-border" />
              ) : (
                ""
              )}
            </div>
          </Button>
          <Button
            disabled={loading.value}
            decoration="fillPrimaryDisabled"
            size="medium"
            className="w-full mb-2 rounded-md text-white !font-bold text-xl !py-2 !px-2"
            onClick={async () => {
              console.log("imx");
              setLoading({ value: true, walletLoading: "imx" });
              await loginIMXPassport({
                updateUser,
                updateBlockchain,
                onSuccess: () => {
                  router.push("/");
                },
              });
              hide();
              setLoading({ value: false, walletLoading: "" });
            }}
          >
            <div className="flex justify-between w-full">
              <div className="flex gap-2  items-center">
                <div className="w-10 h-8 flex items-center justify-center">
                  <img src={"/images/imx.png"} className="h-8" alt="" />
                </div>
                Immutable X Passport
              </div>
              {loading.value && loading.walletLoading == "imx" ? (
                <LoadingOutlined className="text-lg text-overlay-border" />
              ) : (
                ""
              )}
            </div>
          </Button>
        </>
      </div>
    </div>
  );
};

export default LoginModal;
