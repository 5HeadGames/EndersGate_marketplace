/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import useMagicLink from "@shared/hooks/useMagicLink";
import clsx from "clsx";
import {SidebarMobile} from "./sidebars/mobile";
import {useAppDispatch} from "redux/store";
import {onGetAssets, onLoadSales} from "redux/actions";
import {SearchOutlined, ShoppingCartOutlined} from "@ant-design/icons";
import {MenuIcon, XIcon} from "@heroicons/react/solid";
import {Footer} from "../common/footerComponents/footer";
import {Dropdown} from "../common/dropdowns/dropdown/dropdown";
import {useSelector} from "react-redux";
import {getConnection, WALLETS} from "@shared/utils/connection/utils";
import {authStillValid} from "../utils";
import {Cart} from "./cart";
import ChainSelect from "./chainSelect";
import {useBlockchain} from "@shared/context/useBlockchain";
import {toast} from "react-hot-toast";
import {getRentsPendingByUser} from "@shared/web3";
import {useUser} from "@shared/context/useUser";
import {handleSignOut, Logo, NavbarItem, navItems} from "./utils";
import ModalShop from "../Shop/ModalShop";
import {useModal} from "@shared/hooks/modal";
import {Button} from "../common/button/button";
import Link from "next/link";
import {useRouter, useParams, usePathname} from "next/navigation";
import LoginModal from "../Login/loginModal";
import {initializeApp} from "firebase/app";
import {CHAIN_NAME_BY_ID} from "@shared/utils/chains";
import {initializeConnector} from "@web3-react/core";
import {MetaMask} from "@web3-react/metamask";
import {Connection, ConnectionType} from "@shared/utils/connection";

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
  },
};

