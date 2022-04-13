import React from "react";
import Link from "next/link";
import {Layout} from "antd";
import {useMoralis} from "react-moralis";

import {Icons} from "@shared/const/Icons";
import {useRouter} from "next/dist/client/router";
import clsx from "clsx";
import {Button} from "../common/button/button";
import {DropdownMenu} from "../common/dropdownMenu/dropdownMenu";
import {MenuIcon} from "@heroicons/react/outline";
import {SidebarMobile} from "./sidebars/mobile";
import {useAppSelector, useAppDispatch} from "redux/store";
import {onGetAssets, onLoadSales, onLoginUser, onUpdateUser} from "redux/actions";
import {
  AppstoreFilled,
  AreaChartOutlined,
  ShopOutlined,
  TwitterOutlined,
  TwitterSquareFilled,
  WalletOutlined,
} from "@ant-design/icons";

import {getAddresses, getContract, getWeb3, loginMetamaskWallet} from "@shared/web3";

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
};

const navItems = [
  {
    name: "Menu",
    link: "/menu",
    menu: true,
    icon: <AppstoreFilled />,
    items: [
      {
        title: "Enders Gate Website",
        description: "Sell your game items to anyone, anywhere, they're finally yours",
        href: "/marketplace",
        icon: <ShopOutlined />,
      },
      {
        title: "Enders Gate Discord",
        description: "Sell your game items to anyone, anywhere, they're finally yours",
        href: "/marketplace",
        icon: <ShopOutlined />,
      },
      {
        title: "Enders Gate Twitter",
        description: "Sell your game items to anyone, anywhere, they're finally yours",
        href: "/marketplace",
        icon: <TwitterOutlined />,
      },
      {
        title: "Harmony Block Explorer",
        description: "Trusted chrome wallet extension, store your digital currency and NFTs",
        href: "/marketplace",
        icon: <WalletOutlined />,
      },
      {
        title: "Harmony Wallet",
        description: "Trusted chrome wallet extension, store your digital currency and NFTs",
        href: "/marketplace",
        icon: <WalletOutlined />,
      },
      {
        title: "Harmony Bridge",
        description: "Trusted chrome wallet extension, store your digital currency and NFTs",
        href: "/marketplace",
        icon: <WalletOutlined />,
      },
    ],
  },
  {name: "Dashboard", link: "/dashboard", icon: <AreaChartOutlined />},
  {name: "Marketplace", link: "/marketplace", icon: <ShopOutlined />},
];

