/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef } from "react";
import Link from "next/link";
import { Layout } from "antd";
import useMagicLink from "@shared/hooks/useMagicLink";
import { Icons } from "@shared/const/Icons";
import { useRouter } from "next/dist/client/router";
import clsx from "clsx";
import { SidebarMobile } from "./sidebars/mobile";
import { useAppDispatch } from "redux/store";
import { onGetAssets, onLoadSales, onUpdateUser } from "redux/actions";

import {
  AreaChartOutlined,
  SearchOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useWeb3React } from "@web3-react/core";
import { MenuIcon, XIcon } from "@heroicons/react/solid";
import { Footer } from "../common/footerComponents/footer";
import { Dropdown } from "../common/dropdown/dropdown";
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { WALLETS } from "@shared/utils/connection/utils";
import { authStillValid } from "../utils";
import { Cart } from "./cart";
import ChainSelect from "./chainSelect";
import { switchChain } from "@shared/web3";
import { CHAIN_IDS_BY_NAME } from "../chains";
import { useBlockchain } from "@shared/context/useBlockchain";
import { toast } from "react-hot-toast";

type ButtonsTypes = { logout: boolean; userData: boolean };

const navItems = [
  {
    name: "HOME",
    link: "/",
    icon: <AreaChartOutlined />,
  },
  { name: "EXPLORE", link: "/marketplace", icon: <ShopOutlined /> },
  // { name: "COMICS", link: "/comics", icon: <ShopOutlined /> },
  { name: "SHOP", link: "/shop", icon: <ShopOutlined /> },
];

export const Message: React.FunctionComponent<{
  content: string;
  open: boolean;
}> = (props) => {
  const { content, open } = props;

  return (
    <div
      className={clsx(
        `absolute bottom-3.5 left-3.5 bg-purple-300 px-10 py-4 rounded-md`,
        "ease-out duration-300",
        open ? "scale-100" : "scale-0",
      )}
    >
      {content}
    </div>
  );
};

export const Logo = () => (
  <Link href="/">
    <div className="md:py-0 py-2 flex gap-2 items-center cursor-pointer max-w-1/2">
      <img className="h-6" src={Icons.logo5HG} alt="logo" />
      <img
        className="max-h-6 2xl:block hidden"
        src={Icons.logoenders}
        alt="logo"
      />
      <img
        className="h-6 md:block hidden 2xl:hidden"
        src={Icons.logoendersmobile}
        alt="logo"
      />
    </div>
  </Link>
);

