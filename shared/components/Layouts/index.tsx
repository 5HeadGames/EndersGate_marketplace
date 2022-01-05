import React from "react";
import Text from "antd/lib/typography/Text";
import Account from "shared/components/Account";
import Chains from "shared/components/Chains";
import SearchCollections from "shared/components/SearchCollections";
import Link from "next/link";
import {Menu, Layout} from "antd";
import {Icons} from "@shared/const/Icons";
import {useRouter} from "next/dist/client/router";
import clsx from "clsx";
import {Button} from "../common/button/button";
import {DropdownMenu} from "../common/dropdownMenu/dropdownMenu";

const {Header, Footer} = Layout;

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
    icon: Icons.menu,
    items: [
      {
        title: "Marketplace",
        description:
          "Sell your game items to anyone, anywhere, they're finally yours",
        href: "/marketplace",
        icon: Icons.marketplaceWhite,
      },
      {
        title: "Marketplace",
        description:
          "Sell your game items to anyone, anywhere, they're finally yours",
        href: "/marketplace",
        icon: Icons.marketplaceWhite,
      },
      {
        title: "Marketplace",
        description:
          "Sell your game items to anyone, anywhere, they're finally yours",
        href: "/marketplace",
        icon: Icons.marketplaceWhite,
      },
      {
        title: "Marketplace",
        description:
          "Sell your game items to anyone, anywhere, they're finally yours",
        href: "/marketplace",
        icon: Icons.marketplaceWhite,
      },
      {
        title: "Marketplace",
        description:
          "Sell your game items to anyone, anywhere, they're finally yours",
        href: "/marketplace",
        icon: Icons.marketplaceWhite,
      },
      {
        title: "Marketplace",
        description:
          "Sell your game items to anyone, anywhere, they're finally yours",
        href: "/marketplace",
        icon: Icons.marketplaceWhite,
      },
    ],
  },
  {name: "Dashboard", link: "/dashboard", icon: Icons.dashboard},
  {name: "Marketplace", link: "/marketplace", icon: Icons.marketplace},
];

export default function AppLayout({children}) {
  const router = useRouter();
  //   const [inputValue, setInputValue] = React.useState("explore");
  return (
    <Layout style={{height: "100vh", overflow: "auto"}}>
      <nav
        className={clsx(
          "fixed top-0 z-10",
          "bg-overlay",
          "w-screen md:px-16 px-8 flex flex-row items-center justify-between shadow-md",
        )}
      >
        <div className="flex items-center">
          <Logo />
          {navItems.map((item, index) => {
            return item.menu ? (
              <DropdownMenu
                icon={item.icon}
                title={item.name}
                navElementsLinks={item.items}
              />
            ) : (
              <NavbarItem
                key={index}
                name={item.name}
                icon={item.icon}
                link={item.link}
                route={router.asPath}
              />
            );
          })}
        </div>
        <div>
          <Button decoration="fill" size="small" onClick={() => router.push('/login')}>
            Log In
          </Button>
        </div>
      </nav>
      <div className="bg-overlay px-10 " style={styles.content}>
        {children}
      </div>
    </Layout>
  );
}

export const Logo = () => (
  <img className="h-12 w-12" src={Icons.logo} alt="logo" />
);

export const NavbarItem = ({name, link, route, icon}) => {
  return (
    <Link href={link}>
      <a className={clsx("md:ml-12 ml-8 py-8 relative")} href={link}>
        <div className="flex items-center">
          <img
            src={icon}
            className={clsx({"opacity-50": link !== route}, "h-4 w-4 mr-2")}
          />
          <h3
            className={clsx(
              {"opacity-50": link !== route},
              "text-base text-primary"
            )}
          >
            {name}
          </h3>
        </div>
        <div
          className={clsx({
            "absolute bottom-0 w-full bg-primary h-1.5 rounded-t-md":
              link === route,
          })}
        ></div>
      </a>
    </Link>
  );
};
