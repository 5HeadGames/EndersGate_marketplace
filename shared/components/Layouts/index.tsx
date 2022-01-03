import React from "react";
import Text from "antd/lib/typography/Text";
import Account from "shared/components/Account";
import Chains from "shared/components/Chains";
import SearchCollections from "shared/components/SearchCollections";
import Link from "next/link";
import {Menu, Layout} from "antd";
import { Icons } from "@shared/const/Icons";
import { useRouter } from "next/dist/client/router";
import clsx from "clsx";
import { Button } from "../common/button/button";

const { Header, Footer } = Layout;

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
  { name: "Menu", link: "/menu" },
  { name: "Dashboard", link: "/dashboard" },
  { name: "Marketplace", link: "/marketplace" },
];

export default function AppLayout({ children }) {
  const router = useRouter();
  //   const [inputValue, setInputValue] = React.useState("explore");
  return (
    <Layout style={{ height: "100vh", overflow: "auto" }}>
      <nav
        className={clsx(
          "fixed top-0 z-10",
          "bg-overlay",
          "w-screen md:px-16 px-8 flex flex-row items-center justify-between shadow-md",
          "rounded-b-xl"
        )}
      >
        <div className="flex items-center">
          <Logo />
          {navItems.map((item, index) => {
            return (
              <NavbarItem
                key={index}
                name={item.name}
                link={item.link}
                route={router.asPath}
              />
            );
          })}
        </div>
        <div>
          <Button decoration="fill" size="small">
            Logout
          </Button>
        </div>
      </nav>
      <div className="bg-overlay px-10 pt-32" style={styles.content}>
        {children}
      </div>
    </Layout>
  );
}

export const Logo = () => (
  <img className="h-12 w-12" src={Icons.logo} alt="logo" />
);

export const NavbarItem = ({ name, link, route }) => {
  return (
    <Link href={link}>
      <a className={clsx("md:ml-12 ml-8 py-8 relative")} href={link}>
        <h3
          className={clsx(
            { "text-primary": link === route },
            { "text-primary-opacity": link !== route },
            "f-16"
          )}
        >
          {name}
        </h3>
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