export const NavbarItem = ({ name, link, route }) => {
  return (
    <Link href={link}>
      <a className={clsx("py-2 relative")} href={link}>
        <div
          className={clsx(
            { "opacity-50": link !== route },
            "gap-2 flex items-center text-white hover:opacity-100",
          )}
        >
          <h3 className={clsx("text-md font-[500]")}>{name}</h3>
        </div>
      </a>
    </Link>
  );
};

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
  },
  // headerRight: {
  //   display: "flex",
  //   gap: "20px",
  //   alignItems: "center",
  //   fontSize: "15px",
  //   fontWeight: "600",
  // },
};

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [tokenSelected, setTokenSelected] = React.useState("");
  const refSidebarMobile = React.useRef(null);
  const [relogin, setRelogin] = React.useState(false);
  const [disabled, setDisabled] = React.useState<ButtonsTypes>({
    logout: false,
    userData: false,
  });
  const [search, setSearch] = React.useState("");

  const router = useRouter();

  const { account } = useWeb3React();

  const { logout, login } = useMagicLink();

  const { ethAddress } = useSelector((state: any) => state.layout.user);
  const { provider, providerName, cart, isLogged } = useSelector(
    (state: any) => state.layout,
  );

  const { blockchain } = useBlockchain();

  const dispatch = useAppDispatch();

  let isFullscreen;

  React.useEffect(() => {
    if (relogin || isLogged) {
      dispatch(
        onUpdateUser({
          ethAddress: account,
          email: "",
          provider: provider?.provider,
          providerName: "web3react",
        }),
      );
      dispatch(onGetAssets({ address: account, blockchain }));
    }
  }, [account, relogin, isLogged, blockchain]);

  const reconnect = async () => {
    try {
      const typeOfConnection = localStorage.getItem("typeOfConnection");
      if (authStillValid()) {
        await switchChain(CHAIN_IDS_BY_NAME[blockchain]);
        WALLETS.forEach(async (wallet) => {
          if (wallet.title === typeOfConnection) {
            await wallet.connection.connector.activate();
            setRelogin(true);
          }
        });
        if (typeOfConnection === "magic") {
          login(dispatch);
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
    reconnect();
  }, []);

  const initApp = async () => {
    console.log(blockchain, "load");
    await dispatch(onLoadSales());
  };

  React.useEffect(() => {
    initApp();
  }, [blockchain]);

  const handleDisabled = (field: keyof ButtonsTypes) => (value: boolean) => {
    setDisabled((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignOut = async () => {
    if (providerName === "magic") {
      const toggleLogout = handleDisabled("logout");
      toggleLogout(true);
      logout(dispatch);
      toggleLogout(false);
    } else if (providerName === "web3react") {
      dispatch(
        onUpdateUser({
          ethAddress: "",
          email: "",
          provider: "",
          providerName: "",
        }),
      );
    }
    localStorage.removeItem("typeOfConnection");
    localStorage.removeItem("loginTime");
  };

  const profileItems = [
    { name: "INVENTORY", link: "/profile", icon: <ShopOutlined /> },
    {
      name: "ACTIVITY",
      link: "/profile/activity",
      icon: <AreaChartOutlined />,
    },

    // {
    //   link: "/profile/inventory",
    //   name: "INVENTORY",
    //   icon: <GoldenFilled />,
    // },
    {
      name: "MY SALES",
      link: "/profile/mySales",
      icon: <AreaChartOutlined />,
    },
    {
      name: "SWAP",
      link: "/profile/swap",
      icon: <AreaChartOutlined />,
    },
    {
      name: "MY PACKS",
      link: "/packs",
      icon: <AreaChartOutlined />,
    },
    {
      name: "PROFILE",
      link: "/profile/accountSettings",
      icon: <AreaChartOutlined />,
    },
    {
      name: "LOG OUT",
      decoration: "line-primary",
      onClick: handleSignOut,
      disabled: disabled.logout,
    },
  ];

  return (
    <Layout
      style={{
        height: "100vh",
        // overflow: "auto",
      }}
    >
      <nav
        className={clsx(
          "fixed top-0 z-[100]",
          { "!hidden": isFullscreen },
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
                  if (router.asPath === "/marketplace?search=" + search) {
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
          {navItems.map((item, index) => {
            return (
              <>
                <NavbarItem
                  key={item.name}
                  name={item.name}
                  link={item.link}
                  route={router.asPath}
                />
              </>
            );
          })}
          {ethAddress ? (
            <>
              <div
                className={clsx(
                  { "!opacity-100": cartOpen || cart.length > 0 },
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

              <Dropdown
                classTitle={"text-white opacity-50 hover:opacity-100 font-bold"}
                title={"MY ACCOUNT"}
              >
                <div className="flex flex-col items-center px-4 border border-overlay-border rounded-xl">
                  {profileItems.map((item, index) => {
                    return (
                      <>
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
                            route={router.asPath}
                          />
                        )}
                      </>
                    );
                  })}
                </div>
              </Dropdown>
              <ChainSelect />
            </>
          ) : (
            <NavbarItem
              name={"LOG IN"}
              link={
                router.pathname !== "/login"
                  ? `/login?redirect=true&redirectAddress=${router.pathname}`
                  : router.asPath
              }
              route={router.asPath}
            />
          )}
        </div>
        <div className="lg:hidden flex gap-3">
          <div
            className={clsx(
              { "!opacity-100": cartOpen || cart.length > 0 },
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
          {!sidebarOpen ? (
            <MenuIcon
              className="h-6 w-6 text-primary cursor-pointer"
              aria-hidden="true"
              onClick={() => {
                setSidebarOpen((prev) => !prev);
              }}
            />
          ) : (
            <XIcon
              className="h-6 w-6 text-primary cursor-pointer"
              aria-hidden="true"
              onClick={() => {
                setSidebarOpen((prev) => !prev);
              }}
            />
          )}
        </div>
      </nav>

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

      <div className={clsx("bg-overlay flex flex-col")} style={styles.content}>
        {children}
      </div>
      {!router.asPath.includes("/comics") &&
        !router.asPath.includes("/packs") && <Footer />}
    </Layout>
  );
}
