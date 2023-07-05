/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef } from "react";
import Link from "next/link";
import { Layout } from "antd";
import useMagicLink from "@shared/hooks/useMagicLink";
import { Icons } from "@shared/const/Icons";
import { useRouter } from "next/dist/client/router";
import clsx from "clsx";
import { Button } from "../common/button/button";
import { DropdownMenu } from "../common/dropdownMenu/dropdownMenu";
import { MenuIcon } from "@heroicons/react/outline";
import { SidebarMobile } from "./sidebars/mobile";
import { useAppSelector, useAppDispatch } from "redux/store";
import {
  onGetAssets,
  onLoadSales,
  onUpdateUser,
  removeAll,
} from "redux/actions";
import { removeFromCart } from "@redux/actions";
import {
  AddressText,
  findSum,
  nFormatter,
} from "@shared/components/common/specialFields/SpecialFields";
import {
  AppstoreFilled,
  AreaChartOutlined,
  GoldenFilled,
  SearchOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  TwitterOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import packs from "../../packs.json";
import {
  getAddresses,
  getContract,
  getContractCustom,
  getTokensAllowed,
  getWeb3,
  loginMetamaskWallet,
} from "@shared/web3";
import { useWeb3React } from "@web3-react/core";
import { ShoppingCartIcon, XIcon } from "@heroicons/react/solid";
import { Footer } from "../common/footerComponents/footer";
import { Dropdown } from "../common/dropdown/dropdown";
import { DropdownCart } from "../common/dropdownCart/dropdownCart";
import { convertArrayCards } from "../common/convertCards";
import Web3 from "web3";
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { WALLETS } from "@shared/utils/connection/utils";
import useFullscreenStatus from "../common/onFullScreen";

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
    <div className="md:py-0 py-2 flex gap-2 items-center cursor-pointer">
      <img className="h-6" src={Icons.logo5HG} alt="logo" />
      <img className="h-6 xl:block hidden" src={Icons.logoenders} alt="logo" />
      <img
        className="h-6 block xl:hidden"
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
  const [messageBuy, setMessageBuy] = React.useState("");
  const [priceMatic, setPriceMatic] = React.useState("0");
  const refSidebarMobile = React.useRef(null);
  const refCartMobile = React.useRef(null);
  const [isExecuted, setIsExecuted] = React.useState(false);
  const [notAvailable, setNotAvailable] = React.useState({
    message: "",
    value: false,
  });
  const [relogin, setRelogin] = React.useState(false);

  const [disabled, setDisabled] = React.useState<ButtonsTypes>({
    logout: false,
    userData: false,
  });
  const [search, setSearch] = React.useState("");

  const cards = convertArrayCards();

  const { addToast } = useToasts();

  const router = useRouter();
  const { account } = useWeb3React();
  const { logout, login, showWallet } = useMagicLink();
  const { ethAddress } = useSelector((state: any) => state.layout.user);
  const { provider, providerName, cart, message } = useSelector(
    (state: any) => state.layout,
  );
  const dispatch = useAppDispatch();
  const tokensAllowed = getTokensAllowed();

  const maximizableElement = useRef(null);

  let isFullscreen;

  try {
    [isFullscreen] = useFullscreenStatus(maximizableElement);
  } catch (e) {
    addToast(
      "Fullscreen is unsupported by this browser, please try another browser.",
    );
  }

  const { pack, MATICUSD } = getAddresses();

  console.log(router);

  const chainChangedHandler = async () => {};

  React.useEffect(() => {
    if (relogin) {
      dispatch(
        onUpdateUser({
          ethAddress: account,
          email: "",
          provider: provider?.provider,
          providerName: "web3react",
        }),
      );
      dispatch(onGetAssets(account));
    }
  }, [account, relogin]);

  React.useEffect(() => {
    const typeOfConnection = localStorage.getItem("typeOfConnection");
    const savedLoginTime = localStorage.getItem("loginTime");
    const currentTime = new Date().getTime();
    const TWELVE_HOURS = 12 * 60 * 60 * 1000;
    if (
      typeOfConnection &&
      savedLoginTime &&
      currentTime - parseInt(savedLoginTime) <= TWELVE_HOURS
    ) {
      WALLETS.forEach(async (wallet) => {
        if (wallet.title == typeOfConnection) {
          await wallet.connection.connector.activate();
          setRelogin(true);
        }
      });
      if (typeOfConnection == "magic") {
        login(dispatch);
      }
    } else {
      localStorage.removeItem("typeOfConnection");
      localStorage.removeItem("loginTime");
    }
  }, []);

  const accountChangedHandler = async () => {};

  React.useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (window as any).ethereum?.isConnected() &&
      !isExecuted
    ) {
      (window as any).ethereum.on("accountsChanged", accountChangedHandler);
      (window as any).ethereum.on("chainChanged", chainChangedHandler);
      setIsExecuted(true);
    }
  }, []);

  const initApp = async () => {
    await dispatch(onLoadSales());
  };

  React.useEffect(() => {
    initApp();
  }, []);

  React.useEffect(() => {
    if (cart.length > 0) {
      getPriceMatic();
    } else {
      setPriceMatic("0");
    }
  }, [cart]);

  const getPriceMatic = async () => {
    const Aggregator = getContractCustom("Aggregator", MATICUSD, provider);
    const priceMATIC = await Aggregator.methods.latestAnswer().call();
    const price = (
      (parseInt(
        cart
          ?.map((item: any, i) =>
            ((parseInt(item.price) / 10 ** 6) * item.quantity).toString(),
          )
          .reduce((item: any, acc: any) => {
            return findSum(item, acc) as any;
          }) as any,
      ) *
        10 ** 8) /
      priceMATIC
    )
      .toFixed(2)
      .toString();

    setPriceMatic(price);
  };

  const handleDisabled = (field: keyof ButtonsTypes) => (value: boolean) => {
    setDisabled((prev) => ({ ...prev, [field]: value }));
  };

  const buyNFTs = async () => {
    if (tokenSelected == "") {
      addToast("Please Select a Payment Method", { appearance: "error" });
      return;
    }
    try {
      setMessageBuy(`Processing your purchase...`);

      const { amounts, bid, token, tokensId } = {
        amounts: cart.map((item) => item.quantity),
        bid: cart
          ?.map((item: any, i) =>
            ((parseInt(item.price) / 10 ** 6) * item.quantity).toString(),
          )
          .reduce((item: any, acc: any) => {
            return findSum(item, acc) as any;
          }),
        token: tokenSelected,
        tokensId: cart.map((item) => item.id),
      };

      const { marketplace, MATICUSD } = getAddresses();
      const marketplaceContract = getContractCustom(
        "ClockSale",
        marketplace,
        provider,
      );
      let price: any = 0;

      const ERC20 = getContractCustom("ERC20", token, provider);
      const addresses = getTokensAllowed();
      if (
        tokenSelected ==
        addresses.filter((item) => item.name == "MATIC")[0].address
      ) {
        const Aggregator = getContractCustom("Aggregator", MATICUSD, provider);
        const priceMATIC = await Aggregator.methods.latestAnswer().call();
        price = Web3.utils.toWei(
          (((bid as any) * 10 ** 8) / priceMATIC).toString(),
          "ether",
        );
        await marketplaceContract.methods
          .buyBatch(tokensId, amounts, token)
          .send({ from: ethAddress, value: price });
      } else {
        const allowance = await ERC20.methods
          .allowance(ethAddress, marketplace)
          .call();
        if (allowance < 1000000000000) {
          setMessageBuy(
            `Increasing the allowance of ${
              tokensAllowed.filter((item) => item.address == tokenSelected)[0]
                .name
            } 1/2`,
          );
          await ERC20.methods
            .increaseAllowance(
              marketplace,
              "1000000000000000000000000000000000000000000000000",
            )
            .send({
              from: ethAddress,
            });
          setMessageBuy("Buying your NFT(s) 2/2");
          await marketplaceContract.methods
            .buyBatch(tokensId, amounts, tokenSelected)
            .send({ from: ethAddress });
        } else {
          setMessageBuy("Buying your NFT(s)");
          await marketplaceContract.methods
            .buyBatch(tokensId, amounts, tokenSelected)
            .send({ from: ethAddress });
        }

        // }
        dispatch(removeAll());
      }
    } catch (err) {}

    setMessageBuy(``);
  };

  const handleSignOut = async () => {
    if (providerName == "magic") {
      const toggleLogout = handleDisabled("logout");
      toggleLogout(true);
      logout(dispatch);
      toggleLogout(false);
    } else if (providerName == "web3react") {
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

  console.log(isFullscreen, "isfull");

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
                  if (router.asPath == "/marketplace?search=" + search) {
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
        <div className="md:flex hidden gap-4 shrink-0 items-center">
          {navItems.map((item, index) => {
            return (
              <>
                <NavbarItem
                  key={index}
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
                  { ["!opacity-100"]: cartOpen || cart.length > 0 },
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
                            key={index}
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
            </>
          ) : (
            <NavbarItem
              name={ethAddress ? "MY ACCOUNT" : "LOG IN"}
              link={
                ethAddress
                  ? "/profile"
                  : router.pathname !== "/login"
                  ? `/login${`?redirect=true&redirectAddress=${router.pathname}`}`
                  : router.asPath
              }
              route={router.asPath}
            />
          )}
        </div>
        <div className="md:hidden flex gap-3">
          <div
            className={clsx(
              { ["!opacity-100"]: cartOpen || cart.length > 0 },
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
      <DropdownCart
        sidebarOpen={cartOpen}
        initialFocus={refCartMobile}
        items={cart.length}
        setSideBar={setCartOpen}
      >
        {cart.length ? (
          <div className="flex flex-col items-center border border-overlay-border rounded-md md:min-w-[500px] md:w-max py-2">
            <div className="flex justify-between gap-4 w-full">
              <h2 className="text-xl font-bold text-white py-4 px-4">
                Your Cart
              </h2>
              <h2 className="text-lg font-bold text-primary-disabled py-4 px-4">
                {cart
                  .map((item) => item.quantity)
                  .reduce((acc, red) => acc + red)}{" "}
                Item
                {cart
                  .map((item) => item.quantity)
                  .reduce((acc, red) => acc + red) > 1
                  ? "s"
                  : ""}
              </h2>{" "}
            </div>
            <div className="px-4 py-2 pb-4 gap-2 flex flex-col items-center w-full">
              {cart.map((item, index) => {
                return (
                  <div
                    className={clsx(
                      "gap-2 py-2 flex items-center justify-between gap-8 text-white cursor-pointer w-full px-2 border border-overlay-border rounded-md",
                    )}
                    // onClick={item.onClick}
                  >
                    <div className="flex items-center justify-start gap-2 w-full">
                      <div className="rounded-xl flex flex-col text-gray-100 relative overflow-hidden border border-gray-500 h-20 w-20">
                        <img
                          src={
                            item.nft == pack
                              ? packs[item.nftId]?.properties?.image?.value
                              : cards[item.nftId]?.properties.image?.value
                          }
                          className={`absolute top-[-20%] bottom-0 left-[-40%] right-0 margin-auto min-w-[175%]`}
                          alt=""
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className={clsx("text-md font-[700] uppercase")}>
                          {item.nft == pack
                            ? packs[item.nftId]?.properties?.name?.value
                            : cards[item.nftId]?.properties?.name?.value}
                        </h3>
                        <span
                          className="text-[12px] text-gray-500 font-medium"
                          style={{ lineHeight: "10px" }}
                        >
                          Owner: {<AddressText text={item.seller} /> || "Owner"}
                        </span>
                        <div className="flex gap-2 items-end">
                          <img src={Icons.logo} className="w-8 h-8" alt="" />
                          <img
                            src="icons/POLYGON.svg"
                            className="w-6 h-6"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <div className="flex flex-col !shrink-0">
                        <h3
                          className={clsx(
                            "text-sm font-[700] whitespace-nowrap w-24",
                          )}
                        >
                          Price:
                        </h3>
                        <h3
                          className={clsx(
                            "text-sm font-[700] uppercase whitespace-nowrap w-24",
                          )}
                        >
                          {nFormatter(parseInt(item.price) / 10 ** 6)} USD{" "}
                          {/* <span className="!text-sm text-overlay-border">
                                    ($1.5k)
                                  </span> */}
                        </h3>
                        <h3
                          className={clsx(
                            "text-sm font-[700] whitespace-nowrap w-max",
                          )}
                        >
                          Highest Bid:
                        </h3>
                        <h3
                          className={clsx(
                            "text-sm font-[700] uppercase whitespace-nowrap w-max",
                          )}
                        >
                          {nFormatter(parseInt(item.price) / 10 ** 6)} USD{" "}
                        </h3>
                      </div>
                      <div className="text-lg">x{item.quantity}</div>
                      <div
                        className="rounded-full p-1 w-8 h-8 border border-overlay-border hover:bg-red-primary text-white shrink-0"
                        onClick={() => {
                          dispatch(removeFromCart({ id: item.id }));
                        }}
                      >
                        <XIcon></XIcon>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex  gap-4 pb-4 w-full flex-wrap items-center justify-center">
              {tokensAllowed
                .filter((tokenAllowed) => {
                  let intersection = true;
                  cart.forEach((item) => {
                    if (
                      !item.tokens
                        .map((item) => item.toLowerCase())
                        .includes(tokenAllowed.address.toLowerCase())
                    ) {
                      intersection = false;
                    }
                  });
                  return intersection;
                })
                .map((item, index) => {
                  return (
                    <div
                      className={clsx(
                        "w-20 flex items-center justify-center gap-1 rounded-xl cursor-pointer py-1 border border-white",

                        {
                          "bg-overlay-border border-none":
                            tokenSelected !== item.address,
                        },
                        {
                          "bg-overlay border-green-button shadow-[0_0px_10px] shadow-green-button":
                            tokenSelected == item.address,
                        },
                      )}
                      onClick={() => {
                        setTokenSelected(item.address);
                      }}
                    >
                      <img src={item.logo} className="w-6 h-6" alt="" />
                      <h2 className="text-white text-[13px] font-bold">
                        {item.name}
                      </h2>
                    </div>
                  );
                })}
            </div>
            <div className="flex gap-6 justify-between w-full text-md text-xl py-4 px-8 border-y border-overlay-border bg-secondary">
              <div className="flex gap-1 items-center">
                <img src={Icons.logo} className="w-8 h-8" alt="" />
                <h3
                  className="text-[12px] text-primary-disabled font-[700]"
                  style={{ lineHeight: "14px" }}
                >
                  Total price on <br />
                  <span className="text-red-primary font-bold">5</span>
                  <span className="text-white font-bold">HG</span> Marketplace:
                </h3>
              </div>
              <div className="flex flex-col gap items-end">
                <h3 className="text-[14px] font-[700] text-white">
                  {parseInt(
                    cart
                      ?.map((item: any, i) =>
                        (parseInt(item.price) * item.quantity).toString(),
                      )
                      .reduce((item: any, acc: any) => {
                        return findSum(item, acc) as any;
                      }) as any,
                  ) /
                    10 ** 6}{" "}
                  USD
                  {/* <span className="!text-sm text-overlay-border">
                          ($1.5k)
                        </span> */}
                </h3>
                {tokensAllowed
                  .filter((item) => item.name == "MATIC")
                  .filter((tokenAllowed) => {
                    let intersection = true;
                    cart.forEach((item) => {
                      if (!item.tokens.includes(tokenAllowed.address)) {
                        intersection = false;
                      }
                    });
                    return intersection;
                  }).length > 0 && (
                  <h3 className="text-[14px] font-[700] text-white">
                    {priceMatic} MATIC
                  </h3>
                )}
              </div>
            </div>
            {providerName == "magic" && (
              <div className="text-[12px] text-white pt-4 font-bold">
                Don't have crypto? Click{" "}
                <span
                  className="text-green-button cursor-pointer"
                  onClick={() => {
                    showWallet();
                  }}
                >
                  Here
                </span>{" "}
                and buy by using Magic Connect on-ramp
              </div>
            )}
            {messageBuy !== "" ? (
              <div className="py-2 text-lg text-white font-bold text-center w-full">
                {messageBuy}
              </div>
            ) : (
              ""
            )}
            <div className="w-full flex items-center justify-center py-2">
              <div
                onClick={() => {
                  buyNFTs();
                }}
                className="w-auto px-6 py-2 flex justify-center items-center rounded-xl hover:border-green-button hover:bg-overlay hover:text-green-button border border-overlay-border cursor-pointer bg-green-button font-bold text-overlay transition-all duration-500"
              >
                Complete Purchase
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-white font-bold gap-4 text-md text-center w-64 p-4 border border-overlay-border rounded-md">
            <img src={Icons.logoCard} className="w-20 h-20" alt="" />
            There aren't items in your cart.
          </div>
        )}
      </DropdownCart>
      {notAvailable.value ? (
        <div className="bg-overlay md:px-10 px-6 flex flex-col items-center justify-center w-screen h-screen text-primary text-3xl font-bold">
          {notAvailable.message}
        </div>
      ) : (
        <>
          <div
            className={clsx("bg-overlay flex flex-col")}
            style={styles.content}
          >
            {children}
            <Message content={message} open={Boolean(message)} />
          </div>
          {!router.asPath.includes("/comics") && <Footer />}
        </>
      )}
    </Layout>
  );
}