export default function AppLayout({children}) {
  const firebaseConfig = {
    apiKey: "AIzaSyCtkRgLKQD7vMLqf9v4iNqWclGaRW8z2Zs",
    authDomain: "endersgate-1ff81.firebaseapp.com",
    databaseURL: "https://endersgate-1ff81-default-rtdb.firebaseio.com",
    projectId: "endersgate-1ff81",
    storageBucket: "endersgate-1ff81.appspot.com",
    messagingSenderId: "248387184050",
    appId: "1:248387184050:web:b872255ff8f7375880f0ab",
    measurementId: "G-K1H6HYR0C8",
  };

  const app = initializeApp(firebaseConfig);

  const [web3MetamaskWallet, web3MetamaskWalletHooks] =
    initializeConnector<MetaMask>(
      (actions) =>
        new MetaMask({
          actions,
          onError: (error) => {
            console.log(error);
          },
        }),
    );

  const injectedConnection: Connection = {
    connector: web3MetamaskWallet,
    hooks: web3MetamaskWalletHooks,
    type: ConnectionType.INJECTED,
  };

  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [tokenSelected, setTokenSelected] = React.useState({
    address: "",
    name: "",
    transak: false,
    main: false,
  });
  const refSidebarMobile = React.useRef(null);
  const [disabled, setDisabled] = React.useState<ButtonsTypes>({
    logout: false,
    userData: false,
  });
  const [search, setSearch] = React.useState("");

  const router = useRouter();
  const pathname = usePathname();

  const {login, logout} = useMagicLink();

  const {updateUser, user} = useUser();

  const {
    user: {ethAddress, providerName},
  } = useUser();

  const {cart, cartRent} = useSelector((state: any) => state.layout);

  const {Modal: ModalSwap, show, isShow, hide} = useModal();
  const {
    Modal: ModalAuth,
    show: showAuth,
    isShow: isShowAuth,
    hide: hideAuth,
  } = useModal();

  const {allRents} = useSelector((state: any) => state.nfts);

  const {blockchain, updateBlockchain} = useBlockchain();

  const dispatch = useAppDispatch();

  let isFullscreen;

  const reconnect = async () => {
    try {
      const typeOfConnection = localStorage.getItem("typeOfConnection");
      if (authStillValid()) {
        if (typeOfConnection === "magic") {
          login(updateUser);
        }
      } else {
        localStorage.removeItem("typeOfConnection");
        localStorage.removeItem("loginTime");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  React.useEffect(() => {
    setTimeout(() => {
      reconnect();
    }, 10000);
  }, []);

  const loadSales = async () => {
    await dispatch(onLoadSales());
  };

  React.useEffect(() => {
    loadSales();
  }, [blockchain]);

  const userRentsNotificationArray =
    getRentsPendingByUser({user: ethAddress, rents: allRents}) || [];

  const profileItems = [
    {name: "INVENTORY", link: "/profile"},
    {
      name: "ACTIVITY",
      link: "/profile/activity",
    },
    {
      name: "MY SALES",
      link: "/profile/sales",
    },
    {
      name: "MY RENTS",
      link: "/profile/rents",
      notification: userRentsNotificationArray.length,
    },
    {
      name: "SWAP",
      link: "/profile/swap",
    },
    {
      name: "COMPETITIONS",
      link: "/competitive",
    },
    {
      name: "MY PACKS",
      link: "/pack_opening",
    },
    {
      name: "LOG OUT",
      decoration: "line-primary",
      onClick: () =>
        handleSignOut({
          providerName,
          logout,
          updateUser,
          router,
          setDisabled,
        }),
      disabled: disabled.logout,
    },
  ];

  return (
    <div className="overflow-x-hidden relative">
      <nav
        className={clsx(
          "fixed top-0 z-[100]",
          {"!hidden": isFullscreen},
          "bg-overlay",
          "w-[100%] md:px-10 px-4 py-2 flex flex-row items-center gap-x-4 shadow-md",
        )}
        style={styles.content}
      >
        <div className="w-full gap-2 flex">
          <Logo />
          <div className="border md:flex hidden items-center text-md justify-center border-overlay-border bg-primary-disabled rounded-xl w-1/2">
            <div className="text-white flex items-center w-full py-1 px-4 rounded-xl bg-overlay border-r border-overlay-border">
              <input
                type="text"
                className="text-white w-full bg-transparent focus:outline-none"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <div
                className="text-white cursor-pointer flex items-center"
                onClick={() => setSearch("")}
              >
                <XIcon color="#fff" width={"14px"} />
              </div>
            </div>
            <div
              className="text-dark text-xl flex items-center justify-center px-2 cursor-pointer"
              onClick={() => {
                if (search) {
                  if (pathname === "/marketplace?search=" + search) {
                    router.push("/marketplace");
                  }
                  router.push("/marketplace?search=" + search);
                }
              }}
            >
              <SearchOutlined />
            </div>
          </div>
        </div>
        <div className="lg:flex hidden gap-4 shrink-0 items-center">
          {navItems.map((item: any, index) => {
            return (
              <React.Fragment key={item.name}>
                <NavbarItem
                  name={item.name}
                  link={item.link}
                  route={pathname}
                  notification={false}
                />
              </React.Fragment>
            );
          })}
          {ethAddress ? (
            <>
              <div
                className={clsx(
                  {
                    "!opacity-100":
                      cartOpen || cart.length + cartRent.length > 0,
                  },
                  {"!hidden": pathname == "/shop"},
                  "hover:opacity-100 text-white opacity-50 flex justify-center items-center cursor-pointer rounded-md text-2xl whitespace-nowrap relative",
                )}
                onClick={() => {
                  setCartOpen(true);
                }}
              >
                {(cart.length > 0 || cartRent.length > 0) && (
                  <div
                    className={clsx(
                      "absolute top-[-4px] right-[-8px] w-4 h-4 flex items-center justify-center rounded-full font-bold text-[9px] bg-red-primary",
                    )}
                  >
                    {cart.length + cartRent.length}
                  </div>
                )}
                <ShoppingCartOutlined />
              </div>

              <Dropdown
                classTitle={"text-white opacity-50 hover:opacity-100 font-bold"}
                title={"MY ACCOUNT"}
                notification={userRentsNotificationArray.length}
              >
                <div className="flex flex-col items-center px-4 border border-overlay-border rounded-xl">
                  {profileItems.map((item: any, index) => {
                    return (
                      <React.Fragment key={item.name + index}>
                        {item.onClick ? (
                          <div
                            className={clsx(
                              "gap-2 py-2 flex items-center text-white opacity-50 hover:opacity-100 cursor-pointer",
                            )}
                            onClick={item.onClick}
                          >
                            <h3 className={clsx("text-md font-bold")}>
                              {item.name}
                            </h3>
                          </div>
                        ) : (
                          <NavbarItem
                            key={item.name}
                            name={item.name}
                            link={item.link}
                            route={pathname}
                            notification={item.notification}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </Dropdown>
              <ChainSelect />
            </>
          ) : (
            <div
              onClick={() => showAuth()}
              className={clsx(
                "py-2 relative",
                "text-md font-[600] text-white opacity-50 cursor-pointer",
              )}
            >
              LOG IN
            </div>
          )}
        </div>
        <div className="lg:hidden flex gap-4">
          <div
            className={clsx(
              {"!opacity-100": cartOpen || cart.length > 0},
              {hidden: pathname === "/shop"},
              "hover:opacity-100 text-white opacity-50 flex justify-center items-center cursor-pointer rounded-md text-2xl whitespace-nowrap relative",
            )}
            onClick={() => {
              setCartOpen(true);
            }}
          >
            {cart.length > 0 && (
              <div className="absolute top-[-4px] right-[-8px] w-4 h-4 flex items-center justify-center rounded-full font-bold text-[9px] bg-red-primary">
                {cart.length}
              </div>
            )}
            <ShoppingCartOutlined />
          </div>
          <ChainSelect />

          {!sidebarOpen ? (
            <MenuIcon
              className="h-6 w-6 shrink-0 text-primary cursor-pointer"
              aria-hidden="true"
              onClick={() => {
                setSidebarOpen((prev) => !prev);
              }}
            />
          ) : (
            <XIcon
              className="h-6 w-6 shrink-0 text-primary cursor-pointer"
              aria-hidden="true"
              onClick={() => {
                setSidebarOpen((prev) => !prev);
              }}
            />
          )}
        </div>
      </nav>

      <ModalAuth isShow={isShowAuth} withoutX>
        <LoginModal hide={hideAuth} />
      </ModalAuth>

      <SidebarMobile
        initialFocus={refSidebarMobile}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
        navItems={navItems}
        cart={cart}
        setCartOpen={setCartOpen}
        cartOpen={cartOpen}
        providerName={providerName}
        profileItems={profileItems}
      />

      <Cart
        tokenSelected={tokenSelected}
        setTokenSelected={setTokenSelected}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
      ></Cart>

      <ModalSwap isShow={isShow} withoutX>
        <div className="flex flex-col items-center bg-secondary rounded-xl border border-overlay-border w-full relative md:max-w-[700px] md:min-w-[500px] max-w-[350px] min-w-[350px]">
          <div className="flex items-center justify-center border-b border-overlay-border w-full py-4 px-4 relative">
            <h2 className="font-bold text-primary text-center text-3xl">
              Limited time offer!
            </h2>
            <XIcon
              onClick={() => hide()}
              className="absolute right-4 top-0 bottom-0 my-auto text-primary-disabled text-xl w-6 cursor-pointer"
            ></XIcon>
          </div>
          <div className="flex flex-col gap-4 w-full items-center justify-center pb-4 pt-2 md:px-16 px-4">
            <h3 className="text-lg text-white text-center w-full font-bold Raleway">
              Visit the virtual shop to obtain limited cards from the very first
              Generation of Enders Gate™ Cards!
            </h3>
            <p className="text-sm text-primary-disabled text-justify">
              Login to purchase and open Packs from the 5HG marketplace. Enders
              Gate™ Card packs can be re-sold unopened on the 5HG marketplace.
              They can also be opened revealing multiple cards that can be used
              in duels in the game, unlock special game modes, and listed for
              rental on the 5HG Marketplace to other players.
            </p>

            <div className="flex w-full justify-around items-center">
              <p className="text-sm font-bold text-white w-36 text-center">
                Need help?
              </p>
              <Link href="/profile/swap#FAQ">
                <p className="text-sm font-bold text-white py-1 px-4 bg-[#353535] rounded-xl w-36 text-center">
                  Visit our <span className="underline">FAQ</span>
                </p>
              </Link>
              <a
                href="https://discord.com/invite/nHNkWdE99h"
                target={"_blank"}
                rel="noreferrer"
                className="text-sm font-bold text-white py-1 px-4 bg-[#353535] rounded-xl w-36 text-center"
              >
                Join our <span className="underline">Discord</span>
              </a>
            </div>
          </div>

          <div className="flex gap-2 items-center justify-center relative">
            <img
              src="/images/home/modalImage.png"
              className="w-full flex"
              alt=""
            />
          </div>
          <Link
            href="/login?redirect=true&redirectAddress=/profile/swap"
            className="flex sm:flex-row flex-col gap-4 w-full justify-center items-center py-4"
          >
            <Button
              className="w-1/3 py-2 border !border-green-button bg-gradient-to-b from-overlay to-[#233408] rounded-md text-white font-bold"
              onClick={() => {
                hide();
              }}
            >
              Login
            </Button>
          </Link>
        </div>
      </ModalSwap>

      <div className={clsx("bg-overlay flex flex-col")} style={styles.content}>
        {children}
      </div>
      {!pathname?.includes("/comics") &&
        !pathname?.includes("/pack_opening") && <Footer />}
    </div>
  );
}
