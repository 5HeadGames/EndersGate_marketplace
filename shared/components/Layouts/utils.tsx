import { AreaChartOutlined } from "@ant-design/icons";
import { Icons } from "@shared/const/Icons";
import clsx from "clsx";
import Link from "next/link";

const handleDisabled =
  (field: keyof ButtonsTypes, setDisabled) => (value: boolean) => {
    setDisabled((prev) => ({ ...prev, [field]: value }));
  };

export const handleSignOut = async ({
  providerName,
  logout,
  updateUser,
  router,
  setDisabled,
}) => {
  if (providerName === "magic") {
    const toggleLogout = handleDisabled("logout", setDisabled);
    toggleLogout(true);
    logout(updateUser);
    toggleLogout(false);
  } else {
    updateUser({
      ethAddress: "",
      email: "",
      provider: "",
      providerName: "",
    });
  }
  localStorage.removeItem("typeOfConnection");
  localStorage.removeItem("loginTime");
  // localStorage.removeItem("chain");
  router.push("/");
};

export const navItems = [
  {
    name: "HOME",
    link: "/",
  },
  { name: "EXPLORE", link: "/marketplace" },
  // { name: "COMICS", link: "/comics" },
  { name: "SHOP", link: "/shop" },
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

export const NavbarItem = ({ name, link, route, notification }) => {
  return (
    <Link href={link}>
      <div
        className={clsx(
          "py-2 relative",
          "text-md font-[600] text-white opacity-50",
          {
            "!opacity-100": link === route || notification,
          },
        )}
      >
        {notification ? (
          <div className="absolute top-[-4px] right-[-8px] w-4 h-4 flex items-center justify-center rounded-full font-bold text-[9.5px] bg-red-primary">
            {notification}
          </div>
        ) : (
          ""
        )}
        {name}
      </div>
    </Link>
  );
};