export default function AppLayout({children}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const refSidebarMobile = React.useRef(null);
  const [isExecuted, setIsExecuted] = React.useState(false);
  const [notAvailable, setNotAvailable] = React.useState({
    message: "",
    value: false,
  });
  const {blur, message} = useAppSelector((state) => ({
    ...state.layout,
    ...state.user,
  }));
  const router = useRouter();
  const {authenticate, isAuthenticated, user} = useMoralis();

  const chainChangedHandler = async () => {
    // window.location.reload();
    const web3 = await getWeb3();
    const networkId = await web3.eth.net.getId();
    if (networkId != 1666700000 && networkId != 1666600000) {
      setNotAvailable({
        message: "Change your network to harmony testnet please",
        value: true,
      });
    } else {
      setNotAvailable({
        message: "",
        value: false,
      });
    }
  };

  const accountChangedHandler = async (newAccount: any) => {
    // if (timesAccountChange > 0) {
    //   setNotAvailable({
    //     message:
    //       "You have changed your account please go to login/register section and login again",
    //     value: true,
    //   });
    // } else {
    //   setTimesAccountChange((prev) => prev + 1);
    // }
    // window.location.reload();
    const web3 = await loginMetamaskWallet();
    await dispatch(onGetAssets((window as any).ethereum.selectedAddress));
    if (!web3) return;
    // setLoading(true);
    await dispatch(
      onLoginUser({
        address: (window as any).ethereum.selectedAddress,
      })
    );
    // setLoading(false);
    dispatch(
      onUpdateUser({
        address: (window as any).ethereum.selectedAddress,
        walletType: "metamask",
      })
    );
    // dispatch(onMessage("Login successful!"));
    // setTimeout(dispatch, 2000, onMessage(""));
  };
  if (typeof window !== "undefined" && (window as any).ethereum?.isConnected() && !isExecuted) {
    // Client-side-only code
    // connectWallet();
    (window as any).ethereum.on("accountsChanged", accountChangedHandler);
    (window as any).ethereum.on("chainChanged", chainChangedHandler);
    setIsExecuted(true);
  }

  const dispatch = useAppDispatch();

  const initApp = async () => {
    const addresses = getAddresses();
    const marketplace = getContract("ClockSale", addresses.marketplace);

    //marketplace.events
    //.SaleCreated({}, (err, event) => {
    //console.log({err, event}); //idk what this function handles
    //})
    //.on("connected", (subscriptionId) => {
    //console.log({subscriptionId}); //handles when connected
    //})
    //.on("data", (event) => {
    //console.log({event}); //handles the event
    //})
    //.on("error", (err, receipt) => {
    //console.log({err, receipt}); //handles errors
    //});

    dispatch(onLoadSales());
  };

  React.useEffect(() => {
    initApp();
  }, []);

  return (
    <Layout
      style={{
        height: "100vh",
        overflow: "auto",
        ...(blur
          ? {
            filter: "blur(8px)",
            "-webkit-filter": "blur(8px)",
          }
          : {}),
      }}
    >
      <nav
        className={clsx(
          "fixed top-0 z-10",
          "bg-overlay",
          "w-screen md:px-16 px-8 flex flex-row items-center justify-between shadow-md"
        )}
      >
        <div className="flex items-center">
          <Logo />
          <div className="md:flex hidden items-center">
            {navItems.map((item, index) => {
              return item.menu ? (
                <>
                  <DropdownMenu
                    icon={item.icon}
                    title={item.name}
                    navElementsLinks={item.items}
                    key={index}
                  />
                  <div className="h-full border border-transparent"></div>
                </>
              ) : (
                <>
                  <NavbarItem
                    key={index}
                    name={item.name}
                    icon={item.icon}
                    link={item.link}
                    route={router.asPath}
                  />
                </>
              );
            })}
          </div>
        </div>
        <div className="md:flex hidden">
          <Button
            decoration="fill"
            size="small"
            onClick={() => router.push(isAuthenticated ? "/profile" : "/login")}
          >
            {isAuthenticated ? "Profile" : "Log In"}
          </Button>
        </div>
        <div
          className="md:hidden flex"
          onClick={() => {
            setSidebarOpen(true);
          }}
        >
          <MenuIcon className="h-6 w-6 text-primary cursor-pointer" aria-hidden="true" />
        </div>
      </nav>
      <SidebarMobile
        initialFocus={refSidebarMobile}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
      />
      {notAvailable.value ? (
        <div className="bg-overlay md:px-10 px-6 flex flex-col items-center justify-center w-screen h-screen text-primary text-3xl font-bold">
          {notAvailable.message}
        </div>
      ) : (
        <div className="bg-overlay md:px-10 px-6" style={styles.content}>
          {children}
          <Message content={message} open={Boolean(message)} />
        </div>
      )}
    </Layout>
  );
}

export const Message: React.FunctionComponent<{
  content: string;
  open: boolean;
}> = (props) => {
  const {content, open} = props;

  return (
    <div
      className={clsx(
        `absolute bottom-3.5 left-3.5 bg-purple-300 px-10 py-4 rounded-md`,
        "ease-out duration-300",
        open ? "scale-100" : "scale-0"
      )}
    >
      {content}
    </div>
  );
};

export const Logo = () => (
  <Link href="/dashboard">
    <div className="mr-4 md:py-0 py-2 cursor-pointer">
      <img className="h-12 w-12" src={Icons.logo} alt="logo" />
    </div>
  </Link>
);

export const NavbarItem = ({name, link, route, icon}) => {
  return (
    <Link href={link}>
      <a
        className={clsx("md:px-6 px-4 py-6 relative", {
          [`bg-primary text-white`]: link === route,
        })}
        href={link}
      >
        <div
          className={clsx(
            {"opacity-50 text-primary": link !== route},
            {"text-white": link === route},
            "gap-2 flex items-center"
          )}
        >
          <div className="flex items-center text-2xl">{icon}</div>
          <h3 className={clsx("text-base")}>{name}</h3>
        </div>
      </a>
    </Link>
  );
};
